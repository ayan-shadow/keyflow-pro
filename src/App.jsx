import React, { useState, useEffect } from 'react';

// --- SYSTEM CORE SETTINGS ---
const ADMIN_USER = "Ayan_Boss"; 
const ADMIN_PASS = "AdminX_2026";

const generateTexts = (mode, level) => {
  const data = {
    English: {
      Easy: ["The cat sat on the mat.", "Speed is key.", "Practice typing daily.", "React is fun.", "Code is art."],
      Medium: ["Consistency leads to mastery.", "User experience is everything.", "Mobile first design is essential.", "Keep your code clean and simple."],
      Hard: ["Asynchronous functions simplify complex operations in software development.", "Encryption ensures data integrity across distributed networks.", "Neural interfaces require precise synchronization."]
    }
  };
  const pool = data['English'][mode] || data['English']['Easy'];
  return pool[level % pool.length];
};

const App = () => {
  const [currentPage, setCurrentPage] = useState('auth'); 
  const [user, setUser] = useState(null); 
  const [isMobile, setIsMobile] = useState(false);
  const [settings, setSettings] = useState({ theme: 'dark', duration: 60, difficulty: 'Easy' });
  const [stats, setStats] = useState({ 
    level: 1, 
    maxUnlocked: 1, 
    totalPlayTime: 0, 
    totalCharsTyped: 0,
    accuracy: 100,
    history: [] 
  });

  useEffect(() => {
    const checkDevice = () => setIsMobile(window.innerWidth < 768);
    checkDevice();
    window.addEventListener('resize', checkDevice);
    
    const activeUser = localStorage.getItem('kf_active_user');
    if (activeUser) {
      const parsedUser = JSON.parse(activeUser);
      setUser(parsedUser);
      const allProgress = JSON.parse(localStorage.getItem('kf_user_progress') || "{}");
      if (allProgress[parsedUser.username]) setStats(allProgress[parsedUser.username]);
      setCurrentPage('home');
    }
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  const saveProgress = (newStats) => {
    setStats(newStats);
    if (user) {
      const allProgress = JSON.parse(localStorage.getItem('kf_user_progress') || "{}");
      allProgress[user.username] = newStats;
      localStorage.setItem('kf_user_progress', JSON.stringify(allProgress));
    }
  };

  const toggleTheme = () => {
    setSettings(prev => ({ ...prev, theme: prev.theme === 'dark' ? 'light' : 'dark' }));
  };

  const renderPage = () => {
    const props = { setUser, setPage: setCurrentPage, setStats, stats, user, settings, setSettings, saveProgress, isMobile, toggleTheme };
    switch (currentPage) {
      case 'auth': return <AuthPage {...props} />;
      case 'home': return <HomePage {...props} />;
      case 'test': return <TestPage {...props} />;
      case 'levels': return <LevelsPage {...props} />;
      case 'guide': return <GuidePage {...props} />;
      case 'reviews': return <GenuineReviewPage {...props} />;
      case 'certificate': return <CertificatePage {...props} />;
      case 'analytics': return <AnalyticsPage {...props} />;
      case 'leaderboard': return <LeaderboardPage {...props} />;
      default: return <AuthPage {...props} />;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col transition-all duration-500 ${settings.theme === 'dark' ? 'bg-[#050505] text-white' : 'bg-[#f0f2f5] text-gray-900'} font-sans overflow-x-hidden`}>
      <div className="fixed bottom-4 left-4 z-50 flex items-center gap-3">
        <span className={`text-[8px] font-black ${settings.theme === 'dark' ? 'bg-white/10 text-white' : 'bg-black/10 text-black'} backdrop-blur-md px-3 py-1 rounded-full border border-white/5 opacity-50 uppercase tracking-widest`}>
          {isMobile ? "Mobile Mode Active" : "Window Mode Active"}
        </span>
      </div>
      <div className="flex-grow">{renderPage()}</div>
      <footer className="w-full py-6 flex flex-col items-center opacity-40">
        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/5 rounded-full backdrop-blur-md">
          <span className="text-[10px] font-bold tracking-widest uppercase text-cyan-500">KeyFlow Pro // A-X Systems</span>
        </div>
        <p className="text-[9px] mt-2 font-black uppercase tracking-widest text-gray-500 italic">
          Architect: {user?.username === ADMIN_USER ? "Boss Ayan" : "Ayan X"}
        </p>
      </footer>
    </div>
  );
};

// --- AUTH PAGE --- (No changes as per request)
const AuthPage = ({ setUser, setPage, setStats }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [form, setForm] = useState({ username: '', password: '' });

  const handleAuth = () => {
    const users = JSON.parse(localStorage.getItem('kf_users_list') || "[]");
    if (isLogin) {
      if (form.username === ADMIN_USER && form.password === ADMIN_PASS) {
        const adminObj = { username: ADMIN_USER, isAdmin: true };
        localStorage.setItem('kf_active_user', JSON.stringify(adminObj));
        setUser(adminObj); setPage('home'); return;
      }
      const found = users.find(u => u.username === form.username && u.password === form.password);
      if (found) {
        localStorage.setItem('kf_active_user', JSON.stringify(found));
        setUser(found);
        const allProgress = JSON.parse(localStorage.getItem('kf_user_progress') || "{}");
        if (allProgress[found.username]) setStats(allProgress[found.username]);
        setPage('home');
      } else { alert("Error: User not found."); }
    } else {
      if (form.username.length >= 3 && form.password.length >= 4) {
        if (users.find(u => u.username === form.username)) return alert("Name taken.");
        users.push(form);
        localStorage.setItem('kf_users_list', JSON.stringify(users));
        alert("Account Created!"); setIsLogin(true);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="w-full max-w-md bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-xl shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-cyan-500 uppercase italic tracking-tighter">{isLogin ? 'Welcome Back' : 'Join System'}</h2>
          <p className="text-[10px] text-gray-500 font-bold uppercase mt-1 tracking-widest">KeyFlow Identity Portal</p>
        </div>
        <div className="space-y-6 mb-8">
          <input className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-cyan-500 text-sm" placeholder="Username" value={form.username} onChange={(e)=>setForm({...form, username: e.target.value})} />
          <input className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-cyan-500 text-sm" type="password" placeholder="Password" value={form.password} onChange={(e)=>setForm({...form, password: e.target.value})} />
        </div>
        <button onClick={handleAuth} className="w-full bg-cyan-600 hover:bg-cyan-500 py-4 rounded-xl font-black uppercase text-xs tracking-widest transition-all active:scale-95">
          {isLogin ? 'Access System' : 'Create Account'}
        </button>
        <button onClick={() => setIsLogin(!isLogin)} className="w-full mt-4 text-cyan-400 text-[10px] font-black uppercase tracking-widest hover:underline">
          {isLogin ? "Sign Up Now" : "Login to Portal"}
        </button>
      </div>
    </div>
  );
};

// --- HOME PAGE (With Toggle) ---
const HomePage = ({ user, setUser, setPage, settings, setSettings, stats, isMobile, toggleTheme }) => {
  return (
    <div className="p-4 md:p-8 flex flex-col items-center justify-center min-h-screen relative">
      <div className="absolute top-6 left-4 right-4 flex justify-between items-center z-10">
        <button onClick={() => {localStorage.removeItem('kf_active_user'); setUser(null); setPage('auth');}} className="text-[9px] font-black text-red-500 border border-red-500/20 px-4 py-2 rounded-full uppercase">Logout</button>
        <div className="flex gap-2">
          <button onClick={toggleTheme} className="text-[9px] font-black text-blue-400 border border-blue-500/20 px-4 py-2 rounded-full uppercase">
            {settings.theme === 'dark' ? 'Light Mode ☀️' : 'Dark Mode 🌙'}
          </button>
          <button onClick={() => setPage('guide')} className="text-[9px] font-black text-yellow-500 border border-yellow-500/20 px-4 py-2 rounded-full uppercase">Manual 📖</button>
          <button onClick={() => setPage('analytics')} className="text-[9px] font-black text-green-500 border border-green-500/20 px-4 py-2 rounded-full uppercase">Neural Stats</button>
        </div>
      </div>

      <div className="text-center mb-8 mt-12">
        <h1 className={`${isMobile ? 'text-5xl' : 'text-8xl'} font-black text-cyan-500 tracking-tighter italic uppercase animate-pulse`}>KEY-FLOW</h1>
        <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Node: {user?.username} | Sector Unlocked: {stats.maxUnlocked}</p>
      </div>

      <div className={`${isMobile ? 'flex overflow-x-auto w-full pb-6 px-4 snap-x' : 'grid grid-cols-2 md:grid-cols-5'} gap-4 max-w-6xl`}>
        <MenuCard label="Type" icon="⚡" onClick={() => setPage('test')} color="from-cyan-500 to-blue-600" isMobile={isMobile} />
        <MenuCard label="Map" icon="🗺️" onClick={() => setPage('levels')} color="from-purple-500 to-indigo-600" isMobile={isMobile} />
        <MenuCard label="Rank" icon="📊" onClick={() => setPage('leaderboard')} color="from-green-500 to-teal-600" isMobile={isMobile} />
        <MenuCard label="Social" icon="⭐" onClick={() => setPage('reviews')} color="from-pink-500 to-rose-600" isMobile={isMobile} />
        <MenuCard label="Awards" icon="📜" onClick={() => setPage('certificate')} color="from-amber-500 to-orange-600" isMobile={isMobile} />
      </div>

      <div className={`mt-8 w-full ${isMobile ? 'max-w-xs' : 'max-w-md'} bg-white/5 border border-white/10 p-6 rounded-[2rem] backdrop-blur-md shadow-xl`}>
        <div className="flex gap-2 mb-6">
          {['Easy', 'Medium', 'Hard'].map(m => (
            <button key={m} onClick={() => setSettings({...settings, difficulty: m})} 
              className={`flex-1 py-3 rounded-xl font-black text-[9px] transition-all ${settings.difficulty === m ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/40' : 'bg-white/5 opacity-50'}`}>{m}</button>
          ))}
        </div>
        <p className="text-[8px] font-black uppercase text-gray-500 mb-2">Timer: {settings.duration}s</p>
        <input type="range" min="15" max="300" step="15" value={settings.duration} onChange={(e) => setSettings({...settings, duration: Number(e.target.value)})} className="w-full accent-cyan-500 h-1.5 bg-white/5 rounded-full" />
      </div>
    </div>
  );
};

// --- UPGRADED LEVELS PAGE (Map 1-1000) ---
const LevelsPage = ({ setPage, stats, setStats, saveProgress }) => {
  const totalLevels = 1000;
  const progressPercent = ((stats.maxUnlocked / totalLevels) * 100).toFixed(1);

  return (
    <div className="p-6 pt-20 max-w-6xl mx-auto min-h-screen">
      <div className="flex justify-between items-center mb-10">
        <button onClick={() => setPage('home')} className="text-purple-500 font-black text-[10px] uppercase">← Return Home</button>
        <h2 className="text-5xl font-black italic uppercase tracking-tighter text-purple-500">Neural Map</h2>
      </div>

      {/* Progress Bar Section */}
      <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] mb-10 backdrop-blur-md">
        <div className="flex justify-between items-end mb-4">
          <div>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Global Completion</p>
            <h3 className="text-3xl font-black text-white">{progressPercent}%</h3>
          </div>
          <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest">{stats.maxUnlocked} / {totalLevels} Sectors Unlocked</p>
        </div>
        <div className="w-full h-4 bg-white/5 rounded-full overflow-hidden border border-white/5">
          <div className="h-full bg-gradient-to-r from-purple-600 to-indigo-400 shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all duration-1000" style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>

      {/* Grid Map 1 to 1000 */}
      <div className="grid grid-cols-5 md:grid-cols-10 gap-3 max-h-[60vh] overflow-y-auto p-4 bg-black/20 rounded-[2.5rem] border border-white/5 scrollbar-hide">
        {[...Array(totalLevels)].map((_, i) => {
          const lv = i + 1;
          const isUnlocked = lv <= stats.maxUnlocked;
          const isCurrent = lv === stats.level;

          return (
            <button
              key={lv}
              disabled={!isUnlocked}
              onClick={() => { setStats({ ...stats, level: lv }); setPage('test'); }}
              className={`aspect-square rounded-xl flex flex-col items-center justify-center transition-all relative group
                ${isUnlocked ? 'bg-purple-600/20 border border-purple-500/50 hover:scale-110 active:scale-90 shadow-lg shadow-purple-500/10' : 'bg-white/5 border border-white/5 opacity-20 cursor-not-allowed'}
                ${isCurrent ? 'ring-2 ring-white ring-offset-2 ring-offset-black scale-105 bg-purple-500' : ''}
              `}
            >
              <span className={`text-[10px] font-black ${isUnlocked ? 'text-white' : 'text-gray-600'}`}>{lv}</span>
              {isUnlocked && lv < stats.maxUnlocked && <span className="text-[8px] absolute bottom-1">✅</span>}
            </button>
          );
        })}
      </div>
      <p className="text-center mt-6 text-[8px] font-black text-gray-600 uppercase tracking-widest italic">Scroll to explore all 1000 Sectors</p>
    </div>
  );
};

// --- TEST PAGE --- (No changes to typing logic)
const TestPage = ({ setPage, settings, stats, saveProgress, isMobile }) => {
  const [input, setInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(settings.duration);
  const [isFinished, setIsFinished] = useState(false);
  const [startTime] = useState(Date.now());
  const targetText = generateTexts(settings.difficulty, stats.level);

  useEffect(() => {
    if (timeLeft > 0 && !isFinished) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !isFinished) {
      alert("Time Over!"); setPage('home');
    }
  }, [timeLeft, isFinished, setPage]);

  const handleInput = (val) => {
    if (isFinished) return;
    setInput(val);
    if (val === targetText) setIsFinished(true);
  };

  const handleProceed = () => {
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    const newEntry = { 
        level: stats.level, 
        timeTaken, 
        mode: settings.difficulty, 
        date: new Date().toLocaleDateString(),
        chars: targetText.length
    };
    saveProgress({ 
      ...stats, 
      level: stats.level + 1, 
      maxUnlocked: Math.max(stats.maxUnlocked, stats.level + 1),
      totalPlayTime: stats.totalPlayTime + timeTaken,
      totalCharsTyped: (stats.totalCharsTyped || 0) + targetText.length,
      history: [...(stats.history || []), newEntry]
    });
    setPage('home');
  };

  return (
    <div className="p-4 md:p-10 flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-4xl flex justify-between items-center mb-6">
        <button onClick={() => setPage('home')} className="px-4 py-2 bg-red-500/20 text-red-500 rounded-full text-[8px] font-black uppercase">Abort Mission</button>
        <div className="text-4xl font-mono font-black text-cyan-400">00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}</div>
        <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Sector {stats.level}</div>
      </div>

      <div className="w-full max-w-4xl bg-white/5 border border-white/10 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-4xl italic select-none">AYANX</div>
        <div className={`font-mono mb-8 select-none leading-relaxed ${isMobile ? 'text-lg' : 'text-3xl'}`}>
          {targetText.split('').map((char, i) => (
            <span key={i} className={i < input.length ? (input[i] === char ? "text-green-400" : "text-red-500 underline") : "text-gray-700"}>{char}</span>
          ))}
        </div>
        <textarea autoFocus disabled={isFinished} className="w-full bg-transparent border-t border-white/10 pt-6 outline-none resize-none h-32 font-mono text-white text-xl" 
          placeholder="Initiate sequence..." value={input} onChange={(e) => handleInput(e.target.value)} />
        
        {isFinished && (
          <button onClick={handleProceed} className="w-full mt-6 bg-green-600 hover:bg-green-500 py-4 rounded-2xl font-black uppercase tracking-widest text-sm animate-bounce shadow-lg shadow-green-500/20">
            ✅ Sector Cleared! Upgrade Level
          </button>
        )}
      </div>
    </div>
  );
};

// --- LEADERBOARD (As original) ---
const LeaderboardPage = ({ setPage }) => {
    const [players, setPlayers] = useState([]);
    useEffect(() => {
      const allProgress = JSON.parse(localStorage.getItem('kf_user_progress') || "{}");
      const list = Object.keys(allProgress).map(name => ({
        name, 
        level: allProgress[name].maxUnlocked, 
        time: allProgress[name].totalPlayTime,
        chars: allProgress[name].totalCharsTyped || 0
      })).sort((a, b) => b.level - a.level || b.chars - a.chars);
      setPlayers(list);
    }, []);

    return (
      <div className="p-6 pt-20 max-w-5xl mx-auto min-h-screen">
        <button onClick={() => setPage('home')} className="text-cyan-500 font-black text-[10px] uppercase mb-8">← Global Hub</button>
        <div className="flex justify-between items-end mb-10 border-b border-white/10 pb-6">
            <h2 className="text-6xl font-black italic uppercase tracking-tighter">Hall of Fame</h2>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Global Ranking System</p>
        </div>
        <div className="space-y-4">
          {players.map((p, i) => (
            <div key={i} className={`flex justify-between items-center p-6 rounded-3xl border transition-all ${i === 0 ? 'bg-cyan-500/10 border-cyan-500/50 scale-105' : 'bg-white/5 border-white/10'}`}>
              <div className="flex items-center gap-6">
                <span className={`text-2xl font-black italic ${i === 0 ? 'text-cyan-400' : 'text-gray-700'}`}>#{i+1}</span>
                <div>
                    <h4 className="font-black uppercase text-sm tracking-widest">{p.name} {p.name === ADMIN_USER && "🛡️"}</h4>
                    <p className="text-[9px] text-gray-500 uppercase font-bold">Total Chars: {p.chars}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="block text-cyan-400 font-mono font-black text-xl italic leading-none">SECTOR {p.level}</span>
                <span className="text-[8px] text-gray-600 font-black uppercase">Playtime: {(p.time/60).toFixed(1)}m</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
};

// --- ANALYTICS (As original) ---
const AnalyticsPage = ({ setPage, stats, user }) => {
    const totalWords = Math.floor((stats.totalCharsTyped || 0) / 5);
    return (
        <div className="p-6 pt-20 max-w-4xl mx-auto min-h-screen">
          <button onClick={() => setPage('home')} className="mb-8 text-green-500 font-black text-[10px] uppercase">← Back to Console</button>
          <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-5 font-black text-9xl italic">AX</div>
            <h2 className="text-5xl font-black mb-10 italic uppercase tracking-tighter text-green-500">Neural Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <StatCard label="Total Focus Time" value={`${(stats.totalPlayTime / 60).toFixed(1)} Minutes`} color="text-green-400" />
              <StatCard label="Highest Sector" value={`Level ${stats.maxUnlocked}`} color="text-purple-400" />
              <StatCard label="Words Processed" value={totalWords} color="text-cyan-400" />
              <StatCard label="Experience Points" value={stats.maxUnlocked * 150} color="text-amber-400" />
            </div>
            <div className="mt-10 p-6 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-[10px] font-black uppercase text-gray-500 mb-2 italic">AyanX System Status: Verified</p>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500" style={{width: `${Math.min(stats.maxUnlocked / 10, 100)}%`}}></div>
                </div>
            </div>
          </div>
        </div>
    );
};

// --- REVIEWS (As original) ---
const GenuineReviewPage = ({ setPage, user }) => {
    const [reviews, setReviews] = useState(() => JSON.parse(localStorage.getItem('kf_reviews') || "[]"));
    const [text, setText] = useState("");
    
    const post = () => { 
        if (text.trim()) { 
            const now = new Date();
            const timeStr = `${now.getHours()}:${now.getMinutes() < 10 ? '0'+now.getMinutes() : now.getMinutes()}`;
            const updated = [{ 
                id: Date.now(), 
                user: user?.username, 
                msg: text, 
                time: timeStr,
                date: now.toLocaleDateString()
            }, ...reviews]; 
            setReviews(updated); 
            localStorage.setItem('kf_reviews', JSON.stringify(updated)); 
            setText(""); 
        } 
    };

    const deleteReview = (id) => {
        const filtered = reviews.filter(r => r.id !== id);
        setReviews(filtered);
        localStorage.setItem('kf_reviews', JSON.stringify(filtered));
    };

    return (
        <div className="p-6 pt-20 max-w-3xl mx-auto min-h-screen">
            <div className="flex justify-between items-center mb-10">
                <button onClick={() => setPage('home')} className="text-pink-500 font-black text-[10px] uppercase">← Return</button>
                <h2 className="text-4xl font-black italic uppercase tracking-tighter">Real-Time Hub</h2>
            </div>
            
            <div className="flex gap-2 mb-10 group">
                <input className="flex-1 bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-pink-500 transition-all text-sm" 
                    value={text} onChange={(e)=>setText(e.target.value)} placeholder="Submit neural update..." />
                <button onClick={post} className="bg-pink-600 px-8 rounded-2xl font-black uppercase text-[10px] hover:bg-pink-500 active:scale-95 transition-all shadow-lg shadow-pink-500/20">Post</button>
            </div>

            <div className="space-y-6">
                {reviews.map(r => ( 
                    <div key={r.id} className="p-6 bg-white/5 rounded-[2rem] border border-white/5 relative group hover:border-pink-500/30 transition-all">
                        <div className="flex justify-between items-start mb-2">
                            <p className="text-pink-400 font-black text-[11px] uppercase tracking-widest">@{r.user} {r.user === ADMIN_USER && "🛡️"}</p>
                            <div className="text-right">
                                <p className="text-[8px] text-gray-600 font-black uppercase">{r.time} | {r.date}</p>
                            </div>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed italic">"{r.msg}"</p>
                        
                        {user?.isAdmin && (
                            <button onClick={() => deleteReview(r.id)} className="absolute -top-2 -right-2 bg-red-600 text-white p-2 rounded-full text-[8px] font-black uppercase shadow-xl hover:bg-red-500 transition-all">Remove Node</button>
                        )}
                    </div> 
                ))}
            </div>
        </div>
    );
};

// --- CERTIFICATE, GUIDE, UI COMPONENTS (As original) ---
const CertificatePage = ({ setPage, stats, user }) => {
    const levelTier = Math.floor(stats.maxUnlocked / 50);
    const getTierName = (tier) => {
        if (tier >= 4) return "Legendary Archon";
        if (tier >= 3) return "Elite Sentinel";
        if (tier >= 2) return "Advanced Operator";
        if (tier >= 1) return "Certified Master";
        return "Beginner Core";
    };

    return (
        <div className="p-6 md:p-20 flex flex-col items-center justify-center min-h-screen text-center bg-black">
          <button onClick={() => setPage('home')} className="mb-10 text-amber-500 font-black uppercase text-[10px] tracking-widest border border-amber-500/20 px-6 py-2 rounded-full">← System Exit</button>
          
          {stats.maxUnlocked < 50 ? ( 
            <div className="p-10 border-2 border-white/5 rounded-[3rem] opacity-30">
                <p className="uppercase font-black text-xs italic tracking-widest text-white mb-4">Achievement Locked</p>
                <h3 className="text-4xl font-black text-gray-700">SECTOR 50 REQUIRED</h3>
                <p className="mt-4 text-[10px] font-bold text-gray-800">Current Progress: {stats.maxUnlocked}/50</p>
            </div>
          ) : (
            <div className="p-12 border-[12px] border-amber-600 bg-zinc-900 shadow-[0_0_100px_rgba(217,119,6,0.2)] max-w-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50"></div>
                <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.5em] mb-10 italic">Official System Document</p>
                <h1 className="text-5xl text-white font-black uppercase italic tracking-tighter mb-2">{getTierName(levelTier)}</h1>
                <div className="h-1 w-24 bg-amber-600 mx-auto mb-10"></div>
                <p className="text-gray-400 text-xs font-bold mb-2 uppercase">This document verifies that</p>
                <p className="text-3xl text-cyan-500 font-black italic uppercase tracking-widest mb-10">{user?.username}</p>
                <div className="flex justify-around items-center mb-10">
                    <div className="text-center">
                        <p className="text-[8px] text-gray-600 font-black uppercase mb-1">Sector Depth</p>
                        <p className="text-xl font-mono text-white font-black">{stats.maxUnlocked}</p>
                    </div>
                    <div className="text-5xl">🏆</div>
                    <div className="text-center">
                        <p className="text-[8px] text-gray-600 font-black uppercase mb-1">Accuracy Grade</p>
                        <p className="text-xl font-mono text-white font-black">S+</p>
                    </div>
                </div>
                <div className="pt-10 border-t border-white/5 flex justify-between items-end">
                    <div className="text-left">
                        <p className="text-[10px] text-gray-500 font-black uppercase italic mb-1 underline decoration-amber-600/50">Signature: AyanX</p>
                        <p className="text-[7px] text-gray-700 font-black uppercase">Architect of KeyFlow Systems</p>
                    </div>
                    <p className="text-[8px] text-gray-600 font-mono">HASH_{Math.random().toString(36).substring(7).toUpperCase()}</p>
                </div>
            </div>
          )}
        </div>
    );
};

const GuidePage = ({ setPage }) => (
  <div className="p-6 md:p-20 max-w-4xl mx-auto min-h-screen">
    <button onClick={() => setPage('home')} className="mb-10 text-cyan-500 font-black text-[10px] uppercase tracking-widest">← Back to Hub</button>
    <div className="flex items-center gap-4 mb-12">
        <h2 className="text-6xl font-black italic uppercase tracking-tighter text-cyan-500">Manual</h2>
        <span className="text-xs bg-white/5 px-4 py-1 rounded-full font-black text-gray-600 tracking-widest uppercase italic">v2.1 Map Update</span>
    </div>
    <div className="grid gap-6">
      <GuideCard icon="🚀" title="The Protocol" desc="Type the neural sequences exactly as shown. Mistakes cause mission failure." />
      <GuideCard icon="🗺️" title="1000 Sectors" desc="Explore the massive neural map. 1000 levels of increasing difficulty await." />
      <GuideCard icon="🌓" title="Theme Control" desc="Switch between Dark and Light protocols using the main console toggle." />
      <GuideCard icon="🏆" title="AyanX Certification" desc="Reach Level 50 to unlock your first official system certificate." />
    </div>
  </div>
);

const GuideCard = ({ icon, title, desc }) => (
  <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] flex gap-8 items-center hover:bg-white/10 transition-all group">
    <span className="text-5xl group-hover:scale-110 transition-transform">{icon}</span>
    <div>
      <h4 className="font-black uppercase text-cyan-400 text-sm tracking-widest mb-2 italic">{title}</h4>
      <p className="text-gray-400 text-xs font-medium leading-relaxed">{desc}</p>
    </div>
  </div>
);

const MenuCard = ({ label, icon, onClick, color, isMobile }) => (
  <button onClick={onClick} className={`bg-gradient-to-br ${color} ${isMobile ? 'min-w-[150px] p-8 snap-center' : 'p-10'} rounded-[3rem] border border-white/10 flex flex-col items-center justify-center transition-all active:scale-90 hover:brightness-110 shadow-2xl relative overflow-hidden group`}>
    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
    <span className={`${isMobile ? 'text-4xl' : 'text-5xl'} mb-3 transition-transform group-hover:scale-110`}>{icon}</span>
    <span className="font-black text-[10px] tracking-[0.2em] uppercase text-white italic">{label}</span>
  </button>
);

const StatCard = ({ label, value, color }) => (
  <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] hover:border-white/20 transition-all">
    <p className="text-[9px] font-black uppercase text-gray-600 mb-2 tracking-widest italic">{label}</p>
    <h3 className={`text-3xl font-black font-mono tracking-tighter ${color}`}>{value}</h3>
  </div>
);

export default App;