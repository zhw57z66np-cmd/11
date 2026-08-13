import { useParams, useNavigate } from 'react-router-dom'
import { lessons } from '../data/lessons'
import { questions } from '../data/questions'
import { useProgressStore } from '../store/useProgressStore'
import StarRating from '../components/common/StarRating'
import ProgressBar from '../components/common/ProgressBar'

export default function ParentDetail() {
  const { lessonId } = useParams()
  const navigate = useNavigate()
  const lesson = lessons.find(l => l.id === lessonId)
  const record = useProgressStore(s => s.getLessonProgress(lessonId || ''))
  const examRecords = useProgressStore(s => s.examRecords)

  if (!lesson) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <p style={{ color: 'var(--n-400)' }}>课文未找到</p>
      </div>
    )
  }

  const lessonQuestions = questions.filter(q => q.lessonId === lessonId)
  const wrongQuestions = lessonQuestions.filter(q => record.wrongQuestions.includes(q.id))
  const lessonExams = examRecords.filter(r => r.questionResults.some(qr => questions.find(qu => qu.id === qr.questionId)?.lessonId === lessonId))

  return (
    <div className="min-h-dvh page-enter" style={{ background: 'var(--bg-base)' }}>
      {/* 顶部导航 */}
      <header className="sticky top-0 z-20 border-b"
        style={{ 
          background: 'rgba(251, 248, 243, 0.92)',
          backdropFilter: 'blur(16px) saturate(1.2)',
          borderColor: 'var(--border-default)'
        }}>
        <div className="max-w-3xl mx-auto px-4 py-2.5 flex items-center justify-between">
          <button onClick={() => navigate('/parent')} 
            className="flex items-center gap-1.5 text-[13px] btn-press px-3 py-1.5 rounded-[var(--r-sm)]"
            style={{ color: 'var(--n-500)', background: 'var(--bg-muted)' }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M10 12L6 8L10 4"/>
            </svg>
            返回
          </button>
          <h1 className="text-[15px] font-bold truncate max-w-[200px]" style={{ color: 'var(--n-700)' }}>
            {lesson.title}
          </h1>
          <div className="w-16" />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-5 space-y-4">
        {/* 概览卡片 */}
        <div className="rounded-[var(--r-xl)] p-5 relative overflow-hidden paper-texture"
          style={{ 
            background: 'linear-gradient(135deg, var(--secondary-500) 0%, var(--secondary-400) 100%)',
            boxShadow: '0 4px 20px rgba(45, 145, 133, 0.25)'
          }}>
          <div className="relative z-10">
            <h2 className="text-[20px] font-extrabold text-white mb-2">{lesson.title}</h2>
            <StarRating level={record.masteryLevel} size="lg" />
            <div className="mt-4">
              <ProgressBar value={record.correctRate} label="正确率" color="white" />
            </div>
          </div>
          <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-[0.10]"
            style={{ background: 'white' }} />
          <div className="absolute right-10 bottom-0 w-12 h-12 rounded-full opacity-[0.07]"
            style={{ background: 'white' }} />
        </div>

        {/* 统计数据 */}
        <div className="grid grid-cols-3 gap-3">
          <div className="surface-card p-4 text-center">
            <div className="w-10 h-10 rounded-[12px] mx-auto mb-2 flex items-center justify-center"
              style={{ background: 'var(--primary-50)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="var(--primary-500)" strokeWidth="2" strokeLinecap="round">
                <path d="M4 6C4 4.9 4.9 4 6 4H12C13.1 4 14 4.9 14 6V18C14 19.1 13.1 18 12 18H6C4.9 18 4 17.1 4 16V6Z"/>
              </svg>
            </div>
            <div className="text-[22px] font-extrabold" style={{ color: 'var(--primary-500)' }}>
              {record.studyCount}
            </div>
            <div className="text-[11px] mt-0.5" style={{ color: 'var(--n-400)' }}>学习次数</div>
          </div>
          <div className="surface-card p-4 text-center">
            <div className="w-10 h-10 rounded-[12px] mx-auto mb-2 flex items-center justify-center"
              style={{ background: 'var(--info-50)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="var(--info-500)" strokeWidth="2" strokeLinecap="round">
                <path d="M13.5 2.5L7.5 8.5 M7.5 8.5L4 5 M7.5 8.5L5 11"/>
              </svg>
            </div>
            <div className="text-[22px] font-extrabold" style={{ color: 'var(--info-500)' }}>
              {record.practiceCount}
            </div>
            <div className="text-[11px] mt-0.5" style={{ color: 'var(--n-400)' }}>练习次数</div>
          </div>
          <div className="surface-card p-4 text-center">
            <div className="w-10 h-10 rounded-[12px] mx-auto mb-2 flex items-center justify-center"
              style={{ background: record.wrongQuestions.length > 0 ? 'var(--danger-50)' : 'var(--success-50)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke={record.wrongQuestions.length > 0 ? 'var(--danger-500)' : 'var(--success-500)'} 
                strokeWidth="2" strokeLinecap="round">
                {record.wrongQuestions.length > 0 ? (
                  <>
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M15 9l-6 6M9 9l6 6"/>
                  </>
                ) : (
                  <path d="M5 12l5 5L20 7"/>
                )}
              </svg>
            </div>
            <div className="text-[22px] font-extrabold" 
              style={{ color: record.wrongQuestions.length > 0 ? 'var(--danger-500)' : 'var(--success-500)' }}>
              {record.wrongQuestions.length}
            </div>
            <div className="text-[11px] mt-0.5" style={{ color: 'var(--n-400)' }}>错题数</div>
          </div>
        </div>

        {/* 错题本 */}
        {wrongQuestions.length > 0 && (
          <div className="surface-card p-5">
            <h3 className="text-[15px] font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--n-700)' }}>
              <span className="w-7 h-7 rounded-[8px] flex items-center justify-center text-[11px] font-bold text-white"
                style={{ background: 'linear-gradient(135deg, var(--danger-500), var(--danger-400))' }}>
                错
              </span>
              错题本
              <span className="text-[11px] font-normal px-1.5 py-0.5 rounded-[var(--r-xs)]"
                style={{ background: 'var(--danger-50)', color: 'var(--danger-500)' }}>
                {wrongQuestions.length}道
              </span>
            </h3>
            <div className="space-y-2.5">
              {wrongQuestions.map(q => (
                <div key={q.id} className="rounded-[var(--r-md)] p-4 border"
                  style={{ background: 'var(--danger-50)', borderColor: 'var(--danger-100)' }}>
                  <p className="text-[13px] mb-2 leading-relaxed" style={{ color: 'var(--n-600)' }}>
                    {q.prompt}
                  </p>
                  <div className="flex items-start gap-1.5">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="flex-shrink-0 mt-0.5"
                      stroke="var(--success-600)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 8.5L6.5 12L13 4"/>
                    </svg>
                    <p className="text-[13px] font-semibold" style={{ color: 'var(--success-700)' }}>
                      {Array.isArray(q.answer) ? q.answer.join('、') : typeof q.answer === 'object' ? Object.entries(q.answer).map(([k, v]) => `${k}→${v}`).join('；') : String(q.answer)}
                    </p>
                  </div>
                  {q.explanation && (
                    <p className="text-[12px] mt-1.5 ml-5" style={{ color: 'var(--n-400)' }}>
                      {q.explanation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 生字词表 */}
        {lesson.vocabulary.length > 0 && (
          <div className="surface-card p-5">
            <h3 className="text-[15px] font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--n-700)' }}>
              <span className="w-7 h-7 rounded-[8px] flex items-center justify-center text-[11px] font-bold text-white"
                style={{ background: 'linear-gradient(135deg, var(--primary-500), var(--primary-400))' }}>
                字
              </span>
              生字词表
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {lesson.vocabulary.map(v => (
                <div key={v.character} className="rounded-[var(--r-md)] p-3 border text-center"
                  style={{ borderColor: 'var(--border-default)', background: 'var(--bg-subtle)' }}>
                  <div className="text-[26px] font-bold mb-0.5" style={{ color: 'var(--n-800)' }}>
                    {v.character}
                  </div>
                  <div className="text-[12px] font-semibold mb-1" style={{ color: 'var(--primary-500)' }}>
                    {v.pinyin}
                  </div>
                  <div className="text-[10px]" style={{ color: 'var(--n-400)' }}>
                    {v.examples.join('、')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 考试历史 */}
        {lessonExams.length > 0 && (
          <div className="surface-card p-5">
            <h3 className="text-[15px] font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--n-700)' }}>
              <span className="w-7 h-7 rounded-[8px] flex items-center justify-center text-[11px] font-bold text-white"
                style={{ background: 'linear-gradient(135deg, var(--accent-500), var(--accent-400))' }}>
                考
              </span>
              考试历史
            </h3>
            <div className="space-y-0">
              {lessonExams.map((r, i) => {
                const pct = Math.round((r.earnedScore / r.totalScore) * 100)
                return (
                  <div key={r.id} className="flex items-center justify-between py-3"
                    style={{ borderBottom: i < lessonExams.length - 1 ? '1px solid var(--border-default)' : 'none' }}>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-[8px] flex items-center justify-center text-[11px] font-bold"
                        style={{ 
                          background: pct >= 70 ? 'var(--success-50)' : pct >= 40 ? 'var(--warning-50)' : 'var(--danger-50)',
                          color: pct >= 70 ? 'var(--success-600)' : pct >= 40 ? 'var(--warning-600)' : 'var(--danger-500)'
                        }}>
                        {pct}%
                      </div>
                      <span className="text-[12px]" style={{ color: 'var(--n-400)' }}>
                        {new Date(r.finishedAt).toLocaleDateString('zh-CN')}
                      </span>
                    </div>
                    <span className="text-[14px] font-bold" style={{ color: 'var(--n-700)' }}>
                      {r.earnedScore}<span className="text-[12px] font-normal" style={{ color: 'var(--n-400)' }}>/{r.totalScore}</span>
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
