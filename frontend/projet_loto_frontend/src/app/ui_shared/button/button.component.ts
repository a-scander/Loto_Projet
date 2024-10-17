import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'; 
// Importation des modules nécessaires depuis Angular
// `Component` pour créer le composant
// `EventEmitter` et `Output` pour permettre au bouton d'émettre des événements lorsque l'utilisateur clique dessus
// `Input` pour recevoir des données dynamiques dans le composant
// `OnInit` pour gérer le cycle de vie du composant

@Component({
  selector: 'app-button', // Sélecteur du composant utilisé dans le HTML pour insérer ce bouton
  standalone: true, // Ce composant est autonome et n'a pas besoin d'être déclaré dans un module spécifique
  imports: [], // Le composant n'importe aucun autre module ou composant ici
  templateUrl: './button.component.html', // Lien vers le fichier template HTML qui définit l'apparence du bouton
  styleUrl: './button.component.css', // Lien vers le fichier CSS qui applique le style au bouton
})
export class ButtonComponent implements OnInit {
  // Propriétés `@Input` pour personnaliser le bouton :
  @Input() label!: string; // `label` est le texte affiché sur le bouton, c'est une valeur obligatoire
  @Input() type: string = 'button'; // Type HTML du bouton (par défaut : 'button')
  @Input() disabled: boolean = false; // Indique si le bouton est désactivé ou non (par défaut : false)

  // `@Output` permet d'émettre un événement lorsque le bouton est cliqué
  @Output() clicked = new EventEmitter<void>(); // L'événement `clicked` est émis sans valeur (type `void`)

  // Méthode appelée à l'initialisation du composant
  ngOnInit(): void {
    // Vérification pour s'assurer que la propriété `label` a bien été fournie
    if (!this.label) {
      throw new Error(
        "L'input `label` est requis pour le composant `ButtonComponent`.", // Lève une erreur si aucun `label` n'est fourni
      );
    }
  }

  // Méthode appelée lorsque le bouton est cliqué
  onClick(): void {
    if (!this.disabled) {
      // Si le bouton n'est pas désactivé
      this.clicked.emit(); // Émet l'événement `clicked` pour informer le parent que le bouton a été cliqué
    }
  }
}
