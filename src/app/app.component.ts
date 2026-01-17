import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { StorageService } from './services/storage';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonApp, IonRouterOutlet], 
})
export class AppComponent implements OnInit {
  
  constructor(private storageService: StorageService) {}

  async ngOnInit() {
    try {
      const savedTheme = await this.storageService.getTheme();
      if (savedTheme) {
        this.applyTheme(savedTheme);
      }
    } catch (error) {
      console.error('Chyba při načítání tématu:', error);
    }
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
}
