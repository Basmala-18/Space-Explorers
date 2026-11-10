import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useStore } from '../../store/useStore'

interface NarrationPlayerProps {
  text: string
  missionName: string
  color: string
}

// Gentle NASA Comms beep via Web Audio API
function playCommsBeep() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    if (ctx.state === 'suspended') {
      ctx.resume()
    }
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(2525, ctx.currentTime)
    gain.gain.setValueAtTime(0.04, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.14)
  } catch (_e) {
    // Ignore audio context if restricted
  }
}

export default function NarrationPlayer({ text, missionName, color }: NarrationPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0)
  const [activeWordIndex, setActiveWordIndex] = useState(0)
  const [playbackRate, setPlaybackRate] = useState(1.0)
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([])
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>('')
  const [volume, setVolume] = useState(1.0)

  const { audioEnabled, setNarrationPlaying } = useStore()

  // Break narration text into natural sentence segments to prevent Chrome's 15s freeze bug
  const sentences = useMemo(() => {
    if (!text) return []
    const matched = text.match(/[^.!?]+[.!?]+(\s+|$)|[^.!?]+$/g)
    return matched ? matched.map(s => s.trim()).filter(Boolean) : [text]
  }, [text])

  // Precompute paragraph structure mapped to sentence indices for readable, uncompressed layout
  const paragraphData = useMemo(() => {
    if (!text) return []
    const rawParas = text.split(/\n\n+/).filter(Boolean)
    let globalIdx = 0
    return rawParas.map(para => {
      const paraSentences = para.match(/[^.!?]+[.!?]+(?:\s+|$)|[^.!?]+$/g) || [para]
      return paraSentences
        .map(s => {
          const trimmed = s.trim()
          if (!trimmed) return null
          const idx = globalIdx++
          return { text: trimmed, index: idx }
        })
        .filter((item): item is { text: string; index: number } => item !== null)
    })
  }, [text])

  const currentSentenceIndexRef = useRef(0)
  const isPlayingRef = useRef(false)
  const isPausedRef = useRef(false)
  const nextSentenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  isPlayingRef.current = isPlaying
  isPausedRef.current = isPaused
  currentSentenceIndexRef.current = currentSentenceIndex

  // Preload and filter voices
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return

    const loadVoices = () => {
      const all = window.speechSynthesis.getVoices()
      if (all && all.length > 0) {
        const enVoices = all.filter(v => v.lang.startsWith('en'))
        const list = enVoices.length > 0 ? enVoices : all
        setAvailableVoices(list)

        if (!selectedVoiceURI) {
          const natural = list.find(v =>
            v.name.includes('Natural') ||
            v.name.includes('Google') ||
            v.name.includes('David') ||
            v.name.includes('George') ||
            v.name.includes('Zira')
          )
          setSelectedVoiceURI(natural ? natural.voiceURI : list[0].voiceURI)
        }
      }
    }

    loadVoices()
    window.speechSynthesis.onvoiceschanged = loadVoices
  }, [selectedVoiceURI])

  // Unmount cleanup: cancel any speech immediately so narration doesn't bleed across routes
  useEffect(() => {
    return () => {
      if (nextSentenceTimerRef.current) clearTimeout(nextSentenceTimerRef.current)
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }
      setNarrationPlaying(false)
    }
  }, [setNarrationPlaying])

  // Stop speech completely and reset
  const handleStop = useCallback(() => {
    if (nextSentenceTimerRef.current) clearTimeout(nextSentenceTimerRef.current)
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
    activeUtteranceRef.current = null
    setCurrentSentenceIndex(0)
    currentSentenceIndexRef.current = 0
    setActiveWordIndex(0)
    setIsPlaying(false)
    setIsPaused(false)
    setNarrationPlaying(false)
  }, [setNarrationPlaying])

  // Play a specific sentence in the ordered sequence
  const playSentence = useCallback((index: number) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return
    if (index >= sentences.length) {
      // Completed full transmission
      setIsPlaying(false)
      setIsPaused(false)
      setNarrationPlaying(false)
      setCurrentSentenceIndex(0)
      setActiveWordIndex(0)
      return
    }

    // Cancel active synthesis first to prevent overlapping audio
    window.speechSynthesis.cancel()
    if (nextSentenceTimerRef.current) clearTimeout(nextSentenceTimerRef.current)

    setCurrentSentenceIndex(index)
    currentSentenceIndexRef.current = index
    setActiveWordIndex(0)
    setIsPlaying(true)
    setIsPaused(false)
    setNarrationPlaying(true)

    const sentenceText = sentences[index]
    const utterance = new SpeechSynthesisUtterance(sentenceText)
    activeUtteranceRef.current = utterance

    utterance.rate = playbackRate
    utterance.pitch = 0.96
    utterance.volume = audioEnabled ? volume : 0

    if (selectedVoiceURI && availableVoices.length > 0) {
      const v = availableVoices.find(voice => voice.voiceURI === selectedVoiceURI)
      if (v) utterance.voice = v
    }

    // Live word boundary tracking
    utterance.onboundary = (e) => {
      if (e.name === 'word') {
        const textBefore = sentenceText.slice(0, e.charIndex)
        const wordCount = textBefore.trim().split(/\s+/).filter(Boolean).length
        setActiveWordIndex(wordCount)
      }
    }

    utterance.onend = () => {
      if (!isPlayingRef.current || isPausedRef.current) return
      // Play next sentence after a short, natural conversational pause (160ms)
      const nextIdx = index + 1
      if (nextIdx < sentences.length) {
        nextSentenceTimerRef.current = setTimeout(() => {
          playSentence(nextIdx)
        }, 160)
      } else {
        setIsPlaying(false)
        setIsPaused(false)
        setNarrationPlaying(false)
        setCurrentSentenceIndex(sentences.length)
        activeUtteranceRef.current = null
      }
    }

    utterance.onerror = (e) => {
      if (e.error === 'canceled' || e.error === 'interrupted') return
      console.warn('Speech synthesis error:', e)
      setIsPlaying(false)
      setIsPaused(false)
      setNarrationPlaying(false)
    }

    // Microtask delay to ensure clean speech dispatch on Windows Chromium
    setTimeout(() => {
      if (window.speechSynthesis) {
        window.speechSynthesis.speak(utterance)
      }
    }, 20)
  }, [sentences, playbackRate, audioEnabled, volume, selectedVoiceURI, availableVoices, setNarrationPlaying])

  // Toggle Play / Pause / Resume
  const handlePlayPause = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return

    if (isPlaying) {
      if (isPaused) {
        // Resume from current sentence
        playSentence(currentSentenceIndexRef.current)
      } else {
        // Clean Pause: cancel current speech chunk, preserve sentence index
        if (nextSentenceTimerRef.current) clearTimeout(nextSentenceTimerRef.current)
        window.speechSynthesis.cancel()
        setIsPaused(true)
        setNarrationPlaying(false)
      }
    } else {
      // Fresh start
      playCommsBeep()
      const startAt = currentSentenceIndex >= sentences.length ? 0 : currentSentenceIndex
      playSentence(startAt)
    }
  }

  // Replay from beginning
  const handleReplay = () => {
    handleStop()
    playCommsBeep()
    setTimeout(() => {
      playSentence(0)
    }, 80)
  }

  // Calculate visual progress across total sentences
  const progressPct = sentences.length > 0
    ? Math.min(((currentSentenceIndex + (isPlaying && !isPaused ? 0.5 : 0)) / sentences.length) * 100, 100)
    : 0

  const activeSentence = sentences[currentSentenceIndex] || sentences[0] || text

  return (
    <div className="narration-player glass p-5 rounded-2xl border border-white/10 shadow-2xl">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-lg relative"
            style={{
              background: `radial-gradient(circle, ${color}55 0%, ${color}15 100%)`,
              border: `2px solid ${color}`,
            }}
          >
            🎙️
            {isPlaying && !isPaused && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            )}
          </div>
          <div>
            <div className="text-[10px] tracking-widest text-gray-400 font-bold uppercase font-mono">
              {missionName} TRANSMISSION // FIRST-PERSON VOICE
            </div>
            <div className="text-sm font-semibold text-white flex items-center gap-2">
              <span>Mission Audio Story</span>
              {isPlaying && !isPaused && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">
                  TRANSMITTING [{currentSentenceIndex + 1}/{sentences.length}]
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Audio Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Rate Selector */}
          <button
            onClick={() => {
              const next = playbackRate === 0.85 ? 1.0 : playbackRate === 1.0 ? 1.15 : 0.85
              setPlaybackRate(next)
              if (isPlaying && !isPaused) {
                playSentence(currentSentenceIndexRef.current)
              }
            }}
            className="px-2.5 py-1.5 rounded-lg glass border border-white/10 text-xs text-gray-300 hover:text-white font-mono transition-colors cursor-pointer"
            title="Speech Speed"
          >
            {playbackRate}x
          </button>

          {/* Main Play / Pause Button */}
          <button
            onClick={handlePlayPause}
            className="px-4 py-2 rounded-xl flex items-center gap-2 font-bold text-sm text-white shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
            style={{
              background: `linear-gradient(135deg, ${color}, ${color}cc)`,
              boxShadow: `0 0 16px ${color}60`,
            }}
            title={isPlaying && !isPaused ? 'Pause narration' : 'Play voice story'}
          >
            {isPlaying && !isPaused ? (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>Pause</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                <span>{isPaused ? 'Resume' : 'Play Voice'}</span>
              </>
            )}
          </button>

          {/* Stop Button */}
          <button
            onClick={handleStop}
            disabled={!isPlaying && !isPaused}
            className="w-9 h-9 rounded-xl glass border border-white/10 flex items-center justify-center text-gray-400 hover:text-white disabled:opacity-30 transition-all hover:bg-white/5 cursor-pointer"
            title="Stop narration"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <rect x="4" y="4" width="12" height="12" rx="1.5" />
            </svg>
          </button>

          {/* Replay Button */}
          <button
            onClick={handleReplay}
            className="w-9 h-9 rounded-xl glass border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all hover:bg-white/5 cursor-pointer"
            title="Replay from start"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Progress Track */}
      <div className="relative w-full h-1.5 bg-white/10 rounded-full mb-4 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${progressPct}%`,
            background: `linear-gradient(90deg, ${color}, #60a5fa)`,
          }}
        />
      </div>

      {/* Live Voice Transmission Subtitle HUD (Active during voice playback) */}
      {(isPlaying || isPaused) && (
        <div className="bg-black/80 border border-blue-400/30 rounded-xl p-4 mb-4 shadow-xl">
          <div className="flex items-center justify-between text-[10px] text-blue-400 mb-2 font-mono">
            <span className="flex items-center gap-1.5 font-bold tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              VOICE SUBTITLES // TRANSMITTING
            </span>
            <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono">
              SENTENCE [{currentSentenceIndex + 1} of {sentences.length}]
            </span>
          </div>
          <p className="text-base sm:text-lg text-white font-medium leading-relaxed tracking-wide">
            {activeSentence}
          </p>
        </div>
      )}

      {/* Full Written Mission Story Transcript (Clean, uncompressed, high readability) */}
      <div className="bg-slate-950/70 border border-white/10 rounded-2xl p-5 shadow-inner">
        <div className="flex items-center justify-between text-[11px] text-gray-400 mb-4 pb-2 border-b border-white/10 font-mono">
          <span className="font-bold tracking-widest uppercase text-white flex items-center gap-2">
            <span>📜</span> WRITTEN MISSION STORY
          </span>
          <span className="text-[10px] text-gray-400">
            Click any sentence to listen
          </span>
        </div>

        <div className="space-y-4">
          {paragraphData.map((paraSentences, pIdx) => (
            <p
              key={pIdx}
              className="text-gray-300 text-sm sm:text-[15px] leading-7 tracking-normal font-normal text-justify"
            >
              {paraSentences.map((sObj) => {
                const isActive = (isPlaying || isPaused) && sObj.index === currentSentenceIndex
                return (
                  <span
                    key={sObj.index}
                    onClick={() => playSentence(sObj.index)}
                    title="Click to play from this sentence"
                    className={`inline cursor-pointer transition-all duration-200 rounded px-1 -mx-0.5 ${
                      isActive
                        ? 'bg-blue-500/30 text-white font-semibold underline decoration-blue-400 decoration-2 shadow-sm'
                        : 'hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {sObj.text}{' '}
                  </span>
                )
              })}
            </p>
          ))}
        </div>

        {!isPlaying && !isPaused && (
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-2 text-xs text-blue-400">
            <span>💡</span>
            <span>
              Click <strong>[▶ Play Voice]</strong> above or click any sentence to listen to the first-person narration.
            </span>
          </div>
        )}
      </div>

      {/* Audio Options Footer */}
      <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-3 border-t border-white/5 text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <span>Voice:</span>
          {availableVoices.length > 0 ? (
            <select
              value={selectedVoiceURI}
              onChange={(e) => {
                setSelectedVoiceURI(e.target.value)
                if (isPlaying && !isPaused) {
                  playSentence(currentSentenceIndexRef.current)
                }
              }}
              className="bg-black/60 border border-white/10 text-gray-300 rounded px-2 py-0.5 text-xs max-w-[200px] truncate focus:outline-none focus:border-blue-400 cursor-pointer"
            >
              {availableVoices.map(v => (
                <option key={v.voiceURI} value={v.voiceURI}>
                  {v.name} ({v.lang})
                </option>
              ))}
            </select>
          ) : (
            <span className="text-gray-500 font-mono">System Default Voice</span>
          )}
        </div>

        {/* Volume */}
        <div className="flex items-center gap-2">
          <span>Vol:</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-16 h-1 accent-blue-400 cursor-pointer"
          />
        </div>
      </div>
    </div>
  )
}
