import { Component, Output, EventEmitter } from '@angular/core'; // Importation des décorateurs et classes nécessaires d'Angular
import { FormsModule } from '@angular/forms'; // Importer FormsModule pour utiliser ngModel, qui permet la liaison de données bidirectionnelle

@Component({
  selector: 'app-search-bar', // Sélecteur utilisé pour insérer ce composant de barre de recherche dans d'autres templates
  standalone: true, // Indique que ce composant est autonome et n'a pas besoin d'un module
  imports: [FormsModule], // Module importé pour utiliser les fonctionnalités de formulaire, notamment ngModel
  templateUrl: './search-bar.component.html', // Chemin vers le fichier template HTML
})
export class SearchBarComponent {
  searchTerm: string = ''; // Terme de recherche lié à ngModel, initialisé à une chaîne vide

  @Output() searchChange = new EventEmitter<string>(); // Émetteur pour notifier les changements de terme de recherche

  // Méthode déclenchée à chaque changement dans la barre de recherche
  onSearchChange(value: string): void {
    this.searchChange.emit(value); // Émettre l'événement avec la nouvelle valeur de recherche
  }

  // Méthode pour réinitialiser le terme de recherche
  resetSearch(): void {
    this.searchTerm = ''; // Remettre la valeur de la recherche à vide
    this.searchChange.emit(this.searchTerm); // Émettre l'événement avec une chaîne vide pour notifier le parent que la recherche a été réinitialisée
  }
}
