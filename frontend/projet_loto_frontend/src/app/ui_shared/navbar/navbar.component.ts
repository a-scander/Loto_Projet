import { Component, HostListener, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{
 // Propriété pour suivre l'état de la navbar (scrolled ou non)
 isScrolled = false;

 constructor() { }

 ngOnInit(): void {
   this.checkScroll(); // Vérifier initialement si la page est déjà scrollée
 }

 // Écouteur d'événement pour le défilement
 @HostListener('window:scroll', [])
 moveScroll() {
   this.checkScroll();
 }

 // Vérifie si la page est scrollée et met à jour la propriété isScrolled
 checkScroll() {
   if (window.scrollY  > 50) { // Plus de 50px de défilement
     this.isScrolled = true;
   } else {
     this.isScrolled = false;
   }
 }
}

