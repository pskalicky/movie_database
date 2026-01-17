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
import { star, videocam, add, close, options, settings } from 'ionicons/icons';


export interface MovieFilter {
  id: string;
  label: string;
  isActive: boolean;
  type: 'predefined' | 'custom'; 
  apiParams?: any; 
}

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class Tab1Page implements OnInit, ViewWillEnter{
  
  myRatings: any = {};
  movies: any[] = [];
  imageBaseUrl = 'https://image.tmdb.org/t/p/w500';

  filters: MovieFilter[] = [
    { id: 'popular', label: '🔥 Trendy', isActive: true, type: 'predefined' }
  ];

  constructor(
    private movieService: MovieService,
    private modalCtrl: ModalController,
    private storageService: StorageService
  ) {
    addIcons({ star, videocam, add, close, options, settings });
  }

  async ngOnInit() {
    const savedFilters = await this.storageService.getFilters();
    if (savedFilters && Array.isArray(savedFilters) && savedFilters.length > 0) {
      this.filters = savedFilters;
    }
    this.loadMovies();
  }
  saveState() {
    this.storageService.saveFilters(this.filters);
  }
  
  async ionViewWillEnter() {
    this.myRatings = await this.storageService.getAllRatings();
    console.log('Moje hodnocení načtena:', this.myRatings);
  }

  get activeFilterLabel(): string {
    const active = this.filters.find(f => f.isActive);
    return active ? active.label : 'Vyberte filtr';
  }
  
  selectFilter(selectedFilter: MovieFilter) {
    this.filters.forEach(f => f.isActive = false);
    selectedFilter.isActive = true;
    this.loadMovies();
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
      this.loadMovies();
    }
    this.saveState();
  }

  async openAddFilterModal() {
    const modal = await this.modalCtrl.create({
      component: FilterEditorComponent
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

  loadMovies() {
    const activeFilter = this.filters.find(f => f.isActive);
    this.movies = [];

    if (!activeFilter) return;

    if (activeFilter.id === 'popular') {
      this.movieService.getPopularMovies().subscribe(res => this.movies = res.results);
    } else if (activeFilter.id === 'top_rated') {
       this.movieService.getTopRatedMovies().subscribe(res => this.movies = res.results);
    } else {
      const params = activeFilter.apiParams || {};
      this.movieService.getMoviesByFilter(params.genre, params.year)
        .subscribe(res => this.movies = res.results);
    }
  }
}