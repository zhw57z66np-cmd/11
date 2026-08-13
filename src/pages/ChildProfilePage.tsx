import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useChildStore } from '../store/useChildStore'
import ChildAvatar from '../components/common/ChildAvatar'

const avatarNames = ['小老虎', '小兔子', '小熊', '小猫', '小熊猫', '小狐狸']

export default function ChildProfilePage() {
  const navigate = useNavigate()
  const { childId } = useParams()
  const addChild = useChildStore(s => s.addChild)
  const updateChild = useChildStore(s => s.updateChild)
  const children = useChildStore(s => s.children)

  const existing = childId ? children.find(c => c.id === childId) : undefined
  const [name, setName] = useState(existing?.name || '')
  const [avatar, setAvatar] = useState(existing?.avatar || Math.floor(Math.random() * 6))
  const isEdit = !!existing

  const handleSave = () => {
    if (!name.trim()) return
    if (isEdit && childId) {
      updateChild(childId, name.trim(), avatar)
      navigate(-1)
    } else {
      const child = addChild(name.trim(), avatar)
      navigate('/')
      // 自动选中新创建的孩子
      useChildStore.getState().setCurrentChild(child.id)
    }
  }

  return (
    <div className="min-h-dvh flex items-center justify-center p-6 page-enter"
      style={{ background: 'linear-gradient(160deg, #FFF4EB 0%, #FCE7F3 40%, #EDF8F6 100%)' }}>
      
      <div className="surface-card-elevated p-7 max-w-sm w-full scale-enter">
        <h2 className="text-[22px] font-extrabold text-center mb-1" style={{ color: 'var(--n-800)' }}>
          {isEdit ? '编辑资料' : '添加小朋友'}
        </h2>
        <p className="text-[13px] text-center mb-6" style={{ color: 'var(--n-400)' }}>
          {isEdit ? '修改孩子的信息' : '给孩子创建一个学习账号'}
        </p>

        {/* 头像预览 */}
        <div className="flex justify-center mb-6">
          <div className="float-anim">
            <ChildAvatar avatar={avatar} size="xl" />
          </div>
        </div>

        {/* 头像选择 */}
        <div className="mb-5">
          <label className="text-[13px] font-semibold mb-2 block" style={{ color: 'var(--n-600)' }}>
            选择头像
          </label>
          <div className="flex justify-center gap-2.5 flex-wrap">
            {avatarNames.map((_, i) => (
              <button
                key={i}
                onClick={() => setAvatar(i)}
                className="btn-press transition-all rounded-full"
                style={{
                  outline: avatar === i ? '3px solid var(--primary-400)' : '3px solid transparent',
                  outlineOffset: '2px',
                }}
              >
                <ChildAvatar avatar={i} size="md" />
              </button>
            ))}
          </div>
          <p className="text-[11px] text-center mt-2" style={{ color: 'var(--n-400)' }}>
            {avatarNames[avatar]}
          </p>
        </div>

        {/* 名字输入 */}
        <div className="mb-6">
          <label className="text-[13px] font-semibold mb-2 block" style={{ color: 'var(--n-600)' }}>
            名字
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="输入小朋友的名字"
            maxLength={8}
            className="w-full px-4 py-3 rounded-[var(--r-md)] text-[16px] font-medium outline-none transition-all"
            style={{
              background: 'var(--bg-subtle)',
              border: '2px solid var(--border-default)',
              color: 'var(--n-700)',
            }}
            onFocus={e => { e.target.style.borderColor = 'var(--primary-300)' }}
            onBlur={e => { e.target.style.borderColor = 'var(--border-default)' }}
            autoFocus
          />
          <p className="text-[11px] mt-1.5" style={{ color: 'var(--n-300)' }}>
            最多 8 个字
          </p>
        </div>

        {/* 保存按钮 */}
        <button
          onClick={handleSave}
          disabled={!name.trim()}
          className="w-full py-3.5 rounded-[var(--r-md)] text-[16px] btn-primary btn-press disabled:opacity-40"
        >
          {isEdit ? '保存修改' : '创建账号'}
        </button>
        <button onClick={() => navigate(-1)} className="mt-3 w-full text-[13px] btn-press py-2"
          style={{ color: 'var(--n-400)' }}>
          取消
        </button>
      </div>
    </div>
  )
}
