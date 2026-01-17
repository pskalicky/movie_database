import { Component, Input } from '@angular/core';
import { ModalController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterEditorComponent } from '../filter-editor/filter-editor.component';
import { addIcons } from 'ionicons';
import { close, trash, create, menu } from 'ionicons/icons';

// Musíme si sem importovat nebo zkopírovat interface (ideálně ho dej do samostatného souboru shared/interfaces.ts)
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

  // Přijmeme filtry z hlavní stránky
  @Input() filters: MovieFilter[] = [];

  constructor(private modalCtrl: ModalController) {
    addIcons({ close, trash, create, menu });
  }

  // Ukončení editace a odeslání dat zpět
  dismiss() {
    this.modalCtrl.dismiss({
      updatedFilters: this.filters
    });
  }

  // Logika pro změnu pořadí (Ionic Reorder)
  handleReorder(ev: CustomEvent<any>) {
    // Černá magie Ionicu - řekneme mu, odkud kam se to hlo
    const itemMove = this.filters.splice(ev.detail.from, 1)[0];
    this.filters.splice(ev.detail.to, 0, itemMove);

    // Musíme zavolat complete(), aby se animace dokončila
    ev.detail.complete();
  }

  // Smazání filtru
  deleteFilter(id: string) {
    this.filters = this.filters.filter(f => f.id !== id);
  }

  async editFilter(filter: any) {
    // Otevřeme Editor a pošleme mu aktuální filtr
    const modal = await this.modalCtrl.create({
      component: FilterEditorComponent,
      componentProps: {
        filter: filter // Předáváme data
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data) {
      // Najdeme původní filtr v poli a nahradíme ho upraveným
      const index = this.filters.findIndex(f => f.id === data.id);
      if (index > -1) {
        this.filters[index] = data;
      }
    }
  }
}
