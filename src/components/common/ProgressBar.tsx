interface ProgressBarProps {
  value: number
  label?: string
  color?: string
  showPercent?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export default function ProgressBar({
  value,
  label,
  color = 'var(--primary-500)',
  showPercent = true,
  size = 'md',
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value))
  const height = size === 'sm' ? 'h-[5px]' : size === 'lg' ? 'h-[10px]' : 'h-[7px]'

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between mb-1.5">
          <span className="text-[12px] font-medium" style={{ color: 'var(--n-500)' }}>{label}</span>
          {showPercent && (
            <span className="text-[12px] font-bold" style={{ color: 'var(--n-600)' }}>{clamped}%</span>
          )}
        </div>
      )}
      <div className={`w-full rounded-full ${height} overflow-hidden`} style={{ background: 'var(--n-200)' }}>
        <div
          className="h-full rounded-full transition-all duration-700 ease-out progress-bar"
          style={{ width: `${clamped}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}
