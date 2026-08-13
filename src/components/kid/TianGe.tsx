import { useRef, useState, useEffect, useCallback } from 'react'
import type { HanziDetail } from '../../types'

interface TianGeProps {
  hanzi: HanziDetail
  /** 模式: 'study' 学习(显示笔画动画+自由书写) | 'exam' 测试(仅自由书写, 无提示) */
  mode?: 'study' | 'exam'
  /** 测试模式下是否显示浅色字帖 */
  showGuide?: boolean
  size?: number
  disabled?: boolean
  onWriteChange?: (hasInk: boolean) => void
}

/**
 * 田字格组件
 * - 米字格底 + 对角虚线
 * - SVG 层: 笔顺动画 (逐笔播放)
 * - Canvas 层: 自由书写 (触摸/鼠标)
 */
export default function TianGe({ hanzi, mode = 'study', showGuide = true, size = 260, disabled = false, onWriteChange }: TianGeProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [playing, setPlaying] = useState(false)
  const [activeStroke, setActiveStroke] = useState(-1) // -1 未播放, >=0 当前高亮笔画
  const inkRef = useRef(false)
  const strokeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const drawingRef = useRef(false)
  const lastPosRef = useRef<{ x: number; y: number } | null>(null)

  const strokes = hanzi.strokes || []

  // 标记是否有笔迹
  const markInk = useCallback((val: boolean) => {
    inkRef.current = val
    onWriteChange?.(val)
  }, [onWriteChange])

  // 停止动画
  const stopAnim = useCallback(() => {
    if (strokeTimerRef.current) {
      clearTimeout(strokeTimerRef.current)
      strokeTimerRef.current = null
    }
    setPlaying(false)
    setActiveStroke(-1)
  }, [])

  useEffect(() => {
    stopAnim()
    const cv = canvasRef.current
    if (cv) {
      const ctx = cv.getContext('2d')
      if (ctx) {
        ctx.clearRect(0, 0, cv.width, cv.height)
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.strokeStyle = '#353330'
        ctx.lineWidth = 5
      }
    }
    // 注意: 不要在挂载时调用 onWriteChange, 否则与父组件内联回调组合会形成
    // onWriteChange 引用变化 -> useEffect 重跑 -> 再回调 -> 无限循环 (React #185)
  }, [hanzi.char, stopAnim])

  // 卸载时清理定时器
  useEffect(() => () => {
    if (strokeTimerRef.current) clearTimeout(strokeTimerRef.current)
  }, [])

  // 播放笔顺动画
  const playStrokes = () => {
    if (playing || strokes.length === 0) return
    setPlaying(true)
    let i = 0
    setActiveStroke(0)
    strokeTimerRef.current = setTimeout(function tick() {
      i++
      if (i >= strokes.length) {
        setActiveStroke(-1)
        setPlaying(false)
        return
      }
      setActiveStroke(i)
      strokeTimerRef.current = setTimeout(tick, 650)
    }, 650)
  }

  // Canvas 书写
  const getPos = (e: React.PointerEvent) => {
    const cv = canvasRef.current
    if (!cv) return null
    const rect = cv.getBoundingClientRect()
    return {
      x: (e.clientX - rect.left) * (cv.width / rect.width),
      y: (e.clientY - rect.top) * (cv.height / rect.height),
    }
  }

  const drawLine = (a: { x: number; y: number }, b: { x: number; y: number }) => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    ctx.beginPath()
    ctx.moveTo(a.x, a.y)
    ctx.lineTo(b.x, b.y)
    ctx.stroke()
  }

  const handleDown = (e: React.PointerEvent) => {
    if (disabled) return
    e.preventDefault()
    const cv = canvasRef.current
    if (!cv) return
    cv.setPointerCapture(e.pointerId)
    drawingRef.current = true
    lastPosRef.current = getPos(e)
  }

  const handleMove = (e: React.PointerEvent) => {
    if (disabled || !drawingRef.current) return
    const pos = getPos(e)
    if (pos && lastPosRef.current) {
      drawLine(lastPosRef.current, pos)
      lastPosRef.current = pos
      if (!inkRef.current) markInk(true)
    }
  }

  const handleUp = (e: React.PointerEvent) => {
    drawingRef.current = false
    lastPosRef.current = null
    try { canvasRef.current?.releasePointerCapture(e.pointerId) } catch { /* noop */ }
  }

  const clearCanvas = () => {
    const ctx = canvasRef.current?.getContext('2d')
    if (ctx) ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height)
    markInk(false)
  }

  return (
    <div className="flex flex-col items-center">
      {/* 田字格 */}
      <div
        ref={containerRef}
        className="relative rounded-[var(--r-md)] overflow-hidden"
        style={{
          width: size,
          height: size,
          background: '#FFFDF9',
          border: '2px solid var(--n-800)',
          touchAction: 'none',
        }}
      >
        {/* 米字线 */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'transparent' }}>
          {/* 竖中线 */}
          <div className="absolute top-0 bottom-0 left-1/2 w-px" style={{ background: 'var(--n-300)' }} />
          {/* 横中线 */}
          <div className="absolute left-0 right-0 top-1/2 h-px" style={{ background: 'var(--n-300)' }} />
          {/* 对角线 */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <line x1="0" y1="0" x2="100" y2="100" stroke="var(--n-200)" strokeWidth="0.6" vectorEffect="non-scaling-stroke" />
            <line x1="100" y1="0" x2="0" y2="100" stroke="var(--n-200)" strokeWidth="0.6" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>

        {/* 浅色字帖 (学习模式 + showGuide) */}
        {showGuide && mode === 'study' && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
            style={{ color: 'rgba(53, 51, 48, 0.06)', fontSize: size * 0.72, lineHeight: 1, fontFamily: '"KaiTi","STKaiti","楷体",serif' }}>
            {hanzi.char}
          </div>
        )}

        {/* 笔顺 SVG 层 */}
        {strokes.length > 0 && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            {strokes.map((d: string, i: number) => (
              <path
                key={i}
                d={d}
                fill="none"
                stroke={activeStroke === i ? 'var(--primary-500)' : 'var(--n-700)'}
                strokeWidth={activeStroke === i ? 3.2 : 2.2}
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
                style={{
                  opacity: activeStroke === -1 ? 0 : activeStroke >= i ? 1 : 0.18,
                  transition: 'opacity 0.3s, stroke 0.3s',
                }}
              />
            ))}
          </svg>
        )}

        {/* Canvas 书写层 */}
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 w-full h-full ${disabled ? 'cursor-not-allowed' : 'cursor-crosshair'}`}
          width={size * 2}
          height={size * 2}
          style={{ touchAction: 'none' }}
          onPointerDown={handleDown}
          onPointerMove={handleMove}
          onPointerUp={handleUp}
          onPointerCancel={handleUp}
        />
      </div>

      {/* 笔顺控制条 (仅学习模式且有笔画数据) */}
      {mode === 'study' && (
        <>
          {strokes.length > 0 && (
            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={playStrokes}
                disabled={playing}
                className="px-4 py-2 rounded-[var(--r-sm)] text-[13px] font-semibold btn-press disabled:opacity-50"
                style={{ background: 'var(--primary-500)', color: 'white' }}
              >
                {playing ? '播放中...' : '▶ 播放笔顺'}
              </button>
              <button
                onClick={clearCanvas}
                className="px-4 py-2 rounded-[var(--r-sm)] text-[13px] font-medium btn-press"
                style={{ background: 'var(--bg-muted)', color: 'var(--n-600)' }}
              >
                🗑 清空
              </button>
            </div>
          )}
          {strokes.length === 0 && (
            <button
              onClick={clearCanvas}
              className="px-4 py-2 rounded-[var(--r-sm)] text-[13px] font-medium btn-press mt-4"
              style={{ background: 'var(--bg-muted)', color: 'var(--n-600)' }}
            >
              🗑 清空
            </button>
          )}
        </>
      )}

      {/* 笔画进度 */}
      {mode === 'study' && activeStroke >= 0 && (
        <div className="mt-3 text-[12px] font-medium" style={{ color: 'var(--primary-500)' }}>
          {hanzi.strokeOrder[activeStroke] || ''} · 第 {activeStroke + 1} / {strokes.length} 笔
        </div>
      )}
    </div>
  )
}
