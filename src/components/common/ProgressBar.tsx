interface ProgressBarProps {
  value: number
  label?: string
  color?: string
  showPercent?: boolean
}

export default function ProgressBar({
  value,
  label,
  color = '#4F46E5',
  showPercent = true,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value))

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          {showPercent && (
            <span className="text-sm font-medium text-gray-700">{clamped}%</span>
          )}
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${clamped}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}
