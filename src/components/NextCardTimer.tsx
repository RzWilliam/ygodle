import React, { useState, useEffect } from "react";

// Composant pour afficher le temps restant jusqu'au prochain changement de carte
export const NextCardTimer: React.FC = () => {
  const [timeUntilNext, setTimeUntilNext] = useState<string>("");

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();

      // On calcule la prochaine occurrence de 11h UTC
      const nextChangeUTC = new Date(
        Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate(),
          11,
          0,
          0,
          0
        )
      );

      // Si déjà passé aujourd'hui, prendre demain
      if (now.getTime() >= nextChangeUTC.getTime()) {
        nextChangeUTC.setUTCDate(nextChangeUTC.getUTCDate() + 1);
      }

      // Conversion en heure française pour l’affichage (optionnel)
      // const nextChangeFrench = new Date(
      //   nextChangeUTC.toLocaleString("en-US", { timeZone: "Europe/Paris" })
      // );

      // Différence en ms
      const diff = nextChangeUTC.getTime() - now.getTime();

      if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setTimeUntilNext(
          `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
        );
      } else {
        setTimeUntilNext("00:00:00");
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
      <div className="text-xs text-gray-600 mb-1">⏰ Prochaine carte dans</div>
      <div className="text-lg font-mono font-bold text-blue-600">
        {timeUntilNext}
      </div>
      <div className="text-xs text-gray-500 mt-1">
        Les cartes changent à midi (heure française)
      </div>
    </div>
  );
};
