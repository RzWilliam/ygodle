import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import GameGrid from '../components/GameGrid';
import ResultCard from '../components/ResultCard';
import ShareButton from '../components/ShareButton';
import { getRandomCard } from '../services/cardService';
import { compareCards } from '../utils/gameLogic';
import type { YugiohCard, GameAttempt, GameMode } from '../types/game';

interface GamePageProps {
  mode: GameMode;
}

const GamePage: React.FC<GamePageProps> = ({ mode }) => {
  const [targetCard, setTargetCard] = useState<YugiohCard | null>(null);
  const [attempts, setAttempts] = useState<GameAttempt[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const maxAttempts = 6;

  useEffect(() => {
    const initGame = async () => {
      setIsLoading(true);
      setAttempts([]);
      setGameOver(false);
      setGameWon(false);
      
      const card = await getRandomCard(mode);
      if (card) {
        setTargetCard(card);
        console.log('Mystery card:', card.name_en); // For debug
      }
      setIsLoading(false);
    };
    
    initGame();
  }, [mode]);

  const handleCardGuess = (guessedCard: YugiohCard) => {
    if (!targetCard || gameOver) return;

    const results = compareCards(guessedCard, targetCard);
    const newAttempt: GameAttempt = {
      card: guessedCard,
      results
    };

    const newAttempts = [...attempts, newAttempt];
    setAttempts(newAttempts);

    // Check if player won
    if (results.name === 'correct') {
      setGameWon(true);
      setGameOver(true);
    } else if (newAttempts.length >= maxAttempts) {
      setGameOver(true);
    }
  };

  const resetGame = async () => {
    setIsLoading(true);
    setAttempts([]);
    setGameOver(false);
    setGameWon(false);
    
    const card = await getRandomCard(mode);
    if (card) {
      setTargetCard(card);
      console.log('New mystery card:', card.name_en);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-white font-semibold">Loading mystery card...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 py-4 text-center">
        <Link to="/" className="inline-block hover:opacity-80 transition-opacity">
          <h1 className="text-3xl font-bold tracking-wider">
            <span className="text-yellow-400">YG</span>
            <span className="text-blue-400">O</span>
            <span className="text-red-400">dle</span>
          </h1>
        </Link>
        <div className="mt-2">
          <span className="px-3 py-1 bg-gray-700 rounded-full text-sm capitalize">
            {mode} Mode • {attempts.length}/{maxAttempts}
          </span>
        </div>
      </header>

      {/* Main Game Area */}
      <main className="flex flex-col items-center justify-start px-4 py-8">
        <div className="w-full max-w-2xl mx-auto">
          <SearchBar 
            onCardSelect={handleCardGuess} 
            disabled={gameOver}
            gameMode={mode}
          />
          
          <GameGrid 
            attempts={attempts} 
            maxAttempts={maxAttempts}
            gameMode={mode}
            targetCard={targetCard}
            gameOver={gameOver}
          />
          
          <ResultCard 
            card={targetCard}
            gameWon={gameWon}
            gameOver={gameOver}
            attemptCount={attempts.length}
          />
          
          {gameOver && (
            <div className="flex justify-center items-center mt-6 space-x-4 flex-wrap gap-2">
              <ShareButton 
                gameWon={gameWon}
                attemptCount={attempts.length}
                gameMode={mode}
              />
              <button 
                onClick={resetGame}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
              >
                New Game
              </button>
              <Link 
                to="/"
                className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition"
              >
                Change Mode
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default GamePage;