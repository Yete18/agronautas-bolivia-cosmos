import { Inventory } from "@/types/game";
import { PLANT_TYPES } from "@/data/plants";
import { Button } from "@/components/ui/button";
import { Droplet, Sparkles } from "lucide-react";

interface InventoryPanelProps {
  inventory: Inventory;
  selectedSeed: string | null;
  onSelectSeed: (seedId: string) => void;
  unlockedPlants: string[];
}

export const InventoryPanel = ({
  inventory,
  selectedSeed,
  onSelectSeed,
  unlockedPlants,
}: InventoryPanelProps) => {
  return (
    <div className="neon-border rounded-lg p-4 bg-card/80 backdrop-blur-sm space-y-4">
      <h3 className="text-xl font-bold neon-glow">Inventario</h3>

      {/* Resources */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-muted/50 rounded p-2 text-center">
          <Droplet className="w-5 h-5 mx-auto mb-1 text-[hsl(var(--neon-cyan))]" />
          <div className="text-sm font-semibold">{inventory.water}</div>
          <div className="text-xs text-muted-foreground">Agua</div>
        </div>
        <div className="bg-muted/50 rounded p-2 text-center">
          <Sparkles className="w-5 h-5 mx-auto mb-1 text-[hsl(var(--neon-green))]" />
          <div className="text-sm font-semibold">{inventory.fertilizer}</div>
          <div className="text-xs text-muted-foreground">Fertilizante</div>
        </div>
        <div className="bg-muted/50 rounded p-2 text-center">
          <span className="text-2xl">🪙</span>
          <div className="text-sm font-semibold">{inventory.coins}</div>
          <div className="text-xs text-muted-foreground">Monedas</div>
        </div>
      </div>

      {/* Seeds */}
      <div>
        <h4 className="text-sm font-semibold mb-2 text-[hsl(var(--space-purple))]">
          Semillas
        </h4>
        <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
          {PLANT_TYPES.map((plant) => {
            const isUnlocked = unlockedPlants.includes(plant.id);
            const count = inventory.seeds[plant.id] || 0;
            const isSelected = selectedSeed === plant.id;

            if (!isUnlocked) {
              return (
                <div
                  key={plant.id}
                  className="bg-muted/30 rounded p-2 opacity-50 relative"
                >
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-[hsl(var(--star-yellow))]">
                    🔒 {plant.unlockScore}
                  </div>
                  <div className="blur-sm">
                    <div className="text-2xl">{plant.emoji}</div>
                    <div className="text-xs">{plant.name}</div>
                  </div>
                </div>
              );
            }

            return (
              <Button
                key={plant.id}
                variant={isSelected ? "default" : "outline"}
                className={`h-auto p-2 flex flex-col items-center gap-1 ${
                  isSelected ? "ring-2 ring-[hsl(var(--neon-cyan))]" : ""
                } ${count === 0 ? "opacity-50" : ""}`}
                onClick={() => onSelectSeed(plant.id)}
                disabled={count === 0}
              >
                <div className="text-2xl">{plant.emoji}</div>
                <div className="text-xs font-semibold">{plant.name}</div>
                <div className="text-xs text-muted-foreground">x{count}</div>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
