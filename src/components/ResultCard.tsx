import React from "react";
import type { YugiohCard } from "../types/game";

interface ResultCardProps {
  card: YugiohCard | null;
  gameWon: boolean;
  gameOver: boolean;
  attemptCount: number;
}

const ResultCard: React.FC<ResultCardProps> = ({ card, gameWon, gameOver, attemptCount }) => {
  if (!gameOver || !card) return null;

  return (
    <div className="w-full max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-xl border-2 border-gray-200 text-center">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        {gameWon ? "🎉 Congratulations!" : "😔 Game Over!"}
      </h2>
      
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">The card was:</h3>
        <p className="text-xl font-bold text-yugiohBlue">{card.name_en}</p>
      </div>

      {card.card_images && card.card_images.length > 0 && (
        <img
          src={card.card_images[0].image_url_small}
          alt={card.name_en}
          className="mx-auto rounded-lg shadow-md mb-4 max-w-32"
        />
      )}

      <div className="text-sm space-y-1 text-gray-600">
        <p><span className="font-semibold">Type:</span> {card.humanreadablecardtype}</p>
        <p><span className="font-semibold">Race:</span> {card.race}</p>
        {(card.atk !== null && card.atk !== undefined) && <p><span className="font-semibold">ATK:</span> {card.atk}</p>}
        {(card.def !== null && card.def !== undefined) && <p><span className="font-semibold">DEF:</span> {card.def}</p>}
        {(card.level !== null && card.level !== undefined) && <p><span className="font-semibold">Level:</span> {card.level}</p>}
        {card.attribute && <p><span className="font-semibold">Attribute:</span> {card.attribute}</p>}
      </div>

      {gameWon && (
        <div className="mt-4 text-sm text-green-600 font-semibold">
          Solved in {attemptCount} guess{attemptCount !== 1 ? 'es' : ''}!
        </div>
      )}
    </div>
  );
};

export default ResultCard;
