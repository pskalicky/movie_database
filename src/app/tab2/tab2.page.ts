import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router'; // Důležité pro proklik!
import { MovieService } from '../services/movie';
import { addIcons } from 'ionicons';
import { search, star, sad } from 'ionicons/icons'; // Přidali jsme 'sad' pro prázdný stav

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class Tab2Page {

  searchResults: any[] = [];
  imageBaseUrl = 'https://image.tmdb.org/t/p/w500';
  isSearching = false; // Pro zobrazení spinneru
  hasSearched = false; // Abychom věděli, jestli uživatel už něco zkusil hledat

  constructor(private movieService: MovieService) {
    addIcons({ search, star, sad });
  }

  // Tato metoda se zavolá, když uživatel píše
  onSearchChange(event: any) {
    const query = event.detail.value;

    // Pokud uživatel smazal text, vyčistíme výsledky
    if (!query || query.length === 0) {
      this.searchResults = [];
      this.hasSearched = false;
      return;
    }

    this.isSearching = true;
    this.hasSearched = true;

    this.movieService.searchMovies(query).subscribe({
      next: (res) => {
        this.searchResults = res.results;
        this.isSearching = false;
      },
      error: (err) => {
        console.error(err);
        this.isSearching = false;
      }
    });
  }
}