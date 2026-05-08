import React, { useState, useEffect } from 'react';

// --- SYSTEM CORE SETTINGS ---
const ADMIN_USER = "Ayan_Boss";
const ADMIN_PASS = "AdminX_2026";

const generateTexts = (mode, level) => {
  const data = {
    English: {
      Easy: ["The cat sat on the mat.", "Speed is key.", "Practice typing daily.", "React is fun."],
      Medium: ["Consistency leads to mastery.", "Code is like humor; if you have to explain it, it's bad.", "User experience is everything."],
      Hard: ["Asynchronous functions simplify complex operations in software development.", "Encryption ensures data integrity across distributed networks."]
    }
  };
  const pool = data['English'][mode] || data['English']['Easy'];
  return pool[level % pool.length];
};

const App = () => {
  const [currentPage, setCurrentPage] = useState('auth'); 
  const [user, setUser] = useState(null); 
  const [settings, setSettings] = useState({ theme: 'dark', duration: 60, difficulty: 'Easy' });
  const [stats, setStats] = useState({ 
    level: 1, 
    maxUnlocked: 1, 
    totalPlayTime: 0, 
    history: [] 
  });

  useEffect(() => {
    const activeUser = localStorage.getItem('kf_active_user');
    if (activeUser) {
      const parsedUser = JSON.parse(activeUser);
      setUser(parsedUser);
      const allProgress = JSON.parse(localStorage.getItem('kf_user_progress') || "{}");
      if (allProgress[parsedUser.username]) setStats(allProgress[parsedUser.username]);
      setCurrentPage('home');
    }
  }, []);

  const saveProgress = (newStats) => {
    setStats(newStats);
    if (user) {
      const allProgress = JSON.parse(localStorage.getItem('kf_user_progress') || "{}");
      allProgress[user.username] = newStats;
      localStorage.setItem('kf_user_progress', JSON.stringify(allProgress));
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'auth': return <AuthPage setUser={setUser} setPage={setCurrentPage} setStats={setStats} />;
      case 'home': return <HomePage user={user} setUser={setUser} setPage={setCurrentPage} settings={settings} setSettings={setSettings} stats={stats} />;
      case 'test': return <TestPage setPage={setCurrentPage} settings={settings} stats={stats} setStats={saveProgress} />;
      case 'levels': return <LevelsPage setPage={setCurrentPage} stats={stats} setStats={saveProgress} />;
      case 'guide': return <GuidePage setPage={setCurrentPage} />;
      case 'reviews': return <GenuineReviewPage user={user} setPage={setCurrentPage} />;
      case 'certificate': return <CertificatePage setPage={setCurrentPage} stats={stats} user={user} />;
      case 'analytics': return <AnalyticsPage setPage={setCurrentPage} stats={stats} />;
      case 'leaderboard': return <LeaderboardPage setPage={setCurrentPage} />;
      default: return <AuthPage setUser={setUser} setPage={setCurrentPage} />;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col transition-all duration-500 ${settings.theme === 'dark' ? 'bg-[#050505] text-white' : 'bg-[#f0f2f5] text-gray-900'} font-sans`}>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #06b6d4; border-radius: 10px; }
      `}</style>
      <div className="flex-grow">{renderPage()}</div>
      <footer className="w-full py-8 flex flex-col items-center opacity-40">
        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/5 rounded-full backdrop-blur-md">
          <span className="text-[10px] font-bold tracking-widest uppercase text-cyan-500">KeyFlow Pro // A-X Systems</span>
        </div>
        <p className="text-[9px] mt-2 font-black uppercase tracking-widest text-gray-500">Built by Ayan X</p>
      </footer>
    </div>
  );
};

// --- UPGRADED HOME PAGE (FIXED OVERLAP) ---
const HomePage = ({ user, setUser, setPage, settings, setSettings, stats }) => {
  const formatTime = (s) => s >= 60 ? `${s/60}m` : `${s}s`;

  return (
    <div className="p-4 md:p-8 flex flex-col items-center min-h-screen relative overflow-x-hidden pt-24 md:pt-10">
      
      {/* --- RE-STRUCTURED HEADER (NO MORE OVERLAP) --- */}
      <div className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-center gap-4 mb-12 px-4">
        {/* Left Side: Navigation */}
        <div className="flex flex-wrap justify-center gap-2 order-2 md:order-1">
          <button onClick={() => {localStorage.removeItem('kf_active_user'); setUser(null); setPage('auth');}} 
            className="text-[9px] font-black text-red-500 border border-red-500/20 px-4 py-2 rounded-full uppercase hover:bg-red-500/10 transition-all backdrop-blur-sm">Logout</button>
          <button onClick={() => setPage('guide')} 
            className="text-[9px] font-black text-cyan-500 border border-cyan-500/20 px-4 py-2 rounded-full uppercase italic hover:bg-cyan-500/10 transition-all backdrop-blur-sm">How it works</button>
          <button onClick={() => setPage('analytics')} 
            className="text-[9px] font-black text-green-500 border border-green-500/20 px-4 py-2 rounded-full uppercase hover:bg-green-500/10 transition-all backdrop-blur-sm">Analytics</button>
        </div>

        {/* Right Side: Theme Toggle */}
        <div className="order-1 md:order-2 flex items-center gap-3">
          <div className={`w-12 h-6 rounded-full p-1 transition-all duration-300 flex items-center cursor-pointer ${settings.theme === 'dark' ? 'bg-cyan-900 justify-end' : 'bg-gray-300 justify-start'}`} 
            onClick={() => setSettings({...settings, theme: settings.theme === 'dark' ? 'light' : 'dark'})}>
            <div className={`w-4 h-4 rounded-full shadow-md transform transition-all duration-300 ${settings.theme === 'dark' ? 'bg-cyan-400' : 'bg-white'}`} />
          </div>
        </div>
      </div>

      {/* --- HERO SECTION --- */}
      <div className="text-center mb-10">
        <h1 className="text-5xl md:text-9xl font-black text-cyan-500 tracking-tighter italic uppercase drop-shadow-[0_0_25px_rgba(6,182,212,0.3)] animate-pulse">KEY-FLOW</h1>
        <div className="flex flex-col items-center justify-center gap-1 mt-4">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.5em]">Node Identity: {user?.username}</span>
          {user?.isAdmin && <span className="bg-red-500/20 text-red-500 border border-red-500/30 text-[8px] px-3 py-1 rounded-full font-black tracking-widest mt-2">SYSTEM ARCHITECT</span>}
        </div>
      </div>

      {/* --- MENU GRID --- */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-6 w-full max-w-6xl px-2">
        <MenuCard label="Engage" icon="⚡" onClick={() => setPage('test')} color="from-cyan-500 to-blue-600" />
        <MenuCard label="Levels" icon="🗺️" onClick={() => setPage('levels')} color="from-purple-500 to-indigo-600" />
        <MenuCard label="Rankings" icon="📊" onClick={() => setPage('leaderboard')} color="from-green-500 to-teal-600" />
        <MenuCard label="Reviews" icon="⭐" onClick={() => setPage('reviews')} color="from-pink-500 to-rose-600" />
        <MenuCard label="Awards" icon="📜" onClick={() => setPage('certificate')} color="from-amber-500 to-orange-600" />
      </div>

      {/* --- BOTTOM CONTROLS --- */}
      <div className="mt-12 w-full max-w-md bg-white/[0.03] border border-white/10 p-6 rounded-[2.5rem] backdrop-blur-xl mx-4">
        <div className="flex gap-2 mb-6">
          {['Easy', 'Medium', 'Hard'].map(m => (
            <button key={m} onClick={() => setSettings({...settings, difficulty: m})} 
              className={`flex-1 py-3 rounded-2xl font-black text-[9px] uppercase tracking-widest transition-all ${settings.difficulty === m ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/40' : 'bg-white/5 text-gray-500'}`}>{m}</button>
          ))}
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between text-[9px] font-black uppercase opacity-60 px-2 tracking-tighter">
            <span>Session Window</span>
            <span className="text-cyan-400 font-mono text-xs">{formatTime(settings.duration)}</span>
          </div>
          <input type="range" min="15" max="300" step="15" value={settings.duration} 
            onChange={(e) => setSettings({...settings, duration: Number(e.target.value)})} 
            className="w-full accent-cyan-500 cursor-pointer h-1.5 bg-white/10 rounded-full appearance-none" />
        </div>
      </div>
    </div>
  );
};

// --- AUTH PAGE ---
const AuthPage = ({ setUser, setPage, setStats }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ username: '', password: '' });

  const handleAuth = () => {
    if (form.username === ADMIN_USER && form.password === ADMIN_PASS) {
      const adminObj = { username: ADMIN_USER, isAdmin: true };
      localStorage.setItem('kf_active_user', JSON.stringify(adminObj));
      setUser(adminObj);
      setPage('home');
      return;
    }
    const users = JSON.parse(localStorage.getItem('kf_users_list') || "[]");
    if (isLogin) {
      const found = users.find(u => u.username === form.username && u.password === form.password);
      if (found) {
        localStorage.setItem('kf_active_user', JSON.stringify(found));
        setUser(found); 
        const allProgress = JSON.parse(localStorage.getItem('kf_user_progress') || "{}");
        if (allProgress[found.username]) setStats(allProgress[found.username]);
        setPage('home');
      } else { alert("Access Denied: Invalid Credentials."); }
    } else {
      if (form.username.length >= 3 && form.password.length >= 4) {
        if (users.find(u => u.username === form.username) || form.username === ADMIN_USER) return alert("Identity already exists.");
        users.push(form);
        localStorage.setItem('kf_users_list', JSON.stringify(users));
        alert(`Account Created for ${form.username}! Now Log in.`);
        setIsLogin(true);
      } else { alert("Min requirements: User(3), Pass(4)"); }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="w-full max-w-md bg-white/5 border border-white/10 p-10 rounded-[2.5rem] backdrop-blur-xl shadow-2xl">
        <h2 className="text-3xl font-black text-cyan-500 mb-8 uppercase italic tracking-tighter text-center">{isLogin ? 'Secure Portal' : 'New Identity'}</h2>
        <div className="space-y-6 mb-8">
          <div>
            <input className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-cyan-500 text-sm" placeholder="Username" value={form.username} onChange={(e)=>setForm({...form, username: e.target.value})} />
            <p className="text-[9px] text-gray-500 font-bold uppercase mt-2 ml-2 tracking-widest">Example: Ayan_X_2026</p>
          </div>
          <div className="relative">
            <input className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-cyan-500 text-sm" type={showPassword ? "text" : "password"} placeholder="Password" value={form.password} onChange={(e)=>setForm({...form, password: e.target.value})} />
            <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-4 opacity-40">{showPassword ? '🔒' : '👁️'}</button>
            <p className="text-[9px] text-gray-500 font-bold uppercase mt-2 ml-2 tracking-widest">Secure Alpha-Numeric Sequence</p>
          </div>
        </div>
        <button onClick={handleAuth} className="w-full bg-cyan-600 py-4 rounded-xl font-black uppercase text-xs tracking-widest shadow-lg shadow-cyan-500/20 transition-transform active:scale-95"> {isLogin ? 'Initialize' : 'Register'} </button>
        <p className="mt-6 text-center text-[10px] text-gray-500 font-bold uppercase cursor-pointer hover:text-cyan-400" onClick={() => setIsLogin(!isLogin)}> {isLogin ? "Create new sector" : "Return to portal"} </p>
      </div>
    </div>
  );
};

// --- LEADERBOARD PAGE ---
const LeaderboardPage = ({ setPage }) => {
    const [players, setPlayers] = useState([]);

    useEffect(() => {
      const allProgress = JSON.parse(localStorage.getItem('kf_user_progress') || "{}");
      const list = Object.keys(allProgress).map(name => ({
        name,
        level: allProgress[name].maxUnlocked,
        time: allProgress[name].totalPlayTime,
        lastActive: allProgress[name].history.length > 0 ? allProgress[name].history[allProgress[name].history.length-1].date : "Never"
      })).sort((a, b) => b.level - a.level || a.time - b.time);
      setPlayers(list);
    }, []);

    return (
      <div className="p-6 md:p-20 max-w-5xl mx-auto min-h-screen">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-white/10 pb-6 gap-4">
            <div>
                <button onClick={() => setPage('home')} className="mb-4 text-green-500 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:translate-x-[-5px] transition-transform">← Return to Base</button>
                <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter">Global Rankings</h2>
            </div>
            <div className="text-left md:text-right">
                <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Active Nodes</p>
                <p className="text-3xl font-black text-cyan-500 font-mono">{players.length}</p>
            </div>
        </div>

        <div className="space-y-4">
          {players.map((p, i) => (
            <div key={i} className={`flex flex-col md:flex-row justify-between items-center p-6 rounded-[2.5rem] border transition-all hover:scale-[1.01] ${i === 0 ? 'bg-cyan-500/10 border-cyan-500/50' : 'bg-white/5 border-white/10'}`}>
              <div className="flex items-center gap-6 mb-4 md:mb-0 w-full md:w-auto">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm ${i === 0 ? 'bg-cyan-500 text-black' : 'bg-white/10 text-gray-500'}`}>{i + 1}</div>
                <div>
                    <span className={`font-black uppercase tracking-widest block text-md ${i === 0 ? 'text-cyan-400' : 'text-white'}`}>{p.name} {i === 0 && '👑'}</span>
                    <span className="text-[8px] text-gray-600 font-bold uppercase">Sync: {p.lastActive}</span>
                </div>
              </div>
              <div className="flex gap-10 text-center md:text-right w-full md:w-auto justify-between md:justify-end">
                <div>
                    <p className="text-[8px] text-gray-500 font-black uppercase mb-1">Sector</p>
                    <p className="text-lg font-black font-mono text-purple-400">{p.level}</p>
                </div>
                <div>
                    <p className="text-[8px] text-gray-500 font-black uppercase mb-1">Uptime</p>
                    <p className="text-lg font-black font-mono text-green-400">{Math.floor(p.time/60)}m</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
};

// --- ANALYTICS PAGE ---
const AnalyticsPage = ({ setPage, stats }) => {
  const avgTime = stats.history.length > 0 
    ? (stats.history.reduce((acc, curr) => acc + curr.timeTaken, 0) / stats.history.length).toFixed(1)
    : 0;

  return (
    <div className="p-6 md:p-20 max-w-6xl mx-auto min-h-screen">
      <button onClick={() => setPage('home')} className="mb-10 text-green-500 font-black text-[10px] uppercase tracking-widest">← Back to System</button>
      <h2 className="text-4xl font-black mb-10 italic uppercase tracking-tighter border-b border-white/10 pb-6">User Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
          <p className="text-[9px] font-black uppercase text-gray-500 mb-2">Total Node Uptime</p>
          <h3 className="text-2xl font-black text-green-400 font-mono">{(stats.totalPlayTime / 60).toFixed(1)}m</h3>
        </div>
        <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
          <p className="text-[9px] font-black uppercase text-gray-500 mb-2">Avg. Speed</p>
          <h3 className="text-2xl font-black text-cyan-400 font-mono">{avgTime}s</h3>
        </div>
        <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
          <p className="text-[9px] font-black uppercase text-gray-500 mb-2">Max Sector</p>
          <h3 className="text-2xl font-black text-purple-400 font-mono">{stats.maxUnlocked}</h3>
        </div>
      </div>
      <div className="w-full bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
        <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="text-[8px] uppercase text-gray-600 bg-black/40">
              <tr>
                <th className="p-4">Sector</th>
                <th className="p-4">Time</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>
            <tbody className="text-[10px] font-mono">
              {stats.history.slice().reverse().map((h, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 text-cyan-500">#{h.level}</td>
                  <td className="p-4 text-green-400">{h.timeTaken}s</td>
                  <td className="p-4 text-gray-600">{h.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --- GUIDE PAGE ---
const GuidePage = ({ setPage }) => (
  <div className="p-6 md:p-20 max-w-5xl mx-auto min-h-screen">
    <button onClick={() => setPage('home')} className="mb-10 text-cyan-500 font-black text-[10px] uppercase tracking-widest">← Return to Dashboard</button>
    <h2 className="text-4xl font-black mb-10 italic uppercase tracking-tighter border-b border-white/10 pb-6">A-X Protocol Guide</h2>
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <section className="bg-white/5 p-6 rounded-3xl border border-white/5">
          <h3 className="text-cyan-400 font-black uppercase text-xs mb-2">🚀 Dynamic Progression</h3>
          <p className="text-gray-400 text-[11px] leading-relaxed">Master sectors by typing with 100% precision. Complexity scales with your level.</p>
        </section>
        <section className="bg-white/5 p-6 rounded-3xl border border-white/5">
          <h3 className="text-purple-400 font-black uppercase text-xs mb-2">💾 Neural Storage</h3>
          <p className="text-gray-400 text-[11px] leading-relaxed">Progress is stored locally. Identities have dedicated dashboards and maps.</p>
        </section>
      </div>
      <div className="space-y-6">
        <section className="bg-white/5 p-6 rounded-3xl border border-white/5">
          <h3 className="text-amber-400 font-black uppercase text-xs mb-2">🏆 Merit Awards</h3>
          <p className="text-gray-400 text-[11px] leading-relaxed">Sector 50 unlocks the Master Certificate, verified by Ayan X Architects.</p>
        </section>
        <section className="bg-white/5 p-6 rounded-3xl border border-white/5">
          <h3 className="text-pink-400 font-black uppercase text-xs mb-2">💬 Feedback Loop</h3>
          <p className="text-gray-400 text-[11px] leading-relaxed">Share experiences in the Review Hub. Admin nodes have full moderation authority.</p>
        </section>
      </div>
    </div>
  </div>
);

// --- REVIEWS PAGE ---
const GenuineReviewPage = ({ setPage, user }) => {
    const [reviews, setReviews] = useState(() => JSON.parse(localStorage.getItem('user_reviews') || "[]"));
    const [text, setText] = useState("");

    const getTimeAgo = (timestamp) => {
      const seconds = Math.floor((Date.now() - timestamp) / 1000);
      if (seconds < 60) return "Just now";
      if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
      return `${Math.floor(seconds / 3600)}h ago`;
    };

    const post = () => { 
      if (text.trim()) { 
        const updated = [{ id: Date.now(), user: user?.username || "Guest", msg: text, timestamp: Date.now() }, ...reviews];
        setReviews(updated); localStorage.setItem('user_reviews', JSON.stringify(updated)); setText(""); 
      }
    };

    const deleteReview = (id) => {
      const updated = reviews.filter(r => r.id !== id);
      setReviews(updated); localStorage.setItem('user_reviews', JSON.stringify(updated));
    };

    return (
      <div className="p-6 md:p-12 max-w-4xl mx-auto min-h-screen">
        <button onClick={() => setPage('home')} className="mb-8 text-pink-500 font-black text-[10px] uppercase tracking-widest">← Dashboard</button>
        <h2 className="text-3xl font-black mb-8 uppercase italic tracking-tighter">Node Reviews</h2>
        <div className="flex gap-2 mb-10">
          <input className="flex-1 bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-pink-500 text-[11px]" value={text} onChange={(e)=>setText(e.target.value)} placeholder="Submit node feedback..." />
          <button onClick={post} className="bg-pink-600 px-6 rounded-2xl font-black uppercase text-[9px] shadow-lg shadow-pink-500/20">Post</button>
        </div>
        <div className="space-y-4">
          {reviews.map((r) => (
          <div key={r.id} className="p-5 bg-white/5 rounded-3xl border border-white/5">
            <div className="flex justify-between items-start mb-2">
              <span className={`font-black text-[10px] ${r.user === ADMIN_USER ? 'text-cyan-400' : 'text-pink-400'}`}>@{r.user}</span>
              <div className="flex items-center gap-4">
                <span className="text-[8px] font-bold text-gray-600 uppercase tracking-tighter">{getTimeAgo(r.timestamp)}</span>
                {user?.isAdmin && <button onClick={() => deleteReview(r.id)} className="text-[8px] text-red-500 font-black uppercase px-2 py-1 bg-red-500/10 rounded">Purge</button>}
              </div>
            </div>
            <p className="text-gray-300 text-[12px] leading-relaxed italic">"{r.msg}"</p>
          </div>
        ))}</div>
      </div>
    );
};

// --- TEST PAGE ---
const TestPage = ({ setPage, settings, stats, setStats }) => {
  const [input, setInput] = useState("");
  const [startTime] = useState(Date.now());
  const [timeLeft, setTimeLeft] = useState(settings.duration);
  const targetText = generateTexts(settings.difficulty, stats.level);

  useEffect(() => {
    if (timeLeft > 0) { const timer = setInterval(() => setTimeLeft(t => t - 1), 1000); return () => clearInterval(timer); }
    else { setPage('home'); }
  }, [timeLeft]);

  const nextLevel = () => {
    if (input === targetText) {
      const timeTaken = Math.floor((Date.now() - startTime) / 1000);
      const newEntry = { level: stats.level, timeTaken: timeTaken, mode: settings.difficulty, date: new Date().toLocaleDateString() };
      setStats({ 
        ...stats, 
        level: stats.level + 1, 
        maxUnlocked: Math.max(stats.maxUnlocked, stats.level + 1),
        totalPlayTime: stats.totalPlayTime + timeTaken,
        history: [...stats.history, newEntry]
      });
      setInput(""); setPage('home'); alert(`Sector ${stats.level} Secured!`);
    }
  };

  return (
    <div className="p-6 flex flex-col items-center">
      <div className="w-full max-w-5xl flex justify-between items-center mb-6 mt-10">
        <button onClick={() => setPage('home')} className="px-4 py-2 bg-white/5 rounded-full text-[8px] font-black uppercase">Abort</button>
        <div className="text-3xl font-mono font-black text-cyan-400">{timeLeft}s</div>
        <div className="text-right font-black uppercase text-[8px] opacity-40">Sector {stats.level}</div>
      </div>
      <div className="w-full max-w-5xl bg-white/[0.02] border border-white/5 p-8 md:p-12 rounded-[2.5rem] shadow-2xl">
        <div className="text-xl md:text-3xl font-mono leading-relaxed mb-8 text-gray-700 select-none">
          {targetText.split('').map((char, i) => (
            <span key={i} className={i < input.length ? (input[i] === char ? "text-green-400 shadow-green-500" : "text-red-500 bg-red-500/10") : ""}>{char}</span>
          ))}
        </div>
        <textarea autoFocus className="w-full bg-transparent border-t border-white/10 pt-8 text-xl md:text-3xl outline-none resize-none h-40 font-mono text-white placeholder-gray-800" placeholder="Synchronize..." value={input} onChange={(e) => setInput(e.target.value)} />
        <div className="flex justify-end mt-4">
          <button onClick={nextLevel} className={`px-10 py-4 rounded-2xl font-black text-[10px] tracking-widest transition-all ${input === targetText ? 'bg-green-500 text-black shadow-lg shadow-green-500/40' : 'bg-white/5 text-gray-800 cursor-not-allowed'}`}>PROCEED</button>
        </div>
      </div>
    </div>
  );
};

// --- CERTIFICATE PAGE ---
const CertificatePage = ({ setPage, stats, user }) => {
    const milestone = Math.floor(stats.maxUnlocked / 50) * 50;
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const certID = `AX-${user?.username?.toUpperCase().slice(0,3)}-${Date.now().toString().slice(-6)}`;

    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-screen text-center bg-black">
        <button onClick={() => setPage('home')} className="mb-10 text-amber-500 font-black uppercase text-[9px] tracking-widest">← Exit Archives</button>
        {stats.maxUnlocked < 50 ? (
          <div className="p-10 border border-white/5 rounded-[2.5rem]">
            <p className="text-gray-600 italic text-[10px] uppercase font-black">Level 50 Required</p>
            <p className="text-gray-800 text-[10px] mt-2 font-mono">{stats.maxUnlocked}/50</p>
          </div>
        ) : (
          <div className="p-8 border-[10px] border-double border-amber-600/50 bg-[#050505] max-w-lg relative overflow-hidden">
            <div className="absolute top-4 right-6 text-[6px] font-mono text-amber-700/60">NODE ID: {certID}</div>
            <h1 className="text-xl text-amber-600 mb-2 uppercase tracking-widest font-black italic">Master of Precision</h1>
            <p className="text-gray-500 text-[8px] uppercase tracking-[0.3em] mb-8">A-X Protocol Verification</p>
            <h2 className="text-4xl font-black text-white uppercase mb-4">{user?.username}</h2>
            <p className="text-gray-400 text-[10px] italic leading-relaxed">Secured Sector {milestone}</p>
            <div className="mt-12 flex justify-between items-end border-t border-white/10 pt-4">
              <div className="text-left">
                <p className="text-white font-mono text-[8px]">{date}</p>
                <p className="text-[6px] text-gray-600 uppercase font-black">Verified</p>
              </div>
              <div className="text-right">
                <p className="text-amber-500 font-serif italic text-xl">Ayan X</p>
                <p className="text-[6px] text-gray-600 uppercase font-black">Lead Architect</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
};

// --- LEVELS PAGE ---
const LevelsPage = ({ setPage, stats, setStats }) => (
  <div className="p-6 md:p-12 max-w-6xl mx-auto min-h-screen">
    <button onClick={() => setPage('home')} className="mb-10 text-purple-500 font-black uppercase text-[9px] tracking-widest">← System Map</button>
    <h2 className="text-3xl font-black mb-8 italic uppercase tracking-tighter">Sector Navigation</h2>
    <div className="grid grid-cols-4 sm:grid-cols-8 md:grid-cols-12 gap-2 h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
      {[...Array(1000)].map((_, i) => (
        <button key={i} disabled={i + 1 > stats.maxUnlocked} onClick={() => { setStats({...stats, level: i + 1}); setPage('test'); }}
          className={`h-12 rounded-xl font-black text-[9px] border transition-all ${i + 1 <= stats.maxUnlocked ? 'border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-black' : 'border-white/5 text-gray-800 opacity-20'}`}>{i + 1}</button>
      ))}
    </div>
  </div>
);

// --- MENU CARD ---
const MenuCard = ({ label, icon, onClick, color }) => (
  <button onClick={onClick} className={`bg-gradient-to-br ${color} p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] border border-white/10 flex flex-col items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-xl group aspect-square`}>
    <span className="text-3xl md:text-5xl mb-2 md:mb-4 group-hover:scale-110 transition-transform">{icon}</span>
    <span className="font-black text-[8px] md:text-[10px] tracking-[0.1em] uppercase text-white">{label}</span>
  </button>
);

export default App;