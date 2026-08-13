import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { units, lessons } from '../data/lessons'
import { questions } from '../data/questions'
import { useQuizStore } from '../store/useQuizStore'
import { useProgressStore } from '../store/useProgressStore'
import { checkAnswer, calculateScore } from '../utils/scoring'
import QuizQuestion from '../components/kid/QuizQuestion'
import ResultScreen from '../components/kid/ResultScreen'

export default function ExamPage() {
  const { unitId } = useParams()
  const navigate = useNavigate()
  const unit = units.find(u => u.id === unitId)
  const [examStarted, setExamStarted] = useState(false)
  const [quizFinished, setQuizFinished] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)

  const { currentQuestions, currentIndex, answers, startTime, startQuiz, setAnswer, nextQuestion, prevQuestion, goToQuestion, finishQuiz, resetQuiz } = useQuizStore()
  const saveExamRecord = useProgressStore(s => s.saveExamRecord)
  const updatePracticeResult = useProgressStore(s => s.updatePracticeResult)

  // 使用 ref 保存最新引用，避免闭包陈旧
  const answersRef = useRef(answers)
  answersRef.current = answers
  const currentQuestionsRef = useRef(currentQuestions)
  currentQuestionsRef.current = currentQuestions
  const startTimeRef = useRef(startTime)
  startTimeRef.current = startTime

  const unitQuestions = useMemo(() => {
    if (!unitId) return []
    const unitLessonIds = lessons.filter(l => l.unitId === unitId).map(l => l.id)
    return questions.filter(q => unitLessonIds.includes(q.lessonId))
  }, [unitId])

  const handleFinish = useCallback(() => {
    setQuizFinished(true)
    const latestAnswers = answersRef.current
    const latestQuestions = currentQuestionsRef.current
    const latestStartTime = startTimeRef.current
    const results = latestQuestions.map(q => ({
      question: q,
      userAnswer: latestAnswers[q.id] || '',
      isCorrect: checkAnswer(q, latestAnswers[q.id] || ''),
    }))
    const { total, earned } = calculateScore(results)
    const elapsed = latestStartTime ? Math.floor((Date.now() - latestStartTime) / 1000) : 0
    saveExamRecord({
      id: `exam_${Date.now()}`,
      examName: `${unit?.name || '单元测试'}`,
      startedAt: new Date(latestStartTime || Date.now()).toISOString(),
      finishedAt: new Date().toISOString(),
      totalScore: total,
      earnedScore: earned,
      duration: elapsed,
      questionResults: latestQuestions.map(q => ({
        questionId: q.id,
        isCorrect: checkAnswer(q, latestAnswers[q.id] || ''),
        userAnswer: latestAnswers[q.id] || '',
        timeSpent: 0,
      })),
    })
    // 更新每课考试次数
    const lessonIds = new Set(latestQuestions.map(q => q.lessonId))
    lessonIds.forEach(lid => {
      updatePracticeResult(lid, '__exam__', true)
    })
  }, [unit, saveExamRecord, updatePracticeResult])

  useEffect(() => {
    if (!examStarted || quizFinished) return
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          finishQuiz()
          handleFinish()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [examStarted, quizFinished, finishQuiz, handleFinish])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const handleStart = () => {
    startQuiz(unitQuestions)
    setTimeLeft(30 * 60)
    setExamStarted(true)
    setQuizFinished(false)
  }

  if (!examStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 shadow-lg text-center max-w-md w-full">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{unit?.name || '单元测试'}</h2>
          <div className="space-y-2 text-gray-500 mb-6">
            <p>共 {unitQuestions.length} 道题目</p>
            <p>总分 {unitQuestions.reduce((s, q) => s + q.points, 0)} 分</p>
            <p>限时 30 分钟</p>
          </div>
          <button
            onClick={handleStart}
            disabled={unitQuestions.length === 0}
            className="w-full bg-red-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-red-600 transition-colors disabled:bg-gray-300"
          >
            开始考试
          </button>
          <button onClick={() => navigate('/kid')} className="mt-3 text-gray-500 hover:text-gray-700">
            ← 返回
          </button>
        </div>
      </div>
    )
  }

  if (quizFinished) {
    const results = currentQuestions.map(q => ({
      question: q,
      userAnswer: answers[q.id] || '',
      isCorrect: checkAnswer(q, answers[q.id] || ''),
    }))
    const { total, earned, rate } = calculateScore(results)
    return (
      <ResultScreen
        total={total}
        earned={earned}
        rate={rate}
        onRetry={handleStart}
        onBack={() => { resetQuiz(); navigate('/kid') }}
      />
    )
  }

  const currentQ = currentQuestions[currentIndex]
  if (!currentQ) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-pink-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-red-600">📝 {unit?.name}</span>
            <span className={`text-sm font-mono font-bold ${timeLeft < 300 ? 'text-red-600 animate-pulse' : 'text-gray-700'}`}>
              ⏰ {formatTime(timeLeft)}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span>第 {currentIndex + 1} / {currentQuestions.length} 题</span>
            <span>已答 {Object.keys(answers).length} 题</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-red-500 h-2 rounded-full transition-all"
              style={{ width: `${((currentIndex + 1) / currentQuestions.length) * 100}%` }}
            />
          </div>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-6">
        <QuizQuestion
          question={currentQ}
          userAnswer={answers[currentQ.id] || ''}
          onAnswer={ans => setAnswer(currentQ.id, ans)}
          showResult={false}
          showHint={false}
        />
        <div className="flex flex-wrap gap-2 mt-4 justify-center">
          {currentQuestions.map((_, i) => (
            <button
              key={i}
              onClick={() => goToQuestion(i)}
              className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                i === currentIndex
                  ? 'bg-red-500 text-white'
                  : answers[currentQuestions[i].id]
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-500'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={prevQuestion}
            disabled={currentIndex === 0}
            className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 disabled:opacity-30"
          >
            ← 上一题
          </button>
          {currentIndex < currentQuestions.length - 1 ? (
            <button onClick={nextQuestion} className="flex-1 bg-red-500 text-white py-3 rounded-xl font-medium hover:bg-red-600">
              下一题 →
            </button>
          ) : (
            <button onClick={handleFinish} className="flex-1 bg-green-500 text-white py-3 rounded-xl font-bold hover:bg-green-600">
              ✅ 交卷
            </button>
          )}
        </div>
      </main>
    </div>
  )
}
