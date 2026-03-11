import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Conversion } from '../../models/conversion.model';

/**
 * Service responsible for handling currency-related data fetching.
 * Connects to the Spring Boot backend and external exchange rate APIs.
 */
@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  // Base URL retrieved from environment configuration
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Fetches the conversion history from the backend.
   * @return An Observable containing an array of Conversion objects.
   */
  getHistory(): Observable<Conversion[]> {
    return this.http.get<Conversion[]>(`${this.apiUrl}/history`).pipe(
      catchError(err => {
        console.error("Erreur chargement historique :", err);
        return throwError(() => new Error("Impossible de charger l'historique"));
      })
    );
  }

  /**
   * Requests a new currency conversion.
   * @param amount The value to convert.
   * @param fromCurrency Source currency code.
   * @param toCurrency Target currency code.
   * @return An Observable with the conversion result.
   */
  getConversion(amount: number, fromCurrency: string, toCurrency: string): Observable<number> {
    return this.http.get<number>(
      `${this.apiUrl}/convert?amount=${amount}&fromCurrency=${fromCurrency}&toCurrency=${toCurrency}`
    ).pipe(
      catchError(err => {
        console.error("Erreur de conversion :", err);
        return throwError(() => new Error(err.error || "Erreur lors de la conversion"));
      })
    );
  }

  /**
   * Fetches historical rates for charting purposes from an external API (Frankfurter).
   * @param fromCurrency Source currency.
   * @param toCurrency Target currency.
   * @param days Number of days to look back.
   * @return An Observable with historical rate data.
   */
  getHistoricalRates(fromCurrency: string, toCurrency: string, days: number): Observable<any> {

    // Generate date range for the API call
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    return this.http.get<any>(
      `https://api.frankfurter.app/${startDate}..${endDate}?from=${fromCurrency}&to=${toCurrency}`
    ).pipe(
      catchError(err => {
        console.error("Erreur chargement graphique :", err);
        return throwError(() => new Error("Impossible de charger les taux historiques"));
      })
    );
  }
}