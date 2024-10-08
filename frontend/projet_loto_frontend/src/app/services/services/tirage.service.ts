import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tirage } from '../../models/tirage-model';

@Injectable({
  providedIn: 'root',
})
export class TirageService {
  // Nouvelle URL pour la requête combinée
  private apiUrlClassementEtGains =
    'http://localhost:3000/api/tirages/classement-et-gains'; // URL du service backend

  constructor(private http: HttpClient) {}

  // Nouvelle méthode pour la requête combinée
  classerTiragesEtCalculerGains(
    tirages: Tirage[],
    tirageWin: Tirage,
  ): Observable<any> {
    return this.http.post<any>(this.apiUrlClassementEtGains, {
      tirages,
      tirageWin,
    });
  }
}
