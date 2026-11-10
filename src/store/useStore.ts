import { create } from 'zustand'

interface StoreState {
  currentMission: string | null
  setCurrentMission: (id: string | null) => void
  quizScores: Record<string, number>
  setQuizScore: (missionId: string, score: number) => void
  audioEnabled: boolean
  toggleAudio: () => void
  narrationPlaying: boolean
  setNarrationPlaying: (playing: boolean) => void
  controlsHintDismissed: boolean
  dismissControlsHint: () => void
}

export const useStore = create<StoreState>((set) => ({
  currentMission: null,
  setCurrentMission: (id) => set({ currentMission: id }),
  quizScores: {},
  setQuizScore: (missionId, score) =>
    set((state) => ({ quizScores: { ...state.quizScores, [missionId]: score } })),
  audioEnabled: true,
  toggleAudio: () => set((state) => ({ audioEnabled: !state.audioEnabled })),
  narrationPlaying: false,
  setNarrationPlaying: (playing) => set({ narrationPlaying: playing }),
  controlsHintDismissed: false,
  dismissControlsHint: () => set({ controlsHintDismissed: true }),
}))
