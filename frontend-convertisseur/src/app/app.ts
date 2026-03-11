import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CurrencyService } from './currency'; 
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
Chart.register(...registerables);

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
  amount: number = 1;
  targetCurrency: string = 'USD';
  result: number | null = null;
  history: any[] = [];
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

  currencyToCountry: { [key: string]: string } = {
    'EUR': 'eu', 'USD': 'us', 'GBP': 'gb', 'JPY': 'jp', 'MAD': 'ma',
    'DZD': 'dz', 'TND': 'tn', 'CAD': 'ca', 'AUD': 'au', 'CHF': 'ch',
    'CNY': 'cn', 'BRL': 'br', 'INR': 'in', 'RUB': 'ru', 'TRY': 'tr'
  };

  isDarkMode: boolean = false;

  rate: number | null = null;

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

  // Se lance automatiquement à l'ouverture de l'appli
  ngOnInit() {
    this.refreshHistory();
    this.currencies.sort();
  }

  onConvert() {
  this.currencyService.getConversion(this.amount, this.fromCurrency, this.targetCurrency).subscribe({
    next: (data) => {
      this.result = data;
      this.rate = data / this.amount; // ← calcul du taux unitaire
      this.cdr.detectChanges();
      this.refreshHistory();
      this.loadChart();
    }
  });
  }

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

  swapCurrencies() {
    const temp = this.fromCurrency;
    this.fromCurrency = this.targetCurrency;
    this.targetCurrency = temp;
    this.result = null; // remet le résultat à zéro
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
  }

  loadChart() {
    this.currencyService.getHistoricalRates(this.fromCurrency, this.targetCurrency, this.chartDays).subscribe({
      next: (data) => {
        this.chartLabels = Object.keys(data.rates);
        this.chartDatasets = [{
          data: this.chartLabels.map(date => data.rates[date][this.targetCurrency]),
          label: `${this.fromCurrency} → ${this.targetCurrency}`,
          borderColor: '#4caf50',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          fill: true,
          tension: 0.4
        }];
        this.cdr.detectChanges();
      }
    });
  }



}