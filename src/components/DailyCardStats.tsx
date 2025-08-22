import React, { useEffect, useState } from 'react';
import { getDailyCard, getGameModeStats } from '../services/dailyCardService';
import { NextCardTimer } from './NextCardTimer';
import type { GameMode, DailyCard } from '../types/game';

interface DailyCardStatsProps {
  mode: GameMode;
  className?: string;
}

interface GameStats {
  totalDaysPlayed: number;
  totalCards: number;
  averageSuccessRate: number;
}

export const DailyCardStats: React.FC<DailyCardStatsProps> = ({ mode, className = '' }) => {
  const [dailyStats, setDailyStats] = useState<DailyCard | null>(null);
  const [gameStats, setGameStats] = useState<GameStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        
        // Charger les stats de la carte du jour
        const dailyResult = await getDailyCard(mode);
        if (dailyResult) {
          setDailyStats(dailyResult.stats);
        }

        // Charger les stats globales du mode de jeu
        const globalStats = await getGameModeStats(mode);
        setGameStats(globalStats);
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [mode]);

  const getSuccessRate = (successCount: number, totalAttempts: number): string => {
    if (totalAttempts === 0) return '0%';
    return `${Math.round((successCount / totalAttempts) * 100)}%`;
  };

  const getModeDisplayName = (mode: GameMode): string => {
    switch (mode) {
      case 'monsters': return 'Monstres';
      case 'spells': return 'Magie';
      case 'traps': return 'Piège';
      default: return mode;
    }
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-800 mb-3">
        📊 Statistiques - {getModeDisplayName(mode)}
      </h3>
      
      {/* Timer pour la prochaine carte */}
      <div className="mb-4">
        <NextCardTimer />
      </div>
      
      {dailyStats && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">🎯 Carte du jour</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-600">Jour #:</span>
              <span className="font-medium ml-1">{dailyStats.day_number}</span>
            </div>
            <div>
              <span className="text-gray-600">Tentatives globales:</span>
              <span className="font-medium ml-1">{dailyStats.total_attempts}</span>
            </div>
            <div>
              <span className="text-gray-600">Réussites globales:</span>
              <span className="font-medium ml-1">{dailyStats.success_count}</span>
            </div>
            <div>
              <span className="text-gray-600">Taux global:</span>
              <span className="font-medium ml-1">
                {getSuccessRate(dailyStats.success_count, dailyStats.total_attempts)}
              </span>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500 text-center">
            📊 Statistiques de tous les joueurs confondus
          </div>
        </div>
      )}

      {gameStats && (
        <div className="p-3 bg-green-50 rounded-lg">
          <h4 className="font-medium text-green-800 mb-2">📈 Statistiques globales</h4>
          <div className="grid grid-cols-1 gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Jours joués:</span>
              <span className="font-medium">{gameStats.totalDaysPlayed}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Cartes total:</span>
              <span className="font-medium">{gameStats.totalCards}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Taux moyen:</span>
              <span className="font-medium">{gameStats.averageSuccessRate}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Progression:</span>
              <span className="font-medium">
                {gameStats.totalCards > 0 
                  ? `${Math.round((gameStats.totalDaysPlayed / gameStats.totalCards) * 100)}%`
                  : '0%'
                }
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
