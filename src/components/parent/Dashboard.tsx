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

  const kpiCards = [
    { 
      value: `${studiedLessons}/${totalLessons}`, 
      label: '已学课文', 
      icon: 'M4 6C4 4.9 4.9 4 6 4H12C13.1 4 14 4.9 14 6V18C14 19.1 13.1 18 12 18H6C4.9 18 4 17.1 4 16V6Z',
      color: 'var(--primary-500)', 
      bg: 'var(--primary-50)',
    },
    { 
      value: `${masteredLessons}`, 
      label: '已掌握', 
      icon: 'M3 8.5L6.5 12L13 4',
      color: 'var(--success-500)', 
      bg: 'var(--success-50)',
    },
    { 
      value: `${totalExams}`, 
      label: '考试次数', 
      icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6',
      color: 'var(--info-500)', 
      bg: 'var(--info-50)',
    },
    { 
      value: `${overallRate}%`, 
      label: '平均正确率', 
      icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z M12 8v4l3 3',
      color: 'var(--accent-500)', 
      bg: 'var(--accent-50)',
    },
  ]

  return (
    <div className="space-y-4">
      {/* KPI 卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {kpiCards.map((card, i) => (
          <div key={i} className="surface-card p-4">
            <div className="w-9 h-9 rounded-[10px] flex items-center justify-center mb-2.5"
              style={{ background: card.bg }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke={card.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={card.icon} />
              </svg>
            </div>
            <div className="text-[22px] font-extrabold leading-none mb-1" style={{ color: card.color }}>
              {card.value}
            </div>
            <div className="text-[12px]" style={{ color: 'var(--n-400)' }}>{card.label}</div>
          </div>
        ))}
      </div>

      {/* 综合掌握度 */}
      <div className="surface-card p-5">
        <h3 className="text-[15px] font-bold mb-3" style={{ color: 'var(--n-700)' }}>
          综合掌握度
        </h3>
        <ProgressBar value={overallRate} label="整体进度" color="var(--secondary-500)" />
      </div>

      {/* 各单元进度 */}
      <div className="surface-card p-5">
        <h3 className="text-[15px] font-bold mb-4" style={{ color: 'var(--n-700)' }}>
          各单元进度
        </h3>
        <div className="space-y-3.5">
          {units.map((unit, i) => {
            const unitLessons = lessons.filter(l => unit.lessonIds.includes(l.id))
            const unitRecords = unitLessons.map(l => records[l.id]).filter(Boolean)
            const unitRate = unitRecords.length > 0
              ? Math.round(unitRecords.reduce((s, r) => s + r.correctRate, 0) / unitRecords.length) : 0
            const unitMastered = unitRecords.filter(r => r.masteryLevel === '已掌握' || r.masteryLevel === '优秀').length
            
            const colors = ['var(--secondary-500)', 'var(--info-500)', 'var(--accent-400)']
            const barColor = unitRate >= 70 ? 'var(--success-500)' : unitRate >= 40 ? 'var(--warning-500)' : 'var(--danger-400)'
            
            return (
              <div key={unit.id}>
                <div className="flex justify-between text-[12px] mb-1">
                  <span className="font-medium flex items-center gap-1.5" style={{ color: 'var(--n-600)' }}>
                    <span className="w-4 h-4 rounded-[4px] flex items-center justify-center text-[9px] font-bold text-white"
                      style={{ background: colors[i % colors.length] }}>
                      {i + 1}
                    </span>
                    {unit.name}
                  </span>
                  <span style={{ color: 'var(--n-400)' }}>
                    {unitMastered}/{unitLessons.length} · {unitRate}%
                  </span>
                </div>
                <ProgressBar value={unitRate} color={barColor} showPercent={false} />
              </div>
            )
          })}
        </div>
      </div>

      {/* 考试记录 */}
      {examRecords.length > 0 && (
        <div className="surface-card p-5">
          <h3 className="text-[15px] font-bold mb-3" style={{ color: 'var(--n-700)' }}>
            最近考试
          </h3>
          <div className="space-y-0">
            {examRecords.slice(-5).reverse().map((record, i) => (
              <div key={record.id} className="flex items-center justify-between py-2.5"
                style={{ borderBottom: i < Math.min(4, examRecords.length - 1) ? '1px solid var(--border-default)' : 'none' }}>
                <div>
                  <span className="text-[13px] font-medium" style={{ color: 'var(--n-600)' }}>
                    {record.examName}
                  </span>
                  <span className="text-[11px] ml-2" style={{ color: 'var(--n-300)' }}>
                    {new Date(record.finishedAt).toLocaleDateString('zh-CN')}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[14px] font-bold" style={{ color: 'var(--secondary-600)' }}>
                    {record.earnedScore}/{record.totalScore}
                  </span>
                  <span className="text-[11px] ml-1" style={{ color: 'var(--n-400)' }}>
                    ({Math.round((record.earnedScore / record.totalScore) * 100)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
