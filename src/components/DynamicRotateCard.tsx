import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getCurrentDateString } from "../services/dailyCardService";
import { getGameStateForCard } from "../services/guessHistoryService";
import { useDailyCards } from "../hooks/useDailyCards";
import type { GameMode } from "../types/game";
import type { GameMode as GameModeInterface } from "../types/gameMode";
import Back from "../assets/card_back.png";
import MonsterFrame from "../assets/monster_frame.png";
import SpellFrame from "../assets/spell_frame.png";
import TrapFrame from "../assets/trap_frame.png";

// Types et configurations
type CardSize = "sm" | "md" | "lg";

interface DynamicRotateCardProps {
  gameMode: GameModeInterface;
  size?: CardSize;
}

interface CardState {
  isFound: boolean;
  imageUrl: string | null;
  isLoading: boolean;
}

// Configuration des tailles
const SIZE_CLASSES: Record<CardSize, string> = {
  sm: "w-16 h-24",
  md: "w-20 h-28", 
  lg: "w-24 h-32"
};

// Configuration des frames par mode
const FRAME_MAP: Record<string, string> = {
  monsters: MonsterFrame,
  spells: SpellFrame,
  traps: TrapFrame
};

// Configuration d'animation
const ANIMATION_CONFIG = {
  duration: 3,
  perspective: "1000px",
  checkmark: {
    initial: { scale: 0, rotate: 0 },
    animate: { scale: 1, rotate: 360 },
    transition: { duration: 0.6, delay: 0.2 }
  }
};

const DynamicRotateCard: React.FC<DynamicRotateCardProps> = ({ 
  gameMode, 
  size = "md" 
}) => {
  // État du composant
  const [cardState, setCardState] = useState<CardState>({
    isFound: false,
    imageUrl: null,
    isLoading: true
  });

  // Hook pour accéder au cache des cartes quotidiennes
  const { getDailyCardFromCache } = useDailyCards();

  // Utilitaires
  const getFrameForMode = (mode: string): string => {
    return FRAME_MAP[mode] || FRAME_MAP.monsters;
  };

  // Composants de rendu
  const LoadingCard = () => (
    <div className="absolute w-full h-full rounded bg-gray-700 animate-pulse" />
  );

  const SuccessCheckmark = () => (
    <motion.div
      initial={ANIMATION_CONFIG.checkmark.initial}
      animate={ANIMATION_CONFIG.checkmark.animate}
      transition={ANIMATION_CONFIG.checkmark.transition}
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
  );

  const MonsterPlaceholder = () => (
    <div className="absolute inset-0 bg-black rounded flex items-center justify-center">
      <div className="text-white text-4xl opacity-80">❓</div>
    </div>
  );

  const SpellTrapPlaceholder = ({ imageUrl }: { imageUrl: string | null }) => {
    if (imageUrl) {
      return (
        <div className="absolute inset-0 rounded overflow-hidden">
          <img
            src={imageUrl}
            alt="Daily Card"
            className="w-full h-full object-cover"
            style={{ filter: "blur(4px)" }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-white text-4xl">❓</div>
        </div>
      );
    }

    const frame = getFrameForMode(gameMode.id);
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
  };

  const FoundCard = ({ imageUrl }: { imageUrl: string }) => (
    <div className="absolute w-full h-full rounded overflow-hidden">
      <img
        src={imageUrl}
        alt="Daily Card"
        className="w-full h-full object-cover brightness-75"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <SuccessCheckmark />
      </div>
    </div>
  );

  const NotFoundCard = () => {
    const isMonster = gameMode.id === 'monsters';
    
    return (
      <div className="absolute w-full h-full rounded overflow-hidden">
        {isMonster ? (
          <MonsterPlaceholder />
        ) : (
          <SpellTrapPlaceholder imageUrl={cardState.imageUrl} />
        )}
      </div>
    );
  };

  const CardFront = () => {
    if (cardState.isLoading) {
      return <LoadingCard />;
    }

    if (cardState.isFound && cardState.imageUrl) {
      return <FoundCard imageUrl={cardState.imageUrl} />;
    }

    return <NotFoundCard />;
  };

  // Effet pour charger les données de la carte
  useEffect(() => {
    const loadCardData = async () => {
      try {
        setCardState(prev => ({ ...prev, isLoading: true }));
        const currentDate = getCurrentDateString();
        
        // Utiliser le cache au lieu d'appeler getDailyCard
        const dailyCard = getDailyCardFromCache(gameMode.id as GameMode);
        
        if (dailyCard) {
          const gameState = getGameStateForCard(
            gameMode.id as GameMode, 
            dailyCard.card.id, 
            currentDate
          );
          const hasWon = gameState?.gameWon || false;
          
          setCardState({
            isFound: hasWon,
            imageUrl: dailyCard.card.card_images?.[0]?.image_url || null,
            isLoading: false
          });
        } else {
          setCardState({
            isFound: false,
            imageUrl: null,
            isLoading: false
          });
        }
      } catch (error) {
        console.error('Error loading card data:', error);
        setCardState({
          isFound: false,
          imageUrl: null,
          isLoading: false
        });
      }
    };

    loadCardData();
  }, [gameMode.id, getDailyCardFromCache]);

  // Rendu principal
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ perspective: ANIMATION_CONFIG.perspective }}
    >
      <motion.div
        className={`relative ${SIZE_CLASSES[size]}`}
        animate={{ rotateY: 360 }}
        transition={{ 
          duration: ANIMATION_CONFIG.duration, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Face avant de la carte */}
        <motion.div
          className="absolute w-full h-full rounded shadow-lg"
          style={{ backfaceVisibility: "hidden" }}
        >
          <CardFront />
        </motion.div>

        {/* Face arrière de la carte */}
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
