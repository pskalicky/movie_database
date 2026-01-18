import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from 'src/app/services/movie'; 
import { NavController } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage';
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
    private navCtrl: NavController,
    private storageService: StorageService
  ) {
    addIcons({ calendar, time, arrowBack, star, starOutline, albums});
  }
  
  async rateMovie(stars: number) {
    this.myRating = stars;
    if (this.movie && this.movie.id) {
      await this.storageService.saveRating(this.movie.id.toString(), stars);
    }
  }

  goBack() {
    this.navCtrl.back();
  }


async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    const type = this.route.snapshot.paramMap.get('type');

    if (id) {
       this.loadMyRating(id);
    }

    if (id && type) {
      this.loadProviders(id, type);
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

loadProviders(id: string, type: string) {
    let apiCall;
    if (type === 'tv') {
      apiCall = this.movieService.getTvProviders(id);
    } else {
      apiCall = this.movieService.getMovieProviders(id);
    }

    apiCall.subscribe(res => {
      const czData = res.results['CZ'];
      if (czData && czData.flatrate) {
        this.streamProviders = czData.flatrate;
      } else {
        this.streamProviders = [];
      }
    }, (error) => {
      console.log('Chyba při načítání providerů:', error);
      this.streamProviders = [];
    });
  }

  async loadMyRating(id: string) {
    const allRatings = await this.storageService.getAllRatings();
    if (allRatings[id]) {
      this.myRating = allRatings[id];
    }
  }
}
