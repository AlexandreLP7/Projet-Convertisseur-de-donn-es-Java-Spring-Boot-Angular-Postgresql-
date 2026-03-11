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

  getHistoricalRates(fromCurrency: string, toCurrency: string, days: number): Observable<any> {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    return this.http.get<any>(
      `https://api.frankfurter.app/${startDate}..${endDate}?from=${fromCurrency}&to=${toCurrency}`
    );
  }
}