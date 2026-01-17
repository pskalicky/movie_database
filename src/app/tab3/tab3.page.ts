import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../services/storage';
import { addIcons } from 'ionicons';
import { moon, key, globe, informationCircle, contrast } from 'ionicons/icons';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class Tab3Page implements OnInit {
  themeMode = 'auto'; 
  apiKey = '';

  constructor(private storageService: StorageService) {
    addIcons({ contrast, key, globe, informationCircle });
  }

  async ngOnInit() {
    const savedTheme = await this.storageService.getTheme();
    if (savedTheme) {
      this.themeMode = savedTheme;
      this.applyTheme(savedTheme);
    }
  }

  changeTheme(event: any) {
    const mode = event.detail.value;
    this.themeMode = mode;
    this.applyTheme(mode);
    this.storageService.saveTheme(mode);
  }

  applyTheme(mode: string) {
    const body = document.body;
    body.classList.remove('dark', 'light');

    if (mode === 'dark') {
      body.classList.add('dark');
    } else if (mode === 'light') {
      body.classList.add('light');
    }
  }

  resetSettings() {
    this.themeMode = 'auto';
    this.changeTheme({ detail: { value: 'auto' } });
    this.apiKey = '';
    this.storageService.saveTheme('auto');
  }
}