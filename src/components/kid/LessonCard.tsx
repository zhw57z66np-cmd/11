import { useNavigate } from 'react-router-dom'
import StarRating from '../common/StarRating'
import { useProgressStore } from '../../store/useProgressStore'

interface LessonCardProps {
  lessonId: string
  title: string
  type: '课文' | '识字' | '语文园地'
  unitId: string
}

const typeEmoji: Record<string, string> = { '课文': '📖', '识字': '✏️', '语文园地': '🌈' }

export default function LessonCard({ lessonId, title, type }: LessonCardProps) {
  const navigate = useNavigate()
  const progress = useProgressStore(s => s.getLessonProgress(lessonId))

  const typeColors: Record<string, string> = {
    '课文': 'from-green-400 to-emerald-500',
    '识字': 'from-blue-400 to-cyan-500',
    '语文园地': 'from-purple-400 to-pink-500',
  }

  return (
    <div
      className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all hover:-translate-y-1 overflow-hidden cursor-pointer border-2 border-gray-100"
      onClick={() => navigate(`/kid/study/${lessonId}`)}
    >
      <div className={`h-2 bg-gradient-to-r ${typeColors[type]}`} />
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <span className="text-2xl">{typeEmoji[type]}</span>
            <h3 className="text-lg font-bold text-gray-800 mt-1">{title}</h3>
            <span className="text-xs text-gray-400">{type}</span>
          </div>
        </div>
        <StarRating level={progress.masteryLevel} size="sm" />
        <div className="flex gap-3 mt-3 text-xs text-gray-500">
          <span>📖 学习{progress.studyCount}次</span>
          <span>✍️ 练习{progress.practiceCount}次</span>
        </div>
        <div className="flex gap-2 mt-3">
          <button
            onClick={e => { e.stopPropagation(); navigate(`/kid/study/${lessonId}`) }}
            className="flex-1 bg-green-100 text-green-700 py-2 rounded-xl text-sm font-medium hover:bg-green-200 transition-colors"
          >
            📖 学习
          </button>
          <button
            onClick={e => { e.stopPropagation(); navigate(`/kid/practice/${lessonId}`) }}
            className="flex-1 bg-blue-100 text-blue-700 py-2 rounded-xl text-sm font-medium hover:bg-blue-200 transition-colors"
          >
            ✍️ 练习
          </button>
        </div>
      </div>
    </div>
  )
}
