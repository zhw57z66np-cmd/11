import { useNavigate } from 'react-router-dom'

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-50 to-blue-100 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-indigo-700 mb-4">
          语文学习乐园
        </h1>
        <p className="text-lg text-gray-600 mb-12">
          快乐学习，轻松进步
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <button
            onClick={() => navigate('/kid')}
            className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border-4 border-yellow-300 w-64"
          >
            <div className="text-6xl mb-4">🧒</div>
            <h2 className="text-2xl font-bold text-yellow-600 mb-2">我是小朋友</h2>
            <p className="text-gray-500 text-sm">开始学习之旅</p>
          </button>

          <button
            onClick={() => navigate('/parent')}
            className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border-4 border-indigo-300 w-64"
          >
            <div className="text-6xl mb-4">👨‍👩‍👧</div>
            <h2 className="text-2xl font-bold text-indigo-600 mb-2">我是家长</h2>
            <p className="text-gray-500 text-sm">查看学习进度</p>
          </button>
        </div>
      </div>
    </div>
  )
}
