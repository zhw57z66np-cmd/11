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

  if (!lesson) return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-500">课文未找到</p></div>

  const lessonQuestions = questions.filter(q => q.lessonId === lessonId)
  const wrongQuestions = lessonQuestions.filter(q => record.wrongQuestions.includes(q.id))
  const lessonExams = examRecords.filter(r => r.questionResults.some(qr => questions.find(qu => qu.id === qr.questionId)?.lessonId === lessonId))

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-blue-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate('/parent')} className="text-gray-500 hover:text-gray-700">← 返回</button>
          <h1 className="text-lg font-bold text-indigo-700">{lesson.title}</h1>
          <div className="w-16" />
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-4">{lesson.title}</h2>
          <StarRating level={record.masteryLevel} size="lg" />
          <div className="mt-4"><ProgressBar value={record.correctRate} label="正确率" /></div>
          <div className="grid grid-cols-3 gap-4 mt-4 text-center">
            <div><div className="text-2xl font-bold text-indigo-600">{record.studyCount}</div><div className="text-xs text-gray-500">学习次数</div></div>
            <div><div className="text-2xl font-bold text-blue-600">{record.practiceCount}</div><div className="text-xs text-gray-500">练习次数</div></div>
            <div><div className="text-2xl font-bold text-red-600">{record.wrongQuestions.length}</div><div className="text-xs text-gray-500">错题数</div></div>
          </div>
        </div>
        {wrongQuestions.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-red-600 mb-4">错题本 ({wrongQuestions.length}道)</h3>
            <div className="space-y-3">
              {wrongQuestions.map(q => (
                <div key={q.id} className="bg-red-50 rounded-xl p-4 border border-red-100">
                  <p className="text-gray-700 mb-2">{q.prompt}</p>
                  <p className="text-sm text-green-700">正确答案：{Array.isArray(q.answer) ? q.answer.join('、') : String(q.answer)}</p>
                  {q.explanation && <p className="text-xs text-gray-500 mt-1">📖 {q.explanation}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
        {lesson.vocabulary.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4">生字词表</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {lesson.vocabulary.map(v => (
                <div key={v.character} className="border rounded-lg p-3">
                  <div className="text-2xl font-bold text-center">{v.character}</div>
                  <div className="text-center text-indigo-600 text-sm">{v.pinyin}</div>
                  <div className="text-xs text-gray-500 text-center mt-1">{v.examples.join('、')}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        {lessonExams.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4">考试历史</h3>
            <div className="space-y-2">
              {lessonExams.map(r => (
                <div key={r.id} className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm text-gray-600">{new Date(r.finishedAt).toLocaleDateString('zh-CN')}</span>
                  <span className="font-medium">{r.earnedScore}/{r.totalScore} ({Math.round((r.earnedScore / r.totalScore) * 100)}%)</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
