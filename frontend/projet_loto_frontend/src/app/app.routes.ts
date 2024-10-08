import { Routes } from '@angular/router';
import { SimulationPageComponent } from './simulation/simulation-page/simulation-page.component';
import { AccueilPageComponent } from './accueil/accueil-page/accueil-page.component';
import { HistoriquePageComponent } from './historique/historique-page/historique-page.component';
import { QuisommesNousPageComponent } from './quisommesnous/quisommes-nous-page/quisommes-nous-page.component';

export const routes: Routes = [
  { path: 'simulation', component: SimulationPageComponent },
  { path: 'accueil', component: AccueilPageComponent },
  { path: 'historique', component: HistoriquePageComponent },
  { path: 'quisommesnous', component: QuisommesNousPageComponent },
  { path: '**', redirectTo: '/accueil', pathMatch: 'full' },
];
