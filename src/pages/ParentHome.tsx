import { useNavigate } from 'react-router-dom'
import Dashboard from '../components/parent/Dashboard'
import MasteryTable from '../components/parent/MasteryTable'
import { useAuthStore } from '../store/useAuthStore'

export default function ParentHome() {
  const navigate = useNavigate()
  const clearRole = useAuthStore(s => s.clearRole)
  
  return (
    <div className="min-h-dvh page-enter" style={{ background: 'var(--bg-base)' }}>
      {/* 顶部导航 */}
      <header className="sticky top-0 z-20 border-b"
        style={{ 
          background: 'rgba(251, 248, 243, 0.92)',
          backdropFilter: 'blur(16px) saturate(1.2)',
          borderColor: 'var(--border-default)'
        }}>
        <div className="max-w-3xl mx-auto px-4 py-2.5 flex items-center justify-between">
          <button 
            onClick={() => { clearRole(); navigate('/') }} 
            className="flex items-center gap-1.5 text-[13px] btn-press px-3 py-1.5 rounded-[var(--r-sm)]"
            style={{ color: 'var(--n-500)', background: 'var(--bg-muted)' }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M10 12L6 8L10 4"/>
            </svg>
            切换
          </button>
          
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-[8px] flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, var(--secondary-500), var(--secondary-400))' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 20V10"/>
                <path d="M12 20V4"/>
                <path d="M6 20V14"/>
              </svg>
            </div>
            <h1 className="text-[16px] font-bold" style={{ color: 'var(--n-700)' }}>
              家长中心
            </h1>
          </div>
          
          <div className="w-16" />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-5 space-y-5">
        {/* 标题横幅 */}
        <div className="rounded-[var(--r-xl)] p-5 relative overflow-hidden paper-texture"
          style={{ 
            background: 'linear-gradient(135deg, var(--secondary-500) 0%, var(--secondary-400) 60%, var(--secondary-300) 100%)',
            boxShadow: '0 4px 20px rgba(45, 145, 133, 0.25)'
          }}>
          <div className="relative z-10">
            <h2 className="text-[20px] font-extrabold text-white mb-1">
              学习报告
            </h2>
            <p className="text-[13px] text-white/70">
              了解孩子的学习情况和进步
            </p>
          </div>
          <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-[0.10]"
            style={{ background: 'white' }} />
          <div className="absolute right-10 bottom-0 w-12 h-12 rounded-full opacity-[0.07]"
            style={{ background: 'white' }} />
        </div>

        <Dashboard />
        <MasteryTable />
      </main>
    </div>
  )
}
