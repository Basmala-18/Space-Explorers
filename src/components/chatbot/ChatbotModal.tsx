import { useState, useRef, useEffect } from 'react'
import type { Mission } from '../../data/missions'
import {
  ChatMessage,
  getStoredGeminiApiKey,
  setStoredGeminiApiKey,
  sendGeminiChatMessage,
  queryOfflineKnowledgeEngine,
} from '../../services/aiChatService'

interface ChatbotModalProps {
  isOpen: boolean
  onClose: () => void
  mission: Mission
}

export default function ChatbotModal({ isOpen, onClose, mission }: ChatbotModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'bot',
      text: `Greetings explorer! I am ${mission.name}. Ask me anything about my mission to space, my scientific instruments, or what I discovered!`,
      timestamp: Date.now(),
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const [showKeyConfig, setShowKeyConfig] = useState(false)
  const [keyInput, setKeyInput] = useState('')
  const [apiError, setApiError] = useState<string | null>(null)

  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const existingKey = getStoredGeminiApiKey()
    setApiKey(existingKey)
    setKeyInput(existingKey)
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSaveKey = () => {
    setStoredGeminiApiKey(keyInput)
    setApiKey(keyInput.trim())
    setShowKeyConfig(false)
    setApiError(null)
  }

  const sendMessage = async (overrideText?: string) => {
    const text = (overrideText || input).trim()
    if (!text || isTyping) return
    setInput('')
    setApiError(null)

    const userMsg: ChatMessage = { role: 'user', text, timestamp: Date.now() }
    setMessages(prev => [...prev, userMsg])
    setIsTyping(true)

    // 1. Try Live Gemini API if key is configured
    if (apiKey) {
      try {
        const botReply = await sendGeminiChatMessage(text, messages, mission, apiKey)
        setMessages(prev => [...prev, { role: 'bot', text: botReply, timestamp: Date.now() }])
        setIsTyping(false)
        return
      } catch (err: any) {
        console.warn('Gemini API call failed, falling back to NASA Knowledge Base:', err)
        setApiError(err.message || 'Gemini API call failed. Using offline NASA knowledge.')
      }
    }

    // 2. Intelligent Offline NASA Knowledge Engine fallback
    setTimeout(() => {
      const offlineReply = queryOfflineKnowledgeEngine(text, mission, messages)
      setMessages(prev => [...prev, { role: 'bot', text: offlineReply, timestamp: Date.now() }])
      setIsTyping(false)
    }, 450)
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // Curate dynamic mission suggestions
  const suggestions = [
    `What was your greatest discovery?`,
    `Tell me about your instruments`,
    `What happened during your launch?`,
    `Tell me a fun NASA fact!`,
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end sm:p-6 p-0">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Dialog */}
      <div
        className="chatbot-modal glass border border-white/10 rounded-t-2xl sm:rounded-2xl w-full sm:w-[420px] relative z-10 flex flex-col shadow-2xl overflow-hidden"
        style={{
          maxHeight: '85vh',
          height: '620px',
          borderColor: mission.color + '40',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-4 border-b border-white/10"
          style={{ background: `linear-gradient(135deg, ${mission.color}25, rgba(15,23,42,0.8))` }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-md"
              style={{ background: mission.color, color: 'white', fontFamily: 'Orbitron, sans-serif' }}
            >
              {mission.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="font-bold text-white text-sm tracking-wide" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                {mission.name}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className={`w-2 h-2 rounded-full ${apiKey ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}
                />
                <span className="text-[10px] text-gray-300 font-mono">
                  {apiKey ? 'Live Gemini AI' : 'NASA Knowledge Engine'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Configure Key Button */}
            <button
              onClick={() => setShowKeyConfig(!showKeyConfig)}
              className="w-8 h-8 rounded-lg glass border border-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-colors hover:bg-white/10"
              title="Configure real Gemini AI connection"
            >
              ⚙️
            </button>
            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg glass border border-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-colors hover:bg-white/10"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Optional Gemini API Key Drawer */}
        {showKeyConfig && (
          <div className="p-3 bg-slate-900/95 border-b border-white/10 text-xs text-gray-300 animate-fadeInUp">
            <div className="font-semibold text-white mb-1 flex items-center justify-between">
              <span>🤖 Connect Real Gemini AI Backend</span>
              <button
                onClick={() => setShowKeyConfig(false)}
                className="text-gray-400 hover:text-white text-[10px]"
              >
                Close
              </button>
            </div>
            <p className="text-gray-400 text-[11px] mb-2 leading-relaxed">
              Enter a Google Gemini API Key to enable live generative AI powered by <code className="text-blue-300">gemini-1.5-flash</code>. If empty, the app runs the verified offline NASA knowledge engine.
            </p>
            <div className="flex gap-2">
              <input
                type="password"
                value={keyInput}
                onChange={e => setKeyInput(e.target.value)}
                placeholder="AIzaSy..."
                className="flex-1 bg-black/50 border border-white/20 rounded px-2.5 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-400"
              />
              <button
                onClick={handleSaveKey}
                className="px-3 py-1.5 rounded font-semibold text-white bg-blue-600 hover:bg-blue-500 text-xs transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        )}

        {/* API Error Banner if any */}
        {apiError && (
          <div className="mx-4 mt-2 px-3 py-1.5 rounded bg-red-500/10 border border-red-500/30 text-[11px] text-red-300 flex items-center justify-between">
            <span className="truncate">⚠️ {apiError}</span>
            <button onClick={() => setApiError(null)} className="ml-2 font-bold">✕</button>
          </div>
        )}

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-md ${
                  msg.role === 'user'
                    ? 'rounded-br-xs text-white font-medium'
                    : 'glass border border-white/10 text-gray-100 rounded-bl-xs'
                }`}
                style={
                  msg.role === 'user'
                    ? {
                        background: `linear-gradient(135deg, ${mission.color}, ${mission.color}cc)`,
                        boxShadow: `0 0 12px ${mission.color}40`,
                      }
                    : { background: 'rgba(15, 23, 42, 0.75)' }
                }
              >
                {msg.text}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="glass border border-white/10 rounded-2xl px-4 py-3 rounded-bl-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Prompt Suggestions */}
        <div className="px-3 pb-2 pt-1 border-t border-white/5 bg-black/20">
          <div className="text-[10px] text-gray-400 font-mono mb-1.5 flex items-center gap-1">
            <span>💡 EXPLORE QUESTIONS:</span>
          </div>
          <div className="flex flex-wrap gap-1.5 max-h-16 overflow-y-auto">
            {suggestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => sendMessage(q)}
                disabled={isTyping}
                className="text-[11px] px-2.5 py-1 rounded-full glass border border-white/10 hover:border-blue-400/50 hover:bg-blue-500/10 text-gray-300 hover:text-white transition-all text-left truncate max-w-full cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Input Field */}
        <div className="p-3 border-t border-white/10 bg-slate-950/60">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              disabled={isTyping}
              placeholder={`Ask ${mission.name} about its journey...`}
              className="flex-1 glass border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 transition-colors"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isTyping}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 cursor-pointer shadow-lg"
              style={{ background: mission.color }}
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
