import Confetti from '../common/Confetti'
import { useState } from 'react'

interface ResultScreenProps {
  total: number
  earned: number
  rate: number
  onRetry: () => void
  onBack: () => void
}

export default function ResultScreen({ total, earned, rate, onRetry, onBack }: ResultScreenProps) {
  const [showConfetti, setShowConfetti] = useState(rate >= 70)

  const getEmoji = () => {
    if (rate >= 90) return '🏆'
    if (rate >= 70) return '🌟'
    if (rate >= 50) return '💪'
    return '📚'
  }

  const getMessage = () => {
    if (rate >= 90) return '太厉害了！你是语文小达人！'
    if (rate >= 70) return '做得不错！继续加油！'
    if (rate >= 50) return '还不错，再练习一下会更好！'
    return '别灰心，多学几遍就能掌握！'
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-orange-50 flex items-center justify-center p-4">
      <Confetti show={showConfetti} onComplete={() => setShowConfetti(false)} />
      <div className="bg-white rounded-3xl p-8 shadow-lg text-center max-w-md w-full">
        <div className="text-7xl mb-4">{getEmoji()}</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {rate >= 70 ? '恭喜完成！' : '练习结束'}
        </h2>
        <p className="text-gray-600 mb-6">{getMessage()}</p>
        <div className="bg-gray-50 rounded-2xl p-6 mb-6">
          <div className="text-5xl font-bold text-indigo-600 mb-2">
            {earned}<span className="text-2xl text-gray-400">/{total}</span>
          </div>
          <div className="text-lg text-gray-500">正确率 {rate}%</div>
          <div className="mt-4 w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                rate >= 90 ? 'bg-green-500' : rate >= 70 ? 'bg-blue-500' : rate >= 50 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${rate}%` }}
            />
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={onRetry} className="flex-1 bg-indigo-100 text-indigo-700 py-3 rounded-xl font-medium hover:bg-indigo-200 transition-colors">
            🔄 再练一次
          </button>
          <button onClick={onBack} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors">
            🏠 返回首页
          </button>
        </div>
      </div>
    </div>
  )
}
