import { useState, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Navigation from '../../components/ui/Navigation'
import MissionEnvironment from '../../components/missions/MissionEnvironment'
import NarrationPlayer from '../../components/missions/NarrationPlayer'
import MissionTimeline from '../../components/missions/MissionTimeline'
import MissionQuiz from '../../components/missions/MissionQuiz'
import MissionGallery from '../../components/missions/MissionGallery'
import ChatbotModal from '../../components/chatbot/ChatbotModal'
import { MISSIONS, type Mission } from '../../data/missions'

interface MissionPageProps {
  mission: Mission
  model3D: ReactNode
}

export default function MissionPage({ mission, model3D }: MissionPageProps) {
  const [chatOpen, setChatOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'story' | 'timeline' | 'facts' | 'quiz'>('story')

  const currentIndex = MISSIONS.findIndex(m => m.id === mission.id)
  const prevMission = currentIndex > 0 ? MISSIONS[currentIndex - 1] : null
  const nextMission = currentIndex < MISSIONS.length - 1 ? MISSIONS[currentIndex + 1] : null

  const tabs = [
    { id: 'story' as const, label: 'Story' },
    { id: 'timeline' as const, label: 'Timeline' },
    { id: 'facts' as const, label: 'Science' },
    { id: 'quiz' as const, label: 'Quiz' },
  ]

  return (
    <div className="min-h-screen" style={{ background: '#050714' }}>
      <Navigation />

      {/* Hero 3D scene */}
      <div className="relative w-full" style={{ height: '60vh', marginTop: 64 }}>
        <Canvas
          camera={{ position: [0, 2, 7], fov: 50 }}
          gl={{ antialias: true }}
          style={{ background: 'transparent' }}
        >
          <MissionEnvironment type={mission.environment} />
          {model3D}
          <OrbitControls enableZoom={true} enablePan={false} minDistance={2.5} maxDistance={15} />
        </Canvas>

        {/* Mission title overlay */}
        <div className="absolute bottom-6 left-6 right-6 pointer-events-none">
          <div className="inline-flex items-center gap-3 glass border border-white/10 rounded-2xl px-5 py-3">
            <div
              className="w-4 h-4 rounded-full"
              style={{ background: mission.color, boxShadow: `0 0 12px ${mission.color}` }}
            />
            <div>
              <div
                className="text-2xl sm:text-3xl font-black tracking-widest"
                style={{ fontFamily: 'Orbitron, sans-serif', color: mission.color }}
              >
                {mission.name}
              </div>
              <div className="text-sm text-gray-400">{mission.subtitle}</div>
            </div>
            <div className="ml-auto text-right">
              <div className="text-xs text-gray-500">Launch</div>
              <div className="text-sm text-white">{mission.launchDate}</div>
            </div>
          </div>
        </div>

        {/* Breadcrumb Navigation */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2 glass border border-white/10 rounded-full px-4 py-2 text-xs sm:text-sm text-gray-300">
          <Link
            to="/"
            className="hover:text-yellow-400 transition-colors flex items-center gap-1.5 font-medium"
          >
            <span>🌌</span>
            <span>Galaxy Hub</span>
          </Link>
          <span className="text-gray-500">/</span>
          <span className="text-gray-400">Missions</span>
          <span className="text-gray-500">/</span>
          <span className="font-semibold text-white" style={{ color: mission.color }}>
            {mission.name}
          </span>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Tab bar */}
        <div className="flex gap-1 mb-8 glass border border-white/5 rounded-2xl p-1.5 w-fit">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="px-5 py-2 rounded-xl text-sm font-semibold transition-all"
              style={
                activeTab === tab.id
                  ? {
                      background: mission.color,
                      color: 'white',
                      fontFamily: 'Orbitron, sans-serif',
                      letterSpacing: '0.05em',
                    }
                  : { color: '#9ca3af' }
              }
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab: Story */}
        {activeTab === 'story' && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              {/* Narration player */}
              <NarrationPlayer
                text={mission.narration}
                missionName={mission.name}
                color={mission.color}
              />

              {/* Key facts */}
              <div className="glass border border-white/5 rounded-2xl p-5">
                <h3
                  className="text-sm font-bold tracking-widest mb-4"
                  style={{ fontFamily: 'Orbitron, sans-serif', color: mission.color }}
                >
                  FAST FACTS
                </h3>
                <ul className="space-y-3">
                  {mission.facts.map((fact, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                      <span style={{ color: mission.color }} className="mt-0.5 flex-shrink-0">◆</span>
                      {fact}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              {/* Description & Status */}
              <div className="glass border border-white/5 rounded-2xl p-5">
                <h3
                  className="text-sm font-bold tracking-widest mb-3"
                  style={{ fontFamily: 'Orbitron, sans-serif', color: mission.color }}
                >
                  ABOUT THE MISSION
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">{mission.description}</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="glass border border-white/5 rounded-xl p-3">
                    <div className="text-xs text-gray-500 mb-1">Launch Date</div>
                    <div className="text-sm text-white font-semibold">{mission.launchDate}</div>
                  </div>
                  <div className="glass border border-white/5 rounded-xl p-3">
                    <div className="text-xs text-gray-500 mb-1">Status</div>
                    {mission.id === 'lunar-rover' ? (
                      <div>
                        <div className="text-sm font-semibold text-amber-400 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                          <span>Historical Equipment</span>
                        </div>
                        <div className="text-[11px] text-gray-400 mt-0.5 font-mono">
                          Apollo 15, 16 &amp; 17 (1971–1972)
                        </div>
                      </div>
                    ) : mission.id === 'maven' ? (
                      <div>
                        <div className="text-sm font-semibold text-rose-400 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                          <span>Mission Ended</span>
                        </div>
                        <div className="text-[11px] text-gray-400 mt-0.5 font-mono">
                          Concluded June 3, 2026
                        </div>
                      </div>
                    ) : mission.endDate ? (
                      <div>
                        <div className="text-sm font-semibold text-rose-400 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                          <span>Mission Ended</span>
                        </div>
                        <div className="text-[11px] text-gray-400 mt-0.5 font-mono">
                          {mission.endDate}
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm font-semibold text-emerald-400 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span>● Active</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Achievements */}
              <div className="glass border border-white/5 rounded-2xl p-5">
                <h3
                  className="text-sm font-bold tracking-widest mb-4"
                  style={{ fontFamily: 'Orbitron, sans-serif', color: mission.color }}
                >
                  KEY ACHIEVEMENTS
                </h3>
                <ul className="space-y-2">
                  {mission.achievements.map((ach, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                      <span className="text-yellow-400 mt-0.5 flex-shrink-0">✓</span>
                      {ach}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* NASA Photographic Archive Gallery */}
            <div className="lg:col-span-2 mt-2">
              <MissionGallery
                missionId={mission.id}
                missionName={mission.name}
                color={mission.color}
                fallbackPhotos={mission.photos}
              />
            </div>

            {/* Authoritative NASA / JPL / NSSDC Master Catalog References */}
            {mission.references && mission.references.length > 0 && (
              <div className="lg:col-span-2 glass border border-white/5 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">🏛️</span>
                  <div>
                    <h4 className="text-xs font-bold tracking-widest text-white uppercase font-mono">
                      Verified NASA &amp; NSSDC Data Sources
                    </h4>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Authentic historical documentation from NASA, Jet Propulsion Laboratory, and NSSDC Master Catalog.
                    </p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-3 pt-2 border-t border-white/5">
                  {mission.references.map((ref, rIdx) => (
                    <a
                      key={rIdx}
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="glass border border-white/10 hover:border-blue-400/50 rounded-xl p-3 text-xs transition-all hover:bg-white/5 group flex flex-col justify-between"
                    >
                      <div>
                        <div className="text-[10px] text-blue-400 font-mono font-semibold uppercase mb-1">
                          {ref.source}
                        </div>
                        <div className="text-gray-200 font-medium group-hover:text-yellow-400 transition-colors leading-snug">
                          {ref.title}
                        </div>
                      </div>
                      <span className="text-gray-400 text-[10px] mt-2 inline-flex items-center gap-1 font-mono group-hover:text-blue-300">
                        View NASA Record ↗
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab: Timeline */}
        {activeTab === 'timeline' && (
          <div className="max-w-2xl">
            <MissionTimeline events={mission.timeline} color={mission.color} />
          </div>
        )}

        {/* Tab: Science */}
        {activeTab === 'facts' && (
          <div className="grid md:grid-cols-2 gap-4">
            {mission.components.map((comp, i) => (
              <div
                key={i}
                className="glass border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all"
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                    style={{ background: mission.color + '20', border: `1px solid ${mission.color}30` }}
                  >
                    🔧
                  </div>
                  <div>
                    <h4
                      className="font-bold text-white mb-1"
                      style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.8rem', letterSpacing: '0.05em' }}
                    >
                      {comp.name}
                    </h4>
                    <p className="text-sm text-gray-400 leading-relaxed">{comp.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab: Quiz */}
        {activeTab === 'quiz' && (
          <div className="max-w-2xl">
            <MissionQuiz
              questions={mission.quiz}
              missionId={mission.id}
              missionName={mission.name}
              color={mission.color}
            />
          </div>
        )}

        {/* Bottom Mission Navigation Dock: Previous, Return to Hub, Next */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          {prevMission ? (
            <Link
              to={`/mission/${prevMission.slug}`}
              className="flex items-center gap-3 glass border border-white/10 hover:border-white/30 rounded-2xl px-5 py-3 text-sm text-gray-200 hover:text-white transition-all group"
            >
              <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
              <div>
                <div className="text-[10px] text-gray-400 uppercase font-mono">Previous Mission</div>
                <div className="font-bold text-sm" style={{ color: prevMission.color }}>
                  {prevMission.name}
                </div>
              </div>
            </Link>
          ) : (
            <div className="invisible px-5 py-3 hidden sm:block"></div>
          )}

          <Link
            to="/"
            className="flex items-center gap-2 glass border border-blue-400/40 hover:border-blue-400 rounded-2xl px-6 py-3.5 text-sm font-bold text-white shadow-xl transition-all hover:scale-105 active:scale-95 bg-blue-600/20 hover:bg-blue-600/35 font-mono tracking-wider mx-auto sm:mx-0"
          >
            <span>🚀</span>
            <span>RETURN TO GALAXY HUB</span>
          </Link>

          {nextMission ? (
            <Link
              to={`/mission/${nextMission.slug}`}
              className="flex items-center gap-3 glass border border-white/10 hover:border-white/30 rounded-2xl px-5 py-3 text-sm text-gray-200 hover:text-white transition-all group"
            >
              <div className="text-right">
                <div className="text-[10px] text-gray-400 uppercase font-mono">Next Mission</div>
                <div className="font-bold text-sm" style={{ color: nextMission.color }}>
                  {nextMission.name}
                </div>
              </div>
              <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          ) : (
            <div className="invisible px-5 py-3 hidden sm:block"></div>
          )}
        </div>
      </div>

      {/* Chatbot Button */}
      <button
        onClick={() => setChatOpen(true)}
        className="fixed bottom-6 right-6 flex items-center gap-2 px-4 py-3 rounded-full shadow-2xl z-40 transition-all hover:scale-105 active:scale-95 group cursor-pointer"
        style={{
          background: mission.color,
          boxShadow: `0 0 25px ${mission.color}80`,
          color: '#ffffff',
        }}
        title="Talk to me"
      >
        <span className="text-xl">💬</span>
        <span
          className="text-xs font-bold tracking-wider uppercase pr-1"
          style={{ fontFamily: 'Orbitron, sans-serif' }}
        >
          Talk to me
        </span>
      </button>

      {/* Chatbot modal */}
      <ChatbotModal
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        mission={mission}
      />
    </div>
  )
}
