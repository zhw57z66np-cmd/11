import { useNavigate } from 'react-router-dom'
import Dashboard from '../components/parent/Dashboard'
import MasteryTable from '../components/parent/MasteryTable'

export default function ParentHome() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-blue-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="text-gray-500 hover:text-gray-700">← 返回</button>
          <h1 className="text-xl font-bold text-indigo-700">家长中心</h1>
          <div className="w-16" />
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <div className="bg-gradient-to-r from-indigo-500 to-blue-500 rounded-2xl p-6 text-white">
          <h2 className="text-2xl font-bold mb-1">学习报告</h2>
          <p className="text-indigo-100">了解孩子的学习情况</p>
        </div>
        <Dashboard />
        <MasteryTable />
      </main>
    </div>
  )
}
