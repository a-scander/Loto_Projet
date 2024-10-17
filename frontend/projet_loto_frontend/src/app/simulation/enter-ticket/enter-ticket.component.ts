import { Component, OnInit, ViewChild } from '@angular/core';
import { Tirage } from '../../models/tirage-model'; // Modèle de données pour les tirages
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../ui_shared/button/button.component'; // Composant bouton partagé
import { NumberGridComponent } from '../../ui_shared/number-grid/number-grid.component'; // Composant pour afficher la grille de numéros
import { TitleComponent } from '../../ui_shared/title/title.component'; // Composant pour afficher des titres partagés
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Modules pour les formulaires réactifs
import { VariableService } from '../../services/variableservices/variable.service'; // Service pour gérer les variables partagées
import { Router } from '@angular/router'; // Module pour gérer la navigation
import { TableComponent } from '../../ui_shared/table/table.component'; // Composant pour afficher les données dans un tableau
import { BdTirageService } from '../../services/bdservices/bd-tirage.service'; // Service pour interagir avec la base de données des tirages
import { SearchBarComponent } from '../../ui_shared/search-bar/search-bar.component'; // Composant pour la barre de recherche

@Component({
  selector: 'app-enter-ticket', // Sélecteur du composant
  standalone: true, // Ce composant est autonome, il peut être utilisé sans être attaché à un module spécifique
  imports: [
    CommonModule,
    ButtonComponent,
    NumberGridComponent,
    TitleComponent,
    ReactiveFormsModule,
    FormsModule,
    TableComponent,
  ], // Déclaration des modules et composants nécessaires
  templateUrl: './enter-ticket.component.html', // Fichier template HTML du composant
  styleUrl: './enter-ticket.component.css', // Fichier CSS associé au composant
})
export class EnterTicketComponent implements OnInit {
  @ViewChild(TableComponent) tableComponent!: TableComponent; // Référence à TableComponent pour interagir avec le tableau

  // Déclaration des propriétés utilisées dans le composant
  pseudo: string = ''; // Pseudo de l'utilisateur
  selectedNumbers: number[] = []; // Numéros sélectionnés pour le ticket
  selectedStars: number[] = []; // Étoiles sélectionnées pour le ticket
  selectedNumbersString: string = ''; // Chaîne des numéros sélectionnés
  selectedStarsString: string = ''; // Chaîne des étoiles sélectionnées
  tableData: any[] = []; // Données à afficher dans le tableau
  currentDraw: number = 1; // Numéro du tirage actuel
  tirages: Tirage[] = []; // Liste des tirages enregistrés
  showNumberGrid: boolean = false; // Indicateur pour afficher la grille des numéros
  showStarGrid: boolean = false; // Indicateur pour afficher la grille des étoiles
  showPseudoError: boolean = false; // Indicateur pour afficher une erreur sur le pseudo
  showNumbersError: boolean = false; // Indicateur pour afficher une erreur sur les numéros
  showStarsError: boolean = false; // Indicateur pour afficher une erreur sur les étoiles
  totalParticipants!: number; // Nombre total de participants (données reçues via la navigation)
  numberOfDraws!: number; // Nombre de tirages (données reçues via la navigation)
  montantTotal!: number; // Montant total du gain (données reçues via la navigation)
  maxNumberSelections: number = this.service.selectionMaxNumber; // Nombre maximal de numéros à sélectionner
  maxStarSelections: number = this.service.selectionMaxStar; // Nombre maximal d'étoiles à sélectionner
  selectedTirageIndex: number | null = null; // Index du tirage sélectionné pour modification
  selectedIndex: number | null = null; // Gestion de la ligne sélectionnée dans le tableau
  pseudoMessage: string = ''; // Message d'information concernant le pseudo
  showPseudoList: boolean = false; // Affichage ou non de la liste des pseudos
  users: any[] = []; // Liste des utilisateurs récupérés de la base de données
  isPseudoSelected: boolean = false; // Indicateur si un pseudo est sélectionné
  filteredUsers: any[] = []; // Liste des utilisateurs filtrée par la barre de recherche
  searchTerm: string = ''; // Terme recherché pour filtrer les pseudos

  columns = [
    { header: '#', key: 'index' }, // Colonne pour l'index
    { header: 'Pseudo', key: 'pseudo' }, // Colonne pour le pseudo
    { header: 'Numéros', key: 'numeros' }, // Colonne pour les numéros
    { header: 'Étoiles', key: 'etoiles' }, // Colonne pour les étoiles
  ]; // Définition des colonnes du tableau

  constructor(
    private router: Router, // Service de navigation Angular
    private service: VariableService, // Service pour les variables partagées
    private serviceBd: BdTirageService, // Service pour interagir avec la base de données des tirages
  ) {}

  ngOnInit(): void {
    // Récupération des données envoyées via la navigation
    const state = history.state;

    this.totalParticipants = Number(state.totalParticipants);
    this.numberOfDraws = Number(state.numberOfDraws);
    this.montantTotal = Number(state.montantTotal);

    console.log(
      'Données reçues:',
      this.totalParticipants,
      this.numberOfDraws,
      this.montantTotal,
    );

    // Si les participants ou les tirages sont à zéro, générer des tirages supplémentaires
    if (this.totalParticipants === 0 || this.numberOfDraws === 0) {
      this.generateAdditionalDraws();
      // Navigation vers la page suivante avec les tirages générés
      this.router.navigate(['/selection-tiragewin'], {
        state: {
          tirages: this.tirages,
          totalParticipants: this.totalParticipants,
          numberOfDraws: this.numberOfDraws,
          montantTotal: this.montantTotal,
        },
      });
    }
  }

  // Générer un pseudo aléatoire pour l'utilisateur
  generatePseudo(): void {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const digits = '0123456789';
    const pseudoLength = Math.floor(Math.random() * 5) + 8; // Longueur aléatoire entre 8 et 12
    let randomPseudo = '';

    for (let i = 0; i < pseudoLength; i++) {
      const isLetter = Math.random() < 0.7; // 70% de chance d'obtenir une lettre
      if (isLetter) {
        randomPseudo += letters.charAt(
          Math.floor(Math.random() * letters.length),
        );
      } else {
        randomPseudo += digits.charAt(
          Math.floor(Math.random() * digits.length),
        );
      }
    }

    this.pseudo = randomPseudo;
    this.checkPseudo(); // Vérifier si le pseudo est valide
  }

  // Générer des numéros aléatoires pour le ticket
  generateRandomNumbers(): void {
    this.selectedNumbers = [];
    while (this.selectedNumbers.length < this.maxNumberSelections) {
      const randomNum = Math.floor(Math.random() * this.service.gridNumero) + 1; // Numéro entre 1 et 50
      if (!this.selectedNumbers.includes(randomNum)) {
        this.selectedNumbers.push(randomNum);
      }
    }
    this.selectedNumbersString = this.selectedNumbers.join(', ');
    this.showNumbersError = false;
  }

  // Générer des étoiles aléatoires pour le ticket
  generateRandomStars(): void {
    this.selectedStars = [];
    while (this.selectedStars.length < this.maxStarSelections) {
      const randomStar =
        Math.floor(Math.random() * this.service.gridEtoile) + 1; // Étoile entre 1 et 12
      if (!this.selectedStars.includes(randomStar)) {
        this.selectedStars.push(randomStar);
      }
    }
    this.selectedStarsString = this.selectedStars.join(', ');
    this.showStarsError = false;
  }

  // Générer pseudo, numéros et étoiles
  generateAll(): void {
    if (this.isPseudoSelected) {
      this.generateRandomNumbers();
      this.generateRandomStars();
    } else {
      this.generatePseudo();
      this.generateRandomNumbers();
      this.generateRandomStars();
    }
  }

  // Ouvrir la grille pour sélectionner les numéros
  openNumberGrid(): void {
    this.showNumberGrid = true;
  }

  // Ouvrir la grille pour sélectionner les étoiles
  openStarGrid(): void {
    this.showStarGrid = true;
  }

  // Lorsque les numéros sont sélectionnés dans la grille
  onNumbersSelected(numbers: number[]): void {
    this.selectedNumbers = numbers;
    this.selectedNumbersString = numbers.join(', ');
    this.showNumbersError =
      this.selectedNumbers.length !== this.maxNumberSelections;
    this.showNumberGrid = false;
  }

  // Lorsque les étoiles sont sélectionnées dans la grille
  onStarsSelected(stars: number[]): void {
    this.selectedStars = stars;
    this.selectedStarsString = stars.join(', ');
    this.showStarsError = this.selectedStars.length !== this.maxStarSelections;
    this.showStarGrid = false;
  }

  // Fermer les grilles
  closeGrid(): void {
    this.showNumberGrid = false;
    this.showStarGrid = false;
  }

  // Filtrer la liste des pseudos en fonction du terme de recherche
  filterPseudoList(): void {
    if (this.searchTerm.trim() !== '') {
      this.filteredUsers = this.users.filter((user) =>
        user.pseudo.toLowerCase().includes(this.searchTerm.toLowerCase()),
      );
    } else {
      this.filteredUsers = this.users; // Réinitialiser la liste si le champ est vide
    }
  }

  // Récupérer la liste des pseudos depuis la base de données
  fetchPseudosFromDB(): void {
    this.serviceBd.getPseudo().subscribe((response: any) => {
      this.users = response; // Assigner la réponse de l'API à la liste des utilisateurs
      this.filteredUsers = this.users; // Initialiser la liste filtrée avec tous les utilisateurs
      this.showPseudoList = true; // Afficher la liste après récupération
    });
  }

  // Fermer la liste des pseudos
  closePseudoList(): void {
    this.showPseudoList = false;
  }

  // Sélectionner un pseudo dans la liste
  selectPseudo(user: any): void {
    this.pseudo = user.pseudo; // Mettre à jour le pseudo avec celui sélectionné
    this.isPseudoSelected = true; // Désactiver la modification du pseudo
    this.showPseudoList = false; // Fermer la liste des pseudos
    this.showPseudoError = false; // Masquer les erreurs de pseudo
    this.pseudoMessage = 'Pseudo sélectionné depuis la base de données.'; // Message de succès
  }

  // Permettre la modification du pseudo
  enablePseudoEdit(): void {
    this.pseudo = '';
    this.isPseudoSelected = false;
    this.pseudoMessage = '';
  }

  // Vérifier si le pseudo est valide ou déjà pris
  async checkPseudo(): Promise<void> {
    this.pseudo = this.pseudo.replace(/\s+/g, ''); // Supprimer les espaces du pseudo
    this.showPseudoError = this.pseudo.trim() === ''; // Vérifier si le pseudo est vide

    if (this.showPseudoError) {
      this.pseudoMessage = 'Le pseudo ne doit pas être vide.';
      return;
    }

    // Vérifier si le pseudo est déjà utilisé dans les tirages actuels
    const pseudoExistsInTable = this.tirages.some(
      (tirage) => tirage.pseudo.toLowerCase() === this.pseudo.toLowerCase(),
    );

    if (pseudoExistsInTable) {
      this.showPseudoError = true;
      this.pseudoMessage =
        'Ce pseudo est déjà utilisé dans le tableau des tickets.';
      return;
    }

    if (this.isPseudoSelected) {
      this.showPseudoError = false;
      return;
    }

    try {
      // Vérifier si le pseudo existe dans la base de données
      const response = await this.serviceBd.checkPseudo(this.pseudo);

      if (response && response.exists) {
        this.showPseudoError = true;
        this.pseudoMessage = 'Ce pseudo est déjà pris dans la base de données.';
      } else {
        this.showPseudoError = false;
        this.pseudoMessage = 'Ce pseudo est disponible.';
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du pseudo', error);
    }
  }

  // Gestion de la sélection de ligne dans le tableau
  onRowClick(index: number): void {
    this.selectedIndex = index; // Enregistrer l'index de la ligne sélectionnée

    this.selectedTirageIndex = index - 1;
    const selectedTirage = this.tirages[index - 1];

    // Charger les informations du tirage sélectionné
    this.pseudo = selectedTirage.pseudo;
    this.selectedNumbers = [...selectedTirage.numeros];
    this.selectedStars = [...selectedTirage.etoiles];
    this.selectedNumbersString = this.selectedNumbers.join(', ');
    this.selectedStarsString = this.selectedStars.join(', ');
  }

  // Vérifier si le formulaire est valide
  isFormValid(): boolean {
    const numbersArray = this.selectedNumbersString
      .split(',')
      .map((num) => num.trim())
      .filter(Boolean);
    const starsArray = this.selectedStarsString
      .split(',')
      .map((star) => star.trim())
      .filter(Boolean);

    return (
      !this.showPseudoError && // Pas d'erreur sur le pseudo
      this.pseudo?.trim() !== '' && // Le pseudo ne doit pas être vide
      numbersArray.length === this.maxNumberSelections && // Vérification du nombre de numéros
      starsArray.length === this.maxStarSelections // Vérification du nombre d'étoiles
    );
  }

  // Générer les données pour le tableau
  generateTableData(): void {
    this.tableData = this.tirages.map((tirage, index) => ({
      index: index + 1, // Numéro de la ligne
      pseudo: tirage.pseudo,
      numeros: tirage.numeros.join(', '), // Transformation des numéros en chaîne
      etoiles: tirage.etoiles.join(', '), // Transformation des étoiles en chaîne
    }));
  }

  // Validation du ticket
  async validateTicket(): Promise<void> {
    await this.checkPseudo(); // Vérifier la validité du pseudo

    const numbersArray = this.selectedNumbersString
      .split(',')
      .map((num) => num.trim())
      .filter(Boolean);
    const starsArray = this.selectedStarsString
      .split(',')
      .map((star) => star.trim())
      .filter(Boolean);

    this.showNumbersError = numbersArray.length !== this.maxNumberSelections; // Vérifier la sélection des numéros
    this.showStarsError = starsArray.length !== this.maxStarSelections; // Vérifier la sélection des étoiles

    if (this.isFormValid()) {
      if (this.selectedTirageIndex !== null) {
        // Mise à jour du tirage existant
        this.tirages[this.selectedTirageIndex] = new Tirage(
          this.pseudo,
          this.selectedNumbers,
          this.selectedStars,
        );
        this.selectedTirageIndex = null; // Réinitialiser l'index du tirage sélectionné

        if (this.tableComponent) {
          this.tableComponent.resetSearch(); // Réinitialiser la barre de recherche du tableau
        }
      } else {
        // Ajouter un nouveau tirage
        const newTirage = new Tirage(
          this.pseudo,
          this.selectedNumbers,
          this.selectedStars,
        );
        this.tirages.push(newTirage);
        this.currentDraw++;
      }

      this.generateTableData(); // Mettre à jour les données du tableau

      // Réinitialiser les champs après validation
      this.clearSelection();

      if (this.tirages.length === this.numberOfDraws) {
        // Générer des tirages pour les participants restants
        this.generateAdditionalDraws();

        // Naviguer vers la page de sélection des tirages gagnants
        this.router.navigate(['/selection-tiragewin'], {
          state: {
            tirages: this.tirages,
            totalParticipants: this.totalParticipants,
            numberOfDraws: this.numberOfDraws,
            montantTotal: this.montantTotal,
          },
        });
      }
    }
  }

  // Générer des tirages supplémentaires pour les participants restants
  generateAdditionalDraws(): void {
    const remainingParticipants = this.totalParticipants - this.numberOfDraws;

    for (let i = 0; i < remainingParticipants; i++) {
      this.generateAll(); // Générer un tirage aléatoire
      const newTirage = new Tirage(
        this.pseudo,
        this.selectedNumbers,
        this.selectedStars,
      );
      this.tirages.push(newTirage);
    }
  }

  // Réinitialiser la sélection des numéros, étoiles et pseudo
  clearSelection(): void {
    this.selectedTirageIndex = null;
    this.pseudo = '';
    this.selectedNumbers = [];
    this.selectedStars = [];
    this.selectedNumbersString = '';
    this.selectedStarsString = '';
    this.selectedIndex = null;
    this.isPseudoSelected = false;
    this.pseudoMessage = ''; // Réinitialiser le message de pseudo
    this.showPseudoError = false; // Masquer l'erreur de pseudo
  }
}
