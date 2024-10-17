import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { BdTirageService } from '../../services/bdservices/bd-tirage.service';
import { CommonModule } from '@angular/common';
import { TableComponent } from '../../ui_shared/table/table.component';
import { FormsModule, NgModel } from '@angular/forms';
import { ButtonComponent } from '../../ui_shared/button/button.component';
import { NumberGridComponent } from '../../ui_shared/number-grid/number-grid.component';
import { VariableService } from '../../services/variableservices/variable.service';
import { TitleComponent } from '../../ui_shared/title/title.component';

@Component({
  selector: 'app-historique-page',
  standalone: true, // Composant autonome
  imports: [
    TableComponent,
    CommonModule,
    FormsModule,
    ButtonComponent,
    NumberGridComponent,
    TitleComponent,
  ], // Importation des modules nécessaires
  templateUrl: './historique-page.component.html',
  styleUrls: ['./historique-page.component.css'],
})
export class HistoriquePageComponent implements OnInit {
  @ViewChild(TableComponent) tableComponent!: TableComponent; // Référence à TableComponent

  // Colonnes à afficher dans le tableau d'historique
  columns = [
    { header: 'Pseudo', key: 'Pseudo' },
    { header: 'Numéro joué', key: 'Numéro joué' },
    { header: 'Étoile jouée', key: 'Étoile joué' }, // Accordé avec le header
    { header: 'Date', key: 'Date' },
    { header: 'Numéro gagnant', key: 'Numéro gagnant' },
    { header: 'Étoile gagnante', key: 'Étoile gagnant' },
    { header: 'Gain obtenu', key: '€' },
    { header: 'Nombre de Participants', key: 'Nombre de participants' },
    { header: 'Montant de la partie', key: 'Montant du tirage' },
  ];

  // Données des tirages
  allTirages: any[] = []; // Stocker tous les tirages originaux
  filteredTirages: any[] = []; // Stocker les tirages filtrés
  
  // Contrôles pour les filtres et modals
  showAdvancedFilter: boolean = false; // Contrôle pour afficher/cacher le formulaire de filtre avancé
  showNumberGrid: boolean = false; // Contrôle pour la grille des numéros
  showStarGrid: boolean = false; // Contrôle pour la grille des étoiles

  // Sélections et configurations pour les grilles
  selectedNumbers: number[] = []; // Numéros sélectionnés
  selectedStars: number[] = []; // Étoiles sélectionnées
  selectionMaxStar: number = this.service.selectionMaxStar; // Max d'étoiles sélectionnables
  selectionMaxNumber: number = this.service.selectionMaxNumber; // Max de numéros sélectionnables

  // Pour gérer les choix des grilles
  choiceGridStar: 'etoileJoue' | 'etoileGagnant' = 'etoileJoue'; 
  choiceGridNumber: 'numJoue' | 'numGagnant' = 'numJoue';
  
  // Contrôle de la barre latérale
  isSidebarOpen = false;

  // Critères de filtrage avancé
  filterCriteria = {
    pseudo: '',
    numJoue: '',
    etoileJoue: '',
    dateMin: '',
    dateMax: '',
    numGagnant: '',
    etoileGagnant: '',
    minAmount: '',
    maxAmount: '',
  };

  constructor(
    private bdTirage: BdTirageService, // Service pour les tirages
    private service: VariableService, // Service pour les variables partagées
  ) {}

  ngOnInit(): void {
    this.initialisation(); // Initialisation des données à l'ouverture
  }

  // Méthode pour charger les données des tirages
  initialisation(): void {
    this.bdTirage.getAllTirage().subscribe((tirages) => {
      this.allTirages = tirages; // Stocker toutes les données
      this.filteredTirages = [...tirages]; // Copier les données pour affichage
    });
  }


  // Ouvre la grille pour sélectionner les numéros
  openNumberGrid(field: 'numJoue' | 'numGagnant'): void {
    this.showNumberGrid = true;
    this.choiceGridNumber = field; // Champ cible pour la sélection

    // Charger les numéros déjà sélectionnés
    this.selectedNumbers = this.filterCriteria[field]
      ? this.filterCriteria[field].split(', ').map(Number)
      : [];
  }

  // Quand les numéros sont sélectionnés, les affecter aux champs correspondants
  onNumbersSelected(numbers: number[]): void {
    this.filterCriteria[this.choiceGridNumber] = numbers.join(', '); // Met à jour le champ
    this.showNumberGrid = false; // Fermer la grille après sélection
  }

  // Ouvre la grille pour sélectionner les étoiles
  openStarGrid(field: 'etoileJoue' | 'etoileGagnant'): void {
    this.showStarGrid = true;
    this.choiceGridStar = field; // Champ cible pour la sélection

    // Charger les étoiles déjà sélectionnées
    this.selectedStars = this.filterCriteria[field]
      ? this.filterCriteria[field].split(', ').map(Number)
      : [];
  }

  // Quand les étoiles sont sélectionnées, les affecter aux champs correspondants
  onStarsSelected(stars: number[]): void {
    this.filterCriteria[this.choiceGridStar] = stars.join(', ');
    this.showStarGrid = false;
  }

  // Ferme la grille des numéros ou étoiles
  closeGrid(): void {
    this.showNumberGrid = false;
    this.showStarGrid = false;
  }

  // Méthode pour filtrer et supprimer les espaces dans les champs
  filterNoSpaces(event: any): void {
    const inputValue = event.target.value; // Récupère la valeur saisie
    event.target.value = inputValue.replace(/\s/g, ''); // Supprime tous les espaces dans la saisie
    this.filterCriteria.pseudo = event.target.value; // Met à jour le modèle lié au pseudo
  }

  // Réinitialise les filtres
  resetFilters(): void {
    this.deleteFilters();
    this.initialisation(); // Recharge les données initiales

    // Réinitialiser la barre de recherche dans TableComponent
    if (this.tableComponent) {
      this.tableComponent.resetSearch();
    }
  }

  // Supprime tous les filtres appliqués
  deleteFilters(): void {
    this.filterCriteria = {
      pseudo: '',
      numJoue: '',
      etoileJoue: '',
      dateMin: '',
      dateMax: '',
      numGagnant: '',
      etoileGagnant: '',
      minAmount: '',
      maxAmount: '',
    };
  }

  // Applique les filtres avancés
  applyAdvancedFilters(): void {
    const filters = { ...this.filterCriteria }; // Copier les filtres actuels

    this.bdTirage.applyAdvancedFilters(filters).subscribe(
      (filteredResults: any[]) => {
        this.filteredTirages = filteredResults; // Mettre à jour les résultats filtrés
        this.allTirages = filteredResults;
      },
      (error) => {
        console.error('Erreur lors de la récupération des filtres avancés', error);
      },
    );
  }

  // Vérifie les entrées numériques pour empêcher les caractères non valides
  checkNumberInput(event: KeyboardEvent): void {
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];

    if (allowedKeys.includes(event.key)) {
      return; // Permettre les touches autorisées
    }

    const inputElement = event.target as HTMLInputElement;
    const inputValue = inputElement.value;

    // Empêcher plus d'un point décimal
    if (event.key === '.') {
      if (inputValue.includes('.') || inputValue.length === 0) {
        event.preventDefault(); // Bloquer si un point est déjà présent
      }
      return;
    }

    // Empêcher les caractères non numériques
    if (!/^\d$/.test(event.key)) {
      event.preventDefault();
    }
  }

  // Valide les montants minimum et maximum pour s'assurer qu'ils sont corrects
  validateAmounts(): void {
    const minAmount = this.filterCriteria.minAmount
      ? parseInt(this.filterCriteria.minAmount, 10)
      : 0;
    const maxAmount = this.filterCriteria.maxAmount
      ? parseInt(this.filterCriteria.maxAmount, 10)
      : 0;

    if (this.filterCriteria.maxAmount && minAmount > maxAmount) {
      this.filterCriteria.minAmount = this.filterCriteria.maxAmount; // Ajuster minAmount si nécessaire
    }

    if (this.filterCriteria.minAmount && maxAmount < minAmount) {
      this.filterCriteria.maxAmount = this.filterCriteria.minAmount; // Ajuster maxAmount si nécessaire
    }
  }

  // Supprimer un tirage par son ID
  deleteTirage(tirageId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce tirage ?')) {
      this.bdTirage.deleteTirage(tirageId).subscribe(
        () => {
          // Supprimer le tirage de la liste après suppression réussie
          this.filteredTirages = this.filteredTirages.filter(
            (t) => t.id !== tirageId,
          );
          this.allTirages = this.allTirages.filter((t) => t.id !== tirageId);
        },
        (error) => {
          console.error('Erreur lors de la suppression du tirage', error);
        },
      );
    }
  }

  // Ouvre/ferme la barre latérale
  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen; // Bascule l'état de la barre latérale
  }
}
