import { useParams, useNavigate } from 'react-router-dom'
import { useState, useMemo } from 'react'
import { lessons } from '../data/lessons'
import { questions } from '../data/questions'
import { useQuizStore } from '../store/useQuizStore'
import { useProgressStore } from '../store/useProgressStore'
import { checkAnswer, calculateScore } from '../utils/scoring'
import QuizQuestion from '../components/kid/QuizQuestion'
import ResultScreen from '../components/kid/ResultScreen'

export default function PracticePage() {
  const { lessonId } = useParams()
  const navigate = useNavigate()
  const lesson = lessons.find(l => l.id === lessonId)
  const [showHint, setShowHint] = useState(true)
  const [quizFinished, setQuizFinished] = useState(false)

  const { currentQuestions, currentIndex, answers, startQuiz, setAnswer, nextQuestion, prevQuestion, resetQuiz } = useQuizStore()
  const updatePracticeResult = useProgressStore(s => s.updatePracticeResult)

  const lessonQuestions = useMemo(() => questions.filter(q => q.lessonId === lessonId), [lessonId])

  const handleStart = () => { startQuiz(lessonQuestions); setQuizFinished(false) }

  const handleFinish = () => {
    currentQuestions.forEach(q => {
      const userAns = answers[q.id] || ''
      const isCorrect = checkAnswer(q, userAns)
      if (lessonId) updatePracticeResult(lessonId, q.id, isCorrect)
    })
    setQuizFinished(true)
  }

  if (currentQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 shadow-lg text-center max-w-md w-full">
          <div className="text-6xl mb-4">✍️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{lesson?.title || '练习'}</h2>
          <p className="text-gray-500 mb-6">共 {lessonQuestions.length} 道题目</p>
          <label className="flex items-center gap-2 text-sm text-gray-600 justify-center mb-4">
            <input type="checkbox" checked={showHint} onChange={e => setShowHint(e.target.checked)} className="rounded" />
            显示提示
          </label>
          <button onClick={handleStart} disabled={lessonQuestions.length === 0} className="w-full bg-blue-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300">
            开始练习
          </button>
          <button onClick={() => navigate('/kid')} className="mt-3 text-gray-500 hover:text-gray-700">← 返回</button>
        </div>
      </div>
    )
  }

  if (quizFinished) {
    const results = currentQuestions.map(q => ({ question: q, userAnswer: answers[q.id] || '', isCorrect: checkAnswer(q, answers[q.id] || '') }))
    const { total, earned, rate } = calculateScore(results)
    return (
      <ResultScreen
        total={total} earned={earned} rate={rate}
        onRetry={() => { resetQuiz(); setQuizFinished(false); handleStart() }}
        onBack={() => { resetQuiz(); navigate('/kid') }}
      />
    )
  }

  const currentQ = currentQuestions[currentIndex]
  if (!currentQ) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <button onClick={() => { resetQuiz(); navigate('/kid') }} className="text-gray-500 hover:text-gray-700 text-sm">← 退出</button>
            <span className="text-sm text-gray-500">第 {currentIndex + 1} / {currentQuestions.length} 题</span>
            <label className="flex items-center gap-1 text-xs text-gray-500">
              <input type="checkbox" checked={showHint} onChange={e => setShowHint(e.target.checked)} /> 提示
            </label>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${((currentIndex + 1) / currentQuestions.length) * 100}%` }} />
          </div>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-6">
        <QuizQuestion question={currentQ} userAnswer={answers[currentQ.id] || ''} onAnswer={ans => setAnswer(currentQ.id, ans)} showResult={false} showHint={showHint} />
        <div className="flex gap-3 mt-6">
          <button onClick={prevQuestion} disabled={currentIndex === 0} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 disabled:opacity-30">← 上一题</button>
          {currentIndex < currentQuestions.length - 1 ? (
            <button onClick={nextQuestion} className="flex-1 bg-blue-500 text-white py-3 rounded-xl font-medium hover:bg-blue-600">下一题 →</button>
          ) : (
            <button onClick={handleFinish} className="flex-1 bg-green-500 text-white py-3 rounded-xl font-bold hover:bg-green-600">✅ 完成练习</button>
          )}
        </div>
      </main>
    </div>
  )
}
