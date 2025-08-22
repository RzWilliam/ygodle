import { useEffect } from 'react';
import { initializeDailyCards } from '../services/dailyCardService';

// Hook pour initialiser les cartes quotidiennes au démarrage de l'application
export const useDailyCardInitializer = () => {
  useEffect(() => {
    const initialize = async () => {
      try {
        await initializeDailyCards();
        console.log('Daily cards initialized successfully');
      } catch (error) {
        console.error('Failed to initialize daily cards:', error);
      }
    };

    // Initialiser au démarrage
    initialize();

    // Optionnel : vérifier périodiquement (toutes les heures)
    const interval = setInterval(initialize, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);
};
