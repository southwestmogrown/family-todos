import { useState, useEffect, useRef } from "react";

// ── Palette ──────────────────────────────────────────────────────────────────
const C = {
  bg:      "#0b0e12",
  surface: "#111418",
  card:    "#161b22",
  border:  "#1e2530",
  text:    "#c8d0dc",
  muted:   "#4a5568",
  accent:  "#38bdf8",
};

// ── Tracker definitions ───────────────────────────────────────────────────────
const TRACKERS = [
  {
    id: "breath",
    label: "Breathwork",
    icon: "◎",
    color: "#38bdf8",
    unit: "sessions",
    target: 2,
    nudges: [
      "Box breathing: 4 in · 4 hold · 4 out · 4 hold. Do it now.",
      "Stop. Breathe in for 4 counts. Hold 4. Out 6. Again.",
      "Your nervous system is wound up. Two minutes of slow breathing fixes that.",
      "4-7-8: inhale 4, hold 7, exhale 8. Three rounds. Go.",
      "You've been breathing wrong all day. Fix it for two minutes.",
    ],
    guide: "Aim for 2 sessions — morning and one when stress hits. Even 5 deep breaths counts.",
  },
  {
    id: "meditate",
    label: "Meditation",
    icon: "◈",
    color: "#818cf8",
    unit: "min",
    target: 10,
    nudges: [
      "Sit down. Close your eyes. Five minutes. That's it.",
      "You don't need an app. Sit still and watch your thoughts for 5 minutes.",
      "The neck pain gets worse when you're tense. Meditate.",
      "Even 3 minutes of stillness rewires your stress response. Do it.",
      "Close the tab. Sit. Breathe. Nothing else for 5 minutes.",
    ],
    guide: "No target — whatever you log is a win. Start with 5 min if 10 feels too long.",
  },
  {
    id: "music",
    label: "Music",
    icon: "♩",
    color: "#f472b6",
    unit: "min",
    target: 15,
    nudges: [
      "Pick up the instrument. 10 minutes. No excuses.",
      "Even noodling counts. Get your hands on it.",
      "Music is the one thing that uses both sides of your brain at once. Use it.",
      "You don't have to be good today. You just have to play.",
      "15 minutes of music practice beats an hour of doomscrolling. Go.",
    ],
    guide: "Playing, singing, or even focused listening all count. Log what you do.",
  },
  {
    id: "mind",
    label: "Mind Work",
    icon: "⬡",
    color: "#34d399",
    unit: "min",
    target: 10,
    nudges: [
      "Read something. Learn something. Work a puzzle. Use your brain intentionally.",
      "10 minutes of focused mental work beats an hour of passive scrolling.",
      "Your brain needs exercise too. Give it something hard.",
      "Read one article. Finish one puzzle. Learn one thing. That's the bar.",
      "Mental sharpness is a skill. Practice it today.",
    ],
    guide: "Puzzles, reading, learning, strategy games — anything that demands real focus.",
  },
  {
    id: "journal",
    label: "Gratitude",
    icon: "✦",
    color: "#fbbf24",
    unit: "entries",
    target: 1,
    nudges: [
      "Write three things you're grateful for. Right now. Takes 90 seconds.",
      "You have two kids who think you're a hero. Write it down.",
      "Gratitude journaling literally changes brain chemistry. One entry. Go.",
      "Three things. They don't have to be big. Just real.",
      "Name one good thing that happened today. Write it down.",
    ],
    guide: "One honest entry per day is enough. Three things you're grateful for — done.",
  },
  {
    id: "water",
    label: "Water",
    icon: "◇",
    color: "#22d3ee",
    unit: "glasses",
    target: 8,
    nudges: [
      "Drink a glass of water right now. Seriously.",
      "Joint pain is worse when you're dehydrated. Drink up.",
      "If you have a headache, drink water first.",
      "You're probably already behind. Catch up.",
      "Coffee doesn't count. Drink actual water.",
    ],
    guide: "8 glasses (64oz). Tap the + every time you finish one.",
  },
];

// ── Breathing animation ───────────────────────────────────────────────────────
function BreathCircle({ onClose }) {
  const [phase, setPhase] = useState("ready"); // ready | in | hold | out | hold2 | done
  const [count, setCount] = useState(0);
  const [round, setRound] = useState(0);
  const TOTAL = 4;
  const timerRef = useRef(null);

  const PHASES = [
    { key: "in",    label: "Breathe In",  dur: 4, next: "hold"  },
    { key: "hold",  label: "Hold",         dur: 4, next: "out"   },
    { key: "out",   label: "Breathe Out",  dur: 4, next: "hold2" },
    { key: "hold2", label: "Hold",         dur: 4, next: "in"    },
  ];

  const phaseData = PHASES.find(p => p.key === phase);

  useEffect(() => {
    if (phase === "ready" || phase === "done") return;
    if (!phaseData) return;
    if (count < phaseData.dur) {
      timerRef.current = setTimeout(() => setCount(c => c + 1), 1000);
    } else {
      const nextPhase = phaseData.next;
      if (nextPhase === "in") {
        const newRound = round + 1;
        if (newRound >= TOTAL) { setPhase("done"); return; }
        setRound(newRound);
      }
      setPhase(nextPhase);
      setCount(0);
    }
    return () => clearTimeout(timerRef.current);
  }, [phase, count]);

  const circleScale = phase === "in" ? 1.5 : phase === "out" ? 0.8 : phase === "hold" ? 1.5 : 0.8;
  const progress = phaseData ? (count / phaseData.dur) * 100 : 0;

  return (
    <div style={{
      position:"fixed", inset:0, background:"#000000cc",
      display:"flex", alignItems:"center", justifyContent:"center",
      zIndex:1000, flexDirection:"column", gap:32,
    }}>
      <div style={{ fontSize:13, color:C.muted, letterSpacing:4, textTransform:"uppercase" }}>
        Box Breathing · Round {Math.min(round+1, TOTAL)} of {TOTAL}
      </div>

      {phase === "ready" && (
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:18, color:C.text, marginBottom:24 }}>4 rounds · ~64 seconds</div>
          <button onClick={() => { setPhase("in"); setCount(0); }} style={{
            padding:"14px 40px", borderRadius:40, border:"none",
            background:"#38bdf8", color:"#000", fontSize:15, fontWeight:"bold",
            cursor:"pointer", letterSpacing:2,
          }}>BEGIN</button>
        </div>
      )}

      {phase === "done" && (
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:32, marginBottom:8 }}>◎</div>
          <div style={{ fontSize:20, color:C.text, marginBottom:24 }}>Done. That's one session.</div>
          <button onClick={onClose} style={{
            padding:"14px 40px", borderRadius:40, border:"none",
            background:"#38bdf8", color:"#000", fontSize:15, fontWeight:"bold",
            cursor:"pointer", letterSpacing:2,
          }}>LOG IT</button>
        </div>
      )}

      {phaseData && phase !== "ready" && phase !== "done" && (
        <>
          <div style={{ position:"relative", width:200, height:200, display:"flex", alignItems:"center", justifyContent:"center" }}>
            {/* SVG ring */}
            <svg width="200" height="200" style={{position:"absolute",top:0,left:0,transform:"rotate(-90deg)"}}>
              <circle cx="100" cy="100" r="88" fill="none" stroke={C.border} strokeWidth="3"/>
              <circle cx="100" cy="100" r="88" fill="none" stroke="#38bdf8" strokeWidth="3"
                strokeDasharray={`${2*Math.PI*88}`}
                strokeDashoffset={`${2*Math.PI*88*(1-progress/100)}`}
                style={{transition:"stroke-dashoffset 0.9s linear"}}
              />
            </svg>
            {/* breathing circle */}
            <div style={{
              width:100, height:100, borderRadius:"50%",
              background:"radial-gradient(circle, #38bdf822 0%, #38bdf811 100%)",
              border:"1px solid #38bdf844",
              transform:`scale(${circleScale})`,
              transition: phase==="in" ? "transform 4s ease-in" : phase==="out" ? "transform 4s ease-out" : "transform 0.3s",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:28, color:"#38bdf8",
            }}>
              {phaseData.dur - count}
            </div>
          </div>
          <div style={{ fontSize:22, color:C.text, letterSpacing:3, textTransform:"uppercase" }}>{phaseData.label}</div>
        </>
      )}

      {phase !== "ready" && phase !== "done" && (
        <button onClick={onClose} style={{
          padding:"8px 24px", borderRadius:40,
          border:"1px solid #1e2530", background:"transparent",
          color:C.muted, fontSize:12, cursor:"pointer", letterSpacing:2,
        }}>EXIT</button>
      )}
    </div>
  );
}

// ── Log modal ─────────────────────────────────────────────────────────────────
function LogModal({ tracker, current, onLog, onClose }) {
  const [val, setVal] = useState(tracker.unit === "entries" ? 1 : tracker.unit === "sessions" ? 1 : 5);
  return (
    <div style={{
      position:"fixed", inset:0, background:"#000000bb",
      display:"flex", alignItems:"center", justifyContent:"center", zIndex:900,
    }}>
      <div style={{
        background:C.card, border:`1px solid ${C.border}`,
        borderRadius:16, padding:"28px 32px", width:300,
        boxShadow:"0 24px 64px #00000088",
      }}>
        <div style={{ fontSize:11, letterSpacing:4, color:tracker.color, textTransform:"uppercase", marginBottom:6 }}>{tracker.icon} {tracker.label}</div>
        <div style={{ fontSize:13, color:C.muted, marginBottom:20, lineHeight:1.6 }}>{tracker.guide}</div>

        {tracker.unit === "glasses" ? (
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:20, marginBottom:24 }}>
            <button onClick={() => setVal(v => Math.max(0, v-1))} style={{ width:40,height:40,borderRadius:"50%",border:`1px solid ${C.border}`,background:"transparent",color:C.text,fontSize:20,cursor:"pointer" }}>−</button>
            <div style={{ fontSize:36, color:tracker.color, fontWeight:"bold", minWidth:50, textAlign:"center" }}>{val}</div>
            <button onClick={() => setVal(v => v+1)} style={{ width:40,height:40,borderRadius:"50%",border:`1px solid ${C.border}`,background:"transparent",color:C.text,fontSize:20,cursor:"pointer" }}>+</button>
          </div>
        ) : tracker.unit === "entries" || tracker.unit === "sessions" ? (
          <div style={{ fontSize:28, color:tracker.color, textAlign:"center", marginBottom:24 }}>
            {val} {tracker.unit}
          </div>
        ) : (
          <div style={{ marginBottom:24 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
              <span style={{ fontSize:13, color:C.muted }}>Minutes</span>
              <span style={{ fontSize:18, color:tracker.color, fontWeight:"bold" }}>{val}</span>
            </div>
            <input type="range" min={1} max={60} value={val} onChange={e => setVal(Number(e.target.value))}
              style={{ width:"100%", accentColor:tracker.color }} />
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:C.muted, marginTop:4 }}>
              <span>1</span><span>30</span><span>60</span>
            </div>
          </div>
        )}

        <div style={{ display:"flex", gap:10 }}>
          <button onClick={onClose} style={{
            flex:1, padding:"11px", borderRadius:10,
            border:`1px solid ${C.border}`, background:"transparent",
            color:C.muted, fontFamily:"inherit", fontSize:13, cursor:"pointer",
          }}>Cancel</button>
          <button onClick={() => { onLog(val); onClose(); }} style={{
            flex:2, padding:"11px", borderRadius:10, border:"none",
            background:tracker.color, color:"#000",
            fontFamily:"inherit", fontSize:13, fontWeight:"bold", cursor:"pointer", letterSpacing:1,
          }}>Log It</button>
        </div>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function WellnessTracker() {
  const [logs, setLogs]           = useState({}); // { id: number }
  const [nudgeIdx, setNudgeIdx]   = useState(() => Object.fromEntries(TRACKERS.map(t => [t.id, 0])));
  const [logging, setLogging]     = useState(null); // tracker id
  const [breathing, setBreathing] = useState(false);
  const [lastNudge, setLastNudge] = useState(null); // { id, text }
  const [noteText, setNoteText]   = useState("");
  const [noteSaved, setNoteSaved] = useState(false);

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Morning." : hour < 17 ? "Afternoon." : "Evening.";
  const dateStr = now.toLocaleDateString("en-US", { weekday:"long", month:"long", day:"numeric" });

  const totalDone = TRACKERS.filter(t => (logs[t.id] || 0) >= t.target).length;
  const pct = Math.round((totalDone / TRACKERS.length) * 100);

  const nudge = (t) => {
    const idx = nudgeIdx[t.id];
    const text = t.nudges[idx % t.nudges.length];
    setLastNudge({ id: t.id, text });
    setNudgeIdx(prev => ({ ...prev, [t.id]: idx + 1 }));
    setTimeout(() => setLastNudge(n => n?.id === t.id ? null : n), 5000);
  };

  const logVal = (id, val) => {
    setLogs(prev => ({ ...prev, [id]: (prev[id] || 0) + val }));
  };

  const activeTracker = logging ? TRACKERS.find(t => t.id === logging) : null;

  return (
    <div style={{ fontFamily:"'Courier New', Courier, monospace", minHeight:"100vh", background:C.bg, color:C.text }}>
      {breathing && <BreathCircle onClose={() => { setBreathing(false); logVal("breath", 1); }} />}
      {activeTracker && (
        <LogModal
          tracker={activeTracker}
          current={logs[activeTracker.id] || 0}
          onLog={val => logVal(activeTracker.id, val)}
          onClose={() => setLogging(null)}
        />
      )}

      {/* Nudge toast */}
      {lastNudge && (
        <div style={{
          position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)",
          background:"#1a1f2a", border:`1px solid ${TRACKERS.find(t=>t.id===lastNudge.id)?.color}55`,
          borderRadius:12, padding:"14px 20px", zIndex:800,
          maxWidth:340, fontSize:13, color:C.text, lineHeight:1.6,
          boxShadow:"0 8px 32px #00000088",
          animation:"slideUp 0.3s ease",
        }}>
          <style>{`@keyframes slideUp { from { opacity:0; transform:translateX(-50%) translateY(16px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }`}</style>
          {lastNudge.text}
        </div>
      )}

      {/* Header */}
      <div style={{ borderBottom:`1px solid ${C.border}`, padding:"28px 24px 20px" }}>
        <div style={{ maxWidth:640, margin:"0 auto" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:12 }}>
            <div>
              <div style={{ fontSize:11, letterSpacing:5, color:C.muted, textTransform:"uppercase", marginBottom:6 }}>{dateStr}</div>
              <h1 style={{ margin:0, fontSize:28, fontWeight:"normal", color:"#e8eef5", letterSpacing:2 }}>{greeting}</h1>
              <p style={{ margin:"6px 0 0", fontSize:12, color:C.muted }}>Daily wellness check-in. No fluff.</p>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:36, fontWeight:"bold", color: pct===100 ? "#34d399" : C.accent }}>{pct}%</div>
              <div style={{ fontSize:11, color:C.muted, letterSpacing:2, textTransform:"uppercase" }}>{totalDone}/{TRACKERS.length} complete</div>
            </div>
          </div>

          {/* Master progress bar */}
          <div style={{ marginTop:18, background:C.border, borderRadius:99, height:3, overflow:"hidden" }}>
            <div style={{
              height:"100%", borderRadius:99,
              background: pct===100 ? "#34d399" : `linear-gradient(90deg, ${C.accent}, #818cf8)`,
              width:`${pct}%`, transition:"width 0.5s ease",
            }}/>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:640, margin:"0 auto", padding:"24px 20px" }}>

        {/* Tracker cards */}
        <div style={{ display:"flex", flexDirection:"column", gap:2, marginBottom:32 }}>
          {TRACKERS.map((t, i) => {
            const val = logs[t.id] || 0;
            const done = val >= t.target;
            const barPct = Math.min(100, (val / t.target) * 100);
            const isBreath = t.id === "breath";

            return (
              <div key={t.id} style={{
                background: done ? "#0d1a14" : C.card,
                border:`1px solid ${done ? t.color+"44" : C.border}`,
                borderRadius: i===0 ? "12px 12px 4px 4px" : i===TRACKERS.length-1 ? "4px 4px 12px 12px" : "4px",
                padding:"18px 20px",
                transition:"background 0.3s",
              }}>
                <div style={{ display:"flex", alignItems:"center", gap:16 }}>

                  {/* Icon + label */}
                  <div style={{ fontSize:22, color:done ? t.color : C.muted, minWidth:28, textAlign:"center" }}>{t.icon}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:6 }}>
                      <span style={{ fontSize:13, letterSpacing:2, textTransform:"uppercase", color:done ? t.color : C.text }}>{t.label}</span>
                      <span style={{ fontSize:12, color:done ? t.color : C.muted, fontWeight:"bold" }}>
                        {val} / {t.target} {t.unit}
                      </span>
                    </div>
                    <div style={{ background:C.border, borderRadius:99, height:2, overflow:"hidden" }}>
                      <div style={{
                        height:"100%", borderRadius:99, background:t.color,
                        width:`${barPct}%`, transition:"width 0.4s ease",
                      }}/>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                    <button
                      onClick={() => nudge(t)}
                      title="Get a nudge"
                      style={{
                        width:34, height:34, borderRadius:8,
                        border:`1px solid ${C.border}`, background:"transparent",
                        color:C.muted, fontSize:14, cursor:"pointer",
                        display:"flex", alignItems:"center", justifyContent:"center",
                      }}
                    >!</button>
                    <button
                      onClick={() => isBreath ? setBreathing(true) : (t.unit === "glasses" ? logVal(t.id, 1) : setLogging(t.id))}
                      style={{
                        padding:"0 14px", height:34, borderRadius:8, border:"none",
                        background: done ? t.color+"33" : t.color,
                        color: done ? t.color : "#000",
                        fontSize:12, fontWeight:"bold", cursor:"pointer",
                        letterSpacing:1, fontFamily:"inherit",
                        whiteSpace:"nowrap",
                      }}
                    >
                      {t.unit === "glasses" ? "+ Glass" : isBreath ? "Breathe" : "+ Log"}
                    </button>
                  </div>
                </div>
                {done && (
                  <div style={{ marginTop:10, marginLeft:44, fontSize:11, color:t.color, letterSpacing:2, textTransform:"uppercase" }}>
                    ✓ Done for today
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Quick reference */}
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:"18px 20px", marginBottom:20 }}>
          <div style={{ fontSize:10, letterSpacing:4, color:C.muted, textTransform:"uppercase", marginBottom:14 }}>Quick Reference</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px 24px" }}>
            {[
              { label:"Box Breath",  desc:"4 in · 4 hold · 4 out · 4 hold" },
              { label:"4-7-8",       desc:"4 in · 7 hold · 8 out" },
              { label:"Meditation",  desc:"Sit. Eyes closed. Watch thoughts." },
              { label:"Mind Work",   desc:"Puzzle, read, learn — stay focused." },
              { label:"Gratitude",   desc:"3 things. Specific. Honest." },
              { label:"Water",       desc:"8 glasses. Start before you're thirsty." },
            ].map(item => (
              <div key={item.label}>
                <div style={{ fontSize:11, color:C.accent, letterSpacing:1, textTransform:"uppercase", marginBottom:2 }}>{item.label}</div>
                <div style={{ fontSize:12, color:C.muted, lineHeight:1.5 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Journal note */}
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:"18px 20px" }}>
          <div style={{ fontSize:10, letterSpacing:4, color:C.muted, textTransform:"uppercase", marginBottom:12 }}>✦ Today's Note</div>
          <textarea
            value={noteText}
            onChange={e => { setNoteText(e.target.value); setNoteSaved(false); }}
            placeholder="Three things you're grateful for. Or whatever's on your mind. No rules."
            style={{
              width:"100%", minHeight:90, background:C.surface,
              border:`1px solid ${C.border}`, borderRadius:8,
              color:C.text, fontFamily:"inherit", fontSize:13,
              padding:"12px 14px", resize:"vertical", lineHeight:1.7,
              boxSizing:"border-box", outline:"none",
            }}
          />
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:10 }}>
            <span style={{ fontSize:11, color: noteSaved ? "#34d399" : C.muted }}>
              {noteSaved ? "✓ Logged" : noteText.length > 0 ? `${noteText.length} chars` : ""}
            </span>
            <button
              onClick={() => { if (noteText.trim()) { logVal("journal", 1); setNoteSaved(true); } }}
              disabled={!noteText.trim()}
              style={{
                padding:"8px 20px", borderRadius:8, border:"none",
                background: noteText.trim() ? "#fbbf24" : C.border,
                color: noteText.trim() ? "#000" : C.muted,
                fontFamily:"inherit", fontSize:12, fontWeight:"bold",
                cursor: noteText.trim() ? "pointer" : "default",
                letterSpacing:1,
              }}
            >Log Entry</button>
          </div>
        </div>

        <div style={{ textAlign:"center", padding:"24px 0 8px", fontSize:10, color:C.border, letterSpacing:3, textTransform:"uppercase" }}>
          ! = get a nudge · Data resets each session
        </div>
      </div>
    </div>
  );
}
