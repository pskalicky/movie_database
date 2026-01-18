import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router'; 
import { MovieService } from '../services/movie';

import { addIcons } from 'ionicons';
import { search, star, sad, videocam, tv, person, imageOutline } from 'ionicons/icons';

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
  isSearching = false; 
  hasSearched = false; 

  currentPage = 1;
  totalPages = 0;
  currentQuery = '';

  constructor(private movieService: MovieService) {
    addIcons({ search, star, sad, videocam, tv, person, imageOutline });
  }

onSearchChange(event: any) {
    const query = event.detail.value;
    this.currentQuery = query;

    if (!query || query.length === 0) {
      this.searchResults = [];
      this.hasSearched = false;
      return;
    }

    this.isSearching = true;
    this.hasSearched = true;
    this.currentPage = 1;

    this.movieService.searchMovies(this.currentQuery, this.currentPage).subscribe({
      next: (res) => {
        this.searchResults = res.results; 
        this.totalPages = res.total_pages; 
        this.isSearching = false;
      },
      error: (err) => {
        console.error(err);
        this.isSearching = false;
      }
    });
  }

  loadMore(event: any) {
    if (this.currentPage >= this.totalPages) {
      event.target.disabled = true;
      return;
    }

    this.currentPage++;

    this.movieService.searchMovies(this.currentQuery, this.currentPage).subscribe({
      next: (res) => {
        this.searchResults.push(...res.results);
        event.target.complete();
        if (this.currentPage >= this.totalPages) {
          event.target.disabled = true;
        }
      },
      error: (err) => {
        console.error(err);
        event.target.complete(); 
      }
    });
  }
}