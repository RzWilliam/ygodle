import { createContext } from 'react';
import type { GameMode, YugiohCard, DailyCard } from '../types/game';

interface DailyCardData {
  card: YugiohCard;
  stats: DailyCard;
}

interface DailyCardsState {
  monsters: DailyCardData | null;
  spells: DailyCardData | null;
  traps: DailyCardData | null;
  isLoading: boolean;
  error: string | null;
}

interface DailyCardsContextType {
  dailyCards: DailyCardsState;
  getDailyCardFromCache: (mode: GameMode) => DailyCardData | null;
  refreshDailyCards: () => Promise<void>;
  isInitialLoadComplete: boolean;
}

export const DailyCardsContext = createContext<DailyCardsContextType | undefined>(undefined);

export type { DailyCardData, DailyCardsState, DailyCardsContextType };
