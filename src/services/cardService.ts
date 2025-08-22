import { supabase } from '../supabaseClient';
import type { YugiohCard, GameMode } from '../types/game';
import { getDailyCard } from './dailyCardService';

export const searchCards = async (query: string, mode: GameMode): Promise<YugiohCard[]> => {
  if (!query || query.length < 2) return [];

  try {
    const table = mode === 'monsters' ? 'monsters' : mode === 'spells' ? 'spells' : 'traps';
    
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .or(`name_en.ilike.%${query}%,name_fr.ilike.%${query}%`)
      .limit(10);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error searching cards:', error);
    return [];
  }
};

export const getRandomCard = async (mode: GameMode): Promise<YugiohCard | null> => {
  try {
    const table = mode === 'monsters' ? 'monsters' : mode === 'spells' ? 'spells' : 'traps';
    
    // Get total count
    const { count } = await supabase
      .from(table)
      .select('id', { count: 'exact', head: true });

    if (!count) throw new Error('No cards found');

    const randomIndex = Math.floor(Math.random() * count);

    const { data, error } = await supabase
      .from(table)
      .select('*')
      .range(randomIndex, randomIndex)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting random card:', error);
    return null;
  }
};

// Nouvelle fonction pour récupérer la carte du jour
export const getTodaysCard = async (mode: GameMode): Promise<YugiohCard | null> => {
  try {
    const dailyCardResult = await getDailyCard(mode);
    return dailyCardResult ? dailyCardResult.card : null;
  } catch (error) {
    console.error('Error getting today\'s card:', error);
    return null;
  }
};
