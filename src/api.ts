export async function searchFlights(
    origin: string,
    destination: string,
    date: string,
    adults: number = 1
  ) {
    const url = `https://skyscanner-flights4.p.rapidapi.com/api/v1/search?origin=${origin}&destination=${destination}&date=${date}&adults=${adults}&currency=TRY&cabin=economy&market=TR&locale=tr-TR`;
  
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-rapidapi-key": import.meta.env.VITE_RAPIDAPI_KEY,
        "x-rapidapi-host": "skyscanner-flights4.p.rapidapi.com",
        "Content-Type": "application/json",
      },
    });
  
    const text = await response.text();
    console.log("Ham API cevabı:", text);
    
    const data = JSON.parse(text);
    return data.results || [];
  }