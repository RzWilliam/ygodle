import React from "react";
import type { GameAttempt } from "../types/game";

interface MonsterGameGridProps {
  attempts: GameAttempt[];
  maxAttempts: number;
}

const MonsterGameGrid: React.FC<MonsterGameGridProps> = ({
  attempts,
  maxAttempts,
}) => {
  const getColorClass = (
    result: "correct" | "higher" | "lower" | "incorrect"
  ) => {
    switch (result) {
      case "correct":
        return "bg-green-500 text-white";
      case "higher":
      case "lower":
        return "bg-yellow-500 text-white";
      case "incorrect":
        return "bg-red-400 text-white";
    }
  };

  const getArrow = (result: "correct" | "higher" | "lower" | "incorrect") => {
    switch (result) {
      case "higher":
        return "↑";
      case "lower":
        return "↓";
      default:
        return "";
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      {/* Headers */}
      <div className="grid grid-cols-7 gap-2 mb-4 text-sm font-bold text-gray-300">
        <div className="text-center p-3 bg-gray-700 text-gray-300 rounded-lg">
          CARD
        </div>
        <div className="text-center p-3 bg-gray-700 text-gray-300 rounded-lg">
          TYPE
        </div>
        <div className="text-center p-3 bg-gray-700 text-gray-300 rounded-lg">
          RACE
        </div>
        <div className="text-center p-3 bg-gray-700 text-gray-300 rounded-lg">
          ATK
        </div>
        <div className="text-center p-3 bg-gray-700 text-gray-300 rounded-lg">
          DEF
        </div>
        <div className="text-center p-3 bg-gray-700 text-gray-300 rounded-lg">
          LEVEL
        </div>
        <div className="text-center p-3 bg-gray-700 text-gray-300 rounded-lg">
          ATTRIBUTE
        </div>
      </div>

      {/* Attempts */}
      {[...Array(maxAttempts)].map((_, i) => {
        const attempt = attempts[i];

        return (
          <div key={i} className="grid grid-cols-7 gap-2 mb-2">
            {attempt ? (
              <>
                <div
                  className={`rounded-lg text-center text-sm font-medium ${getColorClass(
                    attempt.results.type
                  )}`}
                >
                  {attempt.card.card_images &&
                    attempt.card.card_images.length > 0 && (
                      <img
                        src={attempt.card.card_images[0].image_url_small}
                        alt={attempt.card.name_en}
                        title={attempt.card.name_en}
                        className="rounded-lg"
                      />
                    )}
                </div>
                <div
                  className={`p-3 rounded-lg text-center text-sm font-medium ${getColorClass(
                    attempt.results.type
                  )}`}
                >
                  {attempt.card.humanreadablecardtype}
                </div>
                <div
                  className={`p-3 rounded-lg text-center text-sm font-medium ${getColorClass(
                    attempt.results.race
                  )}`}
                >
                  {attempt.card.race}
                </div>
                <div
                  className={`p-3 rounded-lg text-center text-sm font-medium ${getColorClass(
                    attempt.results.atk
                  )} flex items-center justify-center space-x-1`}
                >
                  <span>
                    {attempt.card.atk !== undefined ? attempt.card.atk : "-"}
                  </span>
                  <span className="text-lg font-bold">
                    {getArrow(attempt.results.atk)}
                  </span>
                </div>
                <div
                  className={`p-3 rounded-lg text-center text-sm font-medium ${getColorClass(
                    attempt.results.def
                  )} flex items-center justify-center space-x-1`}
                >
                  <span>
                    {attempt.card.def !== undefined ? attempt.card.def : "-"}
                  </span>
                  <span className="text-lg font-bold">
                    {getArrow(attempt.results.def)}
                  </span>
                </div>
                <div
                  className={`p-3 rounded-lg text-center text-sm font-medium ${getColorClass(
                    attempt.results.level
                  )} flex items-center justify-center space-x-1`}
                >
                  <span>
                    {attempt.card.level !== undefined
                      ? attempt.card.level
                      : "-"}
                  </span>
                  <span className="text-lg font-bold">
                    {getArrow(attempt.results.level)}
                  </span>
                </div>
                <div
                  className={`p-3 rounded-lg text-center text-sm font-medium flex items-center justify-center ${getColorClass(
                    attempt.results.attribute
                  )}`}
                >
                  <img
                    src={`/attributes/${attempt.card.attribute || ""}.svg`}
                    alt={attempt.card.attribute || ""}
                    title={attempt.card.attribute || ""}
                    className="w-12"
                  />
                </div>
              </>
            ) : (
              Array(7)
                .fill(0)
                .map((_, j) => (
                  <div
                    key={j}
                    className="p-3 h-12 bg-gray-800 rounded-lg border-2 border-gray-600"
                  />
                ))
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MonsterGameGrid;
