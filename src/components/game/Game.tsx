import { useState, useEffect, useCallback } from "react";
import { GameCanvas } from "./GameCanvas";
import { InventoryPanel } from "./InventoryPanel";
import { WeatherPanel } from "./WeatherPanel";
import { MapModal } from "./MapModal";
import { ShopModal } from "./ShopModal";
import { Button } from "@/components/ui/button";
import { GameState, Plant, Position } from "@/types/game";
import { PLANT_TYPES } from "@/data/plants";
import { DEPARTMENTS } from "@/data/departments";
import { fetchWeatherData } from "@/services/nasaApi";
import { Map, ShoppingCart, Droplet, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";

const GRID_SIZE = 50;
const GRID_WIDTH = 12;
const GRID_HEIGHT = 12;

export const Game = () => {
  const [gameState, setGameState] = useState<GameState>({
    playerPosition: { x: 6, y: 6 },
    currentDepartment: "la-paz",
    inventory: {
      seeds: { papa: 5, quinua: 3, coca: 2 },
      water: 20,
      fertilizer: 5,
      coins: 50,
    },
    plants: [],
    score: 0,
    weatherData: {},
    unlockedPlants: ["papa", "quinua", "coca"],
  });

  const [selectedSeed, setSelectedSeed] = useState<string | null>("papa");
  const [mapOpen, setMapOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState<"plant" | "water" | "fertilize" | "harvest">("plant");

  // Load weather data
  useEffect(() => {
    const loadWeather = async () => {
      const dept = DEPARTMENTS.find((d) => d.id === gameState.currentDepartment);
      if (!dept) return;

      const data = await fetchWeatherData(dept.coordinates.lat, dept.coordinates.lon);
      setGameState((prev) => ({
        ...prev,
        weatherData: {
          ...prev.weatherData,
          [dept.id]: { ...data, lastUpdate: Date.now() },
        },
      }));
    };

    loadWeather();
  }, [gameState.currentDepartment]);

  // Update plants
  useEffect(() => {
    const interval = setInterval(() => {
      const currentWeather = gameState.weatherData[gameState.currentDepartment];
      if (!currentWeather) return;

      setGameState((prev) => {
        const updatedPlants = prev.plants.map((plant) => {
          const plantType = PLANT_TYPES.find((p) => p.id === plant.type.id);
          if (!plantType) return plant;

          const now = Date.now();
          const timeSincePlanted = now - plant.planted;
          const newGrowth = Math.min(1, timeSincePlanted / plantType.growthTime);

          // Check environmental conditions
          let healthChange = 0;
          const temp = currentWeather.temperature;
          const humidity = currentWeather.humidity;

          if (temp < plantType.tempMin || temp > plantType.tempMax) {
            healthChange -= 2;
          }
          if (humidity < plantType.humidityMin) {
            healthChange -= 1;
          }

          // Water depletion
          const timeSinceWatered = now - plant.lastWatered;
          if (timeSinceWatered > 5000) {
            healthChange -= 1;
          }

          const newHealth = Math.max(0, Math.min(100, plant.health + healthChange));

          return {
            ...plant,
            growth: newGrowth,
            health: newHealth,
          };
        });

        // Remove dead plants
        const alivePlants = updatedPlants.filter((p) => p.health > 0);
        if (alivePlants.length < updatedPlants.length) {
          toast.error("❌ Algunas plantas han muerto");
        }

        return { ...prev, plants: alivePlants };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState.currentDepartment, gameState.weatherData]);

  // Check for unlocks
  useEffect(() => {
    const newUnlocks = PLANT_TYPES.filter(
      (plant) =>
        plant.unlockScore <= gameState.score &&
        !gameState.unlockedPlants.includes(plant.id)
    );

    if (newUnlocks.length > 0) {
      setGameState((prev) => ({
        ...prev,
        unlockedPlants: [...prev.unlockedPlants, ...newUnlocks.map((p) => p.id)],
      }));
      newUnlocks.forEach((plant) => {
        toast.success(`🎉 ¡${plant.name} desbloqueado!`);
      });
    }
  }, [gameState.score, gameState.unlockedPlants]);

  const handleAction = useCallback(() => {
    const pos = gameState.playerPosition;
    const plantAtPos = gameState.plants.find(
      (p) => p.position.x === pos.x && p.position.y === pos.y
    );

    if (currentAction === "plant") {
      if (plantAtPos) {
        toast.error("Ya hay una planta aquí");
        return;
      }
      if (!selectedSeed || (gameState.inventory.seeds[selectedSeed] || 0) === 0) {
        toast.error("No tienes semillas de este tipo");
        return;
      }

      const plantType = PLANT_TYPES.find((p) => p.id === selectedSeed);
      if (!plantType) return;

      const newPlant: Plant = {
        id: Date.now().toString(),
        type: plantType,
        position: pos,
        growth: 0,
        health: 100,
        waterLevel: 100,
        lastWatered: Date.now(),
        planted: Date.now(),
      };

      setGameState((prev) => ({
        ...prev,
        plants: [...prev.plants, newPlant],
        inventory: {
          ...prev.inventory,
          seeds: {
            ...prev.inventory.seeds,
            [selectedSeed]: prev.inventory.seeds[selectedSeed] - 1,
          },
        },
      }));
      toast.success(`🌱 ${plantType.name} plantado`);
    } else if (currentAction === "water") {
      if (!plantAtPos) {
        toast.error("No hay planta para regar");
        return;
      }
      if (gameState.inventory.water <= 0) {
        toast.error("No tienes agua");
        return;
      }

      setGameState((prev) => ({
        ...prev,
        plants: prev.plants.map((p) =>
          p.id === plantAtPos.id
            ? { ...p, lastWatered: Date.now(), health: Math.min(100, p.health + 10) }
            : p
        ),
        inventory: { ...prev.inventory, water: prev.inventory.water - 1 },
      }));
      toast.success("💧 Planta regada");
    } else if (currentAction === "fertilize") {
      if (!plantAtPos) {
        toast.error("No hay planta para fertilizar");
        return;
      }
      if (gameState.inventory.fertilizer <= 0) {
        toast.error("No tienes fertilizante");
        return;
      }

      setGameState((prev) => ({
        ...prev,
        plants: prev.plants.map((p) =>
          p.id === plantAtPos.id ? { ...p, health: 100 } : p
        ),
        inventory: { ...prev.inventory, fertilizer: prev.inventory.fertilizer - 1 },
      }));
      toast.success("✨ Planta fertilizada - ¡Salud restaurada!");
    } else if (currentAction === "harvest") {
      if (!plantAtPos) {
        toast.error("No hay planta para cosechar");
        return;
      }
      if (plantAtPos.growth < 1) {
        toast.error("La planta aún no está lista");
        return;
      }

      const plantType = plantAtPos.type;
      const newSeeds = plantType.seedsProduced;
      const points = plantType.pointsValue;
      const coins = Math.floor(points / 2);

      setGameState((prev) => ({
        ...prev,
        plants: prev.plants.filter((p) => p.id !== plantAtPos.id),
        inventory: {
          ...prev.inventory,
          seeds: {
            ...prev.inventory.seeds,
            [plantType.id]: (prev.inventory.seeds[plantType.id] || 0) + newSeeds,
          },
          coins: prev.inventory.coins + coins,
        },
        score: prev.score + points,
      }));
      toast.success(
        `🎉 ¡Cosechado! +${newSeeds} semillas, +${points} puntos, +${coins} monedas`
      );
    }
  }, [gameState.playerPosition, gameState.plants, gameState.inventory, currentAction, selectedSeed]);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    // Handle movement
    setGameState((prev) => {
      let newPos = { ...prev.playerPosition };

      switch (e.key.toLowerCase()) {
        case "arrowup":
        case "w":
          newPos.y = Math.max(0, newPos.y - 1);
          break;
        case "arrowdown":
        case "s":
          newPos.y = Math.min(GRID_HEIGHT - 1, newPos.y + 1);
          break;
        case "arrowleft":
        case "a":
          newPos.x = Math.max(0, newPos.x - 1);
          break;
        case "arrowright":
        case "d":
          newPos.x = Math.min(GRID_WIDTH - 1, newPos.x + 1);
          break;
      }

      return { ...prev, playerPosition: newPos };
    });

    // Handle actions with keyboard shortcuts
    switch (e.key.toLowerCase()) {
      case " ":
        e.preventDefault();
        setCurrentAction("plant");
        setTimeout(() => handleAction(), 0);
        break;
      case "r":
        e.preventDefault();
        setCurrentAction("water");
        setTimeout(() => handleAction(), 0);
        break;
      case "f":
        e.preventDefault();
        setCurrentAction("fertilize");
        setTimeout(() => handleAction(), 0);
        break;
      case "h":
        e.preventDefault();
        setCurrentAction("harvest");
        setTimeout(() => handleAction(), 0);
        break;
    }
  }, [handleAction]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  const handlePurchase = (item: "water" | "fertilizer") => {
    const price = item === "water" ? 5 : 10;
    const amount = item === "water" ? 10 : 5;

    if (gameState.inventory.coins < price) {
      toast.error("No tienes suficientes monedas");
      return;
    }

    setGameState((prev) => ({
      ...prev,
      inventory: {
        ...prev.inventory,
        coins: prev.inventory.coins - price,
        [item]: prev.inventory[item] + amount,
      },
    }));
    toast.success(`✅ ¡Comprado ${amount}x ${item === "water" ? "Agua" : "Fertilizante"}!`);
  };

  const currentDept = DEPARTMENTS.find((d) => d.id === gameState.currentDepartment);

  return (
    <div className="min-h-screen space-gradient p-4">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header */}
        <div className="neon-border rounded-lg p-4 bg-card/80 backdrop-blur-sm flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold neon-glow">AGRONAUTAS 🚀</h1>
            <p className="text-sm text-[hsl(var(--space-purple))]">
              Puntuación: {gameState.score} | Departamento: {currentDept?.name}
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setMapOpen(true)} size="sm">
              <Map className="w-4 h-4 mr-2" />
              Mapa
            </Button>
            <Button onClick={() => setShopOpen(true)} size="sm" variant="secondary">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Tienda
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Left Panel - Inventory */}
          <div className="lg:col-span-1">
            <InventoryPanel
              inventory={gameState.inventory}
              selectedSeed={selectedSeed}
              onSelectSeed={setSelectedSeed}
              unlockedPlants={gameState.unlockedPlants}
            />
          </div>

          {/* Center - Game Canvas and Controls */}
          <div className="lg:col-span-2 space-y-4">
            <GameCanvas
              playerPosition={gameState.playerPosition}
              plants={gameState.plants}
              gridSize={GRID_SIZE}
            />

            {/* Action Buttons */}
            <div className="neon-border rounded-lg p-4 bg-card/80 backdrop-blur-sm">
              <h3 className="text-sm font-bold mb-3">Acciones Rápidas</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={currentAction === "plant" ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setCurrentAction("plant");
                    handleAction();
                  }}
                  className="text-xs"
                >
                  🌱 Plantar (Espacio)
                </Button>
                <Button
                  variant={currentAction === "water" ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setCurrentAction("water");
                    handleAction();
                  }}
                  className="text-xs"
                >
                  💧 Regar (R)
                </Button>
                <Button
                  variant={currentAction === "fertilize" ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setCurrentAction("fertilize");
                    handleAction();
                  }}
                  className="text-xs"
                >
                  ✨ Fertilizar (F)
                </Button>
                <Button
                  variant={currentAction === "harvest" ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setCurrentAction("harvest");
                    handleAction();
                  }}
                  className="text-xs"
                >
                  🌾 Cosechar (H)
                </Button>
              </div>
            </div>

            <div className="text-xs text-center text-muted-foreground bg-muted/30 rounded p-2">
              ⌨️ WASD/Flechas: Mover | Espacio: Plantar | R: Regar | F: Fertilizar | H: Cosechar
            </div>
          </div>

          {/* Right Panel - Weather */}
          <div className="lg:col-span-1">
            <WeatherPanel
              weatherData={gameState.weatherData[gameState.currentDepartment]}
              departmentName={currentDept?.name || ""}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      <MapModal
        open={mapOpen}
        onOpenChange={setMapOpen}
        currentDepartment={gameState.currentDepartment}
        onSelectDepartment={(deptId) => {
          setGameState((prev) => ({
            ...prev,
            currentDepartment: deptId,
            plants: [], // Clear plants when changing department
          }));
          toast.success(`🚀 Viajando a ${DEPARTMENTS.find((d) => d.id === deptId)?.name}`);
        }}
      />

      <ShopModal
        open={shopOpen}
        onOpenChange={setShopOpen}
        coins={gameState.inventory.coins}
        onPurchase={handlePurchase}
      />
    </div>
  );
};
