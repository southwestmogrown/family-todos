import { useState, useEffect, useRef } from "react";

const CHORE_COMPLETED_KEY = "chore_completed";
const CHORE_OLIVER_POINTS_KEY = "chore_oliver_points";
const CHORE_WEEK_KEY = "chore_week";

/** Returns the ISO date string (YYYY-MM-DD) for the most recent Sunday in Central Time (CST/CDT). */
function getWeekKeyCST() {
  const now = new Date();
  // Get the current date components in America/Chicago (handles CST/CDT automatically)
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  }).formatToParts(now);
  const year  = parseInt(parts.find(p => p.type === "year").value, 10);
  const month = parseInt(parts.find(p => p.type === "month").value, 10) - 1;
  const day   = parseInt(parts.find(p => p.type === "day").value, 10);
  // Find the most recent Sunday (weekday 0) in Central Time
  const weekday = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].indexOf(
    parts.find(p => p.type === "weekday").value
  );
  const sundayDate = new Date(Date.UTC(year, month, day - weekday, 12));
  const sy = sundayDate.getUTCFullYear();
  const sm = String(sundayDate.getUTCMonth() + 1).padStart(2, "0");
  const sd = String(sundayDate.getUTCDate()).padStart(2, "0");
  return `${sy}-${sm}-${sd}`;
}

/** Loads persisted chore state, resetting it when a new week (Sunday CST) has begun. */
function loadChoreState() {
  try {
    const currentWeek = getWeekKeyCST();
    const storedWeek = localStorage.getItem(CHORE_WEEK_KEY);
    if (storedWeek !== currentWeek) {
      localStorage.removeItem(CHORE_COMPLETED_KEY);
      localStorage.removeItem(CHORE_OLIVER_POINTS_KEY);
      localStorage.setItem(CHORE_WEEK_KEY, currentWeek);
      return { completed: {}, oliverPoints: 0 };
    }
    const completed = JSON.parse(localStorage.getItem(CHORE_COMPLETED_KEY) || "{}");
    const oliverPoints = parseInt(localStorage.getItem(CHORE_OLIVER_POINTS_KEY) || "0", 10);
    return { completed, oliverPoints };
  } catch {
    return { completed: {}, oliverPoints: 0 };
  }
}

const MEMBERS = [
  { id: "dad",     name: "Dad",     emoji: "🦾", color: "#4a90d9", bg: "#1a2a3e" },
  { id: "jenny",   name: "Jenny",   emoji: "⭐", color: "#d97ab0", bg: "#3e1a2e" },
  { id: "oliver",  name: "Oliver",  emoji: "🦁", color: "#f0a030", bg: "#3e2a0a", age: 4 },
  { id: "lincoln", name: "Lincoln", emoji: "🐻", color: "#60c060", bg: "#0a2e0a", age: 1 },
];

const CHORES = {
  dad: {
    daily: [
      { id: "d_trash",   task: "Take out trash if full",          icon: "🗑️" },
      { id: "d_dishes",  task: "Wash / load dishes after dinner", icon: "🍽️" },
      { id: "d_sweep",   task: "Sweep kitchen floor",             icon: "🧹" },
    ],
    weekly: [
      { id: "w_garage",    task: "Tidy garage (15 min)",          icon: "🚗", day: "Sat" },
      { id: "w_vacuum",    task: "Vacuum living room",            icon: "🌀", day: "Wed" },
      { id: "w_lawn",      task: "Lawn / outdoor maintenance",    icon: "🌿", day: "Sat" },
      { id: "w_bathrooms", task: "Scrub both bathrooms",          icon: "🚿", day: "Sun" },
      { id: "w_laundry",   task: "Start and switch laundry",      icon: "👕", day: "Thu" },
    ],
  },
  jenny: {
    daily: [
      { id: "j_wipe",    task: "Wipe down kitchen counters", icon: "✨" },
      { id: "j_laundry", task: "Fold and put away laundry",  icon: "👚" },
      { id: "j_meals",   task: "Meal planning / prep",       icon: "🥗" },
    ],
    weekly: [
      { id: "jw_mop",     task: "Mop kitchen and bathrooms", icon: "🪣", day: "Sun" },
      { id: "jw_beds",    task: "Change bed linens",          icon: "🛏️", day: "Mon" },
      { id: "jw_grocery", task: "Grocery run or order",       icon: "🛒", day: "Wed" },
      { id: "jw_dust",    task: "Dust all surfaces",          icon: "🪄", day: "Fri" },
      { id: "jw_windows", task: "Wipe mirrors and windows",   icon: "🪟", day: "Sat" },
    ],
  },
  oliver: {
    daily: [
      { id: "o_toys",  task: "Put toys in the toy bin",              icon: "🧺", points: 2 },
      { id: "o_shoes", task: "Put shoes on the shoe rack",           icon: "👟", points: 1 },
      { id: "o_books", task: "Stack books neatly",                   icon: "📚", points: 1 },
      { id: "o_plate", task: "Carry plate to the sink after dinner", icon: "🍽️", points: 2 },
    ],
    weekly: [
      { id: "ow_wipe", task: "Help wipe the table with a cloth", icon: "🧽", day: "Sun", points: 3 },
      { id: "ow_feed", task: "Water a plant or help feed a pet",  icon: "🌱", day: "Wed", points: 3 },
      { id: "ow_sort", task: "Sort clean socks into pairs!",      icon: "🧦", day: "Fri", points: 4 },
    ],
  },
  lincoln: {
    daily: [
      { id: "l_block", task: "Drop ONE block in the bucket", icon: "🟦", points: 5 },
      { id: "l_wave",  task: "Wave bye-bye to the mess!",    icon: "👋", points: 5 },
    ],
    weekly: [
      { id: "lw_clap", task: "Clap for the family cleaning crew!", icon: "👏", day: "Sat", points: 10 },
    ],
  },
};

const REWARDS = [
  { points: 5,  label: "Pick tonight's bedtime book",  icon: "📖" },
  { points: 10, label: "Choose dessert this week",      icon: "🍦" },
  { points: 20, label: "Adventure day with Mom or Dad", icon: "🎈" },
  { points: 35, label: "Movie night pick",              icon: "🍿" },
  { points: 50, label: "Toy store trip",                icon: "🏪" },
];

const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const todayName = DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
const POPS = ["🎉","⭐","🏆","🎊","🔥","💥","✨"];

function Confetti({ active }) {
  const colors = ["#f0a030","#4a90d9","#d97ab0","#60c060","#ff6b6b","#ffd700","#a78bfa"];
  if (!active) return null;
  return (
    <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:998, overflow:"hidden" }}>
      <style>{`@keyframes confettiFall { to { transform: translateY(110vh) rotate(720deg); opacity:0; } }`}</style>
      {Array.from({length:28}).map((_,i) => (
        <div key={i} style={{
          position:"absolute",
          left:`${10 + Math.random()*80}%`,
          top:"-16px",
          width: 8 + Math.random()*6,
          height: 8 + Math.random()*6,
          borderRadius: Math.random()>0.5 ? "50%" : "2px",
          background: colors[i % colors.length],
          animation:`confettiFall ${1 + Math.random()*1.4}s ease-in forwards`,
          animationDelay:`${Math.random()*0.6}s`,
        }}/>
      ))}
    </div>
  );
}

function Burst({ bursts }) {
  return (
    <>
      <style>{`@keyframes popUp { 0%{opacity:1;transform:translateY(0) scale(0.5)} 60%{opacity:1;transform:translateY(-32px) scale(1.2)} 100%{opacity:0;transform:translateY(-60px) scale(1)} }`}</style>
      {bursts.map(b => (
        <div key={b.id} style={{
          position:"fixed", left: b.x - 20, top: b.y - 10,
          zIndex:9999, pointerEvents:"none",
          fontSize:26,
          animation:"popUp 0.85s ease-out forwards",
        }}>{b.emoji}</div>
      ))}
    </>
  );
}

export default function ChoreChart() {
  // Load persisted state once per mount (not twice) via a ref cache
  const initRef = useRef(undefined);
  const getInit = () => {
    if (initRef.current === undefined) initRef.current = loadChoreState();
    return initRef.current;
  };

  const [activeMember, setActiveMember] = useState("oliver");
  const [view, setView] = useState("daily");
  const [completed, setCompleted] = useState(() => getInit().completed);
  const [oliverPoints, setOliverPoints] = useState(() => getInit().oliverPoints);
  const [bursts, setBursts] = useState([]);
  const [confetti, setConfetti] = useState(false);

  useEffect(() => {
    try { localStorage.setItem(CHORE_COMPLETED_KEY, JSON.stringify(completed)); } catch {}
  }, [completed]);

  useEffect(() => {
    try { localStorage.setItem(CHORE_OLIVER_POINTS_KEY, String(oliverPoints)); } catch {}
  }, [oliverPoints]);

  const member = MEMBERS.find(m => m.id === activeMember);
  const chores = CHORES[activeMember];
  const list = view === "daily" ? chores.daily : chores.weekly;
  const isKid = activeMember === "oliver" || activeMember === "lincoln";

  const getKey = (mid, cid, isWeekly) => isWeekly ? `wk_${mid}_${cid}` : `day_${mid}_${cid}`;

  const handleTap = (choreId, points, isWeekly, e) => {
    const key = getKey(activeMember, choreId, isWeekly);
    const wasDone = completed[key];
    setCompleted(prev => ({ ...prev, [key]: !prev[key] }));

    if (!wasDone) {
      const rect = e.currentTarget.getBoundingClientRect();
      const id = Date.now() + Math.random();
      const emoji = POPS[Math.floor(Math.random() * POPS.length)];
      setBursts(prev => [...prev, { id, x: rect.left + rect.width/2, y: rect.top, emoji }]);
      setTimeout(() => setBursts(prev => prev.filter(b => b.id !== id)), 900);
      if (isKid && points) {
        setConfetti(true);
        setTimeout(() => setConfetti(false), 2000);
        if (activeMember === "oliver") setOliverPoints(p => p + points);
      }
    } else {
      if (activeMember === "oliver" && points) setOliverPoints(p => Math.max(0, p - points));
    }
  };

  const progressFor = (mid) => {
    const all = [...CHORES[mid].daily, ...CHORES[mid].weekly.filter(c => c.day === todayName)];
    const done = all.filter(c => completed[getKey(mid, c.id, !!c.day)]).length;
    return { done, total: all.length };
  };

  const nextReward = REWARDS.find(r => r.points > oliverPoints);
  const prevPts = [...REWARDS].reverse().find(r => r.points <= oliverPoints)?.points || 0;
  const pct = nextReward ? Math.min(100, ((oliverPoints - prevPts) / (nextReward.points - prevPts)) * 100) : 100;

  return (
    <div style={{ fontFamily:"'Segoe UI',Tahoma,sans-serif", minHeight:"100vh", background:"#0d0f18", color:"#e8e4f0" }}>
      <Burst bursts={bursts} />
      <Confetti active={confetti} />

      {/* Header */}
      <div style={{ background:"linear-gradient(135deg,#161028,#0d0f18)", padding:"24px 20px 16px", borderBottom:"1px solid #231d38" }}>
        <div style={{ maxWidth:680, margin:"0 auto" }}>
          <div style={{ fontSize:10, letterSpacing:5, color:"#8060c0", textTransform:"uppercase", marginBottom:5 }}>Family HQ</div>
          <h1 style={{ margin:0, fontSize:26, fontWeight:"normal", color:"#f0ecff", letterSpacing:1 }}>🏠 Chore Chart</h1>
          <p style={{ margin:"4px 0 14px", fontSize:12, color:"#504878", fontStyle:"italic" }}>
            {new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})} · Today is {todayName}
          </p>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
            {MEMBERS.map(m => {
              const { done, total } = progressFor(m.id);
              const allDone = done === total && total > 0;
              return (
                <div key={m.id} style={{
                  background: allDone ? m.bg : "#16122a",
                  border:`1px solid ${allDone ? m.color+"88" : m.color+"22"}`,
                  borderRadius:10, padding:"8px 14px",
                  display:"flex", alignItems:"center", gap:8,
                }}>
                  <span style={{fontSize:18}}>{m.emoji}</span>
                  <div>
                    <div style={{fontSize:11, color:m.color, fontWeight:"bold"}}>{m.name}</div>
                    <div style={{fontSize:10, color:"#504878"}}>{done}/{total} today</div>
                  </div>
                  {allDone && <span>✅</span>}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ maxWidth:680, margin:"0 auto", padding:"20px 16px" }}>

        {/* Oliver points */}
        <div style={{ background:"linear-gradient(135deg,#2a1800,#1c1000)", border:"1px solid #f0a03044", borderRadius:14, padding:"16px 20px", marginBottom:18 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:10 }}>
            <div>
              <div style={{fontSize:10, letterSpacing:3, color:"#f0a030", textTransform:"uppercase"}}>🦁 Oliver's Star Points</div>
              <div style={{fontSize:32, fontWeight:"bold", color:"#ffd700", marginTop:2}}>⭐ {oliverPoints}</div>
            </div>
            {nextReward && (
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:10, color:"#806030", textTransform:"uppercase", letterSpacing:2}}>Next reward</div>
                <div style={{fontSize:14, color:"#f0c060", marginTop:2}}>{nextReward.icon} {nextReward.label}</div>
                <div style={{fontSize:11, color:"#604020", marginTop:2}}>{nextReward.points - oliverPoints} pts to go!</div>
              </div>
            )}
            {!nextReward && <div style={{fontSize:14, color:"#ffd700"}}>🏆 All rewards unlocked!</div>}
          </div>
          <div style={{background:"#1a0e00", borderRadius:99, height:8, marginTop:12, overflow:"hidden"}}>
            <div style={{ height:"100%", borderRadius:99, background:"linear-gradient(90deg,#f0a030,#ffd700)", width:`${pct}%`, transition:"width 0.5s ease" }}/>
          </div>
          <div style={{display:"flex", gap:6, marginTop:12, flexWrap:"wrap"}}>
            {REWARDS.map(r => (
              <div key={r.points} style={{
                padding:"3px 10px", borderRadius:20, fontSize:11,
                background: oliverPoints >= r.points ? "#3a2800" : "#160e00",
                color: oliverPoints >= r.points ? "#ffd700" : "#503010",
                border:`1px solid ${oliverPoints >= r.points ? "#f0a03066" : "#2a180055"}`,
              }}>
                {oliverPoints >= r.points ? "✓ " : ""}{r.icon} {r.points}★
              </div>
            ))}
          </div>
        </div>

        {/* Member tabs */}
        <div style={{display:"flex", gap:8, marginBottom:16, flexWrap:"wrap"}}>
          {MEMBERS.map(m => (
            <button key={m.id} onClick={() => { setActiveMember(m.id); setView("daily"); }} style={{
              padding:"9px 16px", borderRadius:40, cursor:"pointer", fontFamily:"inherit", fontSize:13,
              border: activeMember===m.id ? "none" : `1px solid ${m.color}33`,
              background: activeMember===m.id ? m.color : m.bg,
              color: activeMember===m.id ? "#fff" : m.color,
              fontWeight: activeMember===m.id ? "bold" : "normal",
              display:"flex", alignItems:"center", gap:7,
            }}>
              <span style={{fontSize:17}}>{m.emoji}</span>{m.name}
              {m.age && <span style={{fontSize:10, opacity:0.65}}>age {m.age}</span>}
            </button>
          ))}
        </div>

        {/* View toggle */}
        <div style={{display:"flex", gap:0, marginBottom:18, background:"#16122a", borderRadius:10, padding:4, width:"fit-content"}}>
          {["daily","weekly"].map(v => (
            <button key={v} onClick={() => setView(v)} style={{
              padding:"7px 20px", borderRadius:7, border:"none", cursor:"pointer",
              background: view===v ? member.color : "transparent",
              color: view===v ? "#fff" : "#504878",
              fontFamily:"inherit", fontSize:13,
              fontWeight: view===v ? "bold" : "normal",
              textTransform:"capitalize", letterSpacing:1,
            }}>{v}</button>
          ))}
        </div>

        {/* Chore list */}
        <div style={{display:"flex", flexDirection:"column", gap:10}}>
          {list.map(chore => {
            const key = getKey(activeMember, chore.id, !!chore.day);
            const done = !!completed[key];
            const isToday = !chore.day || chore.day === todayName;
            return (
              <div key={chore.id}
                onClick={e => isToday && handleTap(chore.id, chore.points, !!chore.day, e)}
                style={{
                  background: done ? member.bg : "#14102a",
                  border:`1px solid ${done ? member.color+"99" : "#231d38"}`,
                  borderRadius:14, padding:"15px 18px",
                  display:"flex", alignItems:"center", gap:14,
                  cursor: isToday ? "pointer" : "default",
                  opacity: isToday ? 1 : 0.4,
                  transition:"border 0.2s, background 0.2s",
                  position:"relative", overflow:"hidden",
                }}
              >
                {done && <div style={{
                  position:"absolute", inset:0,
                  background:`radial-gradient(ellipse at 10% 50%, ${member.color}18 0%, transparent 65%)`,
                  pointerEvents:"none",
                }}/>}
                <div style={{
                  width:30, height:30, borderRadius:"50%", flexShrink:0,
                  border:`2px solid ${done ? member.color : "#322848"}`,
                  background: done ? member.color : "transparent",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:14, color:"#fff",
                  boxShadow: done ? `0 0 10px ${member.color}55` : "none",
                  transition:"all 0.2s",
                }}>
                  {done && "✓"}
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:15, color: done ? member.color : "#ddd8f0", fontWeight: done ? "bold" : "normal"}}>
                    {chore.icon} {chore.task}
                  </div>
                  <div style={{fontSize:11, color:"#3d3660", marginTop:3, display:"flex", gap:10}}>
                    {chore.day && <span>📅 {chore.day}</span>}
                    {chore.points && <span style={{color:"#b08020"}}>⭐ +{chore.points} pts</span>}
                    {!isToday && <span>Not scheduled today</span>}
                  </div>
                </div>
                {done && isKid && <span style={{fontSize:22}}>🎉</span>}
              </div>
            );
          })}
        </div>

        {/* Kid notes */}
        {activeMember === "lincoln" && (
          <div style={{marginTop:18, background:"#0a1e10", border:"1px solid #60c06033", borderRadius:12, padding:"14px 18px", fontSize:13, color:"#5a9a5a", lineHeight:1.7}}>
            🐻 <strong style={{color:"#60c060"}}>Lincoln is 1!</strong> His "chores" are just play and participation. Dropping a block in a bucket is a huge deal at his age — celebrate everything. You're building lifelong habits. 💚
          </div>
        )}
        {activeMember === "oliver" && (
          <div style={{marginTop:18, background:"#1c1200", border:"1px solid #f0a03033", borderRadius:12, padding:"14px 18px", fontSize:13, color:"#907040", lineHeight:1.7}}>
            🦁 <strong style={{color:"#f0a030"}}>Tips for Oliver:</strong> Make it a game — set a timer, sing a cleanup song, or race to finish together. At 4, effort beats perfection every time. Cheer him on! 🎊
          </div>
        )}

        <div style={{textAlign:"center", padding:"22px 0 8px", fontSize:11, color:"#2e2848", letterSpacing:2, textTransform:"uppercase"}}>
          Tap a chore to mark it done · Resets every Sunday
        </div>
      </div>
    </div>
  );
}
