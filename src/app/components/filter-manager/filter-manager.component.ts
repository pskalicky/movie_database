import { Component, Input } from '@angular/core';
import { ModalController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterEditorComponent } from '../filter-editor/filter-editor.component';
import { addIcons } from 'ionicons';
import { close, trash, create, menu } from 'ionicons/icons';


interface MovieFilter {
  id: string;
  label: string;
  isActive: boolean;
  type: 'predefined' | 'custom';
}

@Component({
  selector: 'app-filter-manager',
  templateUrl: './filter-manager.component.html',
  styleUrls: ['./filter-manager.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})

export class FilterManagerComponent {
  @Input() filters: MovieFilter[] = [];
  constructor(private modalCtrl: ModalController) {
    addIcons({ close, trash, create, menu });
  }

  dismiss() {
    this.modalCtrl.dismiss({
      updatedFilters: this.filters
    });
  }

  handleReorder(ev: CustomEvent<any>) {
    const itemMove = this.filters.splice(ev.detail.from, 1)[0];
    this.filters.splice(ev.detail.to, 0, itemMove);
    ev.detail.complete();
  }

  deleteFilter(id: string) {
    this.filters = this.filters.filter(f => f.id !== id);
  }
  async editFilter(filter: any) {
    const modal = await this.modalCtrl.create({
      component: FilterEditorComponent,
      componentProps: {
        filter: filter,
        isTv: true
      }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
      const index = this.filters.findIndex(f => f.id === data.id);
      if (index > -1) {
        this.filters[index] = data;
      }
    }
  }
}
