import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ContactServiceService } from '../../services/contactservice/contact-service.service';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../ui_shared/button/button.component';
import { ConfirmationComponent } from '../../ui_shared/confirmation/confirmation.component';

@Component({
  selector: 'app-contact', // Sélecteur utilisé pour intégrer ce composant
  standalone: true, // Le composant est autonome et peut être utilisé seul
  imports: [
    ReactiveFormsModule, // Importation pour la gestion des formulaires réactifs
    CommonModule, // Module commun d'Angular
    ButtonComponent, // Composant bouton personnalisé
    ConfirmationComponent, // Composant de confirmation personnalisé
  ],
  templateUrl: './contact.component.html', // Chemin vers le template HTML
  styleUrl: './contact.component.css', // Chemin vers le fichier CSS associé
})
export class ContactComponent implements OnInit {
  contactForm!: FormGroup; // Déclaration du formulaire de contact
  emailSent: boolean = false; // Variable pour suivre si l'email a été envoyé ou non
  confirmationMessage: string = ''; // Message de confirmation après l'envoi

  constructor(
    private fb: FormBuilder, // Service pour créer le formulaire de manière réactive
    private contactService: ContactServiceService, // Service pour gérer l'envoi des données du formulaire
  ) {}

  // Méthode du cycle de vie d'Angular, appelée lors de l'initialisation du composant
  ngOnInit(): void {
    // Initialisation du formulaire avec des contrôles et des validateurs
    this.contactForm = this.fb.group({
      name: ['', Validators.required], // Le champ 'name' est obligatoire
      email: [
        '', // Le champ 'email' avec deux validateurs : requis et regex pour valider l'adresse email
        [
          Validators.required, // L'email est requis
          Validators.pattern(
            '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$', // Regex pour valider l'email
          ),
        ],
      ],
      message: ['', Validators.required], // Le champ 'message' est obligatoire
    });
  }

  // Méthode appelée lors de la soumission du formulaire
  onSubmit(): void {
    // Vérifie si le formulaire est valide avant d'envoyer
    if (this.contactForm.valid) {
      // Appel au service pour envoyer les données du formulaire
      this.contactService.sendContactForm(this.contactForm.value).subscribe(
        (response) => {
          console.log('Message envoyé', response); // Log de la réponse après envoi réussi
          this.confirmationMessage = 'Votre email a été envoyé avec succès !'; // Définir un message de confirmation personnalisé
          this.emailSent = true; // Basculer l'état pour afficher le message de confirmation
        },
        (error) => {
          console.error("Erreur lors de l'envoi", error); // Gérer les erreurs d'envoi
        },
      );
    }
  }
}
