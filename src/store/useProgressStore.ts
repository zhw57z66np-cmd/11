import { create } from 'zustand'
import type { ProgressRecord, ExamRecord } from '../types'
import { storage } from '../utils/storage'
import { getMasteryLevel } from '../utils/scoring'
import { units } from '../data/lessons'
import { useChildStore } from './useChildStore'

// 获取当前孩子的存储 key
function getChildKey(prefix: string) {
  const childId = useChildStore.getState().currentChildId
  return childId ? `${prefix}_${childId}` : `${prefix}_default`
}

interface ProgressState {
  records: Record<string, ProgressRecord>
  examRecords: ExamRecord[]
  loadChildData: () => void
  updateStudyProgress: (lessonId: string) => void
  updatePracticeResult: (lessonId: string, questionId: string, isCorrect: boolean) => void
  saveExamRecord: (record: ExamRecord) => void
  getLessonProgress: (lessonId: string) => ProgressRecord
  getUnitProgress: (unitId: string) => { total: number; mastered: number; rate: number }
  resetProgress: () => void
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  records: {},
  examRecords: [],

  loadChildData: () => {
    const records = storage.get(getChildKey('progress'), {})
    const examRecords = storage.get(getChildKey('exam'), [])
    set({ records, examRecords })
  },

  updateStudyProgress: (lessonId: string) => {
    set(state => {
      const existing = state.records[lessonId] || {
        lessonId,
        studyCount: 0,
        practiceCount: 0,
        examCount: 0,
        correctRate: 0,
        lastStudiedAt: '',
        masteryLevel: '未学习' as const,
        wrongQuestions: [],
      }
      const updated = {
        ...existing,
        studyCount: existing.studyCount + 1,
        lastStudiedAt: new Date().toISOString(),
      }
      const newRecords = { ...state.records, [lessonId]: updated }
      storage.set(getChildKey('progress'), newRecords)
      return { records: newRecords }
    })
  },

  updatePracticeResult: (lessonId: string, questionId: string, isCorrect: boolean) => {
    set(state => {
      const existing = state.records[lessonId] || {
        lessonId,
        studyCount: 0,
        practiceCount: 0,
        examCount: 0,
        correctRate: 0,
        lastStudiedAt: '',
        masteryLevel: '未学习' as const,
        wrongQuestions: [],
      }
      const wrongQuestions = isCorrect
        ? existing.wrongQuestions.filter(id => id !== questionId)
        : [...new Set([...existing.wrongQuestions, questionId])]
      const totalSeen = Math.max(existing.wrongQuestions.length, wrongQuestions.length, 1)
      const wrongRate = wrongQuestions.length / Math.max(totalSeen, wrongQuestions.length + 1)
      const correctRate = Math.round((1 - wrongRate) * 100)
      const updated = {
        ...existing,
        practiceCount: existing.practiceCount + 1,
        correctRate,
        masteryLevel: getMasteryLevel(correctRate),
        wrongQuestions,
        lastStudiedAt: new Date().toISOString(),
      }
      const newRecords = { ...state.records, [lessonId]: updated }
      storage.set(getChildKey('progress'), newRecords)
      return { records: newRecords }
    })
  },

  saveExamRecord: (record: ExamRecord) => {
    set(state => {
      const newRecords = [...state.examRecords, record]
      storage.set(getChildKey('exam'), newRecords)
      return { examRecords: newRecords }
    })
  },

  getLessonProgress: (lessonId: string) => {
    return get().records[lessonId] || {
      lessonId,
      studyCount: 0,
      practiceCount: 0,
      examCount: 0,
      correctRate: 0,
      lastStudiedAt: '',
      masteryLevel: '未学习',
      wrongQuestions: [],
    }
  },

  getUnitProgress: (unitId: string) => {
    const { records } = get()
    const unit = units.find(u => u.id === unitId)
    const lessonIds = unit ? unit.lessonIds : []
    const unitRecords = lessonIds.map(id => records[id]).filter(Boolean)
    const total = lessonIds.length
    const mastered = unitRecords.filter(
      r => r.masteryLevel === '已掌握' || r.masteryLevel === '优秀'
    ).length
    const rate = unitRecords.length > 0
      ? Math.round(unitRecords.reduce((s, r) => s + r.correctRate, 0) / unitRecords.length)
      : 0
    return { total, mastered, rate }
  },

  resetProgress: () => {
    storage.remove(getChildKey('progress'))
    storage.remove(getChildKey('exam'))
    set({ records: {}, examRecords: [] })
  },
}))
