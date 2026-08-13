import { useProgressStore } from '../../store/useProgressStore'
import { units, lessons } from '../../data/lessons'
import ProgressBar from '../common/ProgressBar'

export default function Dashboard() {
  const { records, examRecords } = useProgressStore()
  const totalLessons = lessons.length
  const studiedLessons = Object.values(records).filter(r => r.studyCount > 0).length
  const masteredLessons = Object.values(records).filter(r => r.masteryLevel === '已掌握' || r.masteryLevel === '优秀').length
  const overallRate = Object.values(records).length > 0
    ? Math.round(Object.values(records).reduce((s, r) => s + r.correctRate, 0) / Object.values(records).length) : 0
  const totalExams = examRecords.length

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="text-3xl mb-2">📚</div>
          <div className="text-2xl font-bold text-gray-800">{studiedLessons}/{totalLessons}</div>
          <div className="text-sm text-gray-500">已学课文</div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="text-3xl mb-2">✅</div>
          <div className="text-2xl font-bold text-green-600">{masteredLessons}</div>
          <div className="text-sm text-gray-500">已掌握</div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="text-3xl mb-2">📝</div>
          <div className="text-2xl font-bold text-blue-600">{totalExams}</div>
          <div className="text-sm text-gray-500">考试次数</div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="text-3xl mb-2">🎯</div>
          <div className="text-2xl font-bold text-indigo-600">{overallRate}%</div>
          <div className="text-sm text-gray-500">平均正确率</div>
        </div>
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4">整体学习进度</h3>
        <ProgressBar value={overallRate} label="综合掌握度" color="#4F46E5" />
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4">各单元进度</h3>
        <div className="space-y-4">
          {units.map(unit => {
            const unitLessons = lessons.filter(l => unit.lessonIds.includes(l.id))
            const unitRecords = unitLessons.map(l => records[l.id]).filter(Boolean)
            const unitRate = unitRecords.length > 0
              ? Math.round(unitRecords.reduce((s, r) => s + r.correctRate, 0) / unitRecords.length) : 0
            const unitMastered = unitRecords.filter(r => r.masteryLevel === '已掌握' || r.masteryLevel === '优秀').length
            return (
              <div key={unit.id}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">{unit.name}</span>
                  <span className="text-gray-500">掌握 {unitMastered}/{unitLessons.length} · 正确率 {unitRate}%</span>
                </div>
                <ProgressBar value={unitRate} color={unitRate >= 70 ? '#10B981' : unitRate >= 40 ? '#F59E0B' : '#EF4444'} />
              </div>
            )
          })}
        </div>
      </div>
      {examRecords.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">最近考试记录</h3>
          <div className="space-y-3">
            {examRecords.slice(-5).reverse().map(record => (
              <div key={record.id} className="flex items-center justify-between py-2 border-b border-gray-50">
                <div>
                  <span className="font-medium text-gray-700">{record.examName}</span>
                  <span className="text-xs text-gray-400 ml-2">{new Date(record.finishedAt).toLocaleDateString('zh-CN')}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-indigo-600">{record.earnedScore}/{record.totalScore}</span>
                  <span className="text-sm text-gray-500 ml-1">({Math.round((record.earnedScore / record.totalScore) * 100)}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
