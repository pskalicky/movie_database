import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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

  constructor() {
    addIcons({ contrast, key, globe, informationCircle });
  }

  ngOnInit() {
  }


  changeTheme(event: any) {
    this.themeMode = event.detail.value;
    const body = document.body;


    body.classList.remove('dark', 'light');

    if (this.themeMode === 'dark') {
      body.classList.add('dark');
    } else if (this.themeMode === 'light') {
      body.classList.add('light');
    }
  }

  resetSettings() {
    this.themeMode = 'auto';
    this.changeTheme({ detail: { value: 'auto' } });
    this.apiKey = '';
  }
}