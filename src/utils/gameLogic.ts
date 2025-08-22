import type { YugiohCard, GameAttempt } from '../types/game';

export const compareCards = (guess: YugiohCard, target: YugiohCard): GameAttempt['results'] => {
  return {
    name: guess.id === target.id ? 'correct' : 'incorrect',
    type: guess.humanreadablecardtype === target.humanreadablecardtype ? 'correct' : 'incorrect',
    race: guess.race === target.race ? 'correct' : 'incorrect',
    atk: compareNumericValue(guess.atk, target.atk),
    def: compareNumericValue(guess.def, target.def),
    level: compareNumericValue(guess.level, target.level),
    attribute: (guess.attribute || '') === (target.attribute || '') ? 'correct' : 'incorrect'
  };
};

const compareNumericValue = (
  guess: number | undefined, 
  target: number | undefined
): 'correct' | 'higher' | 'lower' | 'incorrect' => {
  if (guess === undefined || target === undefined) {
    return guess === target ? 'correct' : 'incorrect';
  }
  
  if (guess === target) return 'correct';
  
  return guess > target ? 'lower' : 'higher';
};
