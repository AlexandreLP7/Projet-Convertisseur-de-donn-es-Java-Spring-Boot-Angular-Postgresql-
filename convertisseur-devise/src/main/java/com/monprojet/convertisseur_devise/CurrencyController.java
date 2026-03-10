package com.monprojet.convertisseur_devise;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import jakarta.transaction.Transactional;

import java.util.Map;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:4200")
public class CurrencyController {

    private final List<String> history = new ArrayList<>();

    @Autowired
    private ConversionRepository repository;

    @GetMapping("/convert")
    public double convert(
        @RequestParam double amount, 
        @RequestParam String fromCurrency, // Nouvelle variable
        @RequestParam String toCurrency) {
        
        // On change l'URL pour que la base soit dynamique
        String url = "https://api.exchangerate-api.com/v4/latest/" + fromCurrency.toUpperCase().trim();
        RestTemplate restTemplate = new RestTemplate();
        
        Map<?, ?> response = restTemplate.getForObject(url, Map.class);
        if (response != null && response.containsKey("rates")) {
            Map<String, Object> rates = (Map<String, Object>) response.get("rates");
    
            // On récupère l'objet sans présumer de son type (Integer ou Double)            
            double rate = 0.0;
            if (rates.containsKey(toCurrency.toUpperCase())) {
                Object rateObj = rates.get(toCurrency.toUpperCase().trim());
                if (rateObj instanceof Number) {
                    // La magie est ici : .doubleValue() convertit n'importe quel nombre en décimal
                    rate = ((Number) rateObj).doubleValue();
                }
            } else {
                // Si la devise n'est pas trouvée, on peut logger l'erreur
                System.out.println("Devise non trouvée : " + toCurrency);
            }
            
            double result = amount * rate;

            // Mise à jour de l'historique
            String entry = amount + " " + fromCurrency + " = " + String.format("%.2f", result) + " " + toCurrency;
            history.add(0, entry);
            if (history.size() > 5) history.remove(5);

            // Sauvegarde en base de données
            Conversion conv = new Conversion();
            conv.setAmount(amount);
            conv.setFromCurrency(fromCurrency);
            conv.setToCurrency(toCurrency);
            conv.setResult(result);
            repository.saveAndFlush(conv);

            return result;
        }
        
        return 0.0;
    }

    @GetMapping("/history")
    public List<Conversion> getHistory() {
        return repository.findTop5ByOrderByDateDesc();
    }
}