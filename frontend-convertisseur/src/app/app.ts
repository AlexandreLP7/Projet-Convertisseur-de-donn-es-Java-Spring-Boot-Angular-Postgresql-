import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CurrencyService } from './currency'; // Import de ton service
import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // Ajoute OnInit
// --- AJOUTE CES IMPORTS MATERIAL ---
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-root',
  standalone: true,
  // C'est ICI qu'on donne les outils au HTML
  imports: [
    CommonModule, 
    FormsModule,
    // --- ET AJOUTE-LES ICI AUSSI ---
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatFormFieldModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit { // Ajoute l'implémentation
  amount: number = 1;
  targetCurrency: string = 'USD';
  result: number | null = null;
  history: any[] = [];
   // Liste étendue des devises
  currencies = ['EUR', 'USD', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD', 'CNY', 'MAD', 'DZD',
  'TND', 'AED', 'AFN', 'ALL', 'AMD', 'ANG', 'AOA', 'ARS', 'AWG', 'AZN',
  'BAM', 'BBD', 'BDT', 'BGN', 'BHD', 'BIF', 'BMD', 'BND', 'BOB', 'BRL',
  'BSD', 'BTN', 'BWP', 'BYN', 'BZD', 'CDF', 'CLP', 'COP', 'CRC',
  'CUP', 'CVE', 'CZK', 'DJF', 'DKK', 'DOP', 'EGP', 'ERN', 'ETB', 'FJD',
  'FKP', 'FOK', 'GEL', 'GGP', 'GHS', 'GIP', 'GMD', 'GNF', 'GTQ', 'GYD',
  'HKD', 'HNL', 'HRK', 'HTG', 'HUF', 'IDR', 'ILS', 'IMP', 'INR', 'IQD',
  'IRR', 'ISK', 'JEP', 'JMD', 'JOD', 'KES', 'KGS', 'KHR', 'KID', 'KMF',
  'KRW', 'KWD', 'KYD', 'KZT', 'LAK', 'LBP', 'LKR', 'LRD', 'LSL', 'LYD',
  'MDL', 'MGA', 'MKD', 'MMK', 'MNT', 'MOP', 'MRU', 'MUR', 'MVR', 'MWK',
  'MXN', 'MYR', 'MZN', 'NAD', 'NGN', 'NIO', 'NOK', 'NPR', 'NZD', 'OMR',
  'PAB', 'PEN', 'PGK', 'PHP', 'PKR', 'PLN', 'PYG', 'QAR', 'RON', 'RSD',
  'RUB', 'RWF', 'SAR', 'SBD', 'SCR', 'SDG', 'SEK', 'SGD', 'SHP', 'SLE',
  'SLL', 'SOS', 'SRD', 'SSP', 'STN', 'SYP', 'SZL', 'THB', 'TJS', 'TMT',
  'TOP', 'TRY', 'TTD', 'TVD', 'TWD', 'TZS', 'UAH', 'UGX', 'UYU', 'UZS',
  'VES', 'VND', 'VUV', 'WST', 'XAF', 'XCD', 'XDR', 'XOF', 'XPF', 'YER',
  'ZAR', 'ZMW', 'ZWL'];
  fromCurrency: string = 'EUR'; // Par défaut

  // Dans ta classe AppComponent
  currencyToCountry: { [key: string]: string } = {
    'EUR': 'eu', 'USD': 'us', 'GBP': 'gb', 'JPY': 'jp', 'MAD': 'ma',
    'DZD': 'dz', 'TND': 'tn', 'CAD': 'ca', 'AUD': 'au', 'CHF': 'ch',
    'CNY': 'cn', 'BRL': 'br', 'INR': 'in', 'RUB': 'ru', 'TRY': 'tr'
    // Tu peux en ajouter d'autres ici !
  };

  constructor(private currencyService: CurrencyService, private cdr: ChangeDetectorRef) {}

  // Se lance automatiquement à l'ouverture de l'appli
  ngOnInit() {
    this.refreshHistory();
    this.currencies.sort();
  }

  onConvert() {
  this.currencyService.getConversion(this.amount, this.fromCurrency, this.targetCurrency).subscribe({
    next: (data) => {
      this.result = data;
      this.cdr.detectChanges();
      this.refreshHistory();
    }
  });
  }

  // LA MÉTHODE MANQUANTE
  refreshHistory() {
      this.currencyService.getHistory().subscribe({
        next: (historyData) => {
          this.history = historyData;
        },
        error: (err) => console.error("Impossible de charger l'historique", err)
      });
  }

  getFlagUrl(currency: string): string {
    // On récupère le code pays, sinon on prend les 2 premières lettres de la devise
    const countryCode = this.currencyToCountry[currency] || currency.substring(0, 2).toLowerCase();
    return `https://flagcdn.com/w40/${countryCode}.png`;
  }

}