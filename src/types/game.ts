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
