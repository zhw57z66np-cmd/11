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

  /* ─── 考前准备页 ─── */
  if (!examStarted) {
    return (
      <div className="min-h-dvh flex items-center justify-center p-4 page-enter"
        style={{ background: 'linear-gradient(160deg, var(--accent-50) 0%, var(--bg-base) 40%, var(--primary-50) 100%)' }}>
        <div className="surface-card-elevated p-7 text-center max-w-md w-full scale-enter">
          {/* 图标 */}
          <div className="w-16 h-16 rounded-[18px] mx-auto mb-5 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, var(--accent-100), var(--accent-200))' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent-500)" strokeWidth="2" strokeLinecap="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <path d="M14 2v6h6"/>
              <path d="M16 13H8"/>
              <path d="M16 17H8"/>
              <path d="M10 9H8"/>
            </svg>
          </div>
          <h2 className="text-[22px] font-extrabold mb-1" style={{ color: 'var(--n-800)' }}>
            {unit?.name || '单元测试'}
          </h2>
          <p className="text-[13px] mb-5" style={{ color: 'var(--n-400)' }}>
            检验本单元的学习成果
          </p>

          {/* 考试信息 */}
          <div className="rounded-[var(--r-lg)] p-4 mb-6 space-y-2.5"
            style={{ background: 'var(--bg-subtle)' }}>
            <div className="flex items-center justify-between text-[13px]">
              <span className="flex items-center gap-2" style={{ color: 'var(--n-500)' }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <circle cx="8" cy="8" r="6"/>
                  <path d="M8 5v3l2 2"/>
                </svg>
                题目数量
              </span>
              <span className="font-bold" style={{ color: 'var(--n-700)' }}>{unitQuestions.length} 道</span>
            </div>
            <div className="flex items-center justify-between text-[13px]">
              <span className="flex items-center gap-2" style={{ color: 'var(--n-500)' }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M13.5 2.5L7.5 8.5 M7.5 8.5L4 5 M7.5 8.5L5 11"/>
                </svg>
                总分
              </span>
              <span className="font-bold" style={{ color: 'var(--n-700)' }}>{unitQuestions.reduce((s, q) => s + q.points, 0)} 分</span>
            </div>
            <div className="flex items-center justify-between text-[13px]">
              <span className="flex items-center gap-2" style={{ color: 'var(--n-500)' }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <circle cx="8" cy="8" r="6.5"/>
                  <path d="M8 4v4"/>
                </svg>
                限时
              </span>
              <span className="font-bold" style={{ color: 'var(--accent-500)' }}>30 分钟</span>
            </div>
          </div>

          <button
            onClick={handleStart}
            disabled={unitQuestions.length === 0}
            className="w-full py-3.5 rounded-[var(--r-md)] text-[16px] btn-primary btn-press disabled:opacity-40"
          >
            开始考试
          </button>
          <button onClick={() => navigate('/kid')} className="mt-3 text-[13px] btn-press"
            style={{ color: 'var(--n-400)' }}>
            ← 返回
          </button>
        </div>
      </div>
    )
  }

  /* ─── 结果页 ─── */
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

  /* ─── 答题中 ─── */
  const currentQ = currentQuestions[currentIndex]
  if (!currentQ) return null

  const answeredCount = Object.keys(answers).length
  const progressPercent = ((currentIndex + 1) / currentQuestions.length) * 100

  return (
    <div className="min-h-dvh page-enter" style={{ background: 'var(--bg-base)' }}>
      <header className="sticky top-0 z-20 border-b"
        style={{ 
          background: 'rgba(251, 248, 243, 0.92)',
          backdropFilter: 'blur(16px) saturate(1.2)',
          borderColor: 'var(--border-default)'
        }}>
        <div className="max-w-3xl mx-auto px-4 py-2.5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] font-bold flex items-center gap-1.5" style={{ color: 'var(--accent-500)' }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <path d="M14 2v6h6"/>
              </svg>
              {unit?.name}
            </span>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-[var(--r-xs)]"
              style={{ background: timeLeft < 300 ? 'var(--danger-50)' : 'var(--bg-muted)' }}>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" 
                stroke={timeLeft < 300 ? 'var(--danger-500)' : 'var(--n-400)'} 
                strokeWidth="2" strokeLinecap="round">
                <circle cx="8" cy="8" r="6"/>
                <path d="M8 4v4"/>
              </svg>
              <span className={`text-[13px] font-mono font-bold`}
                style={{ color: timeLeft < 300 ? 'var(--danger-500)' : 'var(--n-600)' }}>
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between text-[11px] mb-2" style={{ color: 'var(--n-400)' }}>
            <span>第 {currentIndex + 1} / {currentQuestions.length} 题</span>
            <span>已答 {answeredCount} 题</span>
          </div>
          <div className="w-full h-[5px] rounded-full overflow-hidden" style={{ background: 'var(--n-200)' }}>
            <div
              className="h-full rounded-full progress-bar"
              style={{ 
                width: `${progressPercent}%`,
                background: 'linear-gradient(90deg, var(--accent-400), var(--accent-500))'
              }}
            />
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-5">
        <QuizQuestion
          question={currentQ}
          userAnswer={answers[currentQ.id] || ''}
          onAnswer={ans => setAnswer(currentQ.id, ans)}
          showResult={false}
          showHint={false}
        />

        {/* 题目导航网格 */}
        <div className="mt-4 rounded-[var(--r-lg)] p-3 surface-card">
          <div className="flex flex-wrap gap-1.5 justify-center">
            {currentQuestions.map((_, i) => {
              const isAnswered = !!answers[currentQuestions[i].id]
              const isCurrent = i === currentIndex
              return (
                <button
                  key={i}
                  onClick={() => goToQuestion(i)}
                  className="w-8 h-8 rounded-[var(--r-xs)] text-[11px] font-semibold btn-press transition-all"
                  style={{
                    background: isCurrent
                      ? 'linear-gradient(135deg, var(--accent-500), var(--accent-400))'
                      : isAnswered
                        ? 'var(--success-100)'
                        : 'var(--bg-muted)',
                    color: isCurrent
                      ? 'white'
                      : isAnswered
                        ? 'var(--success-700)'
                        : 'var(--n-400)',
                    boxShadow: isCurrent ? '0 2px 8px rgba(236, 72, 153, 0.3)' : 'none'
                  }}
                >
                  {i + 1}
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          <button
            onClick={prevQuestion}
            disabled={currentIndex === 0}
            className="flex-1 py-3 rounded-[var(--r-md)] text-[14px] font-medium btn-press btn-ghost disabled:opacity-30"
          >
            ← 上一题
          </button>
          {currentIndex < currentQuestions.length - 1 ? (
            <button onClick={nextQuestion} className="flex-1 py-3 rounded-[var(--r-md)] text-[14px] btn-primary btn-press">
              下一题 →
            </button>
          ) : (
            <button onClick={handleFinish} 
              className="flex-1 py-3 rounded-[var(--r-md)] text-[14px] font-bold text-white btn-press"
              style={{ background: 'linear-gradient(135deg, var(--success-500), var(--success-400))', boxShadow: 'var(--shadow-sm), 0 4px 16px rgba(34, 197, 94, 0.25)' }}>
              交卷
            </button>
          )}
        </div>
      </main>
    </div>
  )
}
