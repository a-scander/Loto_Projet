import { CommonModule } from '@angular/common'; // Importation du module commun d'Angular pour utiliser des directives de base
import { Component, EventEmitter, Input, Output } from '@angular/core'; // Importation des décorateurs et classes nécessaires d'Angular

@Component({
  selector: 'app-pagination', // Sélecteur utilisé pour insérer ce composant de pagination dans d'autres templates
  standalone: true, // Indique que ce composant est autonome et ne dépend d'aucun module
  imports: [CommonModule], // Modules importés, ici seulement le module commun
  templateUrl: './pagination.component.html', // Chemin vers le fichier template HTML
  styleUrl: './pagination.component.css', // Chemin vers le fichier de style CSS
})
export class PaginationComponent {
  @Input() totalItems!: number; // Nombre total d'éléments à paginer
  @Input() itemsPerPage: number = 10; // Nombre d'éléments par page, avec une valeur par défaut de 10
  @Input() currentPage: number = 1; // Page actuellement affichée, initialisée à 1

  @Output() pageChange = new EventEmitter<number>(); // Événement émis pour notifier le parent lorsque la page change

  // Calculer le nombre total de pages
  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage); // Retourne le nombre total de pages, en utilisant Math.ceil pour arrondir à l'entier supérieur
  }

  // Générer un tableau des numéros de pages
  get pages(): number[] {
    return Array(this.totalPages) // Crée un tableau de longueur `totalPages`
      .fill(0) // Remplit le tableau avec des zéros
      .map((x, i) => i + 1); // Remplace chaque élément par son index + 1 pour obtenir les numéros de page
  }

  // Méthode pour changer de page
  changePage(page: number) {
    // Vérifie que la page demandée est valide (entre 1 et le nombre total de pages)
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page; // Met à jour la page actuelle
      this.pageChange.emit(this.currentPage); // Émet l'événement pour signaler la nouvelle page sélectionnée
    }
  }
}
