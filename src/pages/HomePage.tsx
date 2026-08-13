import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import { useChildStore } from '../store/useChildStore'
import { useProgressStore } from '../store/useProgressStore'
import ChildAvatar from '../components/common/ChildAvatar'

export default function HomePage() {
  const navigate = useNavigate()
  const setRole = useAuthStore(s => s.setRole)
  const children = useChildStore(s => s.children)
  const setCurrentChild = useChildStore(s => s.setCurrentChild)
  const loadChildData = useProgressStore(s => s.loadChildData)

  const handleSelectChild = (childId: string) => {
    setCurrentChild(childId)
    setRole('kid')
    loadChildData()
    navigate('/kid')
  }

  const handleSelectParent = () => {
    setRole('parent')
    navigate('/parent')
  }

  return (
    <div className="min-h-dvh flex items-center justify-center p-6 page-enter paper-texture"
      style={{ background: 'linear-gradient(160deg, #FFF4EB 0%, #FCE7F3 40%, #EDF8F6 100%)' }}>
      
      <div className="text-center max-w-md w-full relative z-10">
        {/* Logo */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-[22px] mb-5"
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

        {/* 孩子选择区 */}
        {children.length > 0 ? (
          <div className="mb-5">
            <p className="text-[13px] mb-3" style={{ color: 'var(--n-400)' }}>
              选择你的账号
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-4">
              {children.map(child => (
                <button
                  key={child.id}
                  onClick={() => handleSelectChild(child.id)}
                  className="flex flex-col items-center gap-1.5 btn-press card-lift rounded-[var(--r-lg)] p-3 border"
                  style={{ 
                    background: 'rgba(255,255,255,0.85)',
                    backdropFilter: 'blur(8px)',
                    borderColor: 'var(--primary-200)',
                    boxShadow: 'var(--shadow-sm)',
                    minWidth: 80,
                  }}
                >
                  <ChildAvatar avatar={child.avatar} size="lg" />
                  <span className="text-[13px] font-bold truncate max-w-[70px]" style={{ color: 'var(--n-700)' }}>
                    {child.name}
                  </span>
                </button>
              ))}
              
              {/* 添加孩子按钮 */}
              <button
                onClick={() => navigate('/add-child')}
                className="flex flex-col items-center justify-center gap-1 btn-press card-lift rounded-[var(--r-lg)] p-3 border-2 border-dashed"
                style={{ 
                  borderColor: 'var(--n-300)',
                  background: 'rgba(255,255,255,0.5)',
                  minWidth: 80,
                  minHeight: 88,
                }}
              >
                <div className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ background: 'var(--bg-muted)' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--n-400)" strokeWidth="2" strokeLinecap="round">
                    <path d="M12 5v14M5 12h14"/>
                  </svg>
                </div>
                <span className="text-[12px] font-medium" style={{ color: 'var(--n-400)' }}>
                  添加
                </span>
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-5">
            <div className="surface-card p-5 mb-4">
              <p className="text-[14px] mb-3" style={{ color: 'var(--n-500)' }}>
                还没有小朋友的账号
              </p>
              <button
                onClick={() => navigate('/add-child')}
                className="w-full py-3 rounded-[var(--r-md)] text-[14px] btn-primary btn-press">
                添加第一个小朋友
              </button>
            </div>
          </div>
        )}

        {/* 家长入口 */}
        <button
          onClick={handleSelectParent}
          className="w-full card-lift btn-press rounded-[var(--r-xl)] p-4 text-left flex items-center gap-4 border"
          style={{ 
            background: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(8px)',
            borderColor: 'var(--secondary-200)',
            boxShadow: 'var(--shadow-md)'
          }}
        >
          <div className="flex-shrink-0 w-12 h-12 rounded-[14px] flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, var(--secondary-100), var(--secondary-200))' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="9" cy="8" r="3.5" fill="var(--secondary-500)" fillOpacity="0.6"/>
              <circle cx="16" cy="8" r="2.5" fill="var(--secondary-500)" fillOpacity="0.4"/>
              <path d="M4 20C4 17 6.2 14.5 9 14.5C11.8 14.5 14 17 14 20" stroke="var(--secondary-500)" strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.4"/>
              <path d="M12 20C12 17.5 13.5 15.5 16 15.5C18.5 15.5 20 17.5 20 20" stroke="var(--secondary-500)" strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.3"/>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-[15px] font-bold mb-0.5" style={{ color: 'var(--n-800)' }}>
              家长中心
            </h2>
            <p className="text-[12px] leading-snug" style={{ color: 'var(--n-400)' }}>
              查看所有孩子的学习进度
            </p>
          </div>
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="flex-shrink-0">
            <path d="M7.5 14.5L12 10L7.5 5.5" stroke="var(--secondary-400)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
