interface StarRatingProps {
  level: '未学习' | '学习中' | '已掌握' | '优秀'
  size?: 'sm' | 'md' | 'lg'
}

const levelConfig = {
  '未学习': { stars: 0, color: '#D1D5DB', label: '未学习' },
  '学习中': { stars: 2, color: '#F59E0B', label: '学习中' },
  '已掌握': { stars: 4, color: '#10B981', label: '已掌握' },
  '优秀':   { stars: 5, color: '#4F46E5', label: '优秀' },
}

export default function StarRating({ level, size = 'md' }: StarRatingProps) {
  const config = levelConfig[level]
  const starSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-3xl' : 'text-2xl'

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <span
          key={i}
          className={`${starSize} transition-colors`}
          style={{ color: i <= config.stars ? config.color : '#E5E7EB' }}
        >
          ★
        </span>
      ))}
      <span className="ml-2 text-sm text-gray-500">{config.label}</span>
    </div>
  )
}
