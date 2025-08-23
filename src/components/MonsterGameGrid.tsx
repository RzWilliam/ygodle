import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { GameAttempt } from "../types/game";

interface MonsterGameGridProps {
  attempts: GameAttempt[];
}

const MonsterGameGrid: React.FC<MonsterGameGridProps> = ({
  attempts,
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
      {attempts.length > 0 && (
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
      )}

      {/* Attempts */}
      <AnimatePresence mode="popLayout">
        {attempts.slice().reverse().map((attempt, i) => {
          const originalIndex = attempts.length - 1 - i;
          const isLatest = i === 0 && attempts.length > 0;
          
          return (
            <motion.div 
              key={`attempt-${originalIndex}-${attempt.card.id || attempt.card.name_en}`}
              className="grid grid-cols-7 gap-2 mb-2"
              initial={isLatest ? { opacity: 0, y: -20, scale: 0.95 } : false}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ 
                duration: 0.6, 
                ease: "easeOut",
                type: "spring",
                stiffness: 100,
                damping: 15
              }}
              layout
            >
            <motion.div
              className={`rounded-lg text-center text-sm font-medium ${getColorClass(
                attempt.results.type
              )}`}
              initial={isLatest ? { opacity: 0, scale: 0.8 } : false}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: isLatest ? 0.1 : 0, duration: 0.3 }}
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
            </motion.div>
          <motion.div
            className={`p-3 rounded-lg text-center text-sm font-medium ${getColorClass(
              attempt.results.type
            )}`}
            initial={isLatest ? { opacity: 0, scale: 0.8 } : false}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: isLatest ? 0.15 : 0, duration: 0.3 }}
          >
            {attempt.card.humanreadablecardtype}
          </motion.div>
          <motion.div
            className={`p-3 rounded-lg text-center text-sm font-medium ${getColorClass(
              attempt.results.race
            )}`}
            initial={isLatest ? { opacity: 0, scale: 0.8 } : false}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: isLatest ? 0.2 : 0, duration: 0.3 }}
          >
            {attempt.card.race}
          </motion.div>
          <motion.div
            className={`p-3 rounded-lg text-center text-sm font-medium ${getColorClass(
              attempt.results.atk
            )} flex items-center justify-center space-x-1`}
            initial={isLatest ? { opacity: 0, scale: 0.8 } : false}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: isLatest ? 0.25 : 0, duration: 0.3 }}
          >
            <span>
              {attempt.card.atk !== undefined ? attempt.card.atk : "-"}
            </span>
            <span className="text-lg font-bold">
              {getArrow(attempt.results.atk)}
            </span>
          </motion.div>
          <motion.div
            className={`p-3 rounded-lg text-center text-sm font-medium ${getColorClass(
              attempt.results.def
            )} flex items-center justify-center space-x-1`}
            initial={isLatest ? { opacity: 0, scale: 0.8 } : false}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: isLatest ? 0.3 : 0, duration: 0.3 }}
          >
            <span>
              {attempt.card.def !== undefined ? attempt.card.def : "-"}
            </span>
            <span className="text-lg font-bold">
              {getArrow(attempt.results.def)}
            </span>
          </motion.div>
          <motion.div
            className={`p-3 rounded-lg text-center text-sm font-medium ${getColorClass(
              attempt.results.level
            )} flex items-center justify-center space-x-1`}
            initial={isLatest ? { opacity: 0, scale: 0.8 } : false}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: isLatest ? 0.35 : 0, duration: 0.3 }}
          >
            <span>
              {attempt.card.level !== undefined
                ? attempt.card.level
                : "-"}
            </span>
            <span className="text-lg font-bold">
              {getArrow(attempt.results.level)}
            </span>
          </motion.div>
          <motion.div
            className={`p-3 rounded-lg text-center text-sm font-medium flex items-center justify-center ${getColorClass(
              attempt.results.attribute
            )}`}
            initial={isLatest ? { opacity: 0, scale: 0.8 } : false}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: isLatest ? 0.4 : 0, duration: 0.3 }}
          >
            <img
              src={`/attributes/${attempt.card.attribute || ""}.svg`}
              alt={attempt.card.attribute || ""}
              title={attempt.card.attribute || ""}
              className="w-12"
            />
          </motion.div>
        </motion.div>
        );
      })}
      </AnimatePresence>
    </div>
  );
};

export default MonsterGameGrid;
