import React, { useState, useEffect } from 'react';

const TypingTest = ({ settings, gameState, setGameState, onBack }) => {
  const [input, setInput] = useState("");
  const targetText = "Success is not final, failure is not fatal: it is the courage to continue that counts.";

  useEffect(() => {
    let timer;
    if (gameState.isActive && gameState.timeLeft > 0) {
      timer = setInterval(() => {
        setGameState(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
      }, 1000);
    } else if (gameState.timeLeft === 0) {
      setGameState(prev => ({ ...prev, isActive: false }));
      alert("Time Up! Game Finished.");
    }
    return () => clearInterval(timer);
  }, [gameState.isActive, gameState.timeLeft]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-10 animate-fade-in">
      <div className="flex justify-between w-full max-w-4xl mb-10">
        <div className="glass p-4 rounded-xl border border-cyan-500/30">
          <p className="text-xs text-gray-400">LEVEL</p>
          <p className="text-2xl font-black text-cyan-400">{gameState.currentLevel}/100</p>
        </div>
        <div className="glass p-4 rounded-xl border border-yellow-500/30 text-center">
          <p className="text-xs text-gray-400">TIME LEFT</p>
          <p className="text-2xl font-black text-yellow-400">{gameState.timeLeft}s</p>
        </div>
        <button onClick={onBack} className="text-red-500 hover:underline">QUIT MISSION</button>
      </div>

      <div className="w-full max-w-4xl bg-black/40 p-12 rounded-[3rem] border border-white/5">
        <p className="text-2xl text-gray-500 leading-relaxed mb-8 select-none">
          {targetText.split('').map((char, index) => {
            let color = "text-gray-500";
            if (index < input.length) {
              color = input[index] === char ? "text-cyan-400" : "text-red-500 bg-red-500/20";
            }
            return <span key={index} className={`${color} transition-all`}>{char}</span>;
          })}
        </p>
        
        <input 
          autoFocus
          className="w-full bg-transparent border-b-2 border-white/10 py-4 text-3xl outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Start typing to focus..."
        />
      </div>
    </div>
  );
};

export default TypingTest;