// Service pour gérer l'historique des tentatives en localStorage

import type { GameAttempt, GameMode } from '../types/game';

interface GuessHistory {
  [mode: string]: {
    [cardId: number]: {
      date: string;
      cardId: number;
      attempts: GameAttempt[];
      gameOver: boolean;
      gameWon: boolean;
      lastUpdated: string;
    };
  };
}

const GUESS_HISTORY_KEY = 'ygodle_guess_history';

// Récupérer l'historique des tentatives depuis localStorage
export const getGuessHistory = (): GuessHistory => {
  try {
    const stored = localStorage.getItem(GUESS_HISTORY_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn('Error parsing guess history from localStorage:', error);
  }
  
  return {};
};

// Sauvegarder l'historique des tentatives
const saveGuessHistory = (history: GuessHistory): void => {
  try {
    localStorage.setItem(GUESS_HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Error saving guess history to localStorage:', error);
  }
};

// Récupérer les tentatives pour un mode et une carte spécifiques
export const getAttemptsForCard = (
  mode: GameMode, 
  cardId: number, 
  date: string
): GameAttempt[] => {
  const history = getGuessHistory();
  
  if (history[mode] && history[mode][cardId] && history[mode][cardId].date === date) {
    return history[mode][cardId].attempts;
  }
  
  return [];
};

// Récupérer l'état complet du jeu pour une carte
export const getGameStateForCard = (
  mode: GameMode, 
  cardId: number, 
  date: string
): {
  attempts: GameAttempt[];
  gameOver: boolean;
  gameWon: boolean;
} | null => {
  const history = getGuessHistory();
  
  if (history[mode] && history[mode][cardId] && history[mode][cardId].date === date) {
    const cardHistory = history[mode][cardId];
    return {
      attempts: cardHistory.attempts,
      gameOver: cardHistory.gameOver,
      gameWon: cardHistory.gameWon
    };
  }
  
  return null;
};

// Sauvegarder une tentative
export const saveAttempt = (
  mode: GameMode,
  cardId: number,
  date: string,
  attempt: GameAttempt,
  gameOver: boolean = false,
  gameWon: boolean = false
): void => {
  const history = getGuessHistory();
  
  // Initialiser la structure si elle n'existe pas
  if (!history[mode]) {
    history[mode] = {};
  }
  
  if (!history[mode][cardId] || history[mode][cardId].date !== date) {
    // Nouvelle carte ou nouveau jour
    history[mode][cardId] = {
      date,
      cardId,
      attempts: [],
      gameOver: false,
      gameWon: false,
      lastUpdated: new Date().toISOString()
    };
  }
  
  // Ajouter la nouvelle tentative
  history[mode][cardId].attempts.push(attempt);
  history[mode][cardId].gameOver = gameOver;
  history[mode][cardId].gameWon = gameWon;
  history[mode][cardId].lastUpdated = new Date().toISOString();
  
  saveGuessHistory(history);
};

// Sauvegarder l'état complet du jeu
export const saveGameState = (
  mode: GameMode,
  cardId: number,
  date: string,
  attempts: GameAttempt[],
  gameOver: boolean,
  gameWon: boolean
): void => {
  const history = getGuessHistory();
  
  // Initialiser la structure si elle n'existe pas
  if (!history[mode]) {
    history[mode] = {};
  }
  
  history[mode][cardId] = {
    date,
    cardId,
    attempts: [...attempts], // Copie pour éviter les références
    gameOver,
    gameWon,
    lastUpdated: new Date().toISOString()
  };
  
  saveGuessHistory(history);
};

// Vérifier si une tentative existe déjà pour une carte
export const hasExistingAttempts = (
  mode: GameMode, 
  cardId: number, 
  date: string
): boolean => {
  const history = getGuessHistory();
  return !!(
    history[mode] && 
    history[mode][cardId] && 
    history[mode][cardId].date === date &&
    history[mode][cardId].attempts.length > 0
  );
};

// Nettoyer l'historique ancien (garder seulement les 7 derniers jours)
export const cleanupOldGuessHistory = (): void => {
  const history = getGuessHistory();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const cutoffDate = sevenDaysAgo.toISOString().split('T')[0];
  
  let hasChanges = false;
  
  Object.keys(history).forEach(mode => {
    Object.keys(history[mode]).forEach(cardId => {
      const cardHistory = history[mode][parseInt(cardId)];
      if (cardHistory && cardHistory.date < cutoffDate) {
        delete history[mode][parseInt(cardId)];
        hasChanges = true;
      }
    });
    
    // Supprimer les modes vides
    if (Object.keys(history[mode]).length === 0) {
      delete history[mode];
      hasChanges = true;
    }
  });
  
  if (hasChanges) {
    saveGuessHistory(history);
  }
};

// Réinitialiser l'historique (utile pour le développement)
export const clearGuessHistory = (): void => {
  localStorage.removeItem(GUESS_HISTORY_KEY);
};

// Obtenir des statistiques sur l'historique
export const getHistoryStats = (): {
  totalGames: number;
  completedGames: number;
  wonGames: number;
  totalAttempts: number;
} => {
  const history = getGuessHistory();
  let totalGames = 0;
  let completedGames = 0;
  let wonGames = 0;
  let totalAttempts = 0;
  
  Object.values(history).forEach(modeHistory => {
    Object.values(modeHistory).forEach(cardHistory => {
      totalGames++;
      totalAttempts += cardHistory.attempts.length;
      if (cardHistory.gameOver) {
        completedGames++;
        if (cardHistory.gameWon) {
          wonGames++;
        }
      }
    });
  });
  
  return {
    totalGames,
    completedGames,
    wonGames,
    totalAttempts
  };
};
