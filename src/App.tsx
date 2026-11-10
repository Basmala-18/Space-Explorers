import { Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'

const HomePage = lazy(() => import('./pages/HomePage'))
const MavenPage = lazy(() => import('./pages/missions/MavenPage'))
const OpportunityPage = lazy(() => import('./pages/missions/OpportunityPage'))
const Apollo11Page = lazy(() => import('./pages/missions/Apollo11Page'))
const SpiritPage = lazy(() => import('./pages/missions/SpiritPage'))
const LunarRoverPage = lazy(() => import('./pages/missions/LunarRoverPage'))

function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center" style={{ background: '#050714' }}>
      <div className="text-center">
        <div className="text-4xl mb-4" style={{ fontFamily: 'Orbitron, sans-serif', color: '#fbbf24' }}>
          SPACE EXPLORERS
        </div>
        <div className="flex gap-2 justify-center">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-3 h-3 rounded-full"
              style={{
                background: '#3b82f6',
                animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {/* Core Exploration Hub */}
        <Route path="/" element={<HomePage />} />

        {/* Dedicated Independent Mission Pages */}
        <Route path="/mission/maven" element={<MavenPage />} />
        <Route path="/mission/opportunity" element={<OpportunityPage />} />
        <Route path="/mission/apollo11" element={<Apollo11Page />} />
        <Route path="/mission/spirit" element={<SpiritPage />} />
        <Route path="/mission/lunar-rover" element={<LunarRoverPage />} />

        {/* Route Aliases */}
        <Route path="/mission/apollo-11" element={<Apollo11Page />} />
        <Route path="/mission/lunarrover" element={<LunarRoverPage />} />
        <Route path="/mission/lunar_rover" element={<LunarRoverPage />} />

        {/* Sensible Fallback for Unknown Routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
