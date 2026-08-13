import { useEffect, useRef } from 'react'
import type { HanziDetail } from '../../types'
import TianGe from './TianGe'

interface HanziDetailModalProps {
  hanzi: HanziDetail
  onClose: () => void
}

/**
 * 汉字详情弹窗
 * 包含: 田字格书写(笔顺动画+自由书写)、拼音、结构、部首、笔画数、组词、发音
 */
export default function HanziDetailModal({ hanzi, onClose }: HanziDetailModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  // ESC 关闭
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // 锁定背景滚动
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  // 发音 (浏览器 TTS)
  const speak = () => {
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(hanzi.char)
    u.lang = 'zh-CN'
    u.rate = 0.8
    u.pitch = 1
    window.speechSynthesis.speak(u)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 page-enter"
      style={{ background: 'rgba(31, 30, 27, 0.45)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-md max-h-[92dvh] overflow-y-auto rounded-[var(--r-xl)] scale-enter"
        style={{ background: 'var(--bg-base)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-3.5 border-b"
          style={{ background: 'rgba(251, 248, 243, 0.95)', backdropFilter: 'blur(12px)', borderColor: 'var(--border-default)' }}>
          <div className="flex items-center gap-3">
            <div className="text-[26px] font-bold leading-none" style={{ color: 'var(--n-800)', fontFamily: '"KaiTi","STKaiti","楷体",serif' }}>
              {hanzi.char}
            </div>
            <div>
              <div className="text-[15px] font-bold leading-tight" style={{ color: 'var(--primary-500)' }}>
                {hanzi.pinyin}
              </div>
              <div className="text-[10px] leading-tight mt-0.5" style={{ color: 'var(--n-400)' }}>
                {hanzi.strokeCount}画 · {hanzi.structure}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={speak}
              className="w-9 h-9 rounded-full flex items-center justify-center btn-press"
              style={{ background: 'var(--primary-50)', color: 'var(--primary-600)' }}
              title="发音"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
              </svg>
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full flex items-center justify-center btn-press"
              style={{ background: 'var(--bg-muted)', color: 'var(--n-500)' }}
              title="关闭"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M3 3L13 13M13 3L3 13"/>
              </svg>
            </button>
          </div>
        </div>

        {/* 内容 */}
        <div className="p-5 space-y-5">
          {/* 田字格 */}
          <div className="flex flex-col items-center">
            <TianGe hanzi={hanzi} mode="study" size={240} />
          </div>

          {/* 信息网格 */}
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-[var(--r-sm)] p-3 text-center" style={{ background: 'var(--bg-card)' }}>
              <div className="text-[10px] font-medium mb-0.5" style={{ color: 'var(--n-400)' }}>笔画</div>
              <div className="text-[16px] font-bold" style={{ color: 'var(--n-700)' }}>{hanzi.strokeCount}画</div>
            </div>
            <div className="rounded-[var(--r-sm)] p-3 text-center" style={{ background: 'var(--bg-card)' }}>
              <div className="text-[10px] font-medium mb-0.5" style={{ color: 'var(--n-400)' }}>结构</div>
              <div className="text-[16px] font-bold" style={{ color: 'var(--n-700)' }}>{hanzi.structure}</div>
            </div>
            <div className="rounded-[var(--r-sm)] p-3 text-center" style={{ background: 'var(--bg-card)' }}>
              <div className="text-[10px] font-medium mb-0.5" style={{ color: 'var(--n-400)' }}>部首</div>
              <div className="text-[16px] font-bold" style={{ color: 'var(--n-700)' }}>{hanzi.radical}</div>
            </div>
          </div>

          {/* 笔顺 */}
          {hanzi.strokeOrder.length > 0 && (
            <div className="rounded-[var(--r-md)] p-4" style={{ background: 'var(--bg-card)' }}>
              <div className="text-[12px] font-bold mb-2" style={{ color: 'var(--n-600)' }}>笔顺</div>
              <div className="flex flex-wrap gap-1.5">
                {hanzi.strokeOrder.map((s: string, i: number) => (
                  <span key={i} className="inline-flex items-center gap-1 px-2 py-1 rounded-[var(--r-xs)] text-[12px]"
                    style={{ background: 'var(--bg-subtle)', color: 'var(--n-600)' }}>
                    <span className="font-bold" style={{ color: 'var(--primary-500)' }}>{i + 1}</span>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 释义 + 组词 */}
          <div className="rounded-[var(--r-md)] p-4" style={{ background: 'var(--bg-card)' }}>
            <div className="text-[12px] font-bold mb-2" style={{ color: 'var(--n-600)' }}>释义</div>
            <div className="flex flex-wrap gap-2">
              {hanzi.meanings.map((m: string, i: number) => (
                <span key={i} className="text-[13px] px-2.5 py-1 rounded-[var(--r-xs)]"
                  style={{ background: 'var(--primary-50)', color: 'var(--primary-600)' }}>
                  {m}
                </span>
              ))}
            </div>
            <div className="text-[12px] font-bold mt-4 mb-2" style={{ color: 'var(--n-600)' }}>组词</div>
            <div className="flex flex-wrap gap-2">
              {hanzi.examples.map((ex: string, i: number) => (
                <span key={i} className="text-[13px] px-2.5 py-1 rounded-[var(--r-xs)]"
                  style={{ background: 'var(--bg-subtle)', color: 'var(--n-600)', fontFamily: '"KaiTi","STKaiti","楷体",serif' }}>
                  {ex}
                </span>
              ))}
            </div>
          </div>

          {/* 提示 */}
          <div className="text-center text-[12px] pb-1" style={{ color: 'var(--n-400)' }}>
            提示：点击 ▶ 播放笔顺动画，然后在田字格中跟着书写 ✍️
          </div>
        </div>
      </div>
    </div>
  )
}
