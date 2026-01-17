import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { IonicModule } from '@ionic/angular'; 
import { FormsModule } from '@angular/forms';
import { MovieService } from '../services/movie';
import { addIcons } from 'ionicons'; 
import { star } from 'ionicons/icons';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class Tab1Page implements OnInit {
  
  movies: any[] = [];
  imageBaseUrl = 'https://image.tmdb.org/t/p/w500';

  constructor(private movieService: MovieService) {}

  ngOnInit() {
    this.loadMovies();
  }

  loadMovies() {
    this.movieService.getTopRatedMovies().subscribe((res) => {
      this.movies = res.results;
      console.log('Načtené filmy:', this.movies);
    });
  }
}