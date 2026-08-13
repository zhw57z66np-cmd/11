import { useParams, useNavigate } from 'react-router-dom'
import { lessons } from '../data/lessons'
import { questions } from '../data/questions'
import { useProgressStore } from '../store/useProgressStore'
import { useEffect } from 'react'

export default function StudyPage() {
  const { lessonId } = useParams()
  const navigate = useNavigate()
  const lesson = lessons.find(l => l.id === lessonId)
  const updateStudyProgress = useProgressStore(s => s.updateStudyProgress)

  useEffect(() => {
    if (lessonId) updateStudyProgress(lessonId)
  }, [lessonId, updateStudyProgress])

  if (!lesson) {
    return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-500">课文未找到</p></div>
  }

  const lessonQuestions = questions.filter(q => q.lessonId === lessonId)
  const vocab = lesson.vocabulary

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate('/kid')} className="text-gray-500 hover:text-gray-700">← 返回</button>
          <h1 className="text-lg font-bold text-green-700">{lesson.title}</h1>
          <button onClick={() => navigate(`/kid/practice/${lessonId}`)} className="bg-blue-100 text-blue-600 px-3 py-1 rounded-lg text-sm">去练习 →</button>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-2">📖 {lesson.title}</h2>
          <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">{lesson.type}</span>
        </div>
        {vocab.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4">✏️ 生字词</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {vocab.map(v => (
                <div key={v.character} className="border-2 border-gray-100 rounded-xl p-3 hover:border-green-300 transition-colors">
                  <div className="text-3xl font-bold text-center text-gray-800 mb-1">{v.character}</div>
                  <div className="text-center text-indigo-600 text-sm font-medium mb-2">{v.pinyin}</div>
                  <div className="text-xs text-gray-500 text-center">{v.meanings.join('、')}</div>
                  <div className="text-xs text-gray-400 text-center mt-1">组词：{v.examples.join('、')}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        {lesson.keyPoints.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4">💡 知识点</h3>
            <ul className="space-y-3">
              {lesson.keyPoints.map((point, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-yellow-100 text-yellow-700 rounded-full flex items-center justify-center text-sm font-bold">{i + 1}</span>
                  <span className="text-gray-700">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {lessonQuestions.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4">📝 相关题目 ({lessonQuestions.length}道)</h3>
            <div className="space-y-3">
              {lessonQuestions.slice(0, 5).map(q => (
                <div key={q.id} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">
                      {q.type === 'pinyin_write' ? '拼写' : q.type === 'multi_pronunciation' ? '多音字' : q.type === 'word_select' ? '选词' : q.type === 'fill_blank' ? '填空' : q.type === 'match' ? '连线' : q.type === 'antonym' ? '反义词' : q.type === 'word_form' ? '组词' : '其他'}
                    </span>
                    <span className="text-xs text-gray-400">{'⭐'.repeat(q.difficulty)} {q.points}分</span>
                  </div>
                  <p className="text-gray-700 text-sm">{q.prompt}</p>
                </div>
              ))}
            </div>
            {lessonQuestions.length > 5 && (
              <button onClick={() => navigate(`/kid/practice/${lessonId}`)} className="mt-4 w-full bg-blue-500 text-white py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors">
                开始练习全部 {lessonQuestions.length} 道题 →
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
