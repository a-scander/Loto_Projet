import { Routes } from '@angular/router';
import { AccueilPageComponent } from './accueil/accueil-page/accueil-page.component';
import { HistoriquePageComponent } from './historique/historique-page/historique-page.component';
import { QuisommesNousPageComponent } from './quisommesnous/quisommes-nous-page/quisommes-nous-page.component';
import { SelectionPageComponent } from './simulation/selection-page/selection-page.component';
import { ContactComponent } from './contact/contact/contact.component';
import { PolitiqueConfidentialiteComponent } from './politiqueconfidentialite/politique-confidentialite/politique-confidentialite.component';
import { CustomFormComponent } from './simulation/custom-form/custom-form.component';
import { EnterTicketComponent } from './simulation/enter-ticket/enter-ticket.component';
import { SelectionWinTicketComponent } from './simulation/selection-win-ticket/selection-win-ticket.component';
import { TicketWinFormComponent } from './simulation/ticket-win-form/ticket-win-form.component';
import { ResultatComponent } from './simulation/resultat/resultat.component';
import { QuickSimulationComponent } from './simulation/quick-simulation/quick-simulation.component';

export const routes: Routes = [
  { path: 'simulation', component: SelectionPageComponent },
  { path: 'accueil', component: AccueilPageComponent },
  { path: 'historique', component: HistoriquePageComponent },
  { path: 'quisommesnous', component: QuisommesNousPageComponent },
  { path: 'contact', component: ContactComponent }, // Route pour la simulation personnalisée
  { path: 'politique', component: PolitiqueConfidentialiteComponent },
  { path: 'custom-form', component: CustomFormComponent },
  { path: 'quick-simulation', component: QuickSimulationComponent },
  { path: 'enter-ticket', component: EnterTicketComponent },
  { path: 'selection-tiragewin', component: SelectionWinTicketComponent },
  { path: 'ticket-win-form', component: TicketWinFormComponent },
  { path: 'resultat-simulation', component: ResultatComponent },
  { path: '**', redirectTo: '/accueil', pathMatch: 'full' },
];
