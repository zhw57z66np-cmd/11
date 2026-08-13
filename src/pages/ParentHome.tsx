import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Dashboard from '../components/parent/Dashboard'
import MasteryTable from '../components/parent/MasteryTable'
import { useAuthStore } from '../store/useAuthStore'
import { useChildStore } from '../store/useChildStore'
import { useProgressStore } from '../store/useProgressStore'
import ChildAvatar from '../components/common/ChildAvatar'

export default function ParentHome() {
  const navigate = useNavigate()
  const clearRole = useAuthStore(s => s.clearRole)
  const children = useChildStore(s => s.children)
  const currentChildId = useChildStore(s => s.currentChildId)
  const setCurrentChild = useChildStore(s => s.setCurrentChild)
  const loadChildData = useProgressStore(s => s.loadChildData)
  const removeChild = useChildStore(s => s.removeChild)

  // 加载当前孩子的数据
  useEffect(() => {
    if (currentChildId) {
      loadChildData()
    }
  }, [currentChildId, loadChildData])

  // 自动选择第一个孩子
  useEffect(() => {
    if (!currentChildId && children.length > 0) {
      setCurrentChild(children[0].id)
    }
  }, [children, currentChildId, setCurrentChild])

  const handleSwitchChild = (childId: string) => {
    setCurrentChild(childId)
  }

  const handleDeleteChild = (childId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('确定要删除这个孩子的所有数据吗？')) {
      removeChild(childId)
      if (currentChildId === childId) {
        const remaining = children.filter(c => c.id !== childId)
        if (remaining.length > 0) {
          setCurrentChild(remaining[0].id)
        } else {
          setCurrentChild(null)
        }
      }
    }
  }

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
            返回
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
          
          <button
            onClick={() => navigate('/add-child')}
            className="w-8 h-8 rounded-[8px] flex items-center justify-center btn-press"
            style={{ background: 'var(--primary-50)' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="var(--primary-500)" strokeWidth="2" strokeLinecap="round">
              <path d="M8 3v10M3 8h10"/>
            </svg>
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-5 space-y-5">
        {/* 孩子选择标签 */}
        {children.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {children.map(child => {
              const isActive = child.id === currentChildId
              return (
                <button
                  key={child.id}
                  onClick={() => handleSwitchChild(child.id)}
                  className="flex items-center gap-2 px-3 py-2 rounded-[var(--r-lg)] btn-press transition-all flex-shrink-0"
                  style={{
                    background: isActive ? 'var(--secondary-50)' : 'var(--bg-card)',
                    border: isActive ? '2px solid var(--secondary-300)' : '1px solid var(--border-default)',
                    boxShadow: isActive ? '0 2px 8px rgba(45, 145, 133, 0.15)' : 'var(--shadow-xs)',
                  }}
                >
                  <ChildAvatar avatar={child.avatar} size="sm" />
                  <span className="text-[13px] font-semibold whitespace-nowrap"
                    style={{ color: isActive ? 'var(--secondary-600)' : 'var(--n-500)' }}>
                    {child.name}
                  </span>
                  {/* 编辑/删除按钮 */}
                  <div className="flex items-center gap-0.5 ml-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate(`/edit-child/${child.id}`) }}
                      className="w-5 h-5 rounded-full flex items-center justify-center btn-press"
                      style={{ background: 'var(--bg-muted)' }}
                      title="编辑"
                    >
                      <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="var(--n-400)" strokeWidth="2" strokeLinecap="round">
                        <path d="M11.5 1.5l3 3L5 14H2v-3L11.5 1.5z"/>
                      </svg>
                    </button>
                    <button
                      onClick={(e) => handleDeleteChild(child.id, e)}
                      className="w-5 h-5 rounded-full flex items-center justify-center btn-press"
                      style={{ background: 'var(--danger-50)' }}
                      title="删除"
                    >
                      <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="var(--danger-400)" strokeWidth="2" strokeLinecap="round">
                        <path d="M4 4l8 8M12 4l-8 8"/>
                      </svg>
                    </button>
                  </div>
                </button>
              )
            })}
          </div>
        )}

        {/* 无孩子提示 */}
        {children.length === 0 ? (
          <div className="surface-card-elevated p-8 text-center">
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ background: 'var(--bg-muted)' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--n-400)" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="8" r="5"/>
                <path d="M3 21v-2a7 7 0 0114 0v2"/>
                <path d="M19 8v6M16 11h6"/>
              </svg>
            </div>
            <h3 className="text-[16px] font-bold mb-2" style={{ color: 'var(--n-600)' }}>
              还没有添加小朋友
            </h3>
            <p className="text-[13px] mb-4" style={{ color: 'var(--n-400)' }}>
              添加孩子后可以查看他们的学习进度
            </p>
            <button
              onClick={() => navigate('/add-child')}
              className="px-6 py-2.5 rounded-[var(--r-md)] text-[14px] btn-primary btn-press">
              添加小朋友
            </button>
          </div>
        ) : (
          <>
            {/* 标题横幅 */}
            <div className="rounded-[var(--r-xl)] p-5 relative overflow-hidden paper-texture"
              style={{ 
                background: 'linear-gradient(135deg, var(--secondary-500) 0%, var(--secondary-400) 60%, var(--secondary-300) 100%)',
                boxShadow: '0 4px 20px rgba(45, 145, 133, 0.25)'
              }}>
              <div className="relative z-10 flex items-center gap-3">
                {currentChildId && (() => {
                  const child = children.find(c => c.id === currentChildId)
                  return child ? <ChildAvatar avatar={child.avatar} size="lg" /> : null
                })()}
                <div>
                  <h2 className="text-[20px] font-extrabold text-white mb-1">
                    {children.find(c => c.id === currentChildId)?.name || ''}的学习报告
                  </h2>
                  <p className="text-[13px] text-white/70">
                    了解孩子的学习情况和进步
                  </p>
                </div>
              </div>
              <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-[0.10]"
                style={{ background: 'white' }} />
              <div className="absolute right-10 bottom-0 w-12 h-12 rounded-full opacity-[0.07]"
                style={{ background: 'white' }} />
            </div>

            <Dashboard />
            <MasteryTable />
          </>
        )}
      </main>
    </div>
  )
}
