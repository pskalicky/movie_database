import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private THEME_KEY = 'my_theme_preference';
  private FILTERS_KEY = 'my_movie_filters';
  private SESSION_KEY = 'my_tmdb_session';

  constructor() { }

  // --- 1. MOTIV (Dark/Light) ---
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

  // --- 2. FILTRY (To je to, co ti chybělo) ---
  async saveFilters(filters: any[]) {
    await Preferences.set({
      key: this.FILTERS_KEY,
      value: JSON.stringify(filters), // Ukládáme pole jako text
    });
  }

  async getFilters() {
    const { value } = await Preferences.get({ key: this.FILTERS_KEY });
    if (value) {
      return JSON.parse(value); // Převedeme text zpět na pole
    }
    return null;
  }

  // --- 3. SESSION (Přihlášení - pokud jsi implementoval) ---
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
}
