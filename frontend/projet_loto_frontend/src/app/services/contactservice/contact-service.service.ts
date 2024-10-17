import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root', // Fournit le service à l'ensemble de l'application (singleton) via l'injection de dépendance
})
export class ContactServiceService {
  constructor(private http: HttpClient) {}

  // Méthode pour envoyer les informations du formulaire de contact
  sendContactForm(contactData: any): Observable<any> {
    // Crée un en-tête HTTP avec un type de contenu JSON
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // Effectue une requête POST pour envoyer les données du formulaire au serveur
    return this.http.post<any>(
      'http://localhost:3000/api/contact/send', // URL de l'API pour envoyer les informations du formulaire
      contactData, // Les données du formulaire à envoyer au serveur
      { headers }, // Les en-têtes HTTP à inclure dans la requête (ici pour spécifier que le contenu est en JSON)
    );
  }
}
