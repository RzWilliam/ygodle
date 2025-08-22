import React from "react";
import type { GameAttempt, YugiohCard } from "../types/game";

interface SpellTrapGameGridProps {
  attempts: GameAttempt[];
  maxAttempts: number;
  targetCard: YugiohCard | null;
  gameOver: boolean;
}

const SpellTrapGameGrid: React.FC<SpellTrapGameGridProps> = ({ 
  attempts, 
  maxAttempts, 
  targetCard, 
  gameOver 
}) => {
  const getColorClass = (result: 'correct' | 'incorrect') => {
    switch (result) {
      case 'correct': return 'bg-green-500 text-white';
      case 'incorrect': return 'bg-gray-400 text-white';
    }
  };

  const getBlurLevel = (attemptIndex: number) => {
    // Start with heavy blur and progressively reduce it
    // 0 attempts = 20px blur, 6 attempts = 0px blur
    const maxBlur = 20;
    const blurReduction = maxBlur / 6; // Reduce blur by this amount per attempt
    const blurAmount = Math.max(0, maxBlur - (attemptIndex * blurReduction));
    return `blur(${blurAmount}px)`;
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      {/* Card Image with Progressive Deblur */}
      {targetCard && targetCard.card_images && targetCard.card_images.length > 0 && (
        <div className="flex justify-center mb-8">
          <div className="relative">
            <img
              src={targetCard.card_images[0].image_url}
              alt={gameOver ? targetCard.name_en : "Mystery Card"}
              className="w-48 select-none h-auto rounded-lg shadow-lg transition-all duration-500"
              style={{
                filter: gameOver ? 'none' : getBlurLevel(attempts.length),
                imageRendering: 'crisp-edges'
              }}
            />
            {!gameOver && attempts.length === 0 && (
              <div className="absolute inset-0 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-2xl drop-shadow-lg">?</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Headers */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm font-bold text-gray-300">
        <div className="text-center p-3 bg-gray-700 rounded-lg">NAME</div>
        <div className="text-center p-3 bg-gray-700 rounded-lg">TYPE</div>      </div>
      
      {/* Attempts */}
      {[...Array(maxAttempts)].map((_, i) => {
        const attempt = attempts[i];
        
        return (
          <div key={i} className="grid grid-cols-2 gap-4 mb-3">
            {attempt ? (
              <>
                <div className={`p-4 rounded-lg text-center text-sm font-medium border-2 ${
                  attempt.results.name === 'correct' ? 'border-green-500' : 'border-gray-300'
                } ${getColorClass(attempt.results.name)}`}>
                  <div className="truncate">{attempt.card.name_en}</div>
                </div>
                <div className={`p-4 rounded-lg text-center text-sm font-medium ${getColorClass(attempt.results.type)}`}>
                  {attempt.card.humanreadablecardtype}
                </div>
              </>
            ) : (
              Array(2).fill(0).map((_, j) => (
                <div key={j} className="p-4 h-14 bg-gray-800 rounded-lg border-2 border-gray-600" />
              ))
            )}
          </div>
        );
      })}

      {/* Blur Progress Indicator */}
      <div className="mt-6 text-center">
        <div className="text-sm text-gray-400 mb-2">Card Clarity</div>
        <div className="w-full bg-gray-700 rounded-full h-2 mx-auto">
          <div 
            className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, (attempts.length / maxAttempts) * 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default SpellTrapGameGrid;
