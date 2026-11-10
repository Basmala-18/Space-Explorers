import { useState, useEffect } from 'react'
import Navigation from '../components/ui/Navigation'
import GalaxyScene from '../components/galaxy/GalaxyScene'

export default function HomePage() {
  const [introVisible, setIntroVisible] = useState(true)
  const [introFading, setIntroFading] = useState(false)

  useEffect(() => {
    const fadeTimer = setTimeout(() => setIntroFading(true), 2800)
    const hideTimer = setTimeout(() => setIntroVisible(false), 3800)
    return () => { clearTimeout(fadeTimer); clearTimeout(hideTimer) }
  }, [])

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ background: '#050714' }}>
      <Navigation />

      {/* Galaxy 3D Scene — full viewport */}
      <div className="absolute inset-0 pt-16">
        <GalaxyScene />
      </div>

      {/* Intro splash overlay */}
      {introVisible && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(5,7,20,0.85) 0%, rgba(5,7,20,0.4) 70%, transparent 100%)',
            transition: 'opacity 1s ease',
            opacity: introFading ? 0 : 1,
          }}
        >
          <div className="text-center px-4">
            <div
              className="text-5xl sm:text-7xl font-black tracking-widest mb-4 shimmer-text"
              style={{ fontFamily: 'Orbitron, sans-serif' }}
            >
              SPACE EXPLORERS
            </div>
            <div className="text-lg sm:text-xl text-gray-400 tracking-widest mb-8">
              AN IMMERSIVE NASA MISSION EXPERIENCE
            </div>
            <div className="flex gap-2 justify-center">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-blue-500"
                  style={{ animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite` }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mission count badge */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 glass border border-white/10 rounded-full px-6 py-2 text-sm text-gray-400 tracking-widest pointer-events-none"
        style={{ fontFamily: 'Orbitron, sans-serif' }}
      >
        5 MISSIONS TO EXPLORE
      </div>
    </div>
  )
}
