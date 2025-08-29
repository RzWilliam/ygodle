export interface GameMode {
  id: string;
  title: string;
  description: string;
  path: string;
  bgColor: string;
}

export const GAME_MODES: GameMode[] = [
  {
    id: 'monsters',
    title: 'Monsters',
    description: 'Discover today\'s Yu-Gi-Oh! monster',
    path: '/monsters',
    bgColor: 'bg-orange-600'
  },
  {
    id: 'spells',
    title: 'Spells',
    description: 'Guess today\'s spell card',
    path: '/spells',
    bgColor: 'bg-green-600'
  },
  {
    id: 'traps',
    title: 'Traps',
    description: 'Uncover today\'s trap card',
    path: '/traps',
    bgColor: 'bg-purple-600'
  }
];
