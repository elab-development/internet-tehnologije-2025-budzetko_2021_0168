// lib/exchangeApi.ts
export async function getExchangeRate(toCurrency: string = "EUR") {
  try {
    const response = await fetch(`https://api.exchangerate-api.com/v4/latest/RSD`);
    next: { revalidate: 3600 } // podaci se osvezavaju svakih sat vremena 
    if (!response.ok) throw new Error("Mrežna greška");
    const data = await response.json();
    return data.rates[toCurrency];
  } catch (error) {
    console.error("Greška pri preuzimanju kursa:", error);
    return null; 
  }
}