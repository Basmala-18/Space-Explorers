import { useNavigate } from 'react-router-dom'
import { MISSIONS } from '../../data/missions'

interface MiniMapProps {
  playerPos: [number, number]
}

export default function MiniMap({ playerPos }: MiniMapProps) {
  const navigate = useNavigate()
  const SIZE = 160
  const PADDING = 16
  const WORLD_RANGE = 20

  const worldToMap = (wx: number, wz: number) => {
    const x = ((wx + WORLD_RANGE) / (WORLD_RANGE * 2)) * (SIZE - PADDING * 2) + PADDING
    const y = ((wz + WORLD_RANGE) / (WORLD_RANGE * 2)) * (SIZE - PADDING * 2) + PADDING
    return { x, y }
  }

  const player = worldToMap(playerPos[0], playerPos[1])

  return (
    <div
      className="glass rounded-xl border border-white/10 overflow-hidden select-none"
      style={{ width: SIZE, height: SIZE }}
    >
      {/* Header */}
      <div
        className="text-center py-1 text-xs tracking-widest text-blue-400 border-b border-white/5 flex items-center justify-center gap-1.5"
        style={{ fontFamily: 'Orbitron, sans-serif' }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        NAV MAP
      </div>

      {/* SVG map */}
      <svg width={SIZE} height={SIZE - 24} className="relative">
        {/* Background grid */}
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Mission nodes */}
        {MISSIONS.map((m) => {
          const pt = worldToMap(m.position[0], m.position[2])
          return (
            <g
              key={m.id}
              className="cursor-pointer group"
              onClick={() => navigate(`/mission/${m.slug}`)}
            >
              <circle
                cx={pt.x}
                cy={pt.y}
                r={5}
                fill={m.color}
                opacity={0.9}
                style={{ filter: `drop-shadow(0 0 4px ${m.color})` }}
              />
              <circle
                cx={pt.x}
                cy={pt.y}
                r={8}
                fill="none"
                stroke={m.color}
                strokeWidth={0.8}
                opacity={0.5}
                className="transition-transform group-hover:scale-125"
              />
              <title>{m.name} — Click to inspect mission</title>
            </g>
          )
        })}

        {/* Player dot */}
        <circle
          cx={player.x}
          cy={player.y}
          r={4}
          fill="#ffffff"
          style={{ filter: 'drop-shadow(0 0 6px #ffffff)' }}
        />
        {/* Player direction indicator */}
        <circle cx={player.x} cy={player.y} r={8} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth={1} />
      </svg>
    </div>
  )
}
