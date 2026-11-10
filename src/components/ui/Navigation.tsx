import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { MISSIONS } from '../../data/missions'
import { useStore } from '../../store/useStore'
import AboutModal from './AboutModal'

interface LanguageOption {
  code: string
  name: string
  nativeName: string
  available: boolean
}

const LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English (US)', available: true },
  { code: 'es', name: 'Spanish', nativeName: 'Español', available: false },
  { code: 'fr', name: 'French', nativeName: 'Français', available: false },
  { code: 'de', name: 'German', nativeName: 'Deutsch', available: false },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', available: false },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', available: false },
  { code: 'zh', name: 'Chinese', nativeName: '中文', available: false },
]

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [missionsOpen, setMissionsOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [selectedLang, setSelectedLang] = useState('en')
  const [langToast, setLangToast] = useState<string | null>(null)
  const [aboutOpen, setAboutOpen] = useState(false)

  const { audioEnabled, toggleAudio } = useStore()
  const location = useLocation()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const langDropdownRef = useRef<HTMLDivElement>(null)
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMissionsOpen(false)
      }
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target as Node)) {
        setLangOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSelectLanguage = (lang: LanguageOption) => {
    if (!lang.available) {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current)
      setLangToast(`Coming Soon — ${lang.name} (${lang.nativeName}) translation is in development. Space Explorers is currently available in English.`)
      toastTimeoutRef.current = setTimeout(() => {
        setLangToast(null)
      }, 4200)
    } else {
      setSelectedLang(lang.code)
    }
    setLangOpen(false)
  }

  const isHome = location.pathname === '/'

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <span className="text-2xl">🚀</span>
              <span
                className="text-lg font-bold tracking-widest text-white group-hover:text-yellow-400 transition-colors"
                style={{ fontFamily: 'Orbitron, sans-serif' }}
              >
                SPACE EXPLORERS
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8">
              <Link
                to="/"
                className={`text-sm tracking-wider transition-colors ${isHome ? 'text-yellow-400' : 'text-gray-300 hover:text-white'}`}
                style={{ fontFamily: 'Orbitron, sans-serif' }}
              >
                HOME
              </Link>

              {/* Missions dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setMissionsOpen(!missionsOpen)}
                  className="flex items-center gap-1 text-sm tracking-wider text-gray-300 hover:text-white transition-colors cursor-pointer"
                  style={{ fontFamily: 'Orbitron, sans-serif' }}
                >
                  MISSIONS
                  <svg className={`w-4 h-4 transition-transform ${missionsOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {missionsOpen && (
                  <div className="absolute top-full left-0 mt-2 w-64 glass rounded-xl border border-white/10 overflow-hidden shadow-2xl animate-fadeInUp">
                    {MISSIONS.map((m) => (
                      <Link
                        key={m.id}
                        to={`/mission/${m.slug}`}
                        onClick={() => setMissionsOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors group"
                      >
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ background: m.color, boxShadow: `0 0 8px ${m.color}` }}
                        />
                        <div>
                          <div className="text-white text-sm font-semibold group-hover:text-yellow-400 transition-colors">
                            {m.name}
                          </div>
                          <div className="text-gray-400 text-xs">{m.subtitle.slice(0, 32)}…</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* About Button -> Opens Team/Project Modal */}
              <button
                onClick={() => setAboutOpen(true)}
                className="text-sm tracking-wider text-gray-300 hover:text-white transition-colors cursor-pointer"
                style={{ fontFamily: 'Orbitron, sans-serif' }}
              >
                ABOUT
              </button>
            </div>

            {/* Right side: Language Selector + Audio Sound Toggle */}
            <div className="hidden md:flex items-center gap-4">
              {/* Language Selector Dropdown */}
              <div className="relative" ref={langDropdownRef}>
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass border border-white/10 text-xs font-semibold text-gray-300 hover:text-white hover:border-white/20 transition-all cursor-pointer"
                  title="Select Language"
                >
                  <span>🌐</span>
                  <span className="uppercase font-mono">{selectedLang}</span>
                  <svg className={`w-3 h-3 transition-transform ${langOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {langOpen && (
                  <div className="absolute top-full right-0 mt-2 w-56 glass rounded-xl border border-white/10 overflow-hidden shadow-2xl py-1 z-50 animate-fadeInUp">
                    <div className="px-3 py-1.5 border-b border-white/5 text-[10px] font-bold text-gray-400 tracking-wider font-mono">
                      LANGUAGE OPTIONS
                    </div>
                    {LANGUAGES.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => handleSelectLanguage(l)}
                        className={`w-full flex items-center justify-between px-3.5 py-2 text-xs transition-colors cursor-pointer text-left ${
                          l.available
                            ? l.code === selectedLang
                              ? 'bg-blue-600/30 text-blue-300 font-bold'
                              : 'text-gray-200 hover:bg-white/5'
                            : 'text-gray-500 hover:bg-white/5 opacity-75'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="font-medium">{l.nativeName}</span>
                          <span className="text-[10px] text-gray-500">({l.name})</span>
                        </span>
                        {l.available ? (
                          l.code === selectedLang ? (
                            <span className="text-blue-400 font-bold">✓</span>
                          ) : null
                        ) : (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-gray-400 border border-white/10 font-mono">
                            SOON
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Functional Audio Toggle (repurposed from dummy login) */}
              <button
                onClick={toggleAudio}
                className={`px-4 py-1.5 rounded-full border text-xs font-semibold tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                  audioEnabled
                    ? 'border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/20'
                    : 'border-white/20 text-gray-400 hover:bg-white/10'
                }`}
                style={{ fontFamily: 'Orbitron, sans-serif' }}
                title={audioEnabled ? 'Audio is ON (Click to Mute)' : 'Audio is MUTED (Click to Enable)'}
              >
                <span>{audioEnabled ? '🔊' : '🔇'}</span>
                <span>{audioEnabled ? 'AUDIO ON' : 'MUTED'}</span>
              </button>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden text-white p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <div className={`w-6 h-0.5 bg-white mb-1.5 transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <div className={`w-6 h-0.5 bg-white mb-1.5 transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`} />
              <div className={`w-6 h-0.5 bg-white transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden glass border-t border-white/5 px-4 py-4 space-y-3">
            <Link to="/" className="block py-2 text-gray-300 hover:text-white" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
            <div className="py-2">
              <div className="text-gray-400 text-xs uppercase mb-2 font-mono">Missions</div>
              {MISSIONS.map((m) => (
                <Link
                  key={m.id}
                  to={`/mission/${m.slug}`}
                  className="flex items-center gap-2 py-2 pl-3 text-gray-300 hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="w-2 h-2 rounded-full" style={{ background: m.color }} />
                  {m.name}
                </Link>
              ))}
            </div>

            <button
              onClick={() => {
                setMobileMenuOpen(false)
                setAboutOpen(true)
              }}
              className="w-full text-left py-2 text-gray-300 hover:text-white font-medium"
            >
              About Project &amp; Team
            </button>

            {/* Mobile Language Selector */}
            <div className="py-2 border-t border-white/5">
              <div className="text-gray-400 text-xs uppercase mb-2 font-mono">Language</div>
              <div className="flex flex-wrap gap-1.5">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => handleSelectLanguage(l)}
                    className={`px-2.5 py-1 rounded text-xs border ${
                      l.available
                        ? l.code === selectedLang
                          ? 'bg-blue-600/30 border-blue-400 text-blue-300'
                          : 'border-white/10 text-gray-300'
                        : 'border-white/5 text-gray-500 opacity-60'
                    }`}
                  >
                    {l.nativeName}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Audio Toggle */}
            <button
              onClick={toggleAudio}
              className="w-full py-2 rounded-full border border-blue-500/50 text-blue-300 text-xs font-semibold flex items-center justify-center gap-2"
            >
              <span>{audioEnabled ? '🔊' : '🔇'}</span>
              <span>{audioEnabled ? 'SOUND EFFECTS ACTIVE' : 'SOUND EFFECTS MUTED'}</span>
            </button>
          </div>
        )}
      </nav>

      {/* Global Toast for Unavailable Language */}
      {langToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-md w-[90%] glass border border-amber-500/40 rounded-2xl p-4 shadow-2xl animate-fadeInUp bg-slate-900/90">
          <div className="flex items-start gap-3">
            <span className="text-xl">🌐</span>
            <div className="flex-1">
              <div className="text-xs font-bold text-amber-400 uppercase font-mono tracking-wider mb-1">
                Language Notice
              </div>
              <p className="text-xs text-gray-200 leading-relaxed">
                {langToast}
              </p>
            </div>
            <button
              onClick={() => setLangToast(null)}
              className="text-gray-400 hover:text-white text-xs px-1"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Team & Project About Modal */}
      <AboutModal isOpen={aboutOpen} onClose={() => setAboutOpen(false)} />
    </>
  )
}
