import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from 'src/app/services/movie'; 
import { addIcons } from 'ionicons';
import { calendar, time, arrowBack, star, starOutline } from 'ionicons/icons'; 

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.page.html',
  styleUrls: ['./movie-detail.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class MovieDetailPage implements OnInit {

  movie: any = null;
  imageBaseUrl = 'https://image.tmdb.org/t/p/w500';

  myRating = 0;
  stars = [1, 2, 3, 4, 5];

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService
  ) {
    addIcons({ calendar, time, arrowBack, star, starOutline});
  }
  rateMovie(score: number) {
    this.myRating = score;
    console.log('Uživatel hodnotil:', score);
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      this.movieService.getMovieDetails(id).subscribe((res) => {
        console.log('Načtený detail:', res);
        this.movie = res;
      });
    }
  }
}
