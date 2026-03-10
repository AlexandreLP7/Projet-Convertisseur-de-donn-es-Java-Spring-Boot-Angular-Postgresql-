import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private apiUrl = 'http://localhost:8080/api'; // URL de base

  constructor(private http: HttpClient) { }
  
  // NOUVELLE MÉTHODE : Récupérer l'historique
  getHistory(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/history`);
  }

  getConversion(amount: number, fromCurrency: string, toCurrency: string): Observable<number> {
  return this.http.get<number>(
    `${this.apiUrl}/convert?amount=${amount}&fromCurrency=${fromCurrency}&toCurrency=${toCurrency}`);
  }
}