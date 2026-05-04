import React, { createContext, useContext, ReactNode, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLocalStorage } from '../hooks/useLocalStorage';

export type Player = {
  id: string;
  name: string;
  score: number;
  isActive: boolean;
};

export type GameDifficulty = 'easy' | 'medium' | 'hard' | 'any';
export type GameMode = 'Classic' | 'Reveal All' | 'Pass the Mic' | 'Speed Round';

export interface TriviaCategory {
  id: number;
  name: string;
}

interface GameSettings {
  playerLimit: number;
  pointLimit: number;
  difficulty: GameDifficulty;
  mode: GameMode;
  categoryId: number | null;
  familyMode: boolean;
  drinkingMode: boolean;
}

interface GameContextType {
  players: Player[];
  setPlayers: (players: Player[]) => void;
  settings: GameSettings;
  setSettings: (settings: GameSettings) => void;
  gameStarted: boolean;
  setGameStarted: (started: boolean) => void;
  resetGame: () => void;
}

const defaultSettings: GameSettings = {
  playerLimit: 2,
  pointLimit: 10,
  difficulty: 'any',
  mode: 'Classic',
  categoryId: null,
  familyMode: false,
  drinkingMode: false,
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [players, setPlayers] = useLocalStorage<Player[]>('trivia_players', []);
  const [settings, setSettings] = useLocalStorage<GameSettings>('trivia_settings', defaultSettings);
  const [gameStarted, setGameStarted] = useLocalStorage<boolean>('trivia_game_started', false);

  const resetGame = () => {
    setPlayers([]);
    setSettings(defaultSettings);
    setGameStarted(false);
    localStorage.removeItem('trivia_players');
    localStorage.removeItem('trivia_settings');
    localStorage.removeItem('trivia_game_started');
  };

  return (
    <GameContext.Provider value={{
      players,
      setPlayers,
      settings,
      setSettings,
      gameStarted,
      setGameStarted,
      resetGame
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
