import React from 'react';

const RewardPanel = ({ gameState }) => {
  return (
    <div className="mt-10 p-8 bg-gradient-to-r from-yellow-500/10 to-transparent border border-yellow-500/30 rounded-[3rem] text-center">
      <h2 className="text-3xl font-black text-yellow-400 mb-2">ACHIEVEMENT UNLOCKED</h2>
      <p className="text-gray-400 mb-6">You've completed Level {gameState.currentLevel} with Pro Accuracy!</p>
      
      {gameState.currentLevel >= 50 && (
        <div className="p-10 border-4 border-double border-yellow-500 bg-black rounded-xl inline-block shadow-2xl">
          <h1 className="text-2xl font-serif">CERTIFICATE OF MASTERY</h1>
          <p className="mt-4 italic">This is to certify that the Player</p>
          <p className="text-3xl font-black uppercase text-cyan-400 mt-2">[PLAYER_NAME]</p>
          <p className="mt-4">has reached the Elite Speed level.</p>
          <div className="mt-8 flex justify-center gap-4">
            <button className="bg-yellow-500 text-black px-4 py-2 rounded font-bold text-xs">DOWNLOAD PDF</button>
            <button className="bg-white/10 px-4 py-2 rounded font-bold text-xs">SHARE ON DISCORD</button>
          </div>
        </div>
      )}
    </div>
  );
};