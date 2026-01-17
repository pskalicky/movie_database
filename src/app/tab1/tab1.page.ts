import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { IonicModule } from '@ionic/angular'; 
import { FormsModule } from '@angular/forms';
import { MovieService } from '../services/movie';
import { addIcons } from 'ionicons'; 
import { ModalController } from '@ionic/angular';
import { FilterManagerComponent } from '../components/filter-manager/filter-manager.component';
import { FilterEditorComponent } from '../components/filter-editor/filter-editor.component';
import { star, videocam, add, close, options, settings } from 'ionicons/icons';

// 1. Definice, jak vypadá náš Filtr
interface MovieFilter {
  id: string;
  label: string;
  isActive: boolean;
  type: 'predefined' | 'custom'; // 'predefined' nejde smazat, 'custom' jde
  apiParams?: any; // Tady budeme později ukládat nastavení (rok, žánr...)
}

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class Tab1Page implements OnInit {
  
  movies: any[] = [];
  imageBaseUrl = 'https://image.tmdb.org/t/p/w500';

  // 2. Seznam filtrů (tlačítek)
  filters: MovieFilter[] = [
    { id: 'popular', label: '🔥 Trendy', isActive: true, type: 'predefined' }
  ];

  constructor(
    private movieService: MovieService,
    private modalCtrl: ModalController
  ) {
    // Nezapomeň zaregistrovat nové ikony
    addIcons({ star, videocam, add, close, options, settings });
  }

  ngOnInit() {
    this.loadMovies();
  }

  get activeFilterLabel(): string {
    const active = this.filters.find(f => f.isActive);
    return active ? active.label : 'Vyberte filtr';
  }
  
  // 3. Metoda pro přepnutí filtru
  selectFilter(selectedFilter: MovieFilter) {
    // Vypneme všechny ostatní
    this.filters.forEach(f => f.isActive = false);
    // Zapneme tento
    selectedFilter.isActive = true;
    
    // Načteme filmy (zatím jednoduše, v Kroku C to vylepšíme)
    this.loadMovies();
  }

  // 4. Metoda pro smazání vlastního filtru
  removeFilter(event: Event, filterId: string) {
    event.stopPropagation(); // Aby se neaktivoval klik na čip při mazání
    
    // Odstraníme filtr z pole
    this.filters = this.filters.filter(f => f.id !== filterId);
    
    // Pokud jsme smazali zrovna aktivní filtr, přepneme zpět na 'Trendy'
    const hasActive = this.filters.some(f => f.isActive);
    if (!hasActive) {
      this.filters[0].isActive = true;
      this.loadMovies();
    }
  }

// Otevře editor pro NOVÝ filtr
  async openAddFilterModal() {
    const modal = await this.modalCtrl.create({
      component: FilterEditorComponent
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    
    if (data) {
      // Přidáme nový filtr do seznamu
      this.filters.push(data);
      // Rovnou ho vybereme
      this.selectFilter(data);
    }
  }

  loadMovies() {
    // Zjistíme, který filtr je aktivní
    const activeFilter = this.filters.find(f => f.isActive);

    this.movies = [];

    if (activeFilter?.id === 'popular') {
      this.movieService.getPopularMovies().subscribe(res => this.movies = res.results);
    } else if (activeFilter?.id === 'top_rated') { // Pokud jsi tam nechal Top Rated
       this.movieService.getTopRatedMovies().subscribe(res => this.movies = res.results);
    } else {
      // Zde je logika pro CUSTOM filtry
      // Získáme parametry z filtru (nebo prázdný objekt, kdyby tam nic nebylo)
      const params = activeFilter?.apiParams || {};
      
      this.movieService.getMoviesByFilter(params.genre, params.year)
        .subscribe(res => this.movies = res.results);
    }
  }

  async openFilterManager() {
    const modal = await this.modalCtrl.create({
      component: FilterManagerComponent,
      componentProps: {
        // Pošleme tam kopii našich filtrů (aby se změny neprojevily hned, ale až po uložení)
        filters: JSON.parse(JSON.stringify(this.filters)) 
      }
    });

    await modal.present();

    // Čekáme, až se modal zavře a pošle data zpět
    const { data } = await modal.onWillDismiss();
    
    if (data && data.updatedFilters) {
      this.filters = data.updatedFilters;
      // Pokud jsme smazali aktivní filtr, resetujeme výběr
      const activeExists = this.filters.find(f => f.isActive);
      if (!activeExists && this.filters.length > 0) {
        this.selectFilter(this.filters[0]);
      } else if (this.filters.length === 0) {
        // Pokud smazal vše (teoreticky), tak nic nenačítáme nebo dáme default
      }
    }
  }

}