import Confetti from '../common/Confetti'
import { useState, useEffect } from 'react'

interface ResultScreenProps {
  total: number
  earned: number
  rate: number
  onRetry: () => void
  onBack: () => void
}

export default function ResultScreen({ total, earned, rate, onRetry, onBack }: ResultScreenProps) {
  const [showConfetti, setShowConfetti] = useState(rate >= 70)
  const [animatedRate, setAnimatedRate] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      let current = 0
      const step = Math.max(1, Math.floor(rate / 30))
      const interval = setInterval(() => {
        current += step
        if (current >= rate) {
          current = rate
          clearInterval(interval)
        }
        setAnimatedRate(current)
      }, 30)
      return () => clearInterval(interval)
    }, 300)
    return () => clearTimeout(timer)
  }, [rate])

  const getMedal = () => {
    if (rate >= 90) return { emoji: '🏆', label: '金牌', color: 'var(--warning-500)', bg: 'var(--warning-50)' }
    if (rate >= 70) return { emoji: '🌟', label: '银牌', color: 'var(--info-500)', bg: 'var(--info-50)' }
    if (rate >= 50) return { emoji: '💪', label: '铜牌', color: 'var(--primary-500)', bg: 'var(--primary-50)' }
    return { emoji: '📚', label: '加油', color: 'var(--n-500)', bg: 'var(--bg-muted)' }
  }

  const getMessage = () => {
    if (rate >= 90) return '太厉害了！你是语文小达人！'
    if (rate >= 70) return '做得不错！继续加油！'
    if (rate >= 50) return '还不错，再练习一下会更好！'
    return '别灰心，多学几遍就能掌握！'
  }

  const medal = getMedal()
  const accentColor = rate >= 90 ? 'var(--success-500)' : rate >= 70 ? 'var(--info-500)' : rate >= 50 ? 'var(--warning-500)' : 'var(--danger-500)'

  return (
    <div className="min-h-dvh flex items-center justify-center p-4 page-enter"
      style={{ background: 'linear-gradient(160deg, var(--primary-50) 0%, var(--bg-base) 40%, var(--secondary-50) 100%)' }}>
      <Confetti show={showConfetti} onComplete={() => setShowConfetti(false)} />
      
      <div className="surface-card-elevated p-7 text-center max-w-md w-full scale-enter">
        {/* 奖牌 */}
        <div className="relative mb-4">
          <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center float-anim"
            style={{ 
              background: `linear-gradient(135deg, ${medal.bg}, transparent)`,
              border: `3px solid ${medal.color}20`
            }}>
            <span className="text-[44px]">{medal.emoji}</span>
          </div>
        </div>

        <h2 className="text-[22px] font-extrabold mb-1" style={{ color: 'var(--n-800)' }}>
          {rate >= 70 ? '恭喜完成！' : '练习结束'}
        </h2>
        <p className="text-[14px] mb-6" style={{ color: 'var(--n-400)' }}>{getMessage()}</p>
        
        {/* 分数展示 */}
        <div className="rounded-[var(--r-xl)] p-6 mb-6 relative overflow-hidden"
          style={{ background: 'var(--bg-subtle)' }}>
          {/* 环形进度 */}
          <div className="relative w-28 h-28 mx-auto mb-4">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="var(--n-200)" strokeWidth="8" />
              <circle cx="50" cy="50" r="42" fill="none" 
                stroke={accentColor} strokeWidth="8" strokeLinecap="round"
                strokeDasharray={`${animatedRate * 2.64} 264`}
                style={{ transition: 'stroke-dasharray 1s ease-out' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[28px] font-extrabold leading-none" style={{ color: accentColor }}>
                {animatedRate}%
              </span>
              <span className="text-[10px] font-medium mt-0.5" style={{ color: 'var(--n-400)' }}>
                正确率
              </span>
            </div>
          </div>

          {/* 分数详情 */}
          <div className="flex items-center justify-center gap-6">
            <div className="text-center">
              <div className="text-[24px] font-extrabold" style={{ color: accentColor }}>{earned}</div>
              <div className="text-[11px]" style={{ color: 'var(--n-400)' }}>得分</div>
            </div>
            <div className="w-px h-8" style={{ background: 'var(--border-default)' }} />
            <div className="text-center">
              <div className="text-[24px] font-extrabold" style={{ color: 'var(--n-400)' }}>{total}</div>
              <div className="text-[11px]" style={{ color: 'var(--n-400)' }}>总分</div>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-3">
          <button onClick={onRetry} 
            className="flex-1 py-3 rounded-[var(--r-md)] text-[14px] font-semibold btn-press btn-ghost">
            再练一次
          </button>
          <button onClick={onBack} 
            className="flex-1 py-3 rounded-[var(--r-md)] text-[14px] font-semibold btn-press btn-primary">
            返回首页
          </button>
        </div>
      </div>
    </div>
  )
}
