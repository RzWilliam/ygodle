import React from 'react';
import { useDailyCardInitializer } from '../hooks/useDailyCardInitializer';

// Composant pour gérer l'initialisation
export const DailyCardInitializer: React.FC = () => {
  useDailyCardInitializer();
  return null; // Ce composant ne rend rien
};
