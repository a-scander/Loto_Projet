import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  NgModule,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { PaginationComponent } from '../pagination/pagination.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';

// Déclaration du composant Angular
@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, PaginationComponent, SearchBarComponent], // Importation de CommonModule, composant Pagination et SearchBar
  templateUrl: './table.component.html', // Spécification du fichier HTML associé à ce composant
  styleUrl: './table.component.css', // Spécification du fichier CSS associé à ce composant
})
export class TableComponent {
  // Inputs qui peuvent être passés par les composants parents
  @Input() columns: { header: string; key: string }[] = []; // Colonnes à afficher dans la table, chaque objet a un en-tête et une clé
  @Input() data: any[] = []; // Données à afficher dans la table
  @Input() showAction: boolean = true; // Option pour afficher ou masquer les actions (comme un bouton de suppression)
  @Input() selectedIndex: number | null = null; // Index de la ligne sélectionnée (s'il y en a une)
  @Input() title: string = ''; // Titre de la table
  @Input() showCard: boolean = true; // Option pour afficher la table dans une carte (card)
  @Input() showSearchBar: boolean = true; // Contrôle de l'affichage de la barre de recherche (affiché par défaut)

  // Outputs : événements émis vers les composants parents
  @Output() deleteEvent = new EventEmitter<number>(); // Émet un événement lorsqu'un élément est supprimé
  @Output() rowClickEvent = new EventEmitter<number>(); // Émet l'index de la ligne qui est cliquée
  @Output() searchReset = new EventEmitter<void>(); // Émet un événement lorsque la recherche est réinitialisée

  @ViewChild(SearchBarComponent) searchBarComponent!: SearchBarComponent; // Référence au composant SearchBar pour accéder à ses méthodes
  
  // Variables locales pour gérer la pagination et les données filtrées
  itemsPerPage: number = 10; // Nombre d'éléments par page
  currentPage: number = 1; // Page courante
  pagedData: any[] = []; // Données paginées actuellement visibles
  filteredData: any[] = []; // Données filtrées basées sur la recherche ou le tri

  // Initialisation du composant : appel de la méthode pour mettre à jour les données paginées
  ngOnInit(): void {
    this.updatePagedData();
  }

  // Méthode pour mettre à jour les données visibles sur la page actuelle
  updatePagedData() {
    const start = (this.currentPage - 1) * this.itemsPerPage; // Calcul de l'index de départ
    const end = start + this.itemsPerPage; // Calcul de l'index de fin
    this.pagedData = this.filteredData.slice(start, end); // Découper les données filtrées pour la pagination
  }

  // Méthode appelée lors du changement de page
  onPageChange(page: number) {
    this.currentPage = page; // Mettre à jour la page courante
    this.updatePagedData(); // Mettre à jour les données visibles en fonction de la nouvelle page
  }

  // Méthode déclenchée lorsqu'un Input change (comme les données)
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) { // Si les données changent
      this.filteredData = [...this.data]; // Réinitialiser les données filtrées avec les nouvelles données
      this.updatePagedData(); // Mettre à jour les données paginées
    }
  }

  // Méthode pour supprimer un élément (appelée depuis le HTML)
  deleteItem(id: number): void {
    this.deleteEvent.emit(id); // Émet un événement avec l'id de l'élément à supprimer
  }

  // Méthode appelée lors du clic sur une ligne du tableau
  onRowClick(index: number): void {
    this.selectedIndex = index; // Mettre à jour l'index de la ligne sélectionnée
    this.rowClickEvent.emit(index); // Émet un événement vers le parent avec l'index cliqué
  }

  // Réinitialisation de la barre de recherche
  resetSearch(): void {
    if (this.searchBarComponent) {
      this.searchBarComponent.resetSearch(); // Réinitialise la recherche via le composant SearchBar
      this.searchReset.emit(); // Émet un événement au parent pour l'informer de la réinitialisation
    }
  }

  // Méthode de recherche qui filtre les données en fonction du terme de recherche
  onSearch(term: string): void {
    const searchTerm = term.toLowerCase(); // Convertir le terme en minuscules

    if (!searchTerm) { // Si aucun terme n'est fourni, réinitialiser les données filtrées
      this.filteredData = [...this.data];
      this.updatePagedData();
      return;
    }

    // Filtrer les données par rapport au terme de recherche sur chaque colonne
    this.filteredData = this.data.filter((item) => {
      return this.columns.some((column) => {
        let cellValue = item[column.key]; // Obtenir la valeur de la cellule en fonction de la clé de la colonne

        // Si la colonne est 'position' et contient un nombre, convertir en chaîne de caractères
        if (column.key === 'position' && typeof cellValue === 'number') {
          cellValue = cellValue.toString();
        }

        // Vérifier si la valeur de la cellule contient le terme de recherche
        return (
          cellValue &&
          cellValue.toString().toLowerCase().includes(searchTerm)
        );
      });
    });

    this.updatePagedData(); // Mettre à jour les données paginées après avoir filtré
  }
}
