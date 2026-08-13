import { useNavigate } from 'react-router-dom'
import { useProgressStore } from '../../store/useProgressStore'
import { lessons } from '../../data/lessons'
import StarRating from '../common/StarRating'

export default function MasteryTable() {
  const navigate = useNavigate()
  const records = useProgressStore(s => s.records)

  return (
    <div className="surface-card overflow-hidden">
      <div className="px-5 pt-5 pb-3">
        <h3 className="text-[15px] font-bold" style={{ color: 'var(--n-700)' }}>
          知识点掌握详情
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr style={{ background: 'var(--bg-muted)' }}>
              <th className="text-left py-2.5 px-4 font-semibold" style={{ color: 'var(--n-500)' }}>课文</th>
              <th className="text-center py-2.5 px-2 font-semibold" style={{ color: 'var(--n-500)' }}>类型</th>
              <th className="text-center py-2.5 px-2 font-semibold" style={{ color: 'var(--n-500)' }}>掌握度</th>
              <th className="text-center py-2.5 px-2 font-semibold" style={{ color: 'var(--n-500)' }}>正确率</th>
              <th className="text-center py-2.5 px-2 font-semibold" style={{ color: 'var(--n-500)' }}>错题</th>
              <th className="text-center py-2.5 px-3 font-semibold" style={{ color: 'var(--n-500)' }}>最近学习</th>
            </tr>
          </thead>
          <tbody>
            {lessons.map((lesson) => {
              const record = records[lesson.id]
              if (!record) return null
              return (
                <tr key={lesson.id} 
                  className="cursor-pointer transition-colors"
                  style={{ 
                    borderBottom: '1px solid var(--border-default)',
                  }}
                  onClick={() => navigate(`/parent/detail/${lesson.id}`)}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-subtle)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <td className="py-2.5 px-4 font-medium" style={{ color: 'var(--n-700)' }}>
                    {lesson.title}
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-[4px]"
                      style={{ background: 'var(--bg-muted)', color: 'var(--n-500)' }}>
                      {lesson.type}
                    </span>
                  </td>
                  <td className="py-2.5 px-2">
                    <StarRating level={record.masteryLevel} size="sm" />
                  </td>
                  <td className="py-2.5 px-2 text-center font-semibold">
                    <span style={{ 
                      color: record.correctRate >= 70 ? 'var(--success-600)' 
                        : record.correctRate >= 40 ? 'var(--warning-600)' 
                        : 'var(--danger-500)'
                    }}>
                      {record.correctRate}%
                    </span>
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    {record.wrongQuestions.length > 0
                      ? <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-[var(--r-xs)]"
                          style={{ background: 'var(--danger-50)', color: 'var(--danger-500)' }}>
                          {record.wrongQuestions.length}道
                        </span>
                      : <span className="text-[11px]" style={{ color: 'var(--success-500)' }}>无</span>}
                  </td>
                  <td className="py-2.5 px-3 text-center text-[11px]" style={{ color: 'var(--n-400)' }}>
                    {record.lastStudiedAt ? new Date(record.lastStudiedAt).toLocaleDateString('zh-CN') : '-'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {Object.keys(records).length === 0 && (
        <div className="text-center py-8 text-[13px]" style={{ color: 'var(--n-400)' }}>
          暂无学习记录，孩子还没有开始学习
        </div>
      )}
    </div>
  )
}
