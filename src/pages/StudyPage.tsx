import { useParams, useNavigate } from 'react-router-dom'
import { lessons } from '../data/lessons'
import { questions } from '../data/questions'
import { getHanziDetail } from '../data/hanziData'
import { useProgressStore } from '../store/useProgressStore'
import HanziDetailModal from '../components/kid/HanziDetailModal'
import type { HanziDetail, VocabItem } from '../types'
import { useEffect, useState } from 'react'

export default function StudyPage() {
  const { lessonId } = useParams()
  const navigate = useNavigate()
  const lesson = lessons.find(l => l.id === lessonId)
  const updateStudyProgress = useProgressStore(s => s.updateStudyProgress)
  const [activeHanzi, setActiveHanzi] = useState<HanziDetail | null>(null)

  useEffect(() => {
    if (lessonId) updateStudyProgress(lessonId)
  }, [lessonId, updateStudyProgress])

  // 点击生字打开详情 (有笔画数据或基础信息则展示)
  const openHanzi = (v: VocabItem) => {
    const detail = getHanziDetail(v.character)
    if (!detail) return
    setActiveHanzi(detail)
  }

  if (!lesson) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <p style={{ color: 'var(--n-400)' }}>课文未找到</p>
      </div>
    )
  }

  const lessonQuestions = questions.filter(q => q.lessonId === lessonId)

  const typeColors: Record<string, { bg: string; color: string; accent: string }> = {
    '课文': { bg: 'var(--secondary-50)', color: 'var(--secondary-500)', accent: 'var(--secondary-400)' },
    '识字': { bg: 'var(--primary-50)', color: 'var(--primary-500)', accent: 'var(--primary-400)' },
    '语文园地': { bg: 'var(--accent-50)', color: 'var(--accent-500)', accent: 'var(--accent-400)' },
  }
  const tc = typeColors[lesson.type] || typeColors['课文']

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
          <button onClick={() => navigate('/kid')} 
            className="flex items-center gap-1.5 text-[13px] btn-press px-3 py-1.5 rounded-[var(--r-sm)]"
            style={{ color: 'var(--n-500)', background: 'var(--bg-muted)' }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M10 12L6 8L10 4"/>
            </svg>
            返回
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-[7px] flex items-center justify-center"
              style={{ background: tc.bg }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke={tc.color} strokeWidth="2.5" strokeLinecap="round">
                <path d="M4 6C4 4.9 4.9 4 6 4H12C13.1 4 14 4.9 14 6V18C14 19.1 13.1 18 12 18H6C4.9 18 4 17.1 4 16V6Z"/>
              </svg>
            </div>
            <h1 className="text-[15px] font-bold truncate max-w-[180px]" style={{ color: 'var(--n-700)' }}>
              {lesson.title}
            </h1>
          </div>
          <button onClick={() => navigate(`/kid/practice/${lessonId}`)} 
            className="text-[12px] font-semibold px-3 py-1.5 rounded-[var(--r-sm)] btn-press"
            style={{ background: 'var(--info-50)', color: 'var(--info-600)' }}>
            去练习 →
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-5 space-y-4">
        {/* 课文信息卡 */}
        <div className="rounded-[var(--r-xl)] p-5 relative overflow-hidden paper-texture"
          style={{ 
            background: `linear-gradient(135deg, ${tc.color} 0%, ${tc.accent} 100%)`,
            boxShadow: `0 4px 20px ${tc.color}30`
          }}>
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-[14px] flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="white" strokeWidth="2" strokeLinecap="round">
                <path d="M4 6C4 4.9 4.9 4 6 4H12C13.1 4 14 4.9 14 6V18C14 19.1 13.1 18 12 18H6C4.9 18 4 17.1 4 16V6Z"/>
                <path d="M14 8H16C17.1 8 18 8.9 18 10V16C18 17.1 17.1 18 16 18H14"/>
              </svg>
            </div>
            <div>
              <h2 className="text-[20px] font-extrabold text-white mb-0.5">{lesson.title}</h2>
              <span className="inline-block text-[11px] font-semibold px-2 py-0.5 rounded-[var(--r-xs)]"
                style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>
                {lesson.type}
              </span>
            </div>
          </div>
          {/* 装饰 */}
          <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-[0.10]"
            style={{ background: 'white' }} />
          <div className="absolute right-14 bottom-0 w-10 h-10 rounded-full opacity-[0.07]"
            style={{ background: 'white' }} />
        </div>

        {/* 生字词 */}
        {lesson.vocabulary.length > 0 && (
          <div className="surface-card p-5">
            <h3 className="text-[15px] font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--n-700)' }}>
              <span className="w-7 h-7 rounded-[8px] flex items-center justify-center text-[11px] font-bold text-white"
                style={{ background: 'linear-gradient(135deg, var(--primary-500), var(--primary-400))' }}>
                字
              </span>
              生字词
              <span className="text-[11px] font-normal" style={{ color: 'var(--n-300)' }}>
                ({lesson.vocabulary.length}个)
              </span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {lesson.vocabulary.map((v, vi) => {
                const hasDetail = !!getHanziDetail(v.character)
                return (
                  <button
                    key={v.character}
                    onClick={() => openHanzi(v)}
                    disabled={!hasDetail}
                    className="rounded-[var(--r-md)] p-3 border transition-all hover:shadow-sm text-left w-full btn-press disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ 
                      borderColor: hasDetail ? 'var(--border-default)' : 'var(--border-default)',
                      background: hasDetail ? 'var(--bg-card)' : 'var(--bg-muted)',
                      animationDelay: `${vi * 0.05}s`
                    }}>
                    <div className="flex items-start justify-between">
                      <div className="text-[30px] font-bold leading-tight" style={{ color: 'var(--n-800)', fontFamily: '"KaiTi","STKaiti","楷体",serif' }}>
                        {v.character}
                      </div>
                      {hasDetail && (
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-[4px]"
                          style={{ background: 'var(--primary-50)', color: 'var(--primary-500)' }}>
                          点开
                        </span>
                      )}
                    </div>
                    <div className="text-[12px] text-center font-semibold mb-1.5" style={{ color: 'var(--primary-500)' }}>
                      {v.pinyin}
                    </div>
                    <div className="text-[11px] text-center leading-snug" style={{ color: 'var(--n-500)' }}>
                      {v.meanings.join('、')}
                    </div>
                    <div className="text-[10px] text-center mt-1.5 pt-1.5" style={{ color: 'var(--n-400)', borderTop: '1px dashed var(--border-default)' }}>
                      组词：{v.examples.join('、')}
                    </div>
                  </button>
                )
              })}
            </div>
            <div className="mt-3 text-[11px] flex items-center gap-1.5" style={{ color: 'var(--n-400)' }}>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M8 3v10M3 8h10"/>
              </svg>
              点击汉字卡片，可学习田字格书写、笔顺、结构、发音
            </div>
          </div>
        )}

        {/* 知识点 */}
        {lesson.keyPoints.length > 0 && (
          <div className="surface-card p-5">
            <h3 className="text-[15px] font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--n-700)' }}>
              <span className="w-7 h-7 rounded-[8px] flex items-center justify-center text-[11px] font-bold text-white"
                style={{ background: 'linear-gradient(135deg, var(--warning-500), var(--warning-400))' }}>
                知
              </span>
              知识点
            </h3>
            <div className="space-y-2.5">
              {lesson.keyPoints.map((point, i) => (
                <div key={i} className="flex gap-3 items-start rounded-[var(--r-sm)] p-3 transition-colors"
                  style={{ background: i % 2 === 0 ? 'var(--bg-subtle)' : 'transparent' }}>
                  <span className="flex-shrink-0 w-6 h-6 rounded-[var(--r-xs)] flex items-center justify-center text-[11px] font-bold"
                    style={{ background: 'var(--warning-50)', color: 'var(--warning-600)' }}>
                    {i + 1}
                  </span>
                  <span className="text-[14px] leading-relaxed pt-0.5" style={{ color: 'var(--n-600)' }}>
                    {point}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 相关题目预览 */}
        {lessonQuestions.length > 0 && (
          <div className="surface-card p-5">
            <h3 className="text-[15px] font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--n-700)' }}>
              <span className="w-7 h-7 rounded-[8px] flex items-center justify-center text-[11px] font-bold text-white"
                style={{ background: 'linear-gradient(135deg, var(--info-500), var(--info-400))' }}>
                题
              </span>
              相关题目
              <span className="text-[11px] font-normal" style={{ color: 'var(--n-400)' }}>
                ({lessonQuestions.length}道)
              </span>
            </h3>
            <div className="space-y-2">
              {lessonQuestions.slice(0, 5).map((q, qi) => {
                const typeLabel = q.type === 'pinyin_write' ? '拼写' : q.type === 'multi_pronunciation' ? '多音字' : q.type === 'word_select' ? '选词' : q.type === 'fill_blank' ? '填空' : q.type === 'match' ? '连线' : q.type === 'antonym' ? '反义词' : q.type === 'word_form' ? '组词' : '其他'
                const typeBg = q.type === 'pinyin_write' ? 'var(--primary-50)' : q.type === 'fill_blank' ? 'var(--secondary-50)' : 'var(--info-50)'
                const typeColor = q.type === 'pinyin_write' ? 'var(--primary-600)' : q.type === 'fill_blank' ? 'var(--secondary-600)' : 'var(--info-600)'
                return (
                  <div key={q.id} className="rounded-[var(--r-md)] p-3.5 border transition-all hover:shadow-xs"
                    style={{ 
                      background: 'var(--bg-card)',
                      borderColor: 'var(--border-default)',
                      animationDelay: `${qi * 0.04}s`
                    }}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-[4px]"
                        style={{ background: typeBg, color: typeColor }}>
                        {typeLabel}
                      </span>
                      <span className="text-[10px] font-medium" style={{ color: 'var(--n-300)' }}>
                        {q.points}分
                      </span>
                    </div>
                    <p className="text-[13px] leading-snug" style={{ color: 'var(--n-600)' }}>
                      {q.prompt}
                    </p>
                  </div>
                )
              })}
            </div>
            {lessonQuestions.length > 5 && (
              <button 
                onClick={() => navigate(`/kid/practice/${lessonId}`)} 
                className="mt-4 w-full py-3.5 rounded-[var(--r-md)] text-[14px] btn-primary btn-press">
                开始练习全部 {lessonQuestions.length} 道题 →
              </button>
            )}
            {lessonQuestions.length <= 5 && lessonQuestions.length > 0 && (
              <button 
                onClick={() => navigate(`/kid/practice/${lessonId}`)} 
                className="mt-4 w-full py-3 rounded-[var(--r-md)] text-[14px] font-semibold btn-press"
                style={{ background: 'var(--info-50)', color: 'var(--info-600)' }}>
                开始练习 →
              </button>
            )}
          </div>
        )}
      </main>

      {/* 汉字详情弹窗 */}
      {activeHanzi && (
        <HanziDetailModal hanzi={activeHanzi} onClose={() => setActiveHanzi(null)} />
      )}
    </div>
  )
}
