import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getDailyCard, getCurrentDateString } from "../services/dailyCardService";
import { getGameStateForCard } from "../services/guessHistoryService";
import type { GameMode } from "../types/game";
import type { GameMode as GameModeInterface } from "../types/gameMode";
import Back from "../assets/card_back.png";
import MonsterFrame from "../assets/monster_frame.png";
import SpellFrame from "../assets/spell_frame.png";
import TrapFrame from "../assets/trap_frame.png";

interface DynamicRotateCardProps {
  gameMode: GameModeInterface;
  size?: "sm" | "md" | "lg";
}

const DynamicRotateCard: React.FC<DynamicRotateCardProps> = ({ 
  gameMode, 
  size = "md" 
}) => {
  const [cardFound, setCardFound] = useState<boolean>(false);
  const [cardImage, setCardImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Tailles selon la prop size
  const sizeClasses = {
    sm: "w-16 h-24",
    md: "w-20 h-28", 
    lg: "w-24 h-32"
  };

  const getFrameForMode = (mode: string): string => {
    switch (mode) {
      case 'monsters':
        return MonsterFrame;
      case 'spells':
        return SpellFrame;
      case 'traps':
        return TrapFrame;
      default:
        return MonsterFrame;
    }
  };

  const renderPlaceholderForMode = (mode: string, cardImage: string | null): React.ReactNode => {
    if (mode === 'monsters') {
      // Pour les monstres : fond noir avec point d'interrogation
      return (
        <div className="absolute inset-0 bg-black rounded flex items-center justify-center">
          <div className="text-white text-4xl opacity-80">❓</div>
        </div>
      );
    } else {
      // Pour les sorts/pièges : vraie carte floutée
      if (cardImage) {
        return (
          <div className="absolute inset-0 rounded overflow-hidden">
            <img
              src={cardImage}
              alt="Daily Card"
              className="w-full h-full object-cover"
              style={{ filter: "blur(4px)" }}
            />
            <div className="absolute inset-0 flex items-center justify-center text-white text-4xl">❓</div>
          </div>
        );
      } else {
        // Fallback si pas d'image disponible
        const frame = getFrameForMode(mode);
        return (
          <div className="absolute inset-0 rounded overflow-hidden">
            <img
              src={frame}
              alt="Card Frame"
              className="w-full h-full object-cover"
              style={{ filter: "blur(4px)" }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <div className="text-white text-4xl opacity-60">❓</div>
            </div>
          </div>
        );
      }
    }
  };

  useEffect(() => {
    const checkCardStatus = async () => {
      try {
        setLoading(true);
        const currentDate = getCurrentDateString();
        
        // Récupérer la carte du jour
        const dailyCard = await getDailyCard(gameMode.id as GameMode);
        
        if (dailyCard) {
          // Vérifier si l'utilisateur a gagné
          const gameState = getGameStateForCard(gameMode.id as GameMode, dailyCard.card.id, currentDate);
          const hasWon = gameState?.gameWon || false;
          
          setCardFound(hasWon);
          setCardImage(dailyCard.card.card_images?.[0]?.image_url || null);
        } else {
          setCardFound(false);
          setCardImage(null);
        }
      } catch (error) {
        console.error('Error checking card status:', error);
        setCardFound(false);
        setCardImage(null);
      } finally {
        setLoading(false);
      }
    };

    checkCardStatus();
  }, [gameMode.id]);

  const renderCardFront = () => {
    if (loading) {
      return (
        <div className="absolute w-full h-full rounded bg-gray-700 animate-pulse" />
      );
    }

    if (cardFound && cardImage) {
      // Carte trouvée - afficher la carte avec un check vert et fond assombri
      return (
        <div className="absolute w-full h-full rounded overflow-hidden">
          {/* Image de la carte avec overlay sombre */}
          <img
            src={cardImage}
            alt="Daily Card"
            className="w-full h-full object-cover brightness-75"
          />
          
          {/* Check vert au centre */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0, rotate: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-green-500 rounded-full p-1 shadow-lg"
            >
              <svg 
                className="w-8 h-8 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={3} 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
            </motion.div>
          </div>
        </div>
      );
    } else {
      // Carte non trouvée - afficher selon le mode
      return (
        <div className="absolute w-full h-full rounded overflow-hidden">
          {renderPlaceholderForMode(gameMode.id, cardImage)}
        </div>
      );
    }
  };

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ perspective: "1000px" }}
    >
      <motion.div
        className={`relative ${sizeClasses[size]}`}
        animate={{ rotateY: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {/* Front de la carte (dynamique) */}
        <motion.div
          className="absolute w-full h-full rounded shadow-lg"
          style={{ backfaceVisibility: "hidden" }}
        >
          {renderCardFront()}
        </motion.div>

        {/* Back de la carte */}
        <motion.img
          src={Back}
          alt="Card Back"
          className="absolute w-full h-full object-cover rounded shadow-lg"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        />
      </motion.div>
    </div>
  );
};

export default DynamicRotateCard;
