import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tirage } from '../../models/tirage-model'; // Importation du modèle "Tirage" pour typer les données

@Injectable({
  providedIn: 'root', // Fournit le service dans toute l'application
})
export class TirageService {
  constructor(private http: HttpClient) {}

  // Méthode pour envoyer les tirages à l'API et calculer les gains
  classerTiragesEtCalculerGains(
    tirages: Tirage[], // Liste des tirages à envoyer
    tirageWin: Tirage, // Tirage gagnant
    montant: number, // Montant à calculer pour les gains
  ): Observable<any> {
    // Envoie une requête POST à l'API pour classer les tirages et calculer les gains
    return this.http.post<any>(
      'http://localhost:3000/api/tirages/classement-et-gains', // URL de l'API pour traiter la demande
      {
        tirages, // Les tirages à classer
        tirageWin, // Le tirage gagnant
        montant, // Le montant pour le calcul des gains
      },
    );
  }
}
