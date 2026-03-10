import { useState, useEffect } from "react";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const PLAN = [
  {
    day: "Monday",
    label: "Upper Body (Gentle)",
    focus: "Shoulders, neck relief, upper back mobility",
    warmup: "5 min: Neck rolls, shoulder circles, arm swings, cat-cow stretches",
    exercises: [
      { name: "Wall Angels", sets: "3", reps: "10", notes: "Back flat against wall. Slow & controlled. Great for upper back/neck.", equipment: "Bodyweight" },
      { name: "Dumbbell Shrug", sets: "3", reps: "12", notes: "Light weight only. Release tension at top. Do NOT go heavy.", equipment: "Dumbbells" },
      { name: "Seated Dumbbell Press", sets: "3", reps: "10", notes: "Sit on bench. Keep back supported. Start very light.", equipment: "Dumbbells + Bench" },
      { name: "Dumbbell Row (single arm)", sets: "3", reps: "10 each", notes: "Brace on bench. Pull elbow back, not up. Relieves back tension.", equipment: "Dumbbell + Bench" },
      { name: "Band/Dumbbell Face Pull (light)", sets: "3", reps: "15", notes: "Light weight, high reps. Crucial for shoulder health.", equipment: "Dumbbells" },
    ],
    cooldown: "5 min: Doorway chest stretch, chin tucks, upper trap stretch (hold 30s each)",
    rest: false,
  },
  {
    day: "Tuesday",
    label: "Lower Body + Core",
    focus: "Legs, hips, gentle core activation",
    warmup: "5 min: Hip circles, bodyweight squats, leg swings, glute bridges",
    exercises: [
      { name: "Goblet Squat", sets: "3", reps: "12", notes: "Hold kettlebell at chest. Keep chest up, heels down. Joint-friendly.", equipment: "Kettlebell" },
      { name: "Romanian Deadlift", sets: "3", reps: "10", notes: "Hip hinge — push hips BACK. Keep bar close to legs. Light weight.", equipment: "Barbell" },
      { name: "Step-Up (onto bench)", sets: "3", reps: "10 each leg", notes: "Drive through heel. Hold dumbbells for extra resistance.", equipment: "Bench + Dumbbells" },
      { name: "Glute Bridge", sets: "3", reps: "15", notes: "Bodyweight or place barbell across hips. Squeeze at top.", equipment: "Bodyweight / Barbell" },
      { name: "Dead Bug", sets: "3", reps: "8 each side", notes: "Core stabilizer, zero spinal compression. Move SLOWLY.", equipment: "Bodyweight" },
    ],
    cooldown: "5 min: Hip flexor stretch, hamstring stretch, pigeon pose — hold 45s each",
    rest: false,
  },
  {
    day: "Wednesday",
    label: "Active Recovery",
    focus: "Move gently, reduce stiffness",
    warmup: "",
    exercises: [
      { name: "10-20 min Walk", sets: "1", reps: "—", notes: "Outdoors if possible. Easy pace. This is medicine.", equipment: "None" },
      { name: "Cat-Cow", sets: "2", reps: "10 slow", notes: "Breathe in on cow, out on cat. Feels amazing for the spine.", equipment: "Bodyweight" },
      { name: "Thread the Needle", sets: "2", reps: "8 each side", notes: "Opens thoracic spine — direct relief for upper back pain.", equipment: "Bodyweight" },
      { name: "Child's Pose", sets: "1", reps: "Hold 60s", notes: "Arms wide for lat stretch. Breathe deeply.", equipment: "Bodyweight" },
    ],
    cooldown: "",
    rest: false,
  },
  {
    day: "Thursday",
    label: "Full Body (Light)",
    focus: "Total body, joint-friendly movement",
    warmup: "5 min: Jumping jacks (or step jacks), arm circles, hip hinges",
    exercises: [
      { name: "Dumbbell Deadlift", sets: "3", reps: "10", notes: "Start VERY light. Hip hinge pattern. Spine neutral.", equipment: "Dumbbells" },
      { name: "Dumbbell Bench Press", sets: "3", reps: "10", notes: "Light weight. Keep shoulder blades retracted on bench.", equipment: "Dumbbells + Bench" },
      { name: "Kettlebell Swing (2-hand)", sets: "3", reps: "10", notes: "Hip HINGE not squat. Let KB float. Powerful for joints & posture.", equipment: "Kettlebell" },
      { name: "Farmer's Carry", sets: "3", reps: "30 seconds", notes: "Walk with dumbbells at sides. Tall posture. Core braced.", equipment: "Dumbbells" },
      { name: "Plank (on knees if needed)", sets: "3", reps: "20-30 sec", notes: "Elbows under shoulders. Don't hold breath.", equipment: "Bodyweight" },
    ],
    cooldown: "5 min: Foam roll (or tennis ball) upper back, shoulder cross-body stretch",
    rest: false,
  },
  {
    day: "Friday",
    label: "Upper Body + Neck Care",
    focus: "Upper back strength, posture correction",
    warmup: "5 min: Thoracic rotations, chest opener, shoulder rolls",
    exercises: [
      { name: "Incline Dumbbell Row", sets: "3", reps: "12", notes: "Lie chest-down on incline bench. Pull elbows back. Posture gold.", equipment: "Dumbbells + Bench" },
      { name: "Lateral Raise (very light)", sets: "3", reps: "12", notes: "5-10 lbs MAX. Slow eccentric (3 sec down). Shoulder health.", equipment: "Dumbbells" },
      { name: "Barbell or Dumbbell Curl", sets: "3", reps: "10", notes: "Keep elbows at sides. No swinging.", equipment: "Barbell or Dumbbells" },
      { name: "Tricep Dumbbell Extension", sets: "3", reps: "10", notes: "Seated on bench. Keep elbows pointing forward.", equipment: "Dumbbell + Bench" },
      { name: "Chin Tucks", sets: "3", reps: "15", notes: "NOT a rep exercise — hold 5 sec each. Directly treats neck pain.", equipment: "Bodyweight" },
    ],
    cooldown: "5 min: Neck side stretch, levator scapulae stretch, pec minor stretch",
    rest: false,
  },
  {
    day: "Saturday",
    label: "Active Rest / Fun",
    focus: "Anything you enjoy",
    warmup: "",
    exercises: [
      { name: "Walk, bike ride, or yard work", sets: "—", reps: "30+ min", notes: "Just move. No pressure. This counts!", equipment: "None" },
    ],
    cooldown: "",
    rest: true,
  },
  {
    day: "Sunday",
    label: "Full Rest",
    focus: "Let your body rebuild",
    warmup: "",
    exercises: [
      { name: "Rest completely", sets: "—", reps: "—", notes: "Recovery is when you actually get stronger. Earn it.", equipment: "None" },
    ],
    cooldown: "",
    rest: true,
  },
];

const TIPS = [
  "Start lighter than you think you need to. Week 1 should feel easy.",
  "Upper back pain often improves dramatically with rows and face pulls.",
  "Chin tucks are the #1 exercise for forward head posture & neck pain.",
  "If something hurts (not just burns), stop and skip it this week.",
  "Progress = doing the workout, not lifting heavy.",
  "Drink water before, during, and after every session.",
  "Sleep is your best recovery tool. Aim for 7-8 hours.",
  "The kettlebell swing builds more posture strength than almost anything.",
];

const WEEKS = 8;

function getWeekKey(weekNum) { return `week_${weekNum}`; }
function getDayKey(weekNum, dayIdx) { return `w${weekNum}_d${dayIdx}`; }

export default function WorkoutPlan() {
  const [activeDay, setActiveDay] = useState(0);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [completed, setCompleted] = useState(() => {
    try { return JSON.parse(localStorage.getItem("workout_completed") || "{}"); } catch { return {}; }
  });
  const [tipIdx] = useState(() => Math.floor(Math.random() * TIPS.length));
  const [expandedExercise, setExpandedExercise] = useState(null);

  const today = new Date().getDay(); // 0=Sun
  const todayDayIdx = today === 0 ? 6 : today - 1;

  useEffect(() => {
    try { localStorage.setItem("workout_completed", JSON.stringify(completed)); } catch {}
  }, [completed]);

  const toggleDay = (weekNum, dayIdx) => {
    const key = getDayKey(weekNum, dayIdx);
    setCompleted(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const weekDays = Array.from({ length: 7 }, (_, i) => getDayKey(currentWeek, i));
  const weekComplete = weekDays.filter(k => completed[k]).length;

  const totalDone = Object.values(completed).filter(Boolean).length;
  const streakDays = (() => {
    let streak = 0;
    for (let w = currentWeek; w >= 1; w--) {
      for (let d = 6; d >= 0; d--) {
        if (completed[getDayKey(w, d)]) streak++;
        else if (streak > 0) return streak;
      }
    }
    return streak;
  })();

  const day = PLAN[activeDay];

  return (
    <div style={{
      fontFamily: "'Georgia', 'Times New Roman', serif",
      background: "#0f1117",
      minHeight: "100vh",
      color: "#e8e0d0",
      padding: "0",
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #1a1f2e 0%, #0f1117 100%)",
        borderBottom: "1px solid #2a2f3e",
        padding: "28px 24px 20px",
      }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ fontSize: 11, letterSpacing: 4, color: "#c4a55a", textTransform: "uppercase", marginBottom: 6 }}>
                Your Personal Program
              </div>
              <h1 style={{ margin: 0, fontSize: 28, fontWeight: "normal", color: "#f0e6d0", letterSpacing: 1 }}>
                Built to Last at 44
              </h1>
              <p style={{ margin: "6px 0 0", fontSize: 13, color: "#7a8099", fontStyle: "italic" }}>
                Home equipment · Joint-friendly · Upper back/neck focus
              </p>
            </div>
            <div style={{ display: "flex", gap: 16 }}>
              {[
                { label: "Days Done", value: totalDone },
                { label: "Streak", value: `${streakDays}🔥` },
                { label: "Week", value: `${currentWeek}/${WEEKS}` },
              ].map(stat => (
                <div key={stat.label} style={{
                  background: "#1a1f2e",
                  border: "1px solid #2a3050",
                  borderRadius: 10,
                  padding: "10px 16px",
                  textAlign: "center",
                  minWidth: 64,
                }}>
                  <div style={{ fontSize: 20, fontWeight: "bold", color: "#c4a55a" }}>{stat.value}</div>
                  <div style={{ fontSize: 10, color: "#7a8099", letterSpacing: 1, textTransform: "uppercase", marginTop: 2 }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Tip */}
          <div style={{
            marginTop: 18,
            padding: "10px 16px",
            background: "#161b28",
            borderLeft: "3px solid #c4a55a",
            borderRadius: "0 8px 8px 0",
            fontSize: 13,
            color: "#b0a890",
            fontStyle: "italic",
          }}>
            💡 {TIPS[tipIdx]}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "20px 16px" }}>

        {/* Week selector */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "#7a8099", letterSpacing: 2, textTransform: "uppercase", marginRight: 4 }}>Week</span>
          {Array.from({ length: WEEKS }, (_, i) => i + 1).map(w => {
            const wDone = Array.from({ length: 7 }, (_, d) => completed[getDayKey(w, d)]).filter(Boolean).length;
            return (
              <button key={w} onClick={() => setCurrentWeek(w)} style={{
                width: 36, height: 36, borderRadius: "50%",
                background: w === currentWeek ? "#c4a55a" : wDone === 7 ? "#2a4a2a" : "#1a1f2e",
                border: w === currentWeek ? "none" : "1px solid #2a3050",
                color: w === currentWeek ? "#0f1117" : wDone === 7 ? "#5aaa5a" : "#7a8099",
                fontFamily: "inherit",
                fontSize: 13,
                fontWeight: w === currentWeek ? "bold" : "normal",
                cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {wDone === 7 ? "✓" : w}
              </button>
            );
          })}
          <div style={{ marginLeft: "auto", fontSize: 12, color: "#7a8099" }}>
            Week {currentWeek}: <span style={{ color: "#c4a55a" }}>{weekComplete}/7</span> days
          </div>
        </div>

        {/* Day tabs */}
        <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
          {DAYS.map((d, i) => {
            const isDone = completed[getDayKey(currentWeek, i)];
            const isToday = i === todayDayIdx && currentWeek === currentWeek;
            return (
              <button key={d} onClick={() => setActiveDay(i)} style={{
                padding: "8px 14px",
                borderRadius: 8,
                border: activeDay === i ? "none" : isToday ? "1px solid #c4a55a" : "1px solid #2a3050",
                background: activeDay === i ? "#c4a55a" : isDone ? "#1a2e1a" : "#1a1f2e",
                color: activeDay === i ? "#0f1117" : isDone ? "#5aaa5a" : isToday ? "#c4a55a" : "#9090a0",
                fontFamily: "inherit",
                fontSize: 13,
                cursor: "pointer",
                fontWeight: activeDay === i ? "bold" : "normal",
                position: "relative",
              }}>
                {d} {isDone && "✓"}
              </button>
            );
          })}
        </div>

        {/* Day card */}
        <div style={{
          background: "#1a1f2e",
          borderRadius: 16,
          border: "1px solid #2a3050",
          overflow: "hidden",
          marginBottom: 20,
        }}>
          {/* Day header */}
          <div style={{
            padding: "20px 24px",
            background: day.rest ? "linear-gradient(90deg, #1a1f2e, #161b28)" : "linear-gradient(90deg, #1e2035, #1a1f2e)",
            borderBottom: "1px solid #2a3050",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <div>
              <div style={{ fontSize: 11, letterSpacing: 3, color: "#c4a55a", textTransform: "uppercase", marginBottom: 4 }}>
                {day.day}
              </div>
              <div style={{ fontSize: 20, color: "#f0e6d0", fontWeight: "normal" }}>{day.label}</div>
              <div style={{ fontSize: 13, color: "#7a8099", fontStyle: "italic", marginTop: 4 }}>{day.focus}</div>
            </div>
            <button
              onClick={() => toggleDay(currentWeek, activeDay)}
              style={{
                padding: "10px 20px",
                borderRadius: 10,
                border: completed[getDayKey(currentWeek, activeDay)] ? "none" : "1px solid #c4a55a",
                background: completed[getDayKey(currentWeek, activeDay)] ? "#2a4a2a" : "transparent",
                color: completed[getDayKey(currentWeek, activeDay)] ? "#5aaa5a" : "#c4a55a",
                fontFamily: "inherit",
                fontSize: 13,
                cursor: "pointer",
                letterSpacing: 1,
              }}
            >
              {completed[getDayKey(currentWeek, activeDay)] ? "✓ Done!" : "Mark Done"}
            </button>
          </div>

          {/* Warmup */}
          {day.warmup && (
            <div style={{ padding: "14px 24px", borderBottom: "1px solid #1e2338", background: "#161b28" }}>
              <span style={{ fontSize: 10, letterSpacing: 2, color: "#c4855a", textTransform: "uppercase", marginRight: 10 }}>Warm-Up</span>
              <span style={{ fontSize: 13, color: "#9090a0" }}>{day.warmup}</span>
            </div>
          )}

          {/* Exercises */}
          <div style={{ padding: "12px 0" }}>
            {day.exercises.map((ex, i) => (
              <div
                key={i}
                onClick={() => setExpandedExercise(expandedExercise === `${activeDay}-${i}` ? null : `${activeDay}-${i}`)}
                style={{
                  padding: "14px 24px",
                  borderBottom: i < day.exercises.length - 1 ? "1px solid #1e2338" : "none",
                  cursor: "pointer",
                  transition: "background 0.15s",
                  background: expandedExercise === `${activeDay}-${i}` ? "#1e2338" : "transparent",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%",
                      background: "#232840",
                      border: "1px solid #2a3050",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, color: "#c4a55a", fontWeight: "bold", flexShrink: 0,
                    }}>{i + 1}</div>
                    <div>
                      <div style={{ fontSize: 15, color: "#e8e0d0" }}>{ex.name}</div>
                      <div style={{ fontSize: 11, color: "#7a8099", marginTop: 2 }}>
                        {ex.sets !== "—" && `${ex.sets} sets`}{ex.sets !== "—" && ex.reps !== "—" && " × "}{ex.reps !== "—" && ex.reps}
                        {" · "}<span style={{ color: "#5a7090" }}>{ex.equipment}</span>
                      </div>
                    </div>
                  </div>
                  <span style={{ color: "#3a4060", fontSize: 18 }}>{expandedExercise === `${activeDay}-${i}` ? "▲" : "▼"}</span>
                </div>
                {expandedExercise === `${activeDay}-${i}` && (
                  <div style={{
                    marginTop: 12,
                    marginLeft: 40,
                    padding: "10px 14px",
                    background: "#0f1117",
                    borderRadius: 8,
                    fontSize: 13,
                    color: "#b0a890",
                    borderLeft: "2px solid #c4a55a",
                    fontStyle: "italic",
                    lineHeight: 1.6,
                  }}>
                    {ex.notes}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Cooldown */}
          {day.cooldown && (
            <div style={{ padding: "14px 24px", borderTop: "1px solid #1e2338", background: "#161b28" }}>
              <span style={{ fontSize: 10, letterSpacing: 2, color: "#5a90c4", textTransform: "uppercase", marginRight: 10 }}>Cool-Down</span>
              <span style={{ fontSize: 13, color: "#9090a0" }}>{day.cooldown}</span>
            </div>
          )}
        </div>

        {/* Pain & Safety notice */}
        <div style={{
          background: "#1e1a14",
          border: "1px solid #3a3020",
          borderRadius: 12,
          padding: "18px 20px",
          marginBottom: 20,
        }}>
          <div style={{ fontSize: 11, letterSpacing: 3, color: "#c49a5a", textTransform: "uppercase", marginBottom: 10 }}>
            ⚠ For Your Pain & Joint Health
          </div>
          {[
            "Start every exercise at 50% of what you think you can handle — week 1 is about forming the habit.",
            "If upper back/neck pain flares: skip pressing movements and do only rows + stretches that day.",
            "Aching joints respond well to movement, not rest — but light, lubricated movement only.",
            "Wall Angels, chin tucks, and face pulls are your most important exercises. Do them even on rest days.",
            "Consider seeing a physical therapist for your neck/shoulder pain — this plan complements PT, not replaces it.",
          ].map((tip, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
              <span style={{ color: "#c49a5a", marginTop: 1, flexShrink: 0 }}>•</span>
              <span style={{ fontSize: 13, color: "#9090a0", lineHeight: 1.6 }}>{tip}</span>
            </div>
          ))}
        </div>

        {/* Progress overview */}
        <div style={{
          background: "#1a1f2e",
          border: "1px solid #2a3050",
          borderRadius: 12,
          padding: "18px 20px",
        }}>
          <div style={{ fontSize: 11, letterSpacing: 3, color: "#c4a55a", textTransform: "uppercase", marginBottom: 14 }}>
            8-Week Overview
          </div>
          {[
            { weeks: "1–2", label: "Just Show Up", desc: "Focus on form, not weight. Feel the movements. Build the habit." },
            { weeks: "3–4", label: "Add Load", desc: "Increase dumbbell weight slightly. Aim to feel the target muscle." },
            { weeks: "5–6", label: "Build Intensity", desc: "Shorter rest (60-90 sec). Add reps where easy. Notice posture improving." },
            { weeks: "7–8", label: "Own It", desc: "You've built a foundation. This is your lifestyle now." },
          ].map(phase => (
            <div key={phase.weeks} style={{
              display: "flex", gap: 14, marginBottom: 12, alignItems: "flex-start",
            }}>
              <div style={{
                background: "#232840",
                borderRadius: 6,
                padding: "4px 10px",
                fontSize: 11,
                color: "#c4a55a",
                fontWeight: "bold",
                flexShrink: 0,
                marginTop: 1,
                letterSpacing: 1,
              }}>Wk {phase.weeks}</div>
              <div>
                <div style={{ fontSize: 14, color: "#e8e0d0", marginBottom: 2 }}>{phase.label}</div>
                <div style={{ fontSize: 12, color: "#7a8099", fontStyle: "italic" }}>{phase.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", padding: "20px 0 8px", fontSize: 12, color: "#3a4060", fontStyle: "italic" }}>
          Tap any exercise to see coaching notes · Mark days done to track progress
        </div>
      </div>
    </div>
  );
}
