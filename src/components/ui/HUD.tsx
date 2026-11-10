interface HUDProps {
  speed: number
  position: [number, number, number]
  controlsHintDismissed: boolean
  onDismissHint: () => void
  isMobile: boolean
  isBoosting?: boolean
}

export default function HUD({
  speed,
  position,
  controlsHintDismissed,
  onDismissHint,
  isMobile,
  isBoosting = false,
}: HUDProps) {
  const speedKmh = Math.round(speed * 180)
  const maxBars = 10
  const activeBars = Math.min(Math.round((speed / 20.0) * maxBars), maxBars)

  return (
    <>
      {/* Top-left HUD panel */}
      <div className="glass rounded-xl border border-white/10 px-4 py-3 select-none shadow-2xl" style={{ minWidth: 220 }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs tracking-widest text-blue-400 font-bold" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            SHIP TELEMETRY
          </span>
          {isBoosting && (
            <span
              className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 animate-pulse"
              style={{ fontFamily: 'Orbitron, sans-serif' }}
            >
              WARP
            </span>
          )}
        </div>

        {/* Speed Bar */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs text-gray-400 font-mono">VEL</span>
          <div className="flex gap-1 flex-1">
            {Array.from({ length: maxBars }).map((_, i) => (
              <div
                key={i}
                className="h-3 flex-1 rounded-xs transition-all duration-75"
                style={{
                  background:
                    i < activeBars
                      ? isBoosting
                        ? 'linear-gradient(to top, #9333ea, #c084fc)'
                        : 'linear-gradient(to top, #2563eb, #38bdf8)'
                      : 'rgba(255,255,255,0.08)',
                  boxShadow: i < activeBars ? (isBoosting ? '0 0 6px #a855f7' : '0 0 6px #38bdf8') : 'none',
                }}
              />
            ))}
          </div>
          <span className="text-xs font-mono font-bold" style={{ color: isBoosting ? '#c084fc' : '#38bdf8' }}>
            {speedKmh} km/s
          </span>
        </div>

        {/* 3D Coordinates */}
        <div className="text-xs text-gray-400 font-mono grid grid-cols-3 gap-1 text-center py-1 bg-white/5 rounded">
          <span>X: {position[0].toFixed(1)}</span>
          <span className="text-blue-300">Y: {position[1].toFixed(1)}</span>
          <span>Z: {position[2].toFixed(1)}</span>
        </div>

        {/* Objective */}
        <div className="mt-2 text-xs text-yellow-400/90 flex items-center gap-1.5">
          <span className="animate-ping inline-block w-1.5 h-1.5 rounded-full bg-yellow-400" />
          <span>Approach or click a mission to land</span>
        </div>
      </div>

      {/* Controls Hint Box */}
      {!controlsHintDismissed && (
        <div
          className="glass rounded-xl border border-white/10 px-4 py-3 select-none animate-fadeInUp shadow-xl"
          style={{ maxWidth: 260 }}
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs tracking-widest text-yellow-400 font-bold" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              FLIGHT CONTROLS (3D)
            </span>
            <button
              onClick={onDismissHint}
              className="text-gray-400 hover:text-white text-xs px-1 hover:bg-white/10 rounded transition-colors"
            >
              ✕
            </button>
          </div>

          {isMobile ? (
            <div className="space-y-1.5 text-xs text-gray-300">
              <p>🕹️ <strong>Joystick:</strong> Fly &amp; steer heading</p>
              <p>▲ / ▼ <strong>Altitude:</strong> Tap buttons on right to ascend/descend</p>
              <p>⚡ <strong>Warp:</strong> Boost speed</p>
              <p>🎯 <strong>Tap:</strong> Touch glowing destination to open</p>
            </div>
          ) : (
            <div className="space-y-1.5 text-xs text-gray-300">
              <div className="flex items-center justify-between">
                <span className="font-mono text-white bg-white/10 px-1.5 py-0.5 rounded">W / S</span>
                <span className="text-gray-400">Forward / Reverse</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-white bg-white/10 px-1.5 py-0.5 rounded">A / D</span>
                <span className="text-gray-400">Steer left / right</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-cyan-300 bg-white/10 px-1.5 py-0.5 rounded">Space / E</span>
                <span className="text-cyan-300 font-semibold">Ascend (Up)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-cyan-300 bg-white/10 px-1.5 py-0.5 rounded">C / Q</span>
                <span className="text-cyan-300 font-semibold">Descend (Down)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-white bg-white/10 px-1.5 py-0.5 rounded">Shift</span>
                <span className="text-purple-300">Afterburner boost</span>
              </div>
              <div className="mt-2 text-yellow-400 text-[11px] pt-1 border-t border-white/5">
                ★ 6-DOF cosmic flight active
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}
