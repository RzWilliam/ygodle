import React, { useState, useEffect } from 'react';
import { getDailyCard } from '../services/dailyCardService';
import { DailyCardsContext } from './DailyCardsContext';
import type { GameMode } from '../types/game';
import type { DailyCardData, DailyCardsState, DailyCardsContextType } from './DailyCardsContext';

interface DailyCardsProviderProps {
  children: React.ReactNode;
}

export const DailyCardsProvider: React.FC<DailyCardsProviderProps> = ({ children }) => {
  const [dailyCards, setDailyCards] = useState<DailyCardsState>({
    monsters: null,
    spells: null,
    traps: null,
    isLoading: true,
    error: null
  });

  const loadAllDailyCards = async () => {
    try {
      setDailyCards(prev => ({ ...prev, isLoading: true, error: null }));

      // Charger toutes les cartes quotidiennes en parallèle
      const [monstersResult, spellsResult, trapsResult] = await Promise.all([
        getDailyCard('monsters'),
        getDailyCard('spells'),
        getDailyCard('traps')
      ]);

      setDailyCards({
        monsters: monstersResult,
        spells: spellsResult,
        traps: trapsResult,
        isLoading: false,
        error: null
      });

      console.log('Daily cards loaded:', {
        monsters: !!monstersResult,
        spells: !!spellsResult,
        traps: !!trapsResult
      });
    } catch (error) {
      console.error('Error loading daily cards:', error);
      setDailyCards(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load daily cards'
      }));
    }
  };

  const getDailyCardFromCache = (mode: GameMode): DailyCardData | null => {
    return dailyCards[mode];
  };

  const refreshDailyCards = async () => {
    await loadAllDailyCards();
  };

  useEffect(() => {
    loadAllDailyCards();
  }, []);

  const value: DailyCardsContextType = {
    dailyCards,
    getDailyCardFromCache,
    refreshDailyCards
  };

  return (
    <DailyCardsContext.Provider value={value}>
      {children}
    </DailyCardsContext.Provider>
  );
};
