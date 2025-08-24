export interface YugiohCard {
  id: number;
  name_en: string;
  name_fr: string;
  race: string;
  atk?: number;
  def?: number;
  level?: number;
  attribute?: string;
  frametype: string;
  humanreadablecardtype: string;
  archetype?: string;
  card_images: {
    image_url: string;
    image_url_small: string;
  }[];
}

export type GameMode = 'monsters' | 'spells' | 'traps';

export interface GameAttempt {
  card: YugiohCard;
  results: {
    name: 'correct' | 'incorrect';
    type: 'correct' | 'incorrect';
    race: 'correct' | 'incorrect';
    atk: 'correct' | 'higher' | 'lower' | 'incorrect';
    def: 'correct' | 'higher' | 'lower' | 'incorrect';
    level: 'correct' | 'higher' | 'lower' | 'incorrect';
    attribute: 'correct' | 'incorrect';
  };
}

export interface GameState {
  mode: GameMode;
  targetCard: YugiohCard | null;
  attempts: GameAttempt[];
  gameOver: boolean;
  gameWon: boolean;
  isLoading: boolean;
}

export interface DailyCard {
  id: string;
  game_mode: GameMode;
  card_id: number;
  date: string; // Peut être mappé depuis used_date
  used_date?: string; // Champ optionnel pour la compatibilité
  day_number: number;
  success_count: number;
  total_attempts: number;
  created_at: string;
}

export interface UserCardProgress {
  id: string;
  user_id: string;
  game_mode: GameMode;
  card_id: number;
  date: string;
  day_number: number;
  attempts: number;
  is_completed: boolean;
  is_success: boolean;
  completed_at?: string;
  created_at: string;
}

export interface CardHistory {
  id: string;
  game_mode: GameMode;
  card_id: number;
  used_date: string;
  day_number: number;
  success_count: number;
  total_attempts: number;
  created_at: string;
}
