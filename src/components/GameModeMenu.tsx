import React from "react";
import type { GameMode } from "../types/game";

interface GameModeMenuProps {
  currentMode: GameMode;
  onModeChange: (mode: GameMode) => void;
}

const GameModeMenu: React.FC<GameModeMenuProps> = ({ currentMode, onModeChange }) => {
  const modes = [
    { id: 'monsters' as GameMode, label: 'Monsters', icon: '🐉' },
    { id: 'spells' as GameMode, label: 'Spells', icon: '✨' },
    { id: 'traps' as GameMode, label: 'Traps', icon: '🪤' }
  ];

  return (
    <div className="flex justify-center space-x-2 mb-6">
      {modes.map((mode) => (
        <button
          key={mode.id}
          onClick={() => onModeChange(mode.id)}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-2 ${
            currentMode === mode.id
              ? 'bg-yugiohGold text-yugiohBlue shadow-lg'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <span className="text-lg">{mode.icon}</span>
          <span>{mode.label}</span>
        </button>
      ))}
    </div>
  );
};

export default GameModeMenu;
