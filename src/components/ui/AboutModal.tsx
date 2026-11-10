interface AboutModalProps {
  isOpen: boolean
  onClose: () => void
}

interface TeamMember {
  name: string
  role: string
  icon: string
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'Rudaina Mustafa',
    role: 'Programmer',
    icon: '💻',
  },
  {
    name: 'Basmala Mahmoud',
    role: 'Programmer',
    icon: '💻',
  },
  {
    name: 'Rawan Hossam',
    role: 'Researcher',
    icon: '🔬',
  },
]

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeInUp">
      <div
        className="relative max-w-3xl w-full glass border border-white/15 rounded-3xl overflow-hidden shadow-2xl bg-slate-950/95 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🚀</span>
            <div>
              <h2
                className="text-lg sm:text-xl font-bold tracking-wider text-white"
                style={{ fontFamily: 'Orbitron, sans-serif' }}
              >
                ABOUT SPACE EXPLORERS
              </h2>
              <div className="text-xs text-blue-400 font-mono mt-0.5">
                EDUCATIONAL NASA MISSION EXPLORATION HUB
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl glass border border-white/15 text-gray-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors hover:bg-white/10"
          >
            ✕
          </button>
        </div>

        {/* Modal Content Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Mission Statement */}
          <div className="glass border border-white/5 rounded-2xl p-5 bg-blue-950/20">
            <h3
              className="text-xs font-bold tracking-widest text-yellow-400 uppercase font-mono mb-2"
            >
              PROJECT VISION
            </h3>
            <p className="text-sm text-gray-200 leading-relaxed">
              <strong>Space Explorers</strong> is an interactive, educational space exploration experience built to bring humanity's most ambitious off-Earth missions to life. From the historic first steps of <strong>Apollo 11</strong> and the pioneering marathons of <strong>Spirit &amp; Opportunity</strong>, to the atmospheric secrets of <strong>MAVEN</strong> and the engineering genius of the <strong>Lunar Roving Vehicle</strong>, this platform combines real-time 3D simulation, first-person audio narration, official NASA archives, and mission-specific knowledge engines.
            </p>
          </div>

          {/* Project Team Members */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold tracking-widest text-white uppercase font-mono">
                PROJECT TEAM &amp; ROLES
              </h3>
              <span className="text-[10px] text-blue-400 font-mono">
                CORE ROSTER
              </span>
            </div>

            <div className="grid sm:grid-cols-3 gap-3">
              {TEAM_MEMBERS.map((member, i) => (
                <div
                  key={i}
                  className="glass border border-white/10 rounded-2xl p-4 flex items-center gap-3 bg-slate-900/40 hover:border-white/20 transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl flex-shrink-0">
                    {member.icon}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">
                      {member.name}
                    </div>
                    <div className="text-xs font-medium text-blue-400 mt-0.5">
                      {member.role}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Technology Credits */}
          <div className="glass border border-white/5 rounded-2xl p-5 bg-slate-900/30">
            <h3
              className="text-xs font-bold tracking-widest text-white uppercase font-mono mb-3"
            >
              TECHNOLOGY STACK &amp; FRAMEWORKS
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                <span className="text-blue-400 font-bold block">Three.js / R3F</span>
                <span className="text-[11px] text-gray-400">3D WebGL Graphics</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                <span className="text-yellow-400 font-bold block">React 18 &amp; TS</span>
                <span className="text-[11px] text-gray-400">Component Architecture</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                <span className="text-cyan-400 font-bold block">Tailwind CSS v4</span>
                <span className="text-[11px] text-gray-400">Responsive Glass UI</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                <span className="text-emerald-400 font-bold block">NASA Open APIs</span>
                <span className="text-[11px] text-gray-400">Official Image Archive</span>
              </div>
            </div>
          </div>

          {/* Sources and Scientific Attribution */}
          <div className="text-xs text-gray-400 leading-relaxed border-t border-white/10 pt-4 font-mono">
            <span className="text-gray-300 font-bold block mb-1">Official Data &amp; Media Attribution:</span>
            Imagery and telemetry data courtesy of the <strong>National Aeronautics and Space Administration (NASA)</strong>, 
            <strong>NASA Jet Propulsion Laboratory (JPL-Caltech)</strong>, 
            <strong>NASA Goddard Space Flight Center (GSFC)</strong>, and the 
            <strong>NASA Space Science Data Coordinated Archive (NSSDC)</strong>.
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/10 bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors"
            style={{ fontFamily: 'Orbitron, sans-serif' }}
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  )
}
