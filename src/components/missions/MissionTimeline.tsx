import { useState } from 'react'
import type { TimelineEvent } from '../../data/missions'

interface MissionTimelineProps {
  events: TimelineEvent[]
  color: string
}

export default function MissionTimeline({ events, color }: MissionTimelineProps) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null)

  return (
    <div>
      <h3
        className="text-lg font-bold tracking-widest text-white mb-6"
        style={{ fontFamily: 'Orbitron, sans-serif' }}
      >
        MISSION TIMELINE
      </h3>

      <div className="relative">
        {/* Vertical line */}
        <div
          className="absolute left-6 top-0 bottom-0 w-0.5 rounded-full"
          style={{ background: `linear-gradient(to bottom, ${color}, transparent)` }}
        />

        <div className="space-y-2">
          {events.map((event, i) => {
            const isActive = activeIdx === i
            return (
              <div
                key={i}
                className={`timeline-item relative pl-16 cursor-pointer ${isActive ? 'active' : ''}`}
                onClick={() => setActiveIdx(isActive ? null : i)}
              >
                {/* Dot */}
                <div
                  className="absolute left-4 top-4 w-4 h-4 rounded-full border-2 transition-all"
                  style={{
                    background: isActive ? color : 'transparent',
                    borderColor: color,
                    boxShadow: isActive ? `0 0 12px ${color}` : 'none',
                    transform: isActive ? 'scale(1.2)' : 'scale(1)',
                  }}
                />

                {/* Card */}
                <div
                  className={`glass rounded-xl p-4 border transition-all ${isActive ? 'border-opacity-60' : 'border-white/5 hover:border-white/15'}`}
                  style={{ borderColor: isActive ? color + '60' : undefined }}
                >
                  <div className="flex items-center gap-3 mb-1">
                    <span
                      className="text-xs font-bold tracking-wider px-2 py-0.5 rounded-full"
                      style={{ background: color + '22', color: color, fontFamily: 'Orbitron, sans-serif' }}
                    >
                      {event.year}
                    </span>
                    <span className="text-sm font-semibold text-white">{event.event}</span>
                    <span className="ml-auto text-gray-500 text-xs">{isActive ? '▲' : '▼'}</span>
                  </div>

                  {isActive && (
                    <p className="text-sm text-gray-300 leading-relaxed mt-2 animate-fadeInUp">
                      {event.details}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
