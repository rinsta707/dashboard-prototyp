import { Component, EventEmitter, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IxModalSize } from '@siemens/ix';
import { ModalService } from '@siemens/ix-angular';
import { ToastService } from '@siemens/ix-angular';
import { users, services, apiCalls } from 'src/app/modules/dashboard/components/mockData/mock-data';

@Component({
  selector: 'app-filter-modal',
  templateUrl: './filter-modal.component.html',
  styleUrls: ['./filter-modal.component.scss']
})
export class FilterModalComponent {

  @Output() applyFilters = new EventEmitter<any>();
  @ViewChild('customModal', { read: TemplateRef })
  customModalRef!: TemplateRef<any>;

  sortedCategories: string[] = [];
  sortedStatusCodes: string[] = [];

  selectedCategoryLabel: string = 'Choose API User or Service';
  favorites: any[] = [];

  protected form: FormGroup;

  // Initialisiert die Komponente und lädt verfügbare Filter-Optionen
  constructor(private readonly modalService: ModalService, private fb: FormBuilder, private toastService: ToastService) {
    this.form = this.fb.group({
      showAmountSelect: ['5'],
      statusCodeSelect: [[]]
    });

    this.sortedCategories = [...users, ...services].sort();

    this.sortedStatusCodes = Array.from(new Set(apiCalls.map(c => c.statusCode)))
      .map(code => code.toString())
      .sort();

    this.loadFavoritesFromStorage();
  }

  // Öffnet das Modal mit der angegebenen Größe
  public async open(size: IxModalSize) {
    this.form.reset();
    this.selectedCategoryLabel = 'Choose API User or Service';
    return this.modalService.open({
      content: this.customModalRef,
      data: size,
      size: size,
    });
  }

  // Erstellt und öffnet das Modal
  public createModal(size: IxModalSize) {
    this.open(size);
  }

  // Setzt die ausgewählte Kategorie (API User oder Service)
  public onCategorySelect(value: string) {
    this.selectedCategoryLabel = value;
  }

  // Wendet die aktuell ausgewählten Filter an und sendet sie an die übergeordnete Komponente
  onApply() {
    const filter = {
      category: this.selectedCategoryLabel !== 'Choose API User or Service' ? this.selectedCategoryLabel : null,
      showAmount: this.form.value.showAmountSelect,
      statusCodes: this.form.value.statusCodeSelect
    };

    this.applyFilters.emit(filter);
  }

  // Wechselt den Favoritenstatus (fügt aktuellen Filter als Favorit hinzu)
  toggleFavorite() {
    this.onSaveFavorite();
  }

  // Speichert die aktuellen Filtereinstellungen als neuen Favoriten
  onSaveFavorite() {
    const newFavorite = {
      name: this.generateFavoriteName(),
      category: this.selectedCategoryLabel !== 'Choose API User or Service' ? this.selectedCategoryLabel : null,
      showAmount: this.form.value.showAmountSelect,
      statusCodes: this.form.value.statusCodeSelect
    };

    if (this.favorites.length >= 5) {
      this.toastService.show({
        message: 'Maximum of 5 favorites allowed!',
        type: 'error',
      });
      return;
    }

    this.favorites.push(newFavorite);


    this.saveFavoritesToStorage();
    this.applyFilters.emit(newFavorite);
  }

  // Wendet einen gespeicherten Favoriten an und übernimmt dessen Filtereinstellungen
  applyFavorite(fav: any) {
    this.selectedCategoryLabel = fav.category || 'Choose API User or Service';
    this.form.patchValue({
      showAmountSelect: fav.showAmount,
      statusCodeSelect: fav.statusCodes
    });

    this.applyFilters.emit(fav);
  }

  // Löscht alle gespeicherten Favoriten
  clearFavorites() {
    this.favorites = [];
    localStorage.removeItem('filterFavorites');
  }
  
  // Generiert eine sprechende Bezeichnung für den aktuellen Favoriten (zur Anzeige in der UI)
  private generateFavoriteName(): string {
    const category = this.selectedCategoryLabel !== 'Choose API User or Service' ? this.selectedCategoryLabel : 'Alle Kategorien';
    const amount = this.form.value.showAmountSelect;
    const statusCodes = (this.form.value.statusCodeSelect || []).join(', ') || 'all HTTP status codes';

    return `Kategorie: ${category}, Top: ${amount}, Statuscodes: ${statusCodes}`;
  }
// Liest Favoriten aus dem LocalStorage (z. B. beim erneuten Laden der Seite)
  private loadFavoritesFromStorage() {
    const storedFavorites = localStorage.getItem('filterFavorites');
    if (storedFavorites) {
      this.favorites = JSON.parse(storedFavorites);
    }
  }

  // Speichert Favoriten im LocalStorage
  private saveFavoritesToStorage() {
    localStorage.setItem('filterFavorites', JSON.stringify(this.favorites));
  }
  
  // Löscht einen einzelnen Favoriten
  deleteFavorite(index: number) {
    this.favorites.splice(index, 1);
    this.saveFavoritesToStorage();
  }
}
