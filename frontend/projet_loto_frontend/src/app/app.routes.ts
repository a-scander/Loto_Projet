import { Routes } from '@angular/router'; // Importation du type Routes d'Angular pour définir les routes de l'application
import { AccueilPageComponent } from './accueil/accueil-page/accueil-page.component'; // Page d'accueil
import { HistoriquePageComponent } from './historique/historique-page/historique-page.component'; // Page d'historique des tirages
import { QuisommesNousPageComponent } from './quisommesnous/quisommes-nous-page/quisommes-nous-page.component'; // Page "Qui sommes-nous"
import { SelectionPageComponent } from './simulation/selection-page/selection-page.component'; // Page de sélection pour la simulation
import { ContactComponent } from './contact/contact/contact.component'; // Page de contact
import { PolitiqueConfidentialiteComponent } from './politiqueconfidentialite/politique-confidentialite/politique-confidentialite.component'; // Page de politique de confidentialité
import { CustomFormComponent } from './simulation/custom-form/custom-form.component'; // Formulaire de participation personnalisé
import { EnterTicketComponent } from './simulation/enter-ticket/enter-ticket.component'; // Page pour entrer un ticket
import { SelectionWinTicketComponent } from './simulation/selection-win-ticket/selection-win-ticket.component'; // Sélection des tickets gagnants
import { TicketWinFormComponent } from './simulation/ticket-win-form/ticket-win-form.component'; // Formulaire pour saisir les tickets gagnants
import { ResultatComponent } from './simulation/resultat/resultat.component'; // Page des résultats du tirage
import { QuickSimulationComponent } from './simulation/quick-simulation/quick-simulation.component'; // Page de simulation rapide
import { ReglesComponent } from './regles/regles.component'; // Page des règles du jeu

// Définition des routes principales de l'application
export const routes: Routes = [
  { path: 'simulation', component: SelectionPageComponent }, // Route vers la page de sélection pour la simulation
  { path: 'accueil', component: AccueilPageComponent }, // Route vers la page d'accueil
  { path: 'historique', component: HistoriquePageComponent }, // Route vers la page de l'historique des tirages
  { path: 'quisommesnous', component: QuisommesNousPageComponent }, // Route vers la page "Qui sommes-nous"
  { path: 'regles', component: ReglesComponent }, // Route vers la page des règles
  { path: 'contact', component: ContactComponent }, // Route vers la page de contact
  { path: 'politique', component: PolitiqueConfidentialiteComponent }, // Route vers la page de politique de confidentialité
  { path: 'custom-form', component: CustomFormComponent }, // Route vers le formulaire personnalisé pour la simulation
  { path: 'quick-simulation', component: QuickSimulationComponent }, // Route vers la page de simulation rapide
  { path: 'enter-ticket', component: EnterTicketComponent }, // Route pour entrer un ticket de participation
  { path: 'selection-tiragewin', component: SelectionWinTicketComponent }, // Route pour la sélection des tickets gagnants
  { path: 'ticket-win-form', component: TicketWinFormComponent }, // Route pour le formulaire des tickets gagnants
  { path: 'resultat-simulation', component: ResultatComponent }, // Route vers la page des résultats de la simulation

  // Route wildcard (**) : redirige vers la page d'accueil pour toutes les routes inconnues
  { path: '**', redirectTo: '/accueil', pathMatch: 'full' },
];
