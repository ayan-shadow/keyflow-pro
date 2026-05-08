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
      <div className="flex-grow">{renderPage()}</div>
      <footer className="w-full py-6 flex flex-col items-center opacity-40">
        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/5 rounded-full backdrop-blur-md">
          <span className="text-[10px] font-bold tracking-widest uppercase text-cyan-500">KeyFlow Pro // A-X Systems</span>
        </div>
        <p className="text-[9px] mt-2 font-black uppercase tracking-widest text-gray-500">Built by Ayan X</p>
      </footer>
    </div>
  );
};

// --- UPGRADED AUTH PAGE WITH EXAMPLES ---
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
        <h2 className="text-3xl font-black text-cyan-500 mb-2 uppercase italic tracking-tighter">{isLogin ? 'Secure Portal' : 'New Identity'}</h2>
        
        {/* Example Hint Section */}
        <div className="mb-6 p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl">
            <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest mb-1">Example Node Access:</p>
            <p className="text-[9px] text-gray-400 font-mono">User: <span className="text-white">Alex_X</span> | Pass: <span className="text-white">Alex2026</span></p>
        </div>

        <div className="space-y-4 mb-8">
          <input className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-cyan-500 text-sm" placeholder="Username" value={form.username} onChange={(e)=>setForm({...form, username: e.target.value})} />
          <div className="relative">
            <input className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-cyan-500 text-sm" type={showPassword ? "text" : "password"} placeholder="Password" value={form.password} onChange={(e)=>setForm({...form, password: e.target.value})} />
            <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-4 opacity-40">{showPassword ? '🔒' : '👁️'}</button>
          </div>
        </div>
        <button onClick={handleAuth} className="w-full bg-cyan-600 py-4 rounded-xl font-black uppercase text-xs tracking-widest shadow-lg shadow-cyan-500/20 transition-transform active:scale-95"> {isLogin ? 'Initialize' : 'Register'} </button>
        <p className="mt-6 text-center text-[10px] text-gray-500 font-bold uppercase cursor-pointer hover:text-cyan-400" onClick={() => setIsLogin(!isLogin)}> {isLogin ? "Create new sector" : "Return to portal"} </p>
      </div>
    </div>
  );
};

// --- HOME PAGE ---
const HomePage = ({ user, setUser, setPage, settings, setSettings, stats }) => {
  const formatTime = (s) => s >= 60 ? `${s/60}m` : `${s}s`;

  return (
    <div className="p-4 md:p-8 flex flex-col items-center justify-center min-h-screen relative overflow-hidden">
      <div className="absolute top-5 left-5 flex gap-2 z-10">
        <button onClick={() => {localStorage.removeItem('kf_active_user'); setUser(null); setPage('auth');}} className="text-[10px] font-bold text-red-500 border border-red-500/20 px-4 py-2 rounded-full uppercase hover:bg-red-500/10 transition-all">Logout</button>
        <button onClick={() => setPage('guide')} className="text-[10px] font-bold text-cyan-500 border border-cyan-500/20 px-4 py-2 rounded-full uppercase italic hover:bg-cyan-500/10 transition-all">How it works</button>
      </div>
      
      <div className="absolute top-5 right-5 flex items-center gap-3 z-10">
        <button onClick={() => setPage('analytics')} className="text-[10px] font-bold text-green-500 border border-green-500/20 px-4 py-2 rounded-full uppercase hover:bg-green-500/10 transition-all">Analytics</button>
        <div className={`w-14 h-7 rounded-full p-1 transition-all duration-300 flex items-center cursor-pointer ${settings.theme === 'dark' ? 'bg-cyan-900 justify-end' : 'bg-gray-300 justify-start'}`} onClick={() => setSettings({...settings, theme: settings.theme === 'dark' ? 'light' : 'dark'})}>
          <div className={`w-5 h-5 rounded-full shadow-md transform transition-all duration-300 ${settings.theme === 'dark' ? 'bg-cyan-400' : 'bg-white'}`} />
        </div>
      </div>

      <div className="text-center mb-10">
        <h1 className="text-6xl md:text-9xl font-black text-cyan-500 tracking-tighter italic uppercase drop-shadow-2xl animate-pulse">KEY-FLOW</h1>
        <div className="flex items-center justify-center gap-2 mt-2">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em]">Node: {user?.username}</span>
          {user?.isAdmin && <span className="bg-red-500 text-white text-[8px] px-2 py-0.5 rounded font-black tracking-tighter shadow-lg shadow-red-500/20">OWNER</span>}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 w-full max-w-6xl px-4">
        <MenuCard label="Engage" icon="⚡" onClick={() => setPage('test')} color="from-cyan-500 to-blue-600" />
        <MenuCard label="Levels" icon="🗺️" onClick={() => setPage('levels')} color="from-purple-500 to-indigo-600" />
        <MenuCard label="Rankings" icon="📊" onClick={() => setPage('leaderboard')} color="from-green-500 to-teal-600" />
        <MenuCard label="Reviews" icon="⭐" onClick={() => setPage('reviews')} color="from-pink-500 to-rose-600" />
        <MenuCard label="Awards" icon="📜" onClick={() => setPage('certificate')} color="from-amber-500 to-orange-600" />
      </div>

      <div className="mt-8 w-full max-w-md bg-white/5 border border-white/10 p-6 rounded-[2rem] backdrop-blur-md">
        <div className="flex gap-2 mb-6">
          {['Easy', 'Medium', 'Hard'].map(m => (
            <button key={m} onClick={() => setSettings({...settings, difficulty: m})} className={`flex-1 py-3 rounded-xl font-black text-[10px] transition-all ${settings.difficulty === m ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/40' : 'bg-white/5'}`}>{m}</button>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-[9px] font-black uppercase opacity-60 px-2">
            <span>Session Duration</span>
            <span className="text-cyan-400 font-mono text-xs">{formatTime(settings.duration)}</span>
          </div>
          <input type="range" min="15" max="300" step="15" value={settings.duration} onChange={(e) => setSettings({...settings, duration: Number(e.target.value)})} className="w-full accent-cyan-500 cursor-pointer h-2 bg-white/5 rounded-full" />
        </div>
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
        time: allProgress[name].totalPlayTime
      })).sort((a, b) => b.level - a.level || a.time - b.time);
      setPlayers(list);
    }, []);

    return (
      <div className="p-8 md:p-20 max-w-4xl mx-auto min-h-screen">
        <button onClick={() => setPage('home')} className="mb-10 text-green-500 font-black text-xs uppercase tracking-widest">← Return to Base</button>
        <h2 className="text-5xl font-black mb-10 italic uppercase tracking-tighter">Global Rankings</h2>
        <div className="space-y-4">
          {players.map((p, i) => (
            <div key={i} className={`flex justify-between items-center p-6 rounded-2xl border ${i === 0 ? 'bg-cyan-500/10 border-cyan-500' : 'bg-white/5 border-white/10'}`}>
              <div className="flex items-center gap-6">
                <span className={`text-2xl font-black ${i === 0 ? 'text-cyan-400' : 'text-gray-600'}`}>#0{i + 1}</span>
                <span className="font-black uppercase tracking-widest">{p.name}</span>
              </div>
              <div className="text-right">
                <div className="text-cyan-400 font-black">SECTOR {p.level}</div>
                <div className="text-[10px] text-gray-500 uppercase font-bold">{Math.floor(p.time/60)}m Uptime</div>
              </div>
            </div>
          ))}
          {players.length === 0 && <p className="text-center text-gray-500 uppercase font-black italic">No data synced in local network.</p>}
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
    <div className="p-8 md:p-20 max-w-6xl mx-auto min-h-screen">
      <button onClick={() => setPage('home')} className="mb-10 text-green-500 font-black text-xs uppercase tracking-widest">← Back to System</button>
      <h2 className="text-5xl font-black mb-10 italic uppercase tracking-tighter border-b border-white/10 pb-6">User Analytics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="p-8 bg-white/5 border border-white/10 rounded-3xl">
          <p className="text-[10px] font-black uppercase text-gray-500 mb-2">Total Node Uptime</p>
          <h3 className="text-4xl font-black text-green-400 font-mono">{(stats.totalPlayTime / 60).toFixed(1)}m</h3>
        </div>
        <div className="p-8 bg-white/5 border border-white/10 rounded-3xl">
          <p className="text-[10px] font-black uppercase text-gray-500 mb-2">Avg. Completion Speed</p>
          <h3 className="text-4xl font-black text-cyan-400 font-mono">{avgTime}s</h3>
        </div>
        <div className="p-8 bg-white/5 border border-white/10 rounded-3xl">
          <p className="text-[10px] font-black uppercase text-gray-500 mb-2">Max Sector Unlocked</p>
          <h3 className="text-4xl font-black text-purple-400 font-mono">{stats.maxUnlocked}</h3>
        </div>
      </div>

      <div className="w-full bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-white/10 bg-white/5">
          <h4 className="text-xs font-black uppercase tracking-widest">Sector Deployment Log</h4>
        </div>
        <div className="max-h-[400px] overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead className="text-[9px] uppercase text-gray-500 bg-black/40">
              <tr>
                <th className="p-4">Sector</th>
                <th className="p-4">Mode</th>
                <th className="p-4">Time Taken</th>
                <th className="p-4">System Date</th>
              </tr>
            </thead>
            <tbody className="text-xs font-mono">
              {stats.history.slice().reverse().map((h, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 text-cyan-500">#{h.level}</td>
                  <td className="p-4 uppercase">{h.mode}</td>
                  <td className="p-4 text-green-400">{h.timeTaken}s</td>
                  <td className="p-4 text-gray-600">{h.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {stats.history.length === 0 && <p className="p-10 text-center text-[10px] uppercase text-gray-700 italic">No historical data found in current node.</p>}
        </div>
      </div>
    </div>
  );
};

// --- GUIDE PAGE ---
const GuidePage = ({ setPage }) => (
  <div className="p-8 md:p-20 max-w-5xl mx-auto min-h-screen">
    <button onClick={() => setPage('home')} className="mb-10 text-cyan-500 font-black text-xs uppercase tracking-widest">← Return to Dashboard</button>
    <h2 className="text-5xl font-black mb-10 italic uppercase tracking-tighter border-b border-white/10 pb-6">A-X Protocol Guide</h2>
    <div className="grid md:grid-cols-2 gap-12">
      <div className="space-y-8">
        <section className="group">
          <h3 className="text-cyan-400 font-black uppercase text-sm mb-2 flex items-center gap-2">🚀 01. Dynamic Progression</h3>
          <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-200 transition-colors">Master each sector by typing sequences with 100% precision. Each level increases the complexity of the neural strings you must process.</p>
        </section>
        <section className="group">
          <h3 className="text-purple-400 font-black uppercase text-sm mb-2 flex items-center gap-2">💾 02. Neural Storage</h3>
          <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-200 transition-colors">Your progress is encrypted and stored locally. Each identity has a dedicated sector map and analytics dashboard that tracks every millisecond of playtime.</p>
        </section>
      </div>
      <div className="space-y-8">
        <section className="group">
          <h3 className="text-amber-400 font-black uppercase text-sm mb-2 flex items-center gap-2">🏆 03. Merit Awards</h3>
          <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-200 transition-colors">Achieving Sector 50 unlocks the Master Certificate. This document verifies your technical accuracy and is signed by the Ayan X Lead Architect.</p>
        </section>
        <section className="group">
          <h3 className="text-pink-400 font-black uppercase text-sm mb-2 flex items-center gap-2">💬 04. Feedback Loop</h3>
          <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-200 transition-colors">Engage with other nodes in the Review Hub. Share your experience or report system anomalies. Admin nodes have full moderation authority.</p>
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
      if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
      return new Date(timestamp).toLocaleDateString();
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
      <div className="p-8 md:p-12 max-w-4xl mx-auto min-h-screen">
        <button onClick={() => setPage('home')} className="mb-8 text-pink-500 font-black text-[10px] uppercase tracking-widest">← Dashboard</button>
        <h2 className="text-4xl font-black mb-8 uppercase italic tracking-tighter">Node Reviews</h2>
        <div className="flex gap-4 mb-10">
          <input className="flex-1 bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-pink-500 text-sm" value={text} onChange={(e)=>setText(e.target.value)} placeholder="Submit node feedback..." />
          <button onClick={post} className="bg-pink-600 px-8 rounded-2xl font-black uppercase text-[10px] hover:scale-105 active:scale-95 transition-all shadow-lg shadow-pink-500/20">Post</button>
        </div>
        <div className="space-y-4">
          {reviews.map((r) => (
          <div key={r.id} className="p-6 bg-white/5 rounded-3xl border border-white/5 group relative">
            <div className="flex justify-between items-start mb-2">
              <span className={`font-black text-xs ${r.user === ADMIN_USER ? 'text-cyan-400' : 'text-pink-400'}`}>@{r.user}</span>
              <div className="flex items-center gap-4">
                <span className="text-[8px] font-bold text-gray-600 uppercase tracking-tighter">{getTimeAgo(r.timestamp)}</span>
                {user?.isAdmin && (
                  <button onClick={() => deleteReview(r.id)} className="text-[8px] text-red-500 font-black uppercase border border-red-500/20 px-2 py-1 rounded-md hover:bg-red-500/10">Purge</button>
                )}
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">"{r.msg}"</p>
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
      const newEntry = {
        level: stats.level,
        timeTaken: timeTaken,
        mode: settings.difficulty,
        date: new Date().toLocaleDateString()
      };
      
      setStats({ 
        ...stats, 
        level: stats.level + 1, 
        maxUnlocked: Math.max(stats.maxUnlocked, stats.level + 1),
        totalPlayTime: stats.totalPlayTime + timeTaken,
        history: [...stats.history, newEntry]
      });
      setInput(""); 
      setPage('home'); 
      alert(`Sector ${stats.level} Secured in ${timeTaken}s!`);
    }
  };

  return (
    <div className="p-10 flex flex-col items-center">
      <div className="w-full max-w-5xl flex justify-between items-center mb-6">
        <button onClick={() => setPage('home')} className="px-6 py-2 bg-white/5 rounded-full text-[10px] font-black uppercase">Abort</button>
        <div className="text-5xl font-mono font-black text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]">{timeLeft}s</div>
        <div className="text-right font-black uppercase text-[10px] opacity-40">Sector {stats.level} // {settings.difficulty}</div>
      </div>
      <div className="w-full max-w-5xl bg-[#0a0a0a] border border-white/5 p-12 rounded-[3rem] shadow-2xl relative overflow-hidden">
        <div className="text-2xl md:text-4xl font-mono leading-relaxed mb-10 text-gray-700 select-none">
          {targetText.split('').map((char, i) => (
            <span key={i} className={i < input.length ? (input[i] === char ? "text-green-400 shadow-green-500" : "text-red-500 bg-red-500/10") : ""}>{char}</span>
          ))}
        </div>
        <textarea autoFocus className="w-full bg-transparent border-t border-white/10 pt-8 text-2xl md:text-4xl outline-none resize-none h-48 font-mono text-white placeholder-gray-800" placeholder="Synchronize typing..." value={input} onChange={(e) => setInput(e.target.value)} />
        <div className="flex justify-end mt-6">
          <button onClick={nextLevel} className={`px-12 py-5 rounded-2xl font-black text-xs tracking-widest transition-all ${input === targetText ? 'bg-green-500 text-black shadow-lg shadow-green-500/40 hover:scale-105' : 'bg-white/5 text-gray-800 cursor-not-allowed'}`}>PROCEED</button>
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
      <div className="p-12 flex flex-col items-center justify-center min-h-screen text-center bg-black">
        <button onClick={() => setPage('home')} className="mb-10 text-amber-500 font-black uppercase text-[10px] tracking-widest">← Exit Archives</button>
        {stats.maxUnlocked < 50 ? (
          <div className="animate-bounce">
            <p className="text-gray-600 italic text-xs uppercase font-black">Level 50 Required for Award</p>
            <p className="text-gray-800 text-[10px] mt-2 font-mono">Current Status: {stats.maxUnlocked}/50</p>
          </div>
        ) : (
          <div className="p-12 border-[16px] border-double border-amber-600 bg-[#050505] shadow-[0_0_100px_rgba(217,119,6,0.1)] max-w-2xl relative overflow-hidden group">
            <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
            <div className="absolute top-4 right-6 text-[8px] font-mono text-amber-700/60 uppercase">Node ID: {certID}</div>
            <h1 className="text-3xl text-amber-600 mb-2 uppercase tracking-[0.4em] font-black italic relative z-10">Master of Precision</h1>
            <p className="text-gray-500 text-[10px] uppercase tracking-[0.5em] mb-12 relative z-10">A-X Protocol Verification</p>
            <p className="text-gray-400 text-xs italic mb-2 relative z-10">Awarded to the Node Identity</p>
            <h2 className="text-6xl font-black text-white uppercase mb-6 drop-shadow-lg relative z-10">{user?.username}</h2>
            <p className="text-gray-400 text-xs max-w-sm mx-auto leading-relaxed relative z-10 italic">For demonstrating technical excellence and flawless synchronization through <span className="text-amber-500 font-bold">Sector {milestone}</span>.</p>
            <div className="mt-16 flex justify-between items-end px-4 relative z-10">
              <div className="text-left border-t border-white/10 pt-4">
                <p className="text-white font-mono text-[10px]">{date}</p>
                <p className="text-[8px] text-gray-600 uppercase font-black tracking-widest">Verified Date</p>
              </div>
              <div className="text-right border-t border-white/10 pt-4">
                <p className="text-amber-500 font-serif italic text-2xl">Ayan X</p>
                <p className="text-[8px] text-gray-600 uppercase font-black tracking-widest">Lead Architect</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
};

// --- LEVELS PAGE ---
const LevelsPage = ({ setPage, stats, setStats }) => (
  <div className="p-8 md:p-12 max-w-6xl mx-auto min-h-screen">
    <button onClick={() => setPage('home')} className="mb-10 text-purple-500 font-black uppercase text-[10px] tracking-widest">← System Map</button>
    <h2 className="text-4xl font-black mb-8 italic uppercase tracking-tighter">Sector Navigation</h2>
    <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-12 gap-3 h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
      {[...Array(1000)].map((_, i) => (
        <button key={i} disabled={i + 1 > stats.maxUnlocked} onClick={() => { setStats({...stats, level: i + 1}); setPage('test'); }}
          className={`h-14 rounded-2xl font-black text-[10px] border transition-all duration-300 ${i + 1 <= stats.maxUnlocked ? 'border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-black shadow-lg shadow-purple-500/10' : 'border-white/5 text-gray-800 cursor-not-allowed opacity-30'}`}>{i + 1}</button>
      ))}
    </div>
  </div>
);

// --- MENU CARD ---
const MenuCard = ({ label, icon, onClick, color }) => (
  <button onClick={onClick} className={`bg-gradient-to-br ${color} p-8 md:p-12 rounded-[3rem] border border-white/10 flex flex-col items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-2xl group`}>
    <span className="text-5xl mb-4 group-hover:animate-bounce transition-all">{icon}</span>
    <span className="font-black text-[10px] tracking-[0.2em] uppercase text-white">{label}</span>
  </button>
);

export default App;