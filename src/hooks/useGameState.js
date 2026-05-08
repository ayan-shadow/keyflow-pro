import { useState, useEffect } from 'react';

export const useGameState = () => {
  const [view, setView] = useState('home'); // 'home' or 'test'
  const [settings, setSettings] = useState({
    theme: 'neon',
    difficulty: 'medium',
    duration: 60, // Default timer
    mode: 'level' // 'level' or 'manual'
  });

  const [gameState, setGameState] = useState({
    isActive: false,
    timeLeft: 60,
    currentLevel: 1,
    wpm: 0,
    accuracy: 100,
    history: {
      totalGames: 0,
      certificatesEarned: 0,
      maxLevelReached: 1
    }
  });

  return { view, setView, gameState, setGameState, settings, setSettings };
};