import React from "react";
import type { GameAttempt, GameMode, YugiohCard } from "../types/game";
import MonsterGameGrid from "./MonsterGameGrid";
import SpellTrapGameGrid from "./SpellTrapGameGrid";

interface GameGridProps {
  attempts: GameAttempt[];
  maxAttempts: number;
  gameMode: GameMode;
  targetCard: YugiohCard | null;
  gameOver: boolean;
}

const GameGrid: React.FC<GameGridProps> = ({ 
  attempts, 
  maxAttempts, 
  gameMode, 
  targetCard, 
  gameOver 
}) => {
  if (gameMode === 'monsters') {
    return <MonsterGameGrid attempts={attempts} maxAttempts={maxAttempts} />;
  }

  return (
    <SpellTrapGameGrid 
      attempts={attempts} 
      maxAttempts={maxAttempts} 
      targetCard={targetCard}
      gameOver={gameOver}
    />
  );
};

export default GameGrid;
