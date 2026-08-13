import { useNavigate } from 'react-router-dom'
import { useProgressStore } from '../../store/useProgressStore'

interface LessonCardProps {
  lessonId: string
  title: string
  type: '课文' | '识字' | '语文园地'
  unitId: string
}

const typeConfig: Record<string, { icon: string; color: string; bg: string; tabColor: string }> = {
  '课文': {
    icon: 'M4 6C4 4.9 4.9 4 6 4H12C13.1 4 14 4.9 14 6V18C14 19.1 13.1 18 12 18H6C4.9 18 4 17.1 4 16V6Z M14 8H16C17.1 8 18 8.9 18 10V16C18 17.1 17.1 18 16 18H14',
    color: 'var(--secondary-500)',
    bg: 'var(--secondary-50)',
    tabColor: 'var(--secondary-400)',
  },
  '识字': {
    icon: 'M12 4L20 12L12 20 M4 12H20',
    color: 'var(--primary-500)',
    bg: 'var(--primary-50)',
    tabColor: 'var(--primary-400)',
  },
  '语文园地': {
    icon: 'M12 3L14.5 8.5L20.5 9.5L16 14L17.5 20L12 17L6.5 20L8 14L3.5 9.5L9.5 8.5L12 3Z',
    color: 'var(--accent-500)',
    bg: 'var(--accent-50)',
    tabColor: 'var(--accent-400)',
  },
}

export default function LessonCard({ lessonId, title, type }: LessonCardProps) {
  const navigate = useNavigate()
  const records = useProgressStore(s => s.records)
  const progress = records[lessonId] || {
    lessonId,
    studyCount: 0,
    practiceCount: 0,
    masteryLevel: '未学习' as const,
  }

  const config = typeConfig[type] || typeConfig['课文']
  const masteryStars = {
    '未学习': 0,
    '学习中': 2,
    '已掌握': 4,
    '优秀': 5,
  }[progress.masteryLevel]

  return (
    <div
      className="card-lift rounded-[var(--r-lg)] overflow-hidden cursor-pointer border"
      style={{ 
        background: 'var(--bg-card)',
        borderColor: 'var(--border-default)',
        boxShadow: 'var(--shadow-sm)'
      }}
      onClick={() => navigate(`/kid/study/${lessonId}`)}
    >
      {/* 顶部色条 */}
      <div className="h-[4px]" style={{ background: config.tabColor }} />
      
      <div className="p-4">
        {/* 标题行 */}
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-[12px] flex items-center justify-center flex-shrink-0"
            style={{ background: config.bg }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke={config.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d={config.icon} />
            </svg>
          </div>
          <div className="flex-1 min-w-0 pt-0.5">
            <h3 className="text-[15px] font-bold truncate leading-snug" style={{ color: 'var(--n-700)' }}>
              {title}
            </h3>
            <span className="text-[11px] font-medium mt-0.5 inline-block" style={{ color: config.color }}>
              {type}
            </span>
          </div>
        </div>

        {/* 星星评级 */}
        <div className="flex items-center gap-[3px] mb-3">
          {[1, 2, 3, 4, 5].map(i => (
            <svg key={i} width="16" height="16" viewBox="0 0 16 16">
              <path 
                d="M8 1.5L9.8 5.7L14.5 6.3L11 9.6L12 14.3L8 12L4 14.3L5 9.6L1.5 6.3L6.2 5.7L8 1.5Z"
                fill={i <= masteryStars ? 'var(--warning-400)' : 'var(--n-200)'}
                stroke={i <= masteryStars ? 'var(--warning-500)' : 'var(--n-200)'}
                strokeWidth="0.5"
              />
            </svg>
          ))}
          <span className="text-[11px] ml-1.5 font-medium" style={{ color: 'var(--n-400)' }}>
            {progress.masteryLevel}
          </span>
        </div>

        {/* 学习统计 */}
        <div className="flex gap-3 mb-3.5 text-[11px]" style={{ color: 'var(--n-400)' }}>
          <span className="flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" fillOpacity="0.5">
              <path d="M2 3C2 2.4 2.4 2 3 2H9L14 7V13C14 13.6 13.6 14 13 14H3C2.4 14 2 13.6 2 13V3Z"/>
            </svg>
            学习{progress.studyCount}次
          </span>
          <span className="flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" fillOpacity="0.5">
              <path d="M13.5 2.5L7.5 8.5 M7.5 8.5L4 5 M7.5 8.5L5 11"/>
            </svg>
            练习{progress.practiceCount}次
          </span>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-2">
          <button
            onClick={e => { e.stopPropagation(); navigate(`/kid/study/${lessonId}`) }}
            className="flex-1 py-2 rounded-[var(--r-sm)] text-[13px] font-semibold btn-press"
            style={{ background: config.bg, color: config.color }}>
            学习
          </button>
          <button
            onClick={e => { e.stopPropagation(); navigate(`/kid/practice/${lessonId}`) }}
            className="flex-1 py-2 rounded-[var(--r-sm)] text-[13px] font-semibold btn-press"
            style={{ background: 'var(--info-50)', color: 'var(--info-600)' }}>
            练习
          </button>
        </div>
      </div>
    </div>
  )
}
