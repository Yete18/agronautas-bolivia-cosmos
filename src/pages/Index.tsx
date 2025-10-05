import { useState } from "react";
import { StartScreen } from "@/components/game/StartScreen";
import { Game } from "@/components/game/Game";

const Index = () => {
  const [gameStarted, setGameStarted] = useState(false);

  if (!gameStarted) {
    return <StartScreen onStart={() => setGameStarted(true)} />;
  }

  return <Game />;
};

export default Index;
