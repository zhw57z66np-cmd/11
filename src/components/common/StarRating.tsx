interface StarRatingProps {
  level: '未学习' | '学习中' | '已掌握' | '优秀'
  size?: 'sm' | 'md' | 'lg'
}

const levelConfig = {
  '未学习': { stars: 0, color: 'var(--n-300)', label: '未学习' },
  '学习中': { stars: 2, color: 'var(--warning-400)', label: '学习中' },
  '已掌握': { stars: 4, color: 'var(--success-500)', label: '已掌握' },
  '优秀':   { stars: 5, color: 'var(--primary-500)', label: '优秀' },
}

const sizeConfig = {
  sm: { star: 12, text: 'text-[10px]', gap: 'gap-[2px]' },
  md: { star: 16, text: 'text-[12px]', gap: 'gap-[3px]' },
  lg: { star: 22, text: 'text-[14px]', gap: 'gap-1' },
}

export default function StarRating({ level, size = 'md' }: StarRatingProps) {
  const config = levelConfig[level]
  const sz = sizeConfig[size]

  return (
    <div className={`flex items-center ${sz.gap}`}>
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width={sz.star} height={sz.star} viewBox="0 0 16 16" className={i <= config.stars ? 'star-pop' : ''}
          style={{ animationDelay: `${(i - 1) * 0.06}s` }}>
          <path
            d="M8 1.5L9.8 5.7L14.5 6.3L11 9.6L12 14.3L8 12L4 14.3L5 9.6L1.5 6.3L6.2 5.7L8 1.5Z"
            fill={i <= config.stars ? config.color : 'var(--n-200)'}
            stroke={i <= config.stars ? config.color : 'var(--n-200)'}
            strokeWidth="0.5"
          />
        </svg>
      ))}
      {size !== 'sm' && (
        <span className={`ml-1.5 ${sz.text} font-medium`} style={{ color: 'var(--n-400)' }}>{config.label}</span>
      )}
    </div>
  )
}
