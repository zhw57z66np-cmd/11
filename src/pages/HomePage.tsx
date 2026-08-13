import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from '../store/useAuthStore'

export default function HomePage() {
  const navigate = useNavigate()
  const role = useAuthStore(s => s.role)
  const setRole = useAuthStore(s => s.setRole)

  useEffect(() => {
    if (role === 'kid') navigate('/kid')
    else if (role === 'parent') navigate('/parent')
  }, [role, navigate])

  const handleSelect = (r: 'kid' | 'parent') => {
    setRole(r)
    navigate(r === 'kid' ? '/kid' : '/parent')
  }

  return (
    <div className="min-h-dvh flex items-center justify-center p-6 page-enter paper-texture"
      style={{ background: 'linear-gradient(160deg, #FFF4EB 0%, #FCE7F3 35%, #EDF8F6 100%)' }}>
      
      <div className="text-center max-w-sm w-full relative z-10">
        {/* Logo */}
        <div className="mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-[22px] mb-5 float-anim"
            style={{ 
              background: 'linear-gradient(135deg, var(--primary-500), var(--primary-400))',
              boxShadow: '0 8px 24px rgba(242, 129, 26, 0.3), 0 2px 6px rgba(242, 129, 26, 0.15)'
            }}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <path d="M8 10C8 8.9 8.9 8 10 8H18C19.1 8 20 8.9 20 10V32C20 33.1 18.9 32 17.8 32H10C8.9 32 8 31.1 8 30V10Z" fill="white" fillOpacity="0.9"/>
              <path d="M20 10C20 8.9 20.9 8 22 8H30C31.1 8 32 8.9 32 10V30C32 31.1 31.1 32 30 32H22.2C21.1 32 20 33.1 20 32V10Z" fill="white" fillOpacity="0.7"/>
              <circle cx="14" cy="16" r="2" fill="var(--primary-500)" fillOpacity="0.6"/>
              <circle cx="26" cy="16" r="2" fill="var(--secondary-400)" fillOpacity="0.6"/>
              <path d="M12 22H16" stroke="var(--primary-500)" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.4"/>
              <path d="M12 25H15" stroke="var(--primary-500)" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.3"/>
            </svg>
          </div>
          <h1 className="text-[28px] font-extrabold tracking-tight mb-2"
            style={{ color: 'var(--n-800)' }}>
            语文学习乐园
          </h1>
          <p className="text-[15px]" style={{ color: 'var(--n-400)' }}>
            快乐学习，轻松进步
          </p>
        </div>

        {/* 角色选择 */}
        <div className="space-y-3.5">
          <button
            onClick={() => handleSelect('kid')}
            className="w-full card-lift btn-press rounded-[var(--r-xl)] p-5 text-left flex items-center gap-4 border"
            style={{ 
              background: 'rgba(255,253,249,0.88)',
              backdropFilter: 'blur(12px)',
              borderColor: 'var(--primary-200)',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <div className="flex-shrink-0 w-14 h-14 rounded-[16px] flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, var(--primary-100), var(--primary-200))' }}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <circle cx="14" cy="10" r="5" fill="var(--primary-500)" fillOpacity="0.7"/>
                <path d="M6 24C6 19.6 9.6 16 14 16C18.4 16 22 19.6 22 24" stroke="var(--primary-500)" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.5"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-[17px] font-bold mb-0.5" style={{ color: 'var(--n-800)' }}>
                我是小朋友
              </h2>
              <p className="text-[13px] leading-snug" style={{ color: 'var(--n-400)' }}>
                开始学习之旅，探索语文的奥秘
              </p>
            </div>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="flex-shrink-0">
              <path d="M7.5 14.5L12 10L7.5 5.5" stroke="var(--primary-400)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <button
            onClick={() => handleSelect('parent')}
            className="w-full card-lift btn-press rounded-[var(--r-xl)] p-5 text-left flex items-center gap-4 border"
            style={{ 
              background: 'rgba(255,253,249,0.88)',
              backdropFilter: 'blur(12px)',
              borderColor: 'var(--secondary-200)',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <div className="flex-shrink-0 w-14 h-14 rounded-[16px] flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, var(--secondary-100), var(--secondary-200))' }}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <circle cx="10" cy="10" r="4" fill="var(--secondary-500)" fillOpacity="0.6"/>
                <circle cx="18" cy="10" r="3" fill="var(--secondary-500)" fillOpacity="0.4"/>
                <path d="M4 22C4 18.7 6.7 16 10 16C13.3 16 16 18.7 16 22" stroke="var(--secondary-500)" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.4"/>
                <path d="M14 22C14 19.2 15.8 17 18 17C20.2 17 22 19.2 22 22" stroke="var(--secondary-500)" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.3"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-[17px] font-bold mb-0.5" style={{ color: 'var(--n-800)' }}>
                我是家长
              </h2>
              <p className="text-[13px] leading-snug" style={{ color: 'var(--n-400)' }}>
                查看学习进度，了解孩子掌握情况
              </p>
            </div>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="flex-shrink-0">
              <path d="M7.5 14.5L12 10L7.5 5.5" stroke="var(--secondary-400)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* 底部装饰 */}
        <div className="mt-10 flex justify-center gap-6 opacity-25">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="var(--primary-500)">
            <path d="M10 2L12.5 7.5L18 8.5L14 12.5L15 18L10 15.5L5 18L6 12.5L2 8.5L7.5 7.5L10 2Z"/>
          </svg>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="var(--secondary-500)">
            <rect x="2" y="2" width="14" height="14" rx="3" fillOpacity="0.6"/>
          </svg>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="var(--accent-400)">
            <circle cx="8" cy="8" r="6" fillOpacity="0.5"/>
          </svg>
        </div>
      </div>
    </div>
  )
}
