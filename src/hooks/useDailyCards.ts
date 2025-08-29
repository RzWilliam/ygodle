import { useContext } from 'react';
import { DailyCardsContext } from '../contexts/DailyCardsContext';

export const useDailyCards = () => {
  const context = useContext(DailyCardsContext);
  if (context === undefined) {
    throw new Error('useDailyCards must be used within a DailyCardsProvider');
  }
  return context;
};
