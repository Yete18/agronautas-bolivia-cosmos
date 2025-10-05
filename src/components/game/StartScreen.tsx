import { Button } from "@/components/ui/button";
import { Rocket } from "lucide-react";

interface StartScreenProps {
  onStart: () => void;
}

export const StartScreen = ({ onStart }: StartScreenProps) => {
  return (
    <div className="min-h-screen space-gradient flex items-center justify-center relative overflow-hidden">
      {/* Animated stars background */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-glow"
            style={{
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animationDelay: Math.random() * 2 + 's',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center space-y-8 animate-slide-up">
        {/* Title */}
        <div className="space-y-4">
          <h1 className="text-7xl font-bold neon-glow tracking-wider">
            AGRONAUTAS
          </h1>
          <p className="text-2xl text-[hsl(var(--space-purple))] font-semibold animate-float">
            🚀 Misión: Bolivia 🌍
          </p>
        </div>

        {/* Description */}
        <div className="max-w-2xl mx-auto space-y-4 px-4">
          <p className="text-lg text-foreground/90">
            Astronautas especializados han llegado a Bolivia para proteger su agricultura
          </p>
          <div className="neon-border rounded-lg p-6 bg-card/50 backdrop-blur-sm">
            <p className="text-sm text-muted-foreground mb-4">
              Tu misión es cuidar los cultivos bolivianos usando datos satelitales en tiempo real de la NASA
            </p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-[hsl(var(--neon-cyan))]">🌡️</span>
                <span>Temperatura</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[hsl(var(--neon-green))]">💧</span>
                <span>Humedad</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[hsl(var(--space-purple))]">🌧️</span>
                <span>Precipitación</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[hsl(var(--star-yellow))]">🌱</span>
                <span>Vegetación</span>
              </div>
            </div>
          </div>
        </div>

        {/* Start button */}
        <Button
          onClick={onStart}
          size="lg"
          className="group relative overflow-hidden bg-gradient-to-r from-[hsl(var(--neon-cyan))] to-[hsl(var(--space-purple))] hover:scale-110 transition-all duration-300 px-12 py-6 text-xl font-bold"
        >
          <Rocket className="mr-3 h-6 w-6 animate-float" />
          INICIAR MISIÓN
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        </Button>

        {/* Footer */}
        <p className="text-sm text-muted-foreground/70 mt-8">
          Powered by NASA APIs 🛰️
        </p>
      </div>
    </div>
  );
};
