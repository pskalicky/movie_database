import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from 'src/app/services/movie'; 
import { NavController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { calendar, time, arrowBack, star, starOutline, albums } from 'ionicons/icons'; 

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
  streamProviders: any[] = [];
  myRating = 0;
  stars = [1, 2, 3, 4, 5];

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private navCtrl: NavController
  ) {
    addIcons({ calendar, time, arrowBack, star, starOutline, albums});
  }
  rateMovie(score: number) {
    this.myRating = score;
    console.log('Uživatel hodnotil:', score);
  }

  goBack() {
    this.navCtrl.back();
  }


  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    const type = this.route.snapshot.paramMap.get('type');

    if (id) {
      this.loadProviders(id);
    }

    if (id && type) {
      if (type === 'movie') {
        this.movieService.getMovieDetails(id).subscribe(res => {
          this.movie = res;
        });
      } else if (type === 'tv') {
        this.movieService.getTvDetails(id).subscribe(res => {
          this.movie = res;
          this.movie.title = res.name; 
          this.movie.release_date = res.first_air_date;
          if (res.episode_run_time && res.episode_run_time.length > 0) {
            this.movie.runtime = res.episode_run_time[0];
          } else {
            this.movie.runtime = 0;
          }
        });
      }
    }
  }

  loadProviders(id: string) {
    this.movieService.getMovieProviders(id).subscribe(res => {
      const czData = res.results['CZ'];
      if (czData && czData.flatrate) {
        this.streamProviders = czData.flatrate;
      } else {
        this.streamProviders = [];
      }
    });
  }
}
