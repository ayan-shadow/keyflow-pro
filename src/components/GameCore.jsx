import React, { useState, useEffect } from 'react';

const GameCore = ({ gameState, setGameState, settings }) => {
  const [input, setInput] = useState("");
  const targetText = "The path to mastery requires consistent practice and focus.";

  useEffect(() => {
    let timer;
    if (gameState.isActive && gameState.timeLeft > 0) {
      timer = setInterval(() => {
        setGameState(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
      }, 1000);
    } else if (gameState.timeLeft === 0) {
      setGameState(prev => ({ ...prev, isActive: false, isLevelComplete: true }));
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [gameState.isActive, gameState.timeLeft]);

  const handleStart = () => {
    setGameState(prev => ({ ...prev, isActive: true, timeLeft: settings.duration }));
    setInput("");
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-10">
      {!gameState.isActive && !gameState.isLevelComplete ? (
        <button 
          onClick={handleStart}
          className="bg-cyan-500 text-black font-black px-12 py-4 rounded-full text-2xl hover:shadow-[0_0_30px_#00f5ff] transition-all"
        >
          START MISSION
        </button>
      ) : (
        <div className="w-full text-center">
          <div className="text-4xl font-bold mb-4 text-yellow-400">Time: {gameState.timeLeft}s</div>
          <p className="text-2xl opacity-30 mb-6">{targetText}</p>
          <input 
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="bg-transparent border-b-4 border-cyan-500 text-3xl outline-none text-center w-full"
            placeholder="Type here..."
          />
        </div>
      )}
    </div>
  );
};

export default GameCore;