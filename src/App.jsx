import React, { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, onValue, update, push } from "firebase/database";

// --- FIREBASE CONFIGURATION ---
const firebaseConfig = {
  apiKey: "AIzaSyDv1IqdIS0cx71TIciSJR0qIt4nvZ2rpvQ",
  authDomain: "key-flow-2e8f4.firebaseapp.com",
  projectId: "key-flow-2e8f4",
  storageBucket: "key-flow-2e8f4.firebasestorage.app",
  messagingSenderId: "731095565346",
  appId: "1:731095565346:web:a404148a2a4c0807b8f67b",
  measurementId: "G-WPMWNW88FG"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

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
      // Fetch fresh stats from Firebase
      const userRef = ref(db, 'users/' + parsedUser.username + '/stats');
      get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
          setStats(snapshot.val());
        }
        setCurrentPage('home');
      });
    }
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  const saveProgress = (newStats) => {
    setStats(newStats);
    if (user) {
      // Global Save to Firebase
      const userRef = ref(db, 'users/' + user.username + '/stats');
      set(userRef, newStats);
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

// --- AUTH PAGE (Upgraded with Firebase) ---
const AuthPage = ({ setUser, setPage, setStats }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [form, setForm] = useState({ username: '', password: '' });

  const handleAuth = async () => {
    if (form.username.length < 3) return alert("Username too short");

    if (isLogin) {
      if (form.username === ADMIN_USER && form.password === ADMIN_PASS) {
        const adminObj = { username: ADMIN_USER, isAdmin: true };
        localStorage.setItem('kf_active_user', JSON.stringify(adminObj));
        setUser(adminObj); setPage('home'); return;
      }
      
      const userRef = ref(db, 'users/' + form.username);
      const snapshot = await get(userRef);
      if (snapshot.exists() && snapshot.val().password === form.password) {
        const userData = { username: form.username, isAdmin: false };
        localStorage.setItem('kf_active_user', JSON.stringify(userData));
        setUser(userData);
        if (snapshot.val().stats) setStats(snapshot.val().stats);
        setPage('home');
      } else { alert("Invalid Credentials"); }
    } else {
      const userRef = ref(db, 'users/' + form.username);
      const snapshot = await get(userRef);
      if (snapshot.exists()) return alert("Username taken!");
      
      await set(userRef, { ...form, stats: { level: 1, maxUnlocked: 1, totalPlayTime: 0, totalCharsTyped: 0, history: [] } });
      alert("Account Created Globally!"); setIsLogin(true);
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

// --- HOME PAGE ---
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

// --- LEVELS PAGE ---
const LevelsPage = ({ setPage, stats, setStats }) => {
  const totalLevels = 1000;
  const progressPercent = ((stats.maxUnlocked / totalLevels) * 100).toFixed(1);

  return (
    <div className="p-6 pt-20 max-w-6xl mx-auto min-h-screen">
      <div className="flex justify-between items-center mb-10">
        <button onClick={() => setPage('home')} className="text-purple-500 font-black text-[10px] uppercase">← Return Home</button>
        <h2 className="text-5xl font-black italic uppercase tracking-tighter text-purple-500">Neural Map</h2>
      </div>

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

      <div className="grid grid-cols-5 md:grid-cols-10 gap-3 max-h-[60vh] overflow-y-auto p-4 bg-black/20 rounded-[2.5rem] border border-white/5 scrollbar-hide">
        {[...Array(totalLevels)].map((_, i) => {
          const lv = i + 1;
          const isUnlocked = lv <= stats.maxUnlocked;
          return (
            <button key={lv} disabled={!isUnlocked} onClick={() => { setStats({ ...stats, level: lv }); setPage('test'); }}
              className={`aspect-square rounded-xl flex flex-col items-center justify-center transition-all relative group
                ${isUnlocked ? 'bg-purple-600/20 border border-purple-500/50 hover:scale-110 active:scale-90 shadow-lg shadow-purple-500/10' : 'bg-white/5 border border-white/5 opacity-20 cursor-not-allowed'}
                ${lv === stats.level ? 'ring-2 ring-white scale-105 bg-purple-500' : ''}`}>
              <span className={`text-[10px] font-black ${isUnlocked ? 'text-white' : 'text-gray-600'}`}>{lv}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// --- TEST PAGE ---
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
    saveProgress({ 
      ...stats, 
      level: stats.level + 1, 
      maxUnlocked: Math.max(stats.maxUnlocked, stats.level + 1),
      totalPlayTime: (stats.totalPlayTime || 0) + timeTaken,
      totalCharsTyped: (stats.totalCharsTyped || 0) + targetText.length,
      history: [...(stats.history || []), {level: stats.level, date: new Date().toLocaleDateString()}]
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
          <button onClick={handleProceed} className="w-full mt-6 bg-green-600 hover:bg-green-500 py-4 rounded-2xl font-black uppercase tracking-widest text-sm animate-bounce">
            ✅ Sector Cleared!
          </button>
        )}
      </div>
    </div>
  );
};

// --- GLOBAL LEADERBOARD (Real-Time from Firebase) ---
const LeaderboardPage = ({ setPage }) => {
    const [players, setPlayers] = useState([]);
    
    useEffect(() => {
      const usersRef = ref(db, 'users');
      onValue(usersRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const list = Object.keys(data).map(username => ({
            name: username,
            level: data[username].stats?.maxUnlocked || 1,
            time: data[username].stats?.totalPlayTime || 0,
            chars: data[username].stats?.totalCharsTyped || 0
          })).sort((a, b) => b.level - a.level || b.chars - a.chars);
          setPlayers(list);
        }
      });
    }, []);

    return (
      <div className="p-6 pt-20 max-w-5xl mx-auto min-h-screen">
        <button onClick={() => setPage('home')} className="text-cyan-500 font-black text-[10px] uppercase mb-8">← Global Hub</button>
        <div className="flex justify-between items-end mb-10 border-b border-white/10 pb-6">
            <h2 className="text-6xl font-black italic uppercase tracking-tighter text-cyan-500">Hall of Fame</h2>
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

// --- GENUINE REVIEWS (Real-Time from Firebase) ---
const GenuineReviewPage = ({ setPage, user }) => {
    const [reviews, setReviews] = useState([]);
    const [text, setText] = useState("");
    
    useEffect(() => {
        const reviewsRef = ref(db, 'reviews');
        onValue(reviewsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const list = Object.values(data).reverse();
                setReviews(list);
            }
        });
    }, []);

    const post = () => { 
        if (text.trim()) { 
            const now = new Date();
            const reviewsRef = ref(db, 'reviews');
            const newReviewRef = push(reviewsRef);
            set(newReviewRef, {
                id: newReviewRef.key,
                user: user?.username, 
                msg: text, 
                time: `${now.getHours()}:${now.getMinutes() < 10 ? '0'+now.getMinutes() : now.getMinutes()}`,
                date: now.toLocaleDateString()
            });
            setText(""); 
        } 
    };

    return (
        <div className="p-6 pt-20 max-w-3xl mx-auto min-h-screen">
            <div className="flex justify-between items-center mb-10">
                <button onClick={() => setPage('home')} className="text-pink-500 font-black text-[10px] uppercase">← Return</button>
                <h2 className="text-4xl font-black italic uppercase tracking-tighter text-pink-500">Real-Time Hub</h2>
            </div>
            <div className="flex gap-2 mb-10">
                <input className="flex-1 bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-pink-500 text-sm" 
                    value={text} onChange={(e)=>setText(e.target.value)} placeholder="Submit neural update..." />
                <button onClick={post} className="bg-pink-600 px-8 rounded-2xl font-black uppercase text-[10px] hover:bg-pink-500 shadow-lg shadow-pink-500/20">Post</button>
            </div>
            <div className="space-y-6">
                {reviews.map(r => ( 
                    <div key={r.id} className="p-6 bg-white/5 rounded-[2rem] border border-white/5 hover:border-pink-500/30 transition-all">
                        <p className="text-pink-400 font-black text-[11px] uppercase tracking-widest">@{r.user} {r.user === ADMIN_USER && "🛡️"}</p>
                        <p className="text-gray-300 text-sm italic mt-2">"{r.msg}"</p>
                    </div> 
                ))}
            </div>
        </div>
    );
};

// --- STATS, CERTIFICATE, GUIDE & UI HELPERS ---
const AnalyticsPage = ({ setPage, stats }) => {
    const totalWords = Math.floor((stats.totalCharsTyped || 0) / 5);
    return (
        <div className="p-6 pt-20 max-w-4xl mx-auto min-h-screen">
          <button onClick={() => setPage('home')} className="mb-8 text-green-500 font-black text-[10px] uppercase">← Back to Console</button>
          <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
            <h2 className="text-5xl font-black mb-10 italic uppercase tracking-tighter text-green-500">Neural Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <StatCard label="Total Focus Time" value={`${((stats.totalPlayTime || 0) / 60).toFixed(1)} Minutes`} color="text-green-400" />
              <StatCard label="Highest Sector" value={`Level ${stats.maxUnlocked}`} color="text-purple-400" />
              <StatCard label="Words Processed" value={totalWords} color="text-cyan-400" />
              <StatCard label="Experience Points" value={stats.maxUnlocked * 150} color="text-amber-400" />
            </div>
          </div>
        </div>
    );
};

const CertificatePage = ({ setPage, stats, user }) => {
    const getTier = (lv) => lv >= 200 ? "Legendary" : lv >= 100 ? "Elite" : lv >= 50 ? "Pro" : "Novice";
    return (
        <div className="p-6 md:p-20 flex flex-col items-center justify-center min-h-screen text-center bg-black">
          <button onClick={() => setPage('home')} className="mb-10 text-amber-500 font-black uppercase text-[10px] border border-amber-500/20 px-6 py-2 rounded-full">← System Exit</button>
          {stats.maxUnlocked < 50 ? (
            <h3 className="text-4xl font-black text-gray-700">SECTOR 50 REQUIRED FOR CERTIFICATE</h3>
          ) : (
            <div className="p-12 border-[12px] border-amber-600 bg-zinc-900 shadow-2xl max-w-2xl">
                <p className="text-amber-500 uppercase font-black mb-6">AyanX Official Certificate</p>
                <h1 className="text-5xl text-white font-black uppercase mb-10">{getTier(stats.maxUnlocked)} Operator</h1>
                <p className="text-cyan-500 text-3xl font-black italic uppercase mb-4">{user?.username}</p>
                <p className="text-gray-500 text-xs uppercase">Cleared Sector {stats.maxUnlocked}</p>
            </div>
          )}
        </div>
    );
};

const GuidePage = ({ setPage }) => (
  <div className="p-6 md:p-20 max-w-4xl mx-auto min-h-screen">
    <button onClick={() => setPage('home')} className="mb-10 text-cyan-500 font-black text-[10px] uppercase">← Back to Hub</button>
    <h2 className="text-6xl font-black italic uppercase tracking-tighter text-cyan-500 mb-12">Manual</h2>
    <div className="grid gap-6">
      <GuideCard icon="🚀" title="The Protocol" desc="Type sequences exactly. Mistakes cause mission failure." />
      <GuideCard icon="🌍" title="Global Rank" desc="Your progress is synced across all devices via AyanX Cloud." />
    </div>
  </div>
);

const GuideCard = ({ icon, title, desc }) => (
  <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] flex gap-8 items-center">
    <span className="text-5xl">{icon}</span>
    <div>
      <h4 className="font-black uppercase text-cyan-400 text-sm tracking-widest italic">{title}</h4>
      <p className="text-gray-400 text-xs font-medium">{desc}</p>
    </div>
  </div>
);

const MenuCard = ({ label, icon, onClick, color, isMobile }) => (
  <button onClick={onClick} className={`bg-gradient-to-br ${color} ${isMobile ? 'min-w-[150px] p-8' : 'p-10'} rounded-[3rem] border border-white/10 flex flex-col items-center justify-center transition-all active:scale-90 hover:brightness-110 shadow-2xl group`}>
    <span className={`${isMobile ? 'text-4xl' : 'text-5xl'} mb-3 transition-transform group-hover:scale-110`}>{icon}</span>
    <span className="font-black text-[10px] tracking-widest uppercase text-white italic">{label}</span>
  </button>
);

const StatCard = ({ label, value, color }) => (
  <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem]">
    <p className="text-[9px] font-black uppercase text-gray-600 mb-2 italic">{label}</p>
    <h3 className={`text-3xl font-black font-mono ${color}`}>{value}</h3>
  </div>
);

export default App;