import { supabase } from '../supabaseClient';
import type { YugiohCard, GameMode, DailyCard } from '../types/game';

// Calculer le numéro de jour depuis le début du jeu (epoch personnalisé)
// Les cartes changent à midi heure française
const GAME_START_DATE = new Date('2024-01-01T12:00:00+01:00'); // Date de début du jeu à midi heure française

export const getDayNumber = (date: Date = new Date()): number => {
  // Convertir en heure française et ajuster pour le changement à midi
  const frenchTime = new Date(date.toLocaleString("en-US", {timeZone: "Europe/Paris"}));
  
  // Si on est avant midi, on est encore sur le jour précédent
  const changeTime = new Date(frenchTime);
  changeTime.setHours(12, 0, 0, 0); // Midi
  
  let effectiveDate: Date;
  if (frenchTime.getTime() < changeTime.getTime()) {
    // Avant midi = jour précédent
    effectiveDate = new Date(frenchTime);
    effectiveDate.setDate(effectiveDate.getDate() - 1);
    effectiveDate.setHours(12, 0, 0, 0);
  } else {
    // Après midi = jour actuel
    effectiveDate = new Date(frenchTime);
    effectiveDate.setHours(12, 0, 0, 0);
  }
  
  const diffTime = effectiveDate.getTime() - GAME_START_DATE.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + 1; // Commence à 1
};

export const getCurrentDateString = (date: Date = new Date()): string => {
  // Utiliser la date effective pour la clé de base de données
  const frenchTime = new Date(date.toLocaleString("en-US", {timeZone: "Europe/Paris"}));
  const changeTime = new Date(frenchTime);
  changeTime.setHours(12, 0, 0, 0);
  
  let effectiveDate: Date;
  if (frenchTime.getTime() < changeTime.getTime()) {
    // Avant midi = utiliser la date du jour précédent
    effectiveDate = new Date(frenchTime);
    effectiveDate.setDate(effectiveDate.getDate() - 1);
  } else {
    // Après midi = utiliser la date du jour actuel
    effectiveDate = new Date(frenchTime);
  }
  
  return effectiveDate.toISOString().split('T')[0]; // Format YYYY-MM-DD
};

// Récupérer la carte du jour la plus récente pour un mode donné (sans création automatique)
export const getDailyCard = async (mode: GameMode): Promise<{ card: YugiohCard; stats: DailyCard } | null> => {
  try {
    // Chercher la carte la plus récente pour ce mode (au lieu d'une date précise)
    const { data: latestDaily, error: dailyError } = await supabase
      .from('daily_cards')
      .select('*')
      .eq('game_mode', mode)
      .order('date', { ascending: false })
      .limit(1)
      .single();

    if (dailyError) {
      if (dailyError.code === 'PGRST116') {
        // Aucune carte trouvée pour ce mode
        console.log(`No daily card found for ${mode} mode`);
        return null;
      }
      throw dailyError;
    }

    // Récupérer les détails de la carte
    const table = mode === 'monsters' ? 'monsters' : mode === 'spells' ? 'spells' : 'traps';
    const { data: cardData, error: cardError } = await supabase
      .from(table)
      .select('*')
      .eq('id', latestDaily.card_id)
      .single();

    if (cardError) throw cardError;

    console.log(`Found daily card for ${mode}: ${cardData.name_en} (date: ${latestDaily.date})`);

    return {
      card: cardData,
      stats: latestDaily
    };
  } catch (error) {
    console.error('Error getting daily card:', error);
    return null;
  }
};

// Mettre à jour les statistiques globales d'une carte quotidienne
export const updateDailyCardStats = async (
  mode: GameMode, 
  cardId: number, 
  isSuccess: boolean
): Promise<void> => {
  try {
    // Récupérer la carte la plus récente pour ce mode et cette carte
    const { data: currentDaily, error: getCurrentError } = await supabase
      .from('daily_cards')
      .select('success_count, total_attempts, date')
      .eq('game_mode', mode)
      .eq('card_id', cardId)
      .order('date', { ascending: false })
      .limit(1)
      .single();

    if (getCurrentError) throw getCurrentError;

    // Mettre à jour daily_cards (stats globales)
    const { error: dailyError } = await supabase
      .from('daily_cards')
      .update({
        total_attempts: currentDaily.total_attempts + 1,
        success_count: isSuccess 
          ? currentDaily.success_count + 1 
          : currentDaily.success_count
      })
      .eq('game_mode', mode)
      .eq('card_id', cardId)
      .eq('date', currentDaily.date);

    if (dailyError) throw dailyError;

    // Récupérer les stats actuelles pour card_history
    const { data: currentHistory, error: getHistoryError } = await supabase
      .from('card_history')
      .select('success_count, total_attempts')
      .eq('game_mode', mode)
      .eq('card_id', cardId)
      .eq('used_date', currentDaily.date)
      .single();

    if (getHistoryError) throw getHistoryError;

    // Mettre à jour card_history (stats globales)
    const { error: historyError } = await supabase
      .from('card_history')
      .update({
        total_attempts: currentHistory.total_attempts + 1,
        success_count: isSuccess 
          ? currentHistory.success_count + 1 
          : currentHistory.success_count
      })
      .eq('game_mode', mode)
      .eq('card_id', cardId)
      .eq('used_date', currentDaily.date);

    if (historyError) throw historyError;
  } catch (error) {
    console.error('Error updating daily card stats:', error);
    throw error;
  }
};

// Obtenir les statistiques globales pour un mode
export const getGameModeStats = async (mode: GameMode): Promise<{
  totalDaysPlayed: number;
  totalCards: number;
  averageSuccessRate: number;
}> => {
  try {
    const { data, error } = await supabase
      .from('card_history')
      .select('success_count, total_attempts')
      .eq('game_mode', mode);

    if (error) throw error;

    const totalDaysPlayed = data?.length || 0;
    const totalAttempts = data?.reduce((sum, item) => sum + item.total_attempts, 0) || 0;
    const totalSuccesses = data?.reduce((sum, item) => sum + item.success_count, 0) || 0;
    
    const averageSuccessRate = totalAttempts > 0 ? (totalSuccesses / totalAttempts) * 100 : 0;

    // Obtenir le nombre total de cartes disponibles
    const table = mode === 'monsters' ? 'monsters' : mode === 'spells' ? 'spells' : 'traps';
    const { count } = await supabase
      .from(table)
      .select('id', { count: 'exact', head: true });

    return {
      totalDaysPlayed,
      totalCards: count || 0,
      averageSuccessRate: Math.round(averageSuccessRate * 100) / 100
    };
  } catch (error) {
    console.error('Error getting game mode stats:', error);
    return {
      totalDaysPlayed: 0,
      totalCards: 0,
      averageSuccessRate: 0
    };
  }
};
