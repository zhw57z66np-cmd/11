import type { Question } from '../types'

export function checkAnswer(question: Question, userAnswer: string): boolean {
  const normalized = userAnswer.trim()
  if (!normalized) return false

  // 连线匹配题 (Record<string, string>)
  if (typeof question.answer === 'object' && !Array.isArray(question.answer) && question.answer !== null) {
    const answerObj = question.answer as Record<string, string>
    const keys = Object.keys(answerObj)
    return keys.every(key => {
      const value = answerObj[key]
      return normalized.includes(key) && normalized.includes(value)
    })
  }

  if (Array.isArray(question.answer)) {
    // 组词题：答出任意一个即可
    if (question.type === 'word_form') {
      return question.answer.some(a => normalized.includes(a.trim()))
    }
    // 其他数组答案题：全部匹配
    return question.answer.every(a =>
      normalized.includes(a.trim())
    )
  }

  if (typeof question.answer === 'string') {
    return normalized === question.answer ||
           normalized.includes(question.answer) ||
           question.answer.includes(normalized)
  }

  return false
}

export function calculateScore(
  results: { question: Question; userAnswer: string; isCorrect: boolean }[]
): { total: number; earned: number; rate: number } {
  const total = results.reduce((sum, r) => sum + r.question.points, 0)
  const earned = results
    .filter(r => r.isCorrect)
    .reduce((sum, r) => sum + r.question.points, 0)
  const rate = total > 0 ? Math.round((earned / total) * 100) : 0
  return { total, earned, rate }
}

export function getMasteryLevel(rate: number): '未学习' | '学习中' | '已掌握' | '优秀' {
  if (rate >= 90) return '优秀'
  if (rate >= 70) return '已掌握'
  if (rate >= 40) return '学习中'
  return '未学习'
}
