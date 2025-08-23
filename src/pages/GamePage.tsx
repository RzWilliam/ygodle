import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import GameGrid from '../components/GameGrid';
import ResultCard from '../components/ResultCard';
import ShareButton from '../components/ShareButton';
import { DailyCardStats } from '../components/DailyCardStats';
import { getDailyCard, updateDailyCardStats } from '../services/dailyCardService';
import { 
  hasPlayedToday as checkHasPlayedToday, 
  markGameStarted, 
  markGameCompleted, 
  recordAttempt,
  getTodayUserStats,
  cleanupOldSessionData
} from '../services/userSessionService';
import { compareCards } from '../utils/gameLogic';
import type { YugiohCard, GameAttempt, GameMode, DailyCard } from '../types/game';

interface GamePageProps {
  mode: GameMode;
}

const GamePage: React.FC<GamePageProps> = ({ mode }) => {
  const [targetCard, setTargetCard] = useState<YugiohCard | null>(null);
  const [dailyStats, setDailyStats] = useState<DailyCard | null>(null);
  const [attempts, setAttempts] = useState<GameAttempt[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasPlayedToday, setHasPlayedToday] = useState(false);
  
  const maxAttempts = 6;

  const getModeDisplayName = (mode: GameMode): string => {
    switch (mode) {
      case 'monsters': return 'Monstres';
      case 'spells': return 'Magie';
      case 'traps': return 'Piège';
      default: return mode;
    }
  };

  useEffect(() => {
    const initGame = async () => {
      setIsLoading(true);
      setAttempts([]);
      setGameOver(false);
      setGameWon(false);
      
      // Nettoyer les anciennes données de session
      cleanupOldSessionData();
      
      try {
        const dailyResult = await getDailyCard(mode);
        if (dailyResult) {
          setTargetCard(dailyResult.card);
          setDailyStats(dailyResult.stats);
          
          // Vérifier si l'utilisateur a déjà joué aujourd'hui pour cette carte
          const alreadyPlayed = checkHasPlayedToday(mode, dailyResult.card.id);
          const userStats = getTodayUserStats(mode, dailyResult.card.id);
          
          if (alreadyPlayed && userStats) {
            // L'utilisateur a déjà joué aujourd'hui pour cette carte
            setHasPlayedToday(true);
            setGameOver(true);
            setGameWon(userStats.won);
            console.log(`Already played today. Won: ${userStats.won}, Attempts: ${userStats.attempts}`);
          } else {
            // Marquer le début du jeu avec l'ID de la carte
            markGameStarted(mode, dailyResult.card.id);
          }
          
          console.log('Daily card:', dailyResult.card.name_en, 'Day:', dailyResult.stats.day_number);
        } else {
          console.log(`No daily card available for ${mode} mode`);
        }
      } catch (error) {
        console.error('Error loading daily card:', error);
      }
      
      setIsLoading(false);
    };
    
    initGame();
  }, [mode]);

  const handleCardGuess = async (guessedCard: YugiohCard) => {
    if (!targetCard || gameOver || !dailyStats) return;

    const results = compareCards(guessedCard, targetCard);
    const newAttempt: GameAttempt = {
      card: guessedCard,
      results
    };

    const newAttempts = [...attempts, newAttempt];
    setAttempts(newAttempts);

    // Enregistrer la tentative localement
    recordAttempt(mode, targetCard.id);

    // Vérifier si le joueur a gagné
    const isSuccess = results.name === 'correct';
    
    try {
      // Mettre à jour les statistiques globales
      await updateDailyCardStats(mode, targetCard.id, isSuccess);
      
      // Mettre à jour les stats locales pour l'affichage
      setDailyStats(prev => prev ? {
        ...prev,
        total_attempts: prev.total_attempts + 1,
        success_count: isSuccess ? prev.success_count + 1 : prev.success_count
      } : null);
    } catch (error) {
      console.error('Error updating stats:', error);
    }

    // Vérifier si le jeu est terminé
    if (isSuccess) {
      setGameWon(true);
      setGameOver(true);
      setHasPlayedToday(true);
      // Marquer le jeu comme terminé avec succès
      markGameCompleted(mode, targetCard.id, true, newAttempts.length);
    } else if (newAttempts.length >= maxAttempts) {
      setGameOver(true);
      setHasPlayedToday(true);
      // Marquer le jeu comme terminé sans succès
      markGameCompleted(mode, targetCard.id, false, newAttempts.length);
    }
  };

  const resetGame = () => {
    // Pour le mode quotidien, on ne peut pas vraiment "reset" la carte
    // Mais on peut réinitialiser l'état local pour permettre de rejouer (dev mode)
    if (hasPlayedToday) {
      // Reset local pour le développement
      localStorage.removeItem('ygodle_user_session');
      window.location.reload();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-white font-semibold">Loading daily card...</p>
        </div>
      </div>
    );
  }

  // Si aucune carte quotidienne n'est disponible
  if (!targetCard) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-white mb-4">Aucune carte quotidienne</h2>
          <p className="text-gray-300 mb-6">
            Aucune carte quotidienne n'est disponible pour le mode {getModeDisplayName(mode)} aujourd'hui.
            Les cartes changent à midi heure française.
          </p>
          <Link 
            to="/"
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
          >
            Retour à l'accueil
          </Link>
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
            {getModeDisplayName(mode)} Mode • {attempts.length}/{maxAttempts}
            {dailyStats && (
              <span className="ml-2 text-yellow-400">
                • Jour #{dailyStats.day_number}
              </span>
            )}
          </span>
          {hasPlayedToday && (
            <div className="mt-2">
              <span className="px-2 py-1 bg-yellow-600 rounded text-xs">
                ✨ Carte quotidienne terminée !
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Main Game Area */}
      <main className="flex flex-col items-center justify-start px-4 py-8">
        <div className="w-full max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Game Section */}
            <div className="lg:col-span-2">
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
                  {/* Bouton de développement pour reset */}
                  <button 
                    onClick={resetGame}
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold rounded-lg transition"
                    title="Reset local session (dev only)"
                  >
                    🔄 Reset Local
                  </button>
                  <Link 
                    to="/"
                    className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition"
                  >
                    Change Mode
                  </Link>
                </div>
              )}
              
              {hasPlayedToday && (
                <div className="mt-4 p-4 bg-yellow-900/20 border border-yellow-700 rounded-lg text-center">
                  <p className="text-yellow-300 font-medium">
                    🎯 Vous avez terminé la carte quotidienne !
                  </p>
                  <p className="text-gray-300 text-sm mt-1">
                    Revenez demain pour une nouvelle carte. Les statistiques globales continuent de s'accumuler pour tous les joueurs.
                  </p>
                  {dailyStats && (
                    <div className="mt-2 text-xs text-gray-400">
                      Total global aujourd'hui : {dailyStats.success_count}/{dailyStats.total_attempts} réussites
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Stats Section */}
            <div className="lg:col-span-1">
              <DailyCardStats mode={mode} className="sticky top-4" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GamePage;