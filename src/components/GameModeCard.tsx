import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { GameMode } from "../types/gameMode";

interface GameModeCardProps {
  mode: GameMode;
  index: number;
}

const GameModeCard: React.FC<GameModeCardProps> = ({ mode, index }) => {
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const iconVariants = {
    hover: {
      scale: 1.2,
      rotate: [0, -10, 10, -10, 0],
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ 
        scale: 1.05, 
        y: -5,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 20
        }
      }}
      whileTap={{ scale: 0.98 }}
    >
      <Link
        to={mode.path}
        className="block"
      >
        <motion.div 
          className={`${mode.bgColor} bg-opacity-90 hover:bg-opacity-100 rounded-lg p-6 border border-gray-600 hover:border-gray-400 transition-all duration-200 shadow-lg`}
        >
          <div className="flex items-center space-x-4">
            <motion.div 
              className="text-3xl"
              variants={iconVariants}
              whileHover="hover"
            >
              {mode.icon}
            </motion.div>
            <div className="flex-1">
              <motion.h2 
                className="text-xl font-bold text-white"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
              >
                {mode.title}
              </motion.h2>
              <motion.p 
                className="text-gray-200 text-sm mt-1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
              >
                {mode.description}
              </motion.p>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default GameModeCard;
