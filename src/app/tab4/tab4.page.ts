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
        isTv: true // Důležité! Řekneme editoru, ať načte TV žánry
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
        filters: JSON.parse(JSON.stringify(this.filters)) 
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
  }

loadTvShows() {
    const activeFilter = this.filters.find(f => f.isActive);
    this.tvShows = [];

    if (!activeFilter) return;

    // Logika volání API pro seriály
    if (activeFilter.id === 'popular') {
      this.movieService.getPopularTvShows().subscribe(res => this.tvShows = res.results);
    } else if (activeFilter.id === 'top_rated') {
       this.movieService.getTopRatedTvShows().subscribe(res => this.tvShows = res.results);
    } else {
      const params = activeFilter.apiParams || {};
      // Voláme novou metodu pro TV
      this.movieService.getTvShowsByFilter(params.genre, params.year)
        .subscribe(res => this.tvShows = res.results);
    }
  }
}