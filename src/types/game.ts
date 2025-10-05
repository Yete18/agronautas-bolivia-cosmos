export interface Position {
  x: number;
  y: number;
}

export interface Plant {
  id: string;
  type: PlantType;
  position: Position;
  growth: number;
  health: number;
  waterLevel: number;
  lastWatered: number;
  planted: number;
}

export interface PlantType {
  id: string;
  name: string;
  emoji: string;
  growthTime: number;
  waterNeeded: number;
  tempMin: number;
  tempMax: number;
  humidityMin: number;
  unlockScore: number;
  seedsProduced: number;
  pointsValue: number;
}

export interface Inventory {
  seeds: Record<string, number>;
  water: number;
  fertilizer: number;
  coins: number;
}

export interface Department {
  id: string;
  name: string;
  position: Position;
  coordinates: {
    lat: number;
    lon: number;
  };
}

export interface WeatherData {
  temperature: number;
  precipitation: number;
  humidity: number;
  soilMoisture: number;
  ndvi: number;
  lastUpdate: number;
}

export interface GameState {
  playerPosition: Position;
  currentDepartment: string;
  inventory: Inventory;
  plants: Plant[];
  score: number;
  weatherData: Record<string, WeatherData>;
  unlockedPlants: string[];
}
