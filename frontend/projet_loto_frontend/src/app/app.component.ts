import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './ui_shared/navbar/navbar.component';
import { FooterComponent } from './ui_shared/footer/footer.component';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root', // Sélecteur du composant principal, utilisé dans le fichier HTML pour intégrer ce composant.
  standalone: true, // Indique que le composant est autonome et ne dépend pas d'un module spécifique.
  imports: [RouterOutlet, NavbarComponent, FooterComponent], // Importe les modules et composants nécessaires, y compris RouterOutlet, NavbarComponent, et FooterComponent.
  templateUrl: './app.component.html', // Lien vers le fichier HTML associé à ce composant.
  styleUrl: './app.component.css', // Lien vers le fichier CSS associé pour définir le style de ce composant.
})
export class AppComponent {
  //title = 'projet_loto_frontend'; // Une variable `title` qui est commentée et inutilisée.

  constructor(private router: Router) {
    // Constructeur du composant qui prend une instance de `Router` pour gérer la navigation.

    // Définit un comportement pour remonter en haut de la page à chaque changement de route.
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd)) // Utilise RxJS pour filtrer les événements de navigation et ne traite que ceux qui correspondent à la fin d'une navigation (`NavigationEnd`).
      .subscribe(() => {
        window.scrollTo(0, 0); // Lorsque l'événement `NavigationEnd` est déclenché, fait défiler la fenêtre vers le haut de la page (coordonnées 0, 0).
      });
  }
}
