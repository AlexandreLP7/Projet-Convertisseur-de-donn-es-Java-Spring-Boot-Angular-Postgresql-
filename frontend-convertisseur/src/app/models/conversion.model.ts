/**
 * Interface representing a currency conversion record.
 * Matches the structure of the Conversion entity sent by the Spring Boot backend.
 */
export interface Conversion {

    // Unique identifier for the conversion record
    id: number;

    // The initial amount to be converted
    amount: number;

    // The source currency code (e.g., 'EUR')
    fromCurrency: string;

    // The target currency code (e.g., 'USD')
    toCurrency: string;

    // The calculated result of the conversion
    result: number;

    // The timestamp of the transaction as an ISO string
    date: string; 
}