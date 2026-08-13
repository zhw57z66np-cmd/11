import { create } from 'zustand'
import type { Question } from '../types'

interface QuizState {
  currentQuestions: Question[]
  currentIndex: number
  answers: Record<string, string>
  startTime: number | null
  isFinished: boolean
  startQuiz: (questions: Question[]) => void
  setAnswer: (questionId: string, answer: string) => void
  nextQuestion: () => void
  prevQuestion: () => void
  goToQuestion: (index: number) => void
  finishQuiz: () => void
  resetQuiz: () => void
  getCurrentQuestion: () => Question | null
  getElapsedTime: () => number
}

export const useQuizStore = create<QuizState>((set, get) => ({
  currentQuestions: [],
  currentIndex: 0,
  answers: {},
  startTime: null,
  isFinished: false,

  startQuiz: (questions: Question[]) => {
    set({
      currentQuestions: questions,
      currentIndex: 0,
      answers: {},
      startTime: Date.now(),
      isFinished: false,
    })
  },

  setAnswer: (questionId: string, answer: string) => {
    set(state => ({
      answers: { ...state.answers, [questionId]: answer },
    }))
  },

  nextQuestion: () => {
    set(state => ({
      currentIndex: Math.min(state.currentIndex + 1, state.currentQuestions.length - 1),
    }))
  },

  prevQuestion: () => {
    set(state => ({
      currentIndex: Math.max(state.currentIndex - 1, 0),
    }))
  },

  goToQuestion: (index: number) => {
    set(state => ({
      currentIndex: Math.max(0, Math.min(index, state.currentQuestions.length - 1)),
    }))
  },

  finishQuiz: () => {
    set({ isFinished: true })
  },

  resetQuiz: () => {
    set({
      currentQuestions: [],
      currentIndex: 0,
      answers: {},
      startTime: null,
      isFinished: false,
    })
  },

  getCurrentQuestion: () => {
    const { currentQuestions, currentIndex } = get()
    return currentQuestions[currentIndex] || null
  },

  getElapsedTime: () => {
    const { startTime } = get()
    return startTime ? Math.floor((Date.now() - startTime) / 1000) : 0
  },
}))
