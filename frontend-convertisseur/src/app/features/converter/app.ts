import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CurrencyService } from '../../core/services/currency.service'; 
import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; 
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, registerables } from 'chart.js';
import { Conversion } from '../../models/conversion.model';

// Register Chart.js components globally
Chart.register(...registerables);

/**
 * Main component of the application.
 * Manages the conversion UI logic, history updates, and data visualization.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    BaseChartDirective,
    MatFormFieldModule
  ], 
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit {

  // Input fields and result values
  amount: number = 1;
  targetCurrency: string = 'USD';
  fromCurrency: string = 'EUR';
  result: number | null = null;
  rate: number | null = null;

  // UI State management
  history: Conversion[] = [];
  errorMessage: string | null = null;
  isDarkMode: boolean = false;

  // List of supported currency codes
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

  // Mapping for flag display
  currencyToCountry: { [key: string]: string } = {
    'EUR': 'eu', 'USD': 'us', 'GBP': 'gb', 'JPY': 'jp', 'MAD': 'ma',
    'DZD': 'dz', 'TND': 'tn', 'CAD': 'ca', 'AUD': 'au', 'CHF': 'ch',
    'CNY': 'cn', 'BRL': 'br', 'INR': 'in', 'RUB': 'ru', 'TRY': 'tr'
  };


  // Chart configuration
  chartDays: number = 7;
  chartLabels: string[] = [];
  chartDatasets: any[] = [{ data: [], label: 'Taux' }];
  chartOptions: any = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: { ticks: { color: '#666' } },
      x: { ticks: { color: '#666' } }
    }
  };

  constructor(private currencyService: CurrencyService, private cdr: ChangeDetectorRef) {}

  /**
   * Initialization lifecycle hook.
   * Loads initial history and sorts the currency list.
   */
  ngOnInit() {
    this.refreshHistory();
    this.currencies.sort();
  }

  /**
   * Triggers the conversion process and updates the view.
   */
  onConvert() {
    this.errorMessage = null;

    if (!this.amount || this.amount <= 0) {
        this.errorMessage = "Veuillez entrer un montant valide";
        return; 
    }

    this.currencyService.getConversion(this.amount, this.fromCurrency, this.targetCurrency).subscribe({
      next: (data) => {
        this.result = data;
        this.rate = data / this.amount;
        this.cdr.detectChanges();
        this.refreshHistory();
        this.loadChart();
      },
      error: (err) => {
          this.errorMessage = err.message; 
      }
    });

  }

  /**
   * Refreshes the conversion history list from the backend.
   */
  refreshHistory() {
    this.currencyService.getHistory().subscribe({
        next: (historyData) => {
            this.history = historyData;
        },
        error: (err) => {
            this.errorMessage = err.message;
        }
    });
  }

  /**
   * Generates the URL for the flag image based on the currency code.
   * @param currency The currency code (e.g., 'USD').
   */
  getFlagUrl(currency: string): string {
    // On récupère le code pays, sinon on prend les 2 premières lettres de la devise
    const countryCode = this.currencyToCountry[currency] || currency.substring(0, 2).toLowerCase();
    return `https://flagcdn.com/w40/${countryCode}.png`;
  }

  /**
   * Swaps the source and target currencies.
   */
  swapCurrencies() {
    const temp = this.fromCurrency;
    this.fromCurrency = this.targetCurrency;
    this.targetCurrency = temp;
    this.result = null; 
  }

  /**
   * Toggles between light and dark theme modes.
   */
  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
  }

  /**
   * Loads historical rate data for the trend chart.
   */
  loadChart() {
    this.currencyService.getHistoricalRates(this.fromCurrency, this.targetCurrency, this.chartDays).subscribe({
        next: (data) => {
            this.chartLabels = Object.keys(data.rates);
            this.chartDatasets = [{
                data: this.chartLabels.map(date => data.rates[date][this.targetCurrency]),
                // ...
            }];
            this.cdr.detectChanges();
        },
        error: (err) => {
            this.errorMessage = err.message;
        }
    });
}



}