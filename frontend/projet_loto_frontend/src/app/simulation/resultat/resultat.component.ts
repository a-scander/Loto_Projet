import { Component, OnInit } from '@angular/core'; 
import { Tirage } from '../../models/tirage-model'; // Modèle pour les tirages
import { Router } from '@angular/router'; // Service de navigation Angular
import { TirageService } from '../../services/services/tirage.service'; // Service pour gérer les tirages et calculer les gains
import { TableComponent } from '../../ui_shared/table/table.component'; // Composant pour afficher les données sous forme de tableau
import { CommonModule } from '@angular/common'; // Module commun Angular
import { TitleComponent } from '../../ui_shared/title/title.component'; // Composant pour les titres partagés
import { ButtonComponent } from '../../ui_shared/button/button.component'; // Composant pour les boutons partagés
import { BdTirageService } from '../../services/bdservices/bd-tirage.service'; // Service pour interagir avec la base de données des tirages

@Component({
  selector: 'app-resultat', // Sélecteur du composant
  standalone: true, // Composant autonome
  imports: [TableComponent, CommonModule, TitleComponent, ButtonComponent], // Import des composants et modules nécessaires
  templateUrl: './resultat.component.html', // Template HTML du composant
  styleUrl: './resultat.component.css', // Fichier de style CSS du composant
})
export class ResultatComponent implements OnInit {
  // Déclaration des propriétés
  totalParticipants!: number; // Nombre total de participants
  numberOfDraws!: number; // Nombre de tirages
  montantTotal!: number; // Montant total de la partie
  tirages: Tirage[] = []; // Liste des tirages effectués
  tirageWin!: Tirage; // Tirage gagnant
  classement: any[] = []; // Classement des tirages
  positions: number[] = []; // Liste des positions dans le classement
  gains: number[] = []; // Liste des gains associés à chaque tirage
  tableData: any[] = []; // Données à afficher dans le tableau

  // Définition des colonnes pour le tableau
  columns = [
    { header: 'Position', key: 'position' },
    { header: 'Pseudo', key: 'pseudo' },
    { header: 'Numéros', key: 'numeros' },
    { header: 'Étoiles', key: 'etoiles' },
    { header: 'Gains', key: 'gains' },
  ];

  constructor(
    private router: Router, // Service de navigation
    private service: TirageService, // Service pour classer les tirages et calculer les gains
    private bdTirageService: BdTirageService, // Service pour enregistrer les tirages dans la base de données
  ) {}

  // Méthode appelée au moment de l'initialisation du composant
  ngOnInit(): void {
    // Récupération des données envoyées via la navigation
    const state = history.state;

    this.totalParticipants = state.totalParticipants;
    this.numberOfDraws = state.numberOfDraws;
    this.montantTotal = state.montantTotal;
    this.tirages = state.tirages;
    this.tirageWin = state.tirageWin;

    console.log(
      'Données reçues:',
      this.totalParticipants,
      this.numberOfDraws,
      this.montantTotal,
      this.tirages,
      this.tirageWin,
    );
    debugger;

    // Appeler le service pour classer les tirages et calculer les gains
    this.service
      .classerTiragesEtCalculerGains(this.tirages, this.tirageWin, this.montantTotal)
      .subscribe(
        (response) => {
          this.classement = response.classement; // Récupère le classement des tirages
          this.positions = response.positions; // Récupère les positions dans le classement
          this.gains = response.gains; // Récupère les gains pour chaque tirage

          // Générer les données du tableau pour l'affichage
          this.generateTableData();

          // Enregistrer les tirages manuels avec les gains dans la base de données
          this.enregistrerTirages();
        },
        (error) => {
          console.error('Erreur lors du classement des tirages:', error); // Gestion des erreurs
        },
      );
  }

  // Générer les données du tableau pour l'affichage
  generateTableData(): void {
    if (
      this.classement.length === this.positions.length && // Vérifier que les tableaux ont la même longueur
      this.classement.length === this.gains.length
    ) {
      // Construire les données du tableau en liant les tirages aux positions et aux gains
      const tableData = this.classement.map((tirage, index) => ({
        position: this.positions[index], // Position du tirage
        pseudo: tirage.pseudo, // Pseudo du joueur
        numeros: tirage.numeros.join(', '), // Numéros du tirage
        etoiles: tirage.etoiles.join(', '), // Étoiles du tirage
        gains: this.gains[index].toLocaleString() + ' €', // Gain avec formatage et ajout de l'unité €
      }));

      this.tableData = tableData; // Mise à jour des données du tableau
    } else {
      console.error(
        'Les tailles des tableaux classement, positions et gains ne correspondent pas.',
      );
    }
  }

  // Enregistrer les tirages dans la base de données
  enregistrerTirages(): void {
    // Copier les tirages manuels (les premiers 'numberOfDraws' tirages)
    const manualTirages = this.tirages.slice(0, this.numberOfDraws);

    // Associer chaque tirage avec le gain correspondant
    const tiragesAvecGains = manualTirages.map((tirage) => {
      const correspondingRow = this.tableData.find(
        (row) => row.pseudo === tirage.pseudo, // Trouver la ligne correspondante dans le tableau par pseudo
      );

      let gain = 0;
      if (correspondingRow) {
        // Nettoyer le gain pour obtenir une valeur numérique
        const cleanedGain = correspondingRow.gains
          .replace(' €', '') // Retirer le symbole €
          .replace(/\s/g, ''); // Retirer les espaces

        // Remplacer la virgule par un point si c'est un séparateur décimal
        gain = parseFloat(cleanedGain.replace(',', '.'));
      }
      // Retourner un objet avec les numéros, étoiles, pseudo et le gain
      return {
        numeros: tirage.numeros,
        etoiles: tirage.etoiles,
        pseudo: tirage.pseudo,
        gain: gain,
      };
    });
    debugger;

    // Préparer les données à envoyer pour l'enregistrement
    const tirageData = {
      tirages: tiragesAvecGains, // Tirages avec les gains associés
      montantPartie: this.montantTotal, // Montant total de la partie
      tirageGagnant: {
        numeros: this.tirageWin.numeros, // Numéros du tirage gagnant
        etoiles: this.tirageWin.etoiles, // Étoiles du tirage gagnant
      },
      totalParticipants: this.totalParticipants, // Nombre total de participants
    };

    console.log(tirageData); // Afficher les données à enregistrer dans la console
    debugger;

    // Enregistrer les tirages avec les gains dans la base de données
    this.bdTirageService.saveTirageData(tirageData).subscribe(
      (response) => {
        console.log('Tirages avec gains enregistrés avec succès', response); // Message de succès
      },
      (error) => {
        console.error("Erreur lors de l'enregistrement des tirages", error); // Gestion des erreurs
      },
    );
  }

  // Navigation vers la page d'accueil
  goToAccueil() {
    this.router.navigate(['/accueil']);
  }

  // Navigation vers la page de simulation
  goToSimulation() {
    this.router.navigate(['/simulation']);
  }

  // Navigation vers la page de l'historique
  goToHistorique() {
    this.router.navigate(['/historique']);
  }
}
