import { useState } from 'react'
import WorkoutPlan from './workout-plan.jsx'
import ChoreSchedule from './chore-schedule.jsx'
import WellnessTracker from './wellness-tracker.jsx'

const TABS = [
  { id: 'workout', label: 'Workout Plan', component: WorkoutPlan },
  { id: 'chores', label: 'Chore Schedule', component: ChoreSchedule },
  { id: 'wellness', label: 'Wellness Tracker', component: WellnessTracker },
]

export default function App() {
  const [activeTab, setActiveTab] = useState('workout')
  const Active = TABS.find(t => t.id === activeTab).component

  return (
    <div style={{ fontFamily: 'Georgia, serif', background: '#0f1117', minHeight: '100vh' }}>
      <nav style={{
        display: 'flex',
        gap: 4,
        padding: '12px 16px',
        background: '#1a1f2e',
        borderBottom: '1px solid #2a3050',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '8px 18px',
              borderRadius: 8,
              border: 'none',
              background: activeTab === tab.id ? '#c4a55a' : 'transparent',
              color: activeTab === tab.id ? '#0f1117' : '#7a8099',
              fontFamily: 'inherit',
              fontSize: 13,
              fontWeight: activeTab === tab.id ? 'bold' : 'normal',
              cursor: 'pointer',
              letterSpacing: 0.5,
            }}
          >
            {tab.label}
          </button>
        ))}
      </nav>
      <Active />
    </div>
  )
}
