import { useNavigate } from 'react-router-dom'
import { useProgressStore } from '../../store/useProgressStore'
import { lessons } from '../../data/lessons'
import StarRating from '../common/StarRating'

export default function MasteryTable() {
  const navigate = useNavigate()
  const records = useProgressStore(s => s.records)

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800 mb-4">知识点掌握详情</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-2 text-gray-600">课文</th>
              <th className="text-center py-3 px-2 text-gray-600">类型</th>
              <th className="text-center py-3 px-2 text-gray-600">掌握度</th>
              <th className="text-center py-3 px-2 text-gray-600">正确率</th>
              <th className="text-center py-3 px-2 text-gray-600">错题数</th>
              <th className="text-center py-3 px-2 text-gray-600">最近学习</th>
            </tr>
          </thead>
          <tbody>
            {lessons.map(lesson => {
              const record = records[lesson.id]
              if (!record) return null
              return (
                <tr key={lesson.id} className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/parent/detail/${lesson.id}`)}>
                  <td className="py-3 px-2 font-medium text-gray-800">{lesson.title}</td>
                  <td className="py-3 px-2 text-center"><span className="text-xs bg-gray-100 px-2 py-1 rounded">{lesson.type}</span></td>
                  <td className="py-3 px-2"><StarRating level={record.masteryLevel} size="sm" /></td>
                  <td className="py-3 px-2 text-center font-medium">
                    <span className={record.correctRate >= 70 ? 'text-green-600' : record.correctRate >= 40 ? 'text-yellow-600' : 'text-red-600'}>{record.correctRate}%</span>
                  </td>
                  <td className="py-3 px-2 text-center">
                    {record.wrongQuestions.length > 0
                      ? <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs">{record.wrongQuestions.length}道</span>
                      : <span className="text-green-500">无</span>}
                  </td>
                  <td className="py-3 px-2 text-center text-xs text-gray-500">
                    {record.lastStudiedAt ? new Date(record.lastStudiedAt).toLocaleDateString('zh-CN') : '-'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {Object.keys(records).length === 0 && (
        <div className="text-center py-8 text-gray-400">暂无学习记录，孩子还没有开始学习</div>
      )}
    </div>
  )
}
