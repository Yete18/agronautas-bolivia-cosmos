import { useEffect, useRef } from "react";
import { Position, Plant } from "@/types/game";

interface GameCanvasProps {
  playerPosition: Position;
  plants: Plant[];
  gridSize: number;
}

export const GameCanvas = ({ playerPosition, plants, gridSize }: GameCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = "#2a2a3e";
    ctx.lineWidth = 1;
    for (let i = 0; i <= canvas.width; i += gridSize) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i <= canvas.height; i += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // Draw plants
    plants.forEach((plant) => {
      const x = plant.position.x * gridSize + gridSize / 2;
      const y = plant.position.y * gridSize + gridSize / 2;

      // Draw plant with glow effect based on health
      ctx.font = `${gridSize - 10}px Arial`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Glow effect
      if (plant.health > 50) {
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#00ffff";
      } else if (plant.health > 20) {
        ctx.shadowBlur = 5;
        ctx.shadowColor = "#ffff00";
      } else {
        ctx.shadowBlur = 5;
        ctx.shadowColor = "#ff0000";
      }

      // Plant emoji based on growth
      let emoji = plant.type.emoji;
      if (plant.growth < 0.33) {
        emoji = "🌱";
      } else if (plant.growth < 0.66) {
        emoji = "🌿";
      }

      ctx.fillText(emoji, x, y);
      ctx.shadowBlur = 0;

      // Health bar
      const barWidth = gridSize - 10;
      const barHeight = 4;
      const barX = x - barWidth / 2;
      const barY = y - gridSize / 2 + 5;

      ctx.fillStyle = "#333";
      ctx.fillRect(barX, barY, barWidth, barHeight);

      const healthColor =
        plant.health > 66 ? "#00ff88" : plant.health > 33 ? "#ffaa00" : "#ff4444";
      ctx.fillStyle = healthColor;
      ctx.fillRect(barX, barY, (barWidth * plant.health) / 100, barHeight);
    });

    // Draw player (astronaut)
    const playerX = playerPosition.x * gridSize + gridSize / 2;
    const playerY = playerPosition.y * gridSize + gridSize / 2;

    ctx.font = `${gridSize - 5}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#00ffff";
    ctx.fillText("👨‍🚀", playerX, playerY);
    ctx.shadowBlur = 0;
  }, [playerPosition, plants, gridSize]);

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={600}
      className="neon-border rounded-lg bg-card/50 backdrop-blur-sm"
    />
  );
};
