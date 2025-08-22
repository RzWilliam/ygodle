import React, { useState, useEffect } from 'react';

// Composant pour afficher le temps restant jusqu'au prochain changement de carte
export const NextCardTimer: React.FC = () => {
  const [timeUntilNext, setTimeUntilNext] = useState<string>('');

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const frenchTime = new Date(now.toLocaleString("en-US", {timeZone: "Europe/Paris"}));
      
      // Calculer la prochaine occurrence de midi heure française
      const nextChange = new Date(frenchTime);
      nextChange.setHours(12, 0, 0, 0);
      
      // Si on est déjà passé midi aujourd'hui, passer à midi demain
      if (frenchTime.getTime() >= nextChange.getTime()) {
        nextChange.setDate(nextChange.getDate() + 1);
      }
      
      // Convertir en UTC pour le calcul
      const nextChangeUTC = new Date(nextChange.toLocaleString("en-US", {timeZone: "UTC"}));
      const nowUTC = new Date(now.toLocaleString("en-US", {timeZone: "UTC"}));
      
      const diff = nextChangeUTC.getTime() - nowUTC.getTime();
      
      if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        setTimeUntilNext(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      } else {
        setTimeUntilNext('00:00:00');
      }
    };

    // Mettre à jour immédiatement
    updateTimer();
    
    // Mettre à jour chaque seconde
    const interval = setInterval(updateTimer, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
      <div className="text-xs text-gray-600 mb-1">
        ⏰ Prochaine carte dans
      </div>
      <div className="text-lg font-mono font-bold text-blue-600">
        {timeUntilNext}
      </div>
      <div className="text-xs text-gray-500 mt-1">
        Les cartes changent à midi (heure française)
      </div>
    </div>
  );
};
