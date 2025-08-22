import React from "react";

const StatsModal: React.FC = () => {
  // TODO: Afficher les stats de partie
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 hidden">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full text-center">
        <h2 className="text-2xl font-bold mb-4 text-yugiohBlue">Statistiques</h2>
        {/* Placeholder pour stats */}
        <p>Stats de partie à venir...</p>
      </div>
    </div>
  );
};

export default StatsModal;
