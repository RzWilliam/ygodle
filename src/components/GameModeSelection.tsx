import React from "react";
import { motion } from "framer-motion";
import GameModeCard from "./GameModeCard";
import { NextCardTimer } from "./NextCardTimer";
import { GAME_MODES } from "../types/gameMode";

const GameModeSelection: React.FC = () => {
  const titleVariants = {
    hidden: { 
      opacity: 0, 
      y: -20 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8
      }
    }
  };

  return (
    <>
      {/* Choose a gamemode */}
      <motion.p 
        className="text-xl text-white mb-6"
        variants={titleVariants}
      >
        Choose a gamemode
      </motion.p>

      {/* Game Mode Selection */}
      <motion.div className="w-full max-w-md space-y-4">
        {GAME_MODES.map((mode, index) => (
          <GameModeCard
            key={mode.id}
            mode={mode}
            index={index}
          />
        ))}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <NextCardTimer />
        </motion.div>
      </motion.div>
    </>
  );
};

export default GameModeSelection;
