import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private THEME_KEY = 'my_theme_preference';
  private FILTERS_KEY = 'my_movie_filters';
  private SESSION_KEY = 'my_tmdb_session';
  private RATINGS_KEY = 'my_local_ratings';

  constructor() { }


  async saveTheme(mode: string) {
    await Preferences.set({
      key: this.THEME_KEY,
      value: mode,
    });
  }

  async getTheme() {
    const { value } = await Preferences.get({ key: this.THEME_KEY });
    return value;
  }


  async saveFilters(filters: any[]) {
    await Preferences.set({
      key: this.FILTERS_KEY,
      value: JSON.stringify(filters),
    });
  }

  async getFilters() {
    const { value } = await Preferences.get({ key: this.FILTERS_KEY });
    if (value) {
      return JSON.parse(value); 
    }
    return null;
  }


  async saveSession(id: string) {
    await Preferences.set({ key: this.SESSION_KEY, value: id });
  }

  async getSession() {
    const { value } = await Preferences.get({ key: this.SESSION_KEY });
    return value;
  }
  
  async removeSession() {
    await Preferences.remove({ key: this.SESSION_KEY });
  }

  async getAllRatings() {
    const { value } = await Preferences.get({ key: this.RATINGS_KEY });
    if (value) {
      return JSON.parse(value);
    }
    return {}; 
  }

  async saveRating(movieId: string, rating: number) {
    const allRatings = await this.getAllRatings();
    allRatings[movieId] = rating;
    await Preferences.set({
      key: this.RATINGS_KEY,
      value: JSON.stringify(allRatings)
    });
  }

}
