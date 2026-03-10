package com.monprojet.convertisseur_devise;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity // Dit à Spring : "Ceci est une table de base de données"
@Table(name = "conversions")
public class Conversion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-incrément (1, 2, 3...)
    private Long id;
    private double amount;
    private String fromCurrency;
    private String toCurrency;
    private double result;
    private LocalDateTime date;

    // Constructeur par défaut (obligatoire pour JPA)
    public Conversion() {
        this.date = LocalDateTime.now();
    }

    // GETTERS ET SETTERS (Indispensables pour que Spring puisse lire/écrire)
    public Long getId() { return id; }
    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }
    public String getFromCurrency() { return fromCurrency; }
    public void setFromCurrency(String fromCurrency) { this.fromCurrency = fromCurrency; }
    public String getToCurrency() { return toCurrency; }
    public void setToCurrency(String toCurrency) { this.toCurrency = toCurrency; }
    public double getResult() { return result; }
    public void setResult(double result) { this.result = result; }
    public LocalDateTime getDate() { return date; }
}
