import React from 'react';

const SettingsPanel = ({ settings, setSettings }) => {
  const themes = [
    { id: 'neon', label: 'Neon Cyberpunk', color: '#00f5ff' },
    { id: 'matrix', label: 'Deep Matrix', color: '#00ff41' },
    { id: 'ghost', label: 'Ghost Suite', color: '#ffffff' }
  ];

  return (
    <div className="space-y-8">
      <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest">UI THEME DONGLE</h3>
      <div className="flex gap-4">
        {themes.map(t => (
          <button 
            key={t.id}
            onClick={() => setSettings({...settings, theme: t.id})}
            className={`flex-1 p-2 rounded-lg border ${settings.theme === t.id ? 'border-cyan-400 bg-cyan-400/10' : 'border-white/10'}`}
          >
            <div className="h-2 w-full rounded-full mb-2" style={{ backgroundColor: t.color }} />
            <span className="text-[10px]">{t.label}</span>
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <label className="text-xs text-gray-400">DIFFICULTY LEVEL</label>
        <select className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-sm">
          <option>Easy (Level 1-20)</option>
          <option>Medium (Level 21-50)</option>
          <option>Hard (Level 51-100) - CERTIFICATE ELIGIBLE</option>
        </select>
      </div>
    </div>
  );
};

export default SettingsPanel;