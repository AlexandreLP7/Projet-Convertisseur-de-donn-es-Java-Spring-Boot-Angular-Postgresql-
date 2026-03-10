package com.monprojet.convertisseur_devise;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ConversionRepository extends JpaRepository<Conversion, Long> {
    List<Conversion> findTop5ByOrderByDateDesc(); // Pour récupérer les 5 derniers
}