// Service pour gérer les sessions utilisateur locales (localStorage)
// Cela évite qu'une même personne joue plusieurs fois par jour sur le même appareil

interface UserSession {
  id: string;
  playedToday: {
    [mode: string]: {
      date: string;
      cardId: number; // Ajouter l'ID de la carte pour détecter les changements
      completed: boolean;
      won: boolean;
      attempts: number;
    };
  };
}

const USER_SESSION_KEY = 'ygodle_user_session';

// Générer un ID unique pour cet appareil/navigateur
const generateUserId = (): string => {
  return 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
};

// Récupérer ou créer une session utilisateur
export const getUserSession = (): UserSession => {
  const stored = localStorage.getItem(USER_SESSION_KEY);
  
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      console.warn('Invalid session data, creating new session');
    }
  }
  
  // Créer une nouvelle session
  const newSession: UserSession = {
    id: generateUserId(),
    playedToday: {}
  };
  
  localStorage.setItem(USER_SESSION_KEY, JSON.stringify(newSession));
  return newSession;
};

// Sauvegarder la session
const saveSession = (session: UserSession): void => {
  localStorage.setItem(USER_SESSION_KEY, JSON.stringify(session));
};

// Vérifier si l'utilisateur a déjà joué aujourd'hui pour ce mode et cette carte
export const hasPlayedToday = (mode: string, cardId: number, cardDate: string): boolean => {
  const session = getUserSession();
  
  const playedData = session.playedToday[mode];
  return playedData && 
         playedData.date === cardDate && 
         playedData.cardId === cardId && 
         playedData.completed;
};

// Obtenir les stats de jeu d'aujourd'hui pour l'utilisateur local
export const getTodayUserStats = (mode: string, cardId: number, cardDate: string) => {
  const session = getUserSession();
  
  const playedData = session.playedToday[mode];
  if (playedData && playedData.date === cardDate && playedData.cardId === cardId) {
    return playedData;
  }
  
  return null;
};

// Marquer qu'un utilisateur a commencé à jouer aujourd'hui
export const markGameStarted = (mode: string, cardId: number, cardDate: string): void => {
  const session = getUserSession();
  
  // Vérifier si c'est une nouvelle carte (même jour mais carte différente)
  const existingData = session.playedToday[mode];
  if (!existingData || 
      existingData.date !== cardDate || 
      existingData.cardId !== cardId) {
    session.playedToday[mode] = {
      date: cardDate,
      cardId: cardId,
      completed: false,
      won: false,
      attempts: 0
    };
    saveSession(session);
  }
};

// Marquer qu'un utilisateur a terminé le jeu d'aujourd'hui
export const markGameCompleted = (mode: string, cardId: number, cardDate: string, won: boolean, attempts: number): void => {
  const session = getUserSession();
  
  session.playedToday[mode] = {
    date: cardDate,
    cardId: cardId,
    completed: true,
    won,
    attempts
  };
  
  saveSession(session);
};

// Enregistrer une tentative
export const recordAttempt = (mode: string, cardId: number, cardDate: string): void => {
  const session = getUserSession();
  
  if (session.playedToday[mode] && 
      session.playedToday[mode].date === cardDate && 
      session.playedToday[mode].cardId === cardId) {
    session.playedToday[mode].attempts++;
    saveSession(session);
  }
};

// Nettoyer les anciennes données (garder seulement les 7 derniers jours)
export const cleanupOldSessionData = (): void => {
  const session = getUserSession();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const cutoffDate = sevenDaysAgo.toISOString().split('T')[0];
  
  Object.keys(session.playedToday).forEach(mode => {
    if (session.playedToday[mode].date < cutoffDate) {
      delete session.playedToday[mode];
    }
  });
  
  saveSession(session);
};
