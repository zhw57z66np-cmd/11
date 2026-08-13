interface ChildAvatarProps {
  avatar: number
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const sizeConfig = {
  sm: { container: 28, face: 28 },
  md: { container: 40, face: 40 },
  lg: { container: 56, face: 56 },
  xl: { container: 72, face: 72 },
}

// 6 种可爱头像配色
const avatarConfigs = [
  { // 0: 小老虎
    bg: 'linear-gradient(135deg, #FFB347, #FF8C42)',
    face: '#FFD699',
    eyes: '#4A3728',
    accent: '#E8741A',
    feature: 'tiger',
  },
  { // 1: 小兔子
    bg: 'linear-gradient(135deg, #FFB6C1, #FF8FA3)',
    face: '#FFE4E8',
    eyes: '#5C3D4E',
    accent: '#FF6B8A',
    feature: 'bunny',
  },
  { // 2: 小熊
    bg: 'linear-gradient(135deg, #C4A882, #A68B6B)',
    face: '#E8D5B7',
    eyes: '#4A3728',
    accent: '#8B6F4E',
    feature: 'bear',
  },
  { // 3: 小猫
    bg: 'linear-gradient(135deg, #B8D4E3, #89B5D0)',
    face: '#E8F0F5',
    eyes: '#3D5C6E',
    accent: '#5B9BD5',
    feature: 'cat',
  },
  { // 4: 小熊猫
    bg: 'linear-gradient(135deg, #A8D5A2, #7BC47A)',
    face: '#E8F5E6',
    eyes: '#3D5C3D',
    accent: '#4CAF50',
    feature: 'panda',
  },
  { // 5: 小狐狸
    bg: 'linear-gradient(135deg, #FFB347, #FF6B35)',
    face: '#FFF0DB',
    eyes: '#5C3D1E',
    accent: '#E85D26',
    feature: 'fox',
  },
]

export default function ChildAvatar({ avatar, size = 'md' }: ChildAvatarProps) {
  const sz = sizeConfig[size]
  const config = avatarConfigs[avatar % avatarConfigs.length]
  const s = sz.face

  return (
    <div
      className="rounded-full flex items-center justify-center flex-shrink-0"
      style={{
        width: sz.container,
        height: sz.container,
        background: config.bg,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      <svg width={s * 0.75} height={s * 0.75} viewBox="0 0 30 30" fill="none">
        {/* 脸 */}
        <circle cx="15" cy="16" r="10" fill={config.face} />
        
        {/* 根据类型画不同特征 */}
        {config.feature === 'tiger' && (
          <>
            <circle cx="11" cy="14" r="1.5" fill={config.eyes} />
            <circle cx="19" cy="14" r="1.5" fill={config.eyes} />
            <ellipse cx="15" cy="18" rx="2" ry="1.2" fill={config.accent} fillOpacity="0.5" />
            <path d="M13 20 Q15 22 17 20" stroke={config.eyes} strokeWidth="1" strokeLinecap="round" fill="none" />
            <path d="M8 8 L11 12" stroke={config.accent} strokeWidth="2" strokeLinecap="round" />
            <path d="M22 8 L19 12" stroke={config.accent} strokeWidth="2" strokeLinecap="round" />
            <path d="M9 6 L10 10" stroke={config.accent} strokeWidth="1.5" strokeLinecap="round" />
            <path d="M21 6 L20 10" stroke={config.accent} strokeWidth="1.5" strokeLinecap="round" />
          </>
        )}
        {config.feature === 'bunny' && (
          <>
            <ellipse cx="11" cy="3" rx="2.5" ry="5" fill={config.face} stroke={config.accent} strokeWidth="0.8" />
            <ellipse cx="19" cy="3" rx="2.5" ry="5" fill={config.face} stroke={config.accent} strokeWidth="0.8" />
            <ellipse cx="11" cy="3" rx="1.2" ry="3" fill={config.accent} fillOpacity="0.3" />
            <ellipse cx="19" cy="3" rx="1.2" ry="3" fill={config.accent} fillOpacity="0.3" />
            <circle cx="12" cy="14" r="1.3" fill={config.eyes} />
            <circle cx="18" cy="14" r="1.3" fill={config.eyes} />
            <ellipse cx="15" cy="17" rx="1.5" ry="1" fill={config.accent} fillOpacity="0.6" />
            <path d="M13 19 Q15 20.5 17 19" stroke={config.eyes} strokeWidth="0.8" strokeLinecap="round" fill="none" />
          </>
        )}
        {config.feature === 'bear' && (
          <>
            <circle cx="8" cy="9" r="3.5" fill={config.face} stroke={config.accent} strokeWidth="0.8" />
            <circle cx="22" cy="9" r="3.5" fill={config.face} stroke={config.accent} strokeWidth="0.8" />
            <circle cx="8" cy="9" r="1.8" fill={config.accent} fillOpacity="0.3" />
            <circle cx="22" cy="9" r="1.8" fill={config.accent} fillOpacity="0.3" />
            <circle cx="12" cy="14" r="1.3" fill={config.eyes} />
            <circle cx="18" cy="14" r="1.3" fill={config.eyes} />
            <ellipse cx="15" cy="18" rx="3" ry="2" fill={config.accent} fillOpacity="0.2" />
            <ellipse cx="15" cy="17" rx="1.5" ry="1" fill={config.eyes} />
            <path d="M13 19.5 Q15 21 17 19.5" stroke={config.eyes} strokeWidth="0.8" strokeLinecap="round" fill="none" />
          </>
        )}
        {config.feature === 'cat' && (
          <>
            <path d="M7 10 L9 4 L13 10 Z" fill={config.face} stroke={config.accent} strokeWidth="0.6" />
            <path d="M23 10 L21 4 L17 10 Z" fill={config.face} stroke={config.accent} strokeWidth="0.6" />
            <circle cx="12" cy="14" r="1.5" fill={config.eyes} />
            <circle cx="18" cy="14" r="1.5" fill={config.eyes} />
            <circle cx="12.5" cy="13.5" r="0.5" fill="white" />
            <circle cx="18.5" cy="13.5" r="0.5" fill="white" />
            <ellipse cx="15" cy="17" rx="1.2" ry="0.8" fill={config.accent} fillOpacity="0.5" />
            <path d="M8 17 L5 16" stroke={config.eyes} strokeWidth="0.6" strokeLinecap="round" />
            <path d="M8 18.5 L5 19" stroke={config.eyes} strokeWidth="0.6" strokeLinecap="round" />
            <path d="M22 17 L25 16" stroke={config.eyes} strokeWidth="0.6" strokeLinecap="round" />
            <path d="M22 18.5 L25 19" stroke={config.eyes} strokeWidth="0.6" strokeLinecap="round" />
          </>
        )}
        {config.feature === 'panda' && (
          <>
            <circle cx="8" cy="9" r="3" fill={config.accent} fillOpacity="0.7" />
            <circle cx="22" cy="9" r="3" fill={config.accent} fillOpacity="0.7" />
            <ellipse cx="11.5" cy="14" rx="2.5" ry="2" fill={config.accent} fillOpacity="0.6" />
            <ellipse cx="18.5" cy="14" rx="2.5" ry="2" fill={config.accent} fillOpacity="0.6" />
            <circle cx="11.5" cy="14" r="1.2" fill="white" />
            <circle cx="18.5" cy="14" r="1.2" fill="white" />
            <circle cx="11.5" cy="14" r="0.7" fill={config.eyes} />
            <circle cx="18.5" cy="14" r="0.7" fill={config.eyes} />
            <ellipse cx="15" cy="17.5" rx="1.2" ry="0.8" fill={config.eyes} />
          </>
        )}
        {config.feature === 'fox' && (
          <>
            <path d="M6 12 L8 3 L13 10 Z" fill={config.accent} />
            <path d="M24 12 L22 3 L17 10 Z" fill={config.accent} />
            <path d="M7.5 11 L8.5 5 L12 10 Z" fill={config.face} />
            <path d="M22.5 11 L21.5 5 L18 10 Z" fill={config.face} />
            <circle cx="12" cy="14" r="1.3" fill={config.eyes} />
            <circle cx="18" cy="14" r="1.3" fill={config.eyes} />
            <path d="M15 16 L14 18 L16 18 Z" fill={config.eyes} />
            <path d="M12 20 Q15 22 18 20" stroke={config.eyes} strokeWidth="0.8" strokeLinecap="round" fill="none" />
            <ellipse cx="10" cy="18" rx="2" ry="1.5" fill={config.accent} fillOpacity="0.15" />
            <ellipse cx="20" cy="18" rx="2" ry="1.5" fill={config.accent} fillOpacity="0.15" />
          </>
        )}
      </svg>
    </div>
  )
}
