import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { IonicModule } from '@ionic/angular'; 
import { FormsModule } from '@angular/forms';
import { MovieService } from '../services/movie';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons'; 
import { ModalController } from '@ionic/angular';
import { FilterManagerComponent } from '../components/filter-manager/filter-manager.component';
import { FilterEditorComponent } from '../components/filter-editor/filter-editor.component';
import { ViewWillEnter } from '@ionic/angular';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { StorageService } from '../services/storage';
import { star, videocam, add, close, options, settings, tv } from 'ionicons/icons';


export interface TvFilter {
  id: string;
  label: string;
  isActive: boolean;
  type: 'predefined' | 'custom'; 
  apiParams?: any; 
}

@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class Tab4Page implements OnInit, ViewWillEnter{
  
  myRatings: any = {};
  tvShows: any[] = [];
  imageBaseUrl = 'https://image.tmdb.org/t/p/w500';
  currentPage = 1;
  totalPages = 1;

  filters: TvFilter[] = [
    { id: 'popular', label: '🔥 Trendy', isActive: true, type: 'predefined' }
  ];

  constructor(
    private movieService: MovieService,
    private modalCtrl: ModalController,
    private storageService: StorageService
  ) {
    addIcons({ star, videocam, add, close, options, settings, tv});
  }

  async ngOnInit() {
    const savedFilters = await this.storageService.getFilters('tv');
    if (savedFilters && Array.isArray(savedFilters) && savedFilters.length > 0) {
      this.filters = savedFilters;
    }
    this.storageService.ratings$.subscribe((ratings) => {
      this.myRatings = ratings;
    });
    this.loadTvShows();
  }
  saveState() {
    this.storageService.saveFilters(this.filters, 'tv');
  }
  
  async ionViewWillEnter() {
    this.myRatings = await this.storageService.getAllRatings();
    console.log('Moje hodnocení načtena:', this.myRatings);
  }

  get activeFilterLabel(): string {
    const active = this.filters.find(f => f.isActive);
    return active ? active.label : 'Vyberte filtr';
  }
  
  selectFilter(selectedFilter: TvFilter) {
    this.filters.forEach(f => f.isActive = false);
    selectedFilter.isActive = true;
    this.tvShows = [];
    this.currentPage = 1;
    this.totalPages = 1;
    this.loadTvShows();
    this.saveState();
  }

  removeFilter(event: Event, filterId: string) {
    event.stopPropagation(); 
    
    this.filters = this.filters.filter(f => f.id !== filterId);
    
    const hasActive = this.filters.some(f => f.isActive);
    if (!hasActive) {
      if (this.filters.length > 0) {
        this.filters[0].isActive = true;
      }
      this.loadTvShows();
    }
    this.saveState();
  }

  async openAddFilterModal() {
    const modal = await this.modalCtrl.create({
      component: FilterEditorComponent,
      componentProps: { 
        isTv: true 
      } 
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    
    if (data) {
      this.filters.push(data);
      this.selectFilter(data);
    }
  }

  async openFilterManager() {
    const modal = await this.modalCtrl.create({
      component: FilterManagerComponent,
      componentProps: {
        filters: JSON.parse(JSON.stringify(this.filters)),
        isTv: true
      }
    });

    await modal.present();
    const { data } = await modal.onWillDismiss();
    
    if (data && data.updatedFilters) {
      this.filters = data.updatedFilters;
      

      const activeExists = this.filters.find(f => f.isActive);
      if (!activeExists && this.filters.length > 0) {
        this.selectFilter(this.filters[0]);
      } else {
         this.saveState();
      }
    }
    this.loadTvShows();
  }
  loadTvShows(event?: any) {
    const activeFilter = this.filters.find(f => f.isActive);
    if (!activeFilter) {
      if (event) event.target.complete();
      return;
    }
    let apiCall;
    if (activeFilter.id === 'popular') {
      apiCall = this.movieService.getPopularTvShows(this.currentPage);
    } else if (activeFilter.id === 'top_rated') {
       apiCall = this.movieService.getTopRatedTvShows(this.currentPage);
    } else {
      const params = activeFilter.apiParams || {};
      apiCall = this.movieService.getTvShowsByFilter(params.genre, params.year, this.currentPage);
    }

    apiCall.subscribe({
      next: (res: any) => {
        this.totalPages = res.total_pages;

        if (this.currentPage === 1) {
          this.tvShows = res.results;
        } else {
          this.tvShows.push(...res.results);
        }
        if (event) {
          event.target.complete();
        }
      },
      error: (err) => {
        console.error(err);
        if (event) event.target.complete();
      }
    });
  }

  loadMore(event: any) {
    if (this.currentPage >= this.totalPages) {
      event.target.disabled = true;
      return;
    }
    this.currentPage++;
    this.loadTvShows(event);
  }
}