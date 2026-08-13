import { useNavigate } from 'react-router-dom'
import { units, lessons } from '../data/lessons'
import LessonCard from '../components/kid/LessonCard'
import { useProgressStore } from '../store/useProgressStore'
import { useAuthStore } from '../store/useAuthStore'
import { useChildStore } from '../store/useChildStore'
import ChildAvatar from '../components/common/ChildAvatar'

export default function KidHome() {
  const navigate = useNavigate()
  const clearRole = useAuthStore(s => s.clearRole)
  const records = useProgressStore(s => s.records)
  const currentChild = useChildStore(s => s.children.find(c => c.id === s.currentChildId))
  
  const getUnitProgress = (unitId: string) => {
    const unit = units.find(u => u.id === unitId)
    const lessonIds = unit ? unit.lessonIds : []
    const unitRecords = lessonIds.map(id => records[id]).filter(Boolean)
    const total = lessonIds.length
    const mastered = unitRecords.filter(
      r => r.masteryLevel === '已掌握' || r.masteryLevel === '优秀'
    ).length
    return { total, mastered }
  }

  const totalLessons = lessons.length
  const masteredLessons = Object.values(records).filter(
    r => r.masteryLevel === '已掌握' || r.masteryLevel === '优秀'
  ).length

  return (
    <div className="min-h-dvh page-enter" style={{ background: 'var(--bg-base)' }}>
      {/* 顶部导航 */}
      <header className="sticky top-0 z-20 border-b"
        style={{ 
          background: 'rgba(251, 248, 243, 0.92)',
          backdropFilter: 'blur(16px) saturate(1.2)',
          borderColor: 'var(--border-default)'
        }}>
        <div className="max-w-2xl mx-auto px-4 py-2.5 flex items-center justify-between">
          <button 
            onClick={() => { clearRole(); navigate('/') }} 
            className="flex items-center gap-1.5 text-[13px] btn-press px-3 py-1.5 rounded-[var(--r-sm)]"
            style={{ color: 'var(--n-500)', background: 'var(--bg-muted)' }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M10 12L6 8L10 4"/>
            </svg>
            切换
          </button>
          
          <div className="flex items-center gap-2">
            {currentChild && (
              <ChildAvatar avatar={currentChild.avatar} size="sm" />
            )}
            <h1 className="text-[15px] font-bold" style={{ color: 'var(--n-700)' }}>
              {currentChild?.name || '语文乐园'}
            </h1>
          </div>
          
          {/* 进度徽章 */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[var(--r-sm)]"
            style={{ background: 'var(--primary-50)' }}>
            <svg width="14" height="14" viewBox="0 0 16 16">
              <path d="M8 1.5L9.8 5.7L14.5 6.3L11 9.6L12 14.3L8 12L4 14.3L5 9.6L1.5 6.3L6.2 5.7L8 1.5Z"
                fill="var(--warning-400)" stroke="var(--warning-500)" strokeWidth="0.5"/>
            </svg>
            <span className="text-[13px] font-bold" style={{ color: 'var(--primary-600)' }}>
              {masteredLessons}/{totalLessons}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-5">
        {/* 欢迎横幅 */}
        <div className="rounded-[var(--r-xl)] p-5 mb-6 relative overflow-hidden paper-texture"
          style={{ 
            background: 'linear-gradient(135deg, var(--primary-500) 0%, var(--primary-400) 60%, var(--primary-300) 100%)',
            boxShadow: '0 4px 20px rgba(242, 129, 26, 0.25)'
          }}>
          <div className="relative z-10 flex items-center gap-3">
            <div>
              <h2 className="text-[20px] font-extrabold text-white mb-1">
                你好，{currentChild?.name || '小朋友'}！
              </h2>
              <p className="text-[13px] text-white/75">
                今天想学哪一课呢？
              </p>
            </div>
          </div>
          {/* 装饰 */}
          <div className="absolute -right-3 -top-3 w-20 h-20 rounded-full opacity-[0.12]"
            style={{ background: 'white' }} />
          <div className="absolute right-12 bottom-0 w-10 h-10 rounded-full opacity-[0.08]"
            style={{ background: 'white' }} />
          <div className="absolute -left-2 bottom-2 w-8 h-8 rounded-full opacity-[0.06]"
            style={{ background: 'white' }} />
        </div>

        {/* 单元列表 */}
        {units.map((unit, unitIndex) => {
          const progress = getUnitProgress(unit.id)
          const unitLessons = lessons.filter(l => unit.lessonIds.includes(l.id))
          const progressPercent = progress.total > 0 
            ? Math.round((progress.mastered / progress.total) * 100) 
            : 0

          const unitColors = [
            { bg: 'var(--secondary-500)', light: 'var(--secondary-50)', text: 'var(--secondary-600)' },
            { bg: 'var(--info-500)', light: 'var(--info-50)', text: 'var(--info-600)' },
            { bg: 'var(--accent-400)', light: 'var(--accent-50)', text: 'var(--accent-500)' },
          ]
          const uc = unitColors[unitIndex % unitColors.length]

          return (
            <section key={unit.id} className="mb-6">
              {/* 单元标题 */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-[10px] flex items-center justify-center text-[13px] font-bold text-white"
                    style={{ background: uc.bg }}>
                    {unitIndex + 1}
                  </div>
                  <h2 className="text-[16px] font-bold" style={{ color: 'var(--n-700)' }}>
                    {unit.name}
                  </h2>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-medium px-2 py-1 rounded-[var(--r-xs)]"
                    style={{ 
                      background: progressPercent === 100 ? 'var(--success-50)' : 'var(--bg-muted)',
                      color: progressPercent === 100 ? 'var(--success-600)' : 'var(--n-400)'
                    }}>
                    {progress.mastered}/{progress.total}
                  </span>
                  <button
                    onClick={() => navigate(`/kid/exam/${unit.id}`)}
                    className="text-[11px] font-semibold px-3 py-1.5 rounded-[var(--r-sm)] btn-press"
                    style={{ background: uc.light, color: uc.text }}>
                    测试
                  </button>
                </div>
              </div>

              {/* 课文卡片 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {unitLessons.map(lesson => (
                  <LessonCard
                    key={lesson.id}
                    lessonId={lesson.id}
                    title={lesson.title}
                    type={lesson.type}
                    unitId={unit.id}
                  />
                ))}
              </div>
            </section>
          )
        })}
      </main>
    </div>
  )
}
