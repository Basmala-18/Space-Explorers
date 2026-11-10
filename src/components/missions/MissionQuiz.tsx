import { useState } from 'react'
import { useStore } from '../../store/useStore'
import type { QuizQuestion } from '../../data/missions'

interface MissionQuizProps {
  questions: QuizQuestion[]
  missionId: string
  missionName: string
  color: string
}

export default function MissionQuiz({ questions, missionId, missionName, color }: MissionQuizProps) {
  const [currentQ, setCurrentQ] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const { setQuizScore } = useStore()

  const q = questions[currentQ]

  const handleSelect = (idx: number) => {
    if (answered) return
    setSelected(idx)
    setAnswered(true)
    if (idx === q.correctIndex) setScore(s => s + 1)
  }

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(c => c + 1)
      setSelected(null)
      setAnswered(false)
    } else {
      setFinished(true)
      setQuizScore(missionId, score + (selected === q.correctIndex ? 1 : 0))
    }
  }

  const handleReplay = () => {
    setCurrentQ(0)
    setSelected(null)
    setAnswered(false)
    setScore(0)
    setFinished(false)
  }

  const finalScore = finished ? score : score + (selected === q?.correctIndex ? 1 : 0)
  const pct = Math.round((finalScore / questions.length) * 100)
  const stars = pct >= 80 ? 3 : pct >= 60 ? 2 : 1

  if (finished) {
    return (
      <div className="text-center py-8 animate-fadeInUp">
        <div className="text-5xl mb-4">
          {pct >= 80 ? '🏆' : pct >= 60 ? '🎉' : '🚀'}
        </div>
        <h3
          className="text-2xl font-bold mb-2"
          style={{ fontFamily: 'Orbitron, sans-serif', color }}
        >
          {pct >= 80 ? 'MISSION ACCOMPLISHED!' : pct >= 60 ? 'WELL DONE!' : 'KEEP EXPLORING!'}
        </h3>
        <p className="text-gray-400 mb-4">
          You scored <span className="text-white font-bold">{finalScore}/{questions.length}</span> on the {missionName} quiz
        </p>

        <div className="star-rating flex justify-center gap-2 mb-6">
          {[1, 2, 3].map(s => (
            <span key={s} style={{ opacity: s <= stars ? 1 : 0.2, fontSize: '2rem' }}>⭐</span>
          ))}
        </div>

        <div
          className="inline-block px-4 py-2 rounded-full mb-6 text-sm font-semibold"
          style={{ background: color + '22', color, border: `1px solid ${color}40` }}
        >
          {pct}% Score
        </div>

        <div>
          <button
            onClick={handleReplay}
            className="px-6 py-3 rounded-full font-semibold text-white transition-all hover:scale-105"
            style={{ background: color }}
          >
            Replay Quiz
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3
          className="text-lg font-bold tracking-widest text-white"
          style={{ fontFamily: 'Orbitron, sans-serif' }}
        >
          KNOWLEDGE CHECK
        </h3>
        <span className="text-sm text-gray-400">
          {currentQ + 1} / {questions.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-white/10 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${((currentQ + (answered ? 1 : 0)) / questions.length) * 100}%`, background: color }}
        />
      </div>

      <div className="glass rounded-xl border border-white/5 p-5 mb-4">
        <p className="text-white font-semibold text-base leading-relaxed mb-5">
          {q.question}
        </p>

        <div className="space-y-3">
          {q.options.map((opt, i) => {
            let className = 'quiz-option glass border border-white/5 rounded-xl px-4 py-3 text-left w-full text-sm transition-all'
            if (answered) {
              if (i === q.correctIndex) className += ' correct'
              else if (i === selected && i !== q.correctIndex) className += ' incorrect'
            } else {
              className += ' hover:border-white/20 hover:bg-white/5 cursor-pointer'
            }

            return (
              <button
                key={i}
                className={className}
                onClick={() => handleSelect(i)}
                disabled={answered}
              >
                <span
                  className="inline-flex w-6 h-6 rounded-full items-center justify-center text-xs font-bold mr-3 flex-shrink-0"
                  style={{
                    background: answered && i === q.correctIndex
                      ? '#22c55e'
                      : answered && i === selected && i !== q.correctIndex
                        ? '#ef4444'
                        : color + '22',
                    color: answered && (i === q.correctIndex || i === selected) ? 'white' : color,
                  }}
                >
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="text-gray-200">{opt}</span>
              </button>
            )
          })}
        </div>

        {answered && (
          <div
            className="mt-4 p-3 rounded-xl text-sm animate-fadeInUp"
            style={{
              background: selected === q.correctIndex ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
              borderLeft: `3px solid ${selected === q.correctIndex ? '#22c55e' : '#ef4444'}`,
            }}
          >
            <div className="font-semibold mb-1" style={{ color: selected === q.correctIndex ? '#22c55e' : '#ef4444' }}>
              {selected === q.correctIndex ? '✓ Correct!' : '✗ Not quite'}
            </div>
            <p className="text-gray-300">{q.explanation}</p>
          </div>
        )}
      </div>

      {answered && (
        <button
          onClick={handleNext}
          className="w-full py-3 rounded-xl font-semibold text-white transition-all hover:scale-[1.02]"
          style={{ background: color }}
        >
          {currentQ < questions.length - 1 ? 'Next Question →' : 'See Results'}
        </button>
      )}
    </div>
  )
}
