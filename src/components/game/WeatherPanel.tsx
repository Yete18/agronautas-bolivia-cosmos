import { WeatherData } from "@/types/game";
import { Cloud, Droplets, Thermometer, Sprout } from "lucide-react";

interface WeatherPanelProps {
  weatherData: WeatherData | null;
  departmentName: string;
}

export const WeatherPanel = ({ weatherData, departmentName }: WeatherPanelProps) => {
  if (!weatherData) {
    return (
      <div className="neon-border rounded-lg p-4 bg-card/80 backdrop-blur-sm">
        <h3 className="text-xl font-bold neon-glow mb-4">Datos Satelitales NASA</h3>
        <p className="text-sm text-muted-foreground">Cargando datos...</p>
      </div>
    );
  }

  const data = [
    {
      icon: <Thermometer className="w-5 h-5" />,
      label: "Temperatura",
      value: `${weatherData.temperature.toFixed(1)}°C`,
      color: "text-[hsl(var(--danger-red))]",
    },
    {
      icon: <Cloud className="w-5 h-5" />,
      label: "Precipitación",
      value: `${weatherData.precipitation.toFixed(1)} mm`,
      color: "text-[hsl(var(--space-purple))]",
    },
    {
      icon: <Droplets className="w-5 h-5" />,
      label: "Humedad",
      value: `${weatherData.humidity.toFixed(0)}%`,
      color: "text-[hsl(var(--neon-cyan))]",
    },
    {
      icon: <Droplets className="w-5 h-5" />,
      label: "Humedad Suelo",
      value: `${weatherData.soilMoisture.toFixed(0)}%`,
      color: "text-[hsl(var(--neon-green))]",
    },
    {
      icon: <Sprout className="w-5 h-5" />,
      label: "NDVI (Vegetación)",
      value: weatherData.ndvi.toFixed(2),
      color: "text-[hsl(var(--neon-green))]",
    },
  ];

  return (
    <div className="neon-border rounded-lg p-4 bg-card/80 backdrop-blur-sm space-y-4">
      <div>
        <h3 className="text-xl font-bold neon-glow">Datos Satelitales NASA</h3>
        <p className="text-sm text-[hsl(var(--space-purple))]">📍 {departmentName}</p>
      </div>

      <div className="space-y-2">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-muted/50 rounded p-2"
          >
            <div className="flex items-center gap-2">
              <span className={item.color}>{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </div>
            <span className="text-sm font-bold">{item.value}</span>
          </div>
        ))}
      </div>

      <div className="text-xs text-muted-foreground">
        🛰️ Actualizado: {new Date(weatherData.lastUpdate).toLocaleTimeString()}
      </div>
    </div>
  );
};
