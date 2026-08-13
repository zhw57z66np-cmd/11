import { useNavigate } from 'react-router-dom'
import { units, lessons } from '../data/lessons'
import LessonCard from '../components/kid/LessonCard'
import { useProgressStore } from '../store/useProgressStore'

export default function KidHome() {
  const navigate = useNavigate()
  const getUnitProgress = useProgressStore(s => s.getUnitProgress)

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-orange-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="text-gray-500 hover:text-gray-700">
            ← 返回
          </button>
          <h1 className="text-xl font-bold text-indigo-700">语文学习乐园</h1>
          <div className="w-16" />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl p-6 text-white mb-6">
          <h2 className="text-2xl font-bold mb-1">小朋友你好！</h2>
          <p className="text-indigo-100">今天想学哪一课呢？</p>
        </div>

        {units.map(unit => {
          const progress = getUnitProgress(unit.id)
          const unitLessons = lessons.filter(l => unit.lessonIds.includes(l.id))

          return (
            <section key={unit.id} className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">{unit.name}</h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    已掌握 {progress.mastered}/{progress.total}
                  </span>
                  <button
                    onClick={() => navigate(`/kid/exam/${unit.id}`)}
                    className="bg-red-100 text-red-600 px-4 py-2 rounded-xl text-sm font-medium hover:bg-red-200 transition-colors"
                  >
                    📝 单元测试
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
