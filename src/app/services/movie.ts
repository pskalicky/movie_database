import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface ApiResult {
  page: number;
  results: any[];
  total_pages: number;
  total_results: number;
}

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  constructor(private http: HttpClient) { }

  getPopularMovies(page = 1): Observable<ApiResult> {
    return this.http.get<ApiResult>(
      `${environment.baseUrl}/movie/popular?api_key=${environment.apiKey}&page=${page}`
    );
  }

  getTopRatedMovies(page = 1): Observable<ApiResult> {
    return this.http.get<ApiResult>(
      `${environment.baseUrl}/movie/top_rated?api_key=${environment.apiKey}&page=${page}`
    );
  }

getGenres(): Observable<any> {
    return this.http.get(
      `${environment.baseUrl}/genre/movie/list?api_key=${environment.apiKey}&language=cs-CZ`
    );
  }


  getMoviesByFilter(genreId?: number, year?: number, page = 1): Observable<ApiResult> {
    let url = `${environment.baseUrl}/discover/movie?api_key=${environment.apiKey}&page=${page}&sort_by=popularity.desc`;
    
    if (genreId) {
      url += `&with_genres=${genreId}`;
    }
    if (year) {
      url += `&primary_release_year=${year}`;
    }

    return this.http.get<ApiResult>(url);
  }

searchMovies(query: string, page = 1): Observable<ApiResult> {
    return this.http.get<ApiResult>(
      `${environment.baseUrl}/search/movie?api_key=${environment.apiKey}&query=${query}&page=${page}&language=cs-CZ`
    );
  }

  getMovieProviders(id: string) {
    return this.http.get<any>(
      `${environment.baseUrl}/movie/${id}/watch/providers?api_key=${environment.apiKey}`
    );
  }

getMovieDetails(id: string) {
    return this.http.get<any>(
      `${environment.baseUrl}/movie/${id}?api_key=${environment.apiKey}&language=cs-CZ&append_to_response=credits`
    );
  }
}
