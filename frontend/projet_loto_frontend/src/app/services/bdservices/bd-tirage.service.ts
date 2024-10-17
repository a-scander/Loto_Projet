import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tirage } from '../../models/tirage-model';

@Injectable({
  providedIn: 'root', // Le service est disponible dans toute l'application via l'injection de dépendance
})
export class BdTirageService {
  constructor(private http: HttpClient) {} // Injection du service HttpClient pour effectuer les requêtes HTTP

  // Méthode pour récupérer tous les tirages via une requête GET
  getAllTirage(): Observable<any> {
    return this.http.get<any>('http://localhost:3000/api/bd/liste-tirage');
    // Fait une requête HTTP GET à l'URL spécifiée et retourne un Observable contenant les tirages
  }

  // Méthode pour récupérer une liste de pseudos via une requête GET
  getPseudo(): Observable<string[]> {
    return this.http.get<string[]>(`http://localhost:3000/api/bd/pseudos`);
    // Fait une requête HTTP GET pour récupérer les pseudos sous forme d'un tableau de chaînes de caractères
  }

  // Méthode pour appliquer des filtres avancés avec une requête POST
  applyAdvancedFilters(filters: any): Observable<any[]> {
    return this.http.post<any[]>(
      'http://localhost:3000/api/bd/apply-filters',
      filters,
    );
    // Fait une requête HTTP POST avec les critères de filtre dans `filters`
    // Retourne un Observable contenant les résultats filtrés
  }

  // Méthode pour supprimer un tirage via une requête DELETE
  deleteTirage(id: number): Observable<any> {
    return this.http.delete(`http://localhost:3000/api/bd/delete/${id}`);
    // Supprime un tirage basé sur son ID via une requête HTTP DELETE
  }

  // Méthode pour enregistrer un tirage avec une requête POST
  saveTirageData(tirageData: any): Observable<any> {
    return this.http.post<any>(
      'http://localhost:3000/api/bd/save-tirage',
      tirageData,
    );
    // Envoie les données d'un nouveau tirage à l'API via une requête HTTP POST
  }

  // Méthode pour vérifier si un pseudo existe via une requête GET
  checkPseudo(pseudo: string): Promise<{ exists: boolean }> {
    return this.http
      .get<{ exists: boolean }>(
        `http://localhost:3000/api/bd/check-pseudo/${pseudo}`,
      )
      .toPromise() // Convertit l'Observable en une Promesse pour un traitement plus flexible
      .then((response) => {
        console.log("Réponse de l'API (brut):", response);
        return response || { exists: false }; // Si la réponse est undefined, retourne un objet par défaut { exists: false }
      })
      .catch((error) => {
        console.error("Erreur lors de l'appel à l'API:", error);
        return { exists: false }; // En cas d'erreur, retourne également { exists: false }
      });
  }
}
