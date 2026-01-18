import { Component, Input, OnInit } from '@angular/core';
import { ModalController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MovieService } from 'src/app/services/movie';

@Component({
  selector: 'app-filter-editor',
  templateUrl: './filter-editor.component.html',
  styleUrls: ['./filter-editor.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class FilterEditorComponent implements OnInit {

  @Input() filter: any = null;
  @Input() isTv: boolean = false;

  filterName: string = '';
  selectedGenre: number | null = null;
  selectedYear: number | null = null;

  genres: any[] = [];

  constructor(
    private modalCtrl: ModalController,
    private movieService: MovieService
  ) {}

  ngOnInit() {
if (this.isTv) {
      this.movieService.getTvGenres().subscribe((res: any) => {
        this.genres = res.genres;
      });
    } else {
      this.movieService.getGenres().subscribe((res: any) => {
        this.genres = res.genres;
      });
    }

    if (this.filter) {
      this.filterName = this.filter.label;
      this.selectedGenre = this.filter.apiParams?.genre || null;
      this.selectedYear = this.filter.apiParams?.year || null;
    }
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  save() {
    const result = {
      id: this.filter ? this.filter.id : `custom_${Date.now()}`,
      label: this.filterName,
      isActive: true,
      type: 'custom',
      apiParams: {
        genre: this.selectedGenre,
        year: this.selectedYear
      }
    };

    this.modalCtrl.dismiss(result);
  }
}