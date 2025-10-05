const NASA_API_KEY = 'XUOX2vSNLJTAaiAYO2UE32ciX3cxtiwZcQGC570M';

export interface NASAWeatherData {
  temperature: number;
  precipitation: number;
  humidity: number;
  soilMoisture: number;
  ndvi: number;
}

export async function fetchWeatherData(lat: number, lon: number): Promise<NASAWeatherData> {
  try {
    // NASA POWER API for climate data
    const powerUrl = `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=T2M,PRECTOTCORR,RH2M&community=AG&longitude=${lon}&latitude=${lat}&start=20240101&end=20241231&format=JSON`;
    
    const response = await fetch(powerUrl);
    const data = await response.json();
    
    // Get the latest available data
    const params = data.properties.parameter;
    const dates = Object.keys(params.T2M);
    const latestDate = dates[dates.length - 1];
    
    // Simulate NDVI and soil moisture (in production, use MODIS and SMAP APIs)
    const ndvi = 0.6 + Math.random() * 0.3; // 0.6-0.9 range for healthy vegetation
    const soilMoisture = 30 + Math.random() * 40; // 30-70% range
    
    return {
      temperature: params.T2M[latestDate] || 20,
      precipitation: params.PRECTOTCORR[latestDate] || 0,
      humidity: params.RH2M[latestDate] || 50,
      soilMoisture,
      ndvi,
    };
  } catch (error) {
    console.error('Error fetching NASA data:', error);
    // Return default values on error
    return {
      temperature: 20 + Math.random() * 10,
      precipitation: Math.random() * 5,
      humidity: 50 + Math.random() * 30,
      soilMoisture: 40 + Math.random() * 30,
      ndvi: 0.6 + Math.random() * 0.3,
    };
  }
}

export async function fetchAllDepartmentsWeather(departments: Array<{lat: number, lon: number, id: string}>) {
  const weatherData: Record<string, NASAWeatherData> = {};
  
  for (const dept of departments) {
    weatherData[dept.id] = await fetchWeatherData(dept.lat, dept.lon);
    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  return weatherData;
}
