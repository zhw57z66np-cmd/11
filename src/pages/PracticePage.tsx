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
  const [quizFinished, setQuizFinished] = useState(false)
  const [submittedAnswers, setSubmittedAnswers] = useState<Record<string, string>>({})

  const { currentQuestions, currentIndex, answers, startQuiz, setAnswer, nextQuestion, prevQuestion, resetQuiz } = useQuizStore()
  const updatePracticeResult = useProgressStore(s => s.updatePracticeResult)

  const lessonQuestions = useMemo(() => questions.filter(q => q.lessonId === lessonId), [lessonId])

  const handleStart = () => { 
    startQuiz(lessonQuestions)
    setQuizFinished(false)
    setSubmittedAnswers({})
  }

  const handleSubmitAnswer = () => {
    const currentQ = currentQuestions[currentIndex]
    if (!currentQ) return
    const userAns = answers[currentQ.id] || ''
    if (!userAns.trim()) return
    setSubmittedAnswers(prev => ({ ...prev, [currentQ.id]: userAns }))
  }

  const handleFinish = () => {
    currentQuestions.forEach(q => {
      const userAns = submittedAnswers[q.id] || answers[q.id] || ''
      const isCorrect = checkAnswer(q, userAns)
      if (lessonId) updatePracticeResult(lessonId, q.id, isCorrect)
    })
    setQuizFinished(true)
  }

  if (currentQuestions.length === 0) {
    return (
      <div className="min-h-dvh flex items-center justify-center p-6 page-enter"
        style={{ background: 'var(--bg-base)' }}>
        <div className="surface-card-elevated p-7 text-center max-w-sm w-full scale-enter">
          <div className="w-14 h-14 rounded-[16px] mx-auto mb-4 flex items-center justify-center"
            style={{ background: 'var(--info-50)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--info-500)" strokeWidth="2" strokeLinecap="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </div>
          <h2 className="text-[18px] font-bold mb-1.5" style={{ color: 'var(--n-700)' }}>
            {lesson?.title || '练习'}
          </h2>
          <p className="text-[13px] mb-6" style={{ color: 'var(--n-400)' }}>
            共 {lessonQuestions.length} 道题目
          </p>
          <button 
            onClick={handleStart} 
            disabled={lessonQuestions.length === 0} 
            className="w-full py-3 rounded-[var(--r-md)] text-[15px] btn-primary btn-press disabled:opacity-40">
            开始练习
          </button>
          <button onClick={() => navigate('/kid')} className="mt-3 text-[13px] btn-press"
            style={{ color: 'var(--n-400)' }}>
            ← 返回
          </button>
        </div>
      </div>
    )
  }

  if (quizFinished) {
    const results = currentQuestions.map(q => ({ 
      question: q, 
      userAnswer: submittedAnswers[q.id] || answers[q.id] || '', 
      isCorrect: checkAnswer(q, submittedAnswers[q.id] || answers[q.id] || '') 
    }))
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

  const isSubmitted = !!submittedAnswers[currentQ.id]
  const userAnswer = submittedAnswers[currentQ.id] || answers[currentQ.id] || ''
  const isCorrect = isSubmitted ? checkAnswer(currentQ, userAnswer) : false
  const allSubmitted = currentQuestions.every(q => !!submittedAnswers[q.id])

  return (
    <div className="min-h-dvh page-enter" style={{ background: 'var(--bg-base)' }}>
      {/* 顶部进度 */}
      <header className="sticky top-0 z-20 border-b"
        style={{ 
          background: 'rgba(251, 248, 243, 0.92)',
          backdropFilter: 'blur(16px) saturate(1.2)',
          borderColor: 'var(--border-default)'
        }}>
        <div className="max-w-2xl mx-auto px-4 py-2.5">
          <div className="flex items-center justify-between mb-2">
            <button 
              onClick={() => { resetQuiz(); navigate('/kid') }} 
              className="text-[13px] btn-press px-3 py-1.5 rounded-[var(--r-sm)]"
              style={{ color: 'var(--n-500)', background: 'var(--bg-muted)' }}>
              ← 退出
            </button>
            <span className="text-[13px] font-semibold" style={{ color: 'var(--n-500)' }}>
              {currentIndex + 1} / {currentQuestions.length}
            </span>
            <div className="flex items-center gap-1 px-2 py-1 rounded-[var(--r-xs)]"
              style={{ background: 'var(--bg-muted)' }}>
              <span className="text-[11px]" style={{ color: 'var(--n-400)' }}>
                已答 {Object.keys(submittedAnswers).length}/{currentQuestions.length}
              </span>
            </div>
          </div>
          {/* 进度条 */}
          <div className="w-full h-[5px] rounded-full" style={{ background: 'var(--n-200)' }}>
            <div 
              className="h-full rounded-full progress-bar" 
              style={{ 
                width: `${((currentIndex + 1) / currentQuestions.length) * 100}%`,
                background: 'linear-gradient(90deg, var(--info-500), var(--info-400))'
              }} 
            />
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-5">
        {/* 题目卡片 */}
        <QuizQuestion 
          question={currentQ} 
          userAnswer={userAnswer}
          onAnswer={ans => setAnswer(currentQ.id, ans)} 
          showResult={isSubmitted}
          isCorrect={isSubmitted ? isCorrect : undefined}
          showHint={false}
          disabled={isSubmitted}
        />

        {/* 答题反馈 */}
        {isSubmitted && (
          <div className="mt-4 rounded-[var(--r-lg)] p-4 border page-enter-fast"
            style={{ 
              background: isCorrect ? 'var(--success-50)' : 'var(--warning-50)',
              borderColor: isCorrect ? 'var(--success-100)' : 'var(--warning-100)'
            }}>
            {isCorrect ? (
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ background: 'var(--success-100)' }}>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="var(--success-600)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 8.5L6.5 12L13 4"/>
                  </svg>
                </div>
                <span className="font-bold text-[14px]" style={{ color: 'var(--success-700)' }}>
                  回答正确！太棒了！
                </span>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ background: 'var(--warning-100)' }}>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="var(--warning-600)" strokeWidth="2" strokeLinecap="round">
                      <circle cx="8" cy="8" r="6"/>
                      <path d="M8 5V8.5"/>
                      <circle cx="8" cy="11" r="0.5" fill="var(--warning-600)"/>
                    </svg>
                  </div>
                  <span className="font-bold text-[14px]" style={{ color: 'var(--warning-600)' }}>
                    再想想看
                  </span>
                </div>
                <p className="text-[13px] ml-9" style={{ color: 'var(--n-500)' }}>
                  正确答案：<span className="font-bold" style={{ color: 'var(--success-600)' }}>
                    {typeof currentQ.answer === 'object' && !Array.isArray(currentQ.answer)
                      ? Object.entries(currentQ.answer).map(([k, v]) => `${k}→${v}`).join('；')
                      : Array.isArray(currentQ.answer)
                        ? currentQ.answer.join('、')
                        : String(currentQ.answer)}
                  </span>
                </p>
                {currentQ.explanation && (
                  <p className="text-[12px] mt-1.5 ml-9" style={{ color: 'var(--n-400)' }}>
                    {currentQ.explanation}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* 操作按钮 */}
        <div className="flex gap-3 mt-6">
          <button 
            onClick={prevQuestion} 
            disabled={currentIndex === 0} 
            className="flex-1 py-3 rounded-[var(--r-md)] text-[14px] font-medium btn-press btn-ghost disabled:opacity-30">
            ← 上一题
          </button>
          
          {!isSubmitted ? (
            <button 
              onClick={handleSubmitAnswer}
              disabled={!answers[currentQ.id]?.trim()}
              className="flex-1 py-3 rounded-[var(--r-md)] text-[14px] btn-primary btn-press disabled:opacity-40">
              提交答案
            </button>
          ) : currentIndex < currentQuestions.length - 1 ? (
            <button 
              onClick={nextQuestion} 
              className="flex-1 py-3 rounded-[var(--r-md)] text-[14px] btn-secondary btn-press">
              下一题 →
            </button>
          ) : (
            <button 
              onClick={handleFinish} 
              disabled={!allSubmitted}
              className="flex-1 py-3 rounded-[var(--r-md)] text-[14px] font-bold text-white btn-press disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg, var(--success-500), var(--success-400))', boxShadow: 'var(--shadow-sm), 0 4px 16px rgba(34, 197, 94, 0.25)' }}>
              完成练习
            </button>
          )}
        </div>
      </main>
    </div>
  )
}
