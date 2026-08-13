import { useState, useEffect, useCallback, useRef } from 'react'
import type { Question } from '../../types'
import { getHanziDetail } from '../../data/hanziData'
import TianGe from './TianGe'

interface QuizQuestionProps {
  question: Question
  userAnswer: string
  onAnswer: (answer: string) => void
  showResult: boolean
  isCorrect?: boolean
  showHint: boolean
  disabled?: boolean
}

const typeLabels: Record<string, string> = {
  pinyin_write: '看拼音写词语',
  multi_pronunciation: '多音字',
  word_select: '选词填空',
  fill_blank: '课文填空',
  reading_choice: '阅读理解',
  antonym: '反义词',
  word_form: '组词',
  character_pinyin: '生字注音',
  match: '连线匹配',
  handwriting: '田字格书写',
}

export default function QuizQuestion({
  question, userAnswer, onAnswer, showResult, isCorrect, showHint, disabled,
}: QuizQuestionProps) {
  const [inputValue, setInputValue] = useState(userAnswer)
  const [hasInk, setHasInk] = useState(false)

  // 输入框同步 userAnswer (从答案卡/上一题返回时)
  useEffect(() => {
    setInputValue(userAnswer)
  }, [userAnswer, question.id])

  // 切换题目时重置田字格状态
  useEffect(() => {
    setHasInk(false)
  }, [question.id])

  const handleInputChange = (val: string) => {
    if (disabled) return
    setInputValue(val)
    onAnswer(val)
  }

  const inputBaseStyle = `w-full px-4 py-3 text-[15px] border-2 rounded-[var(--r-md)] outline-none transition-colors`

  // 用 ref 保存最新的 onAnswer, 使 handleInkChange 引用完全稳定 (避免父组件内联回调导致无限循环)
  const onAnswerRef = useRef(onAnswer)
  onAnswerRef.current = onAnswer

  // 田字格书写回调 (稳定引用, 避免无限循环)
  const handleInkChange = useCallback((ink: boolean) => {
    setHasInk(ink)
    if (ink) {
      // 有笔迹即视为已作答
      const targetChar = String(question.answer).trim()
      onAnswerRef.current(targetChar)
    } else {
      onAnswerRef.current('')
    }
  }, [question.answer])

  const renderQuestion = () => {
    switch (question.type) {
      case 'handwriting': {
        // 根据题目目标字展示田字格听写 (answer 为目标字)
        const targetChar = String(question.answer).trim()
        const detail = getHanziDetail(targetChar)

        if (!detail) {
          return (
            <div className="space-y-3">
              <p className="text-[15px] font-medium" style={{ color: 'var(--n-700)' }}>
                {question.prompt}
              </p>
              <p className="text-[13px] text-center py-4 rounded-[var(--r-sm)]"
                style={{ background: 'var(--warning-50)', color: 'var(--warning-600)' }}>
                该字暂未收录笔画数据，请直接输入：{targetChar}
              </p>
              <input
                type="text"
                value={inputValue}
                onChange={e => handleInputChange(e.target.value)}
                placeholder="请输入该字..."
                disabled={disabled}
                className={inputBaseStyle}
                style={{ borderColor: 'var(--border-default)', background: 'var(--bg-card)' }}
              />
            </div>
          )
        }

        return (
          <div className="space-y-3">
            <p className="text-[15px] font-medium leading-relaxed" style={{ color: 'var(--n-700)' }}>
              {question.prompt}
            </p>
            <p className="text-[20px] font-bold text-center" style={{ color: 'var(--primary-500)' }}>
              {detail.pinyin}
            </p>
            <p className="text-[12px] text-center" style={{ color: 'var(--n-400)' }}>
              请在下方田字格中书写"{targetChar}"
            </p>
            <div className="flex justify-center py-2">
              <TianGe
                hanzi={detail}
                mode="exam"
                showGuide={false}
                size={220}
                disabled={disabled}
                onWriteChange={handleInkChange}
              />
            </div>
            <p className="text-[11px] text-center" style={{ color: hasInk ? 'var(--success-600)' : 'var(--n-400)' }}>
              {hasInk ? '✓ 已书写，可提交答案' : '请在田字格中书写后提交'}
            </p>
          </div>
        )
      }
      case 'match': {
        const answerObj = typeof question.answer === 'object' && !Array.isArray(question.answer)
          ? question.answer as Record<string, string>
          : {}
        const pairs = Object.entries(answerObj)
        return (
          <div className="space-y-3">
            <p className="text-[15px] font-medium" style={{ color: 'var(--n-700)' }}>
              {question.prompt}
            </p>
            <div className="grid grid-cols-2 gap-2 mb-1">
              <div className="text-center text-[11px] font-medium px-2 py-1 rounded-[var(--r-xs)]"
                style={{ background: 'var(--bg-muted)', color: 'var(--n-400)' }}>
                左侧
              </div>
              <div className="text-center text-[11px] font-medium px-2 py-1 rounded-[var(--r-xs)]"
                style={{ background: 'var(--bg-muted)', color: 'var(--n-400)' }}>
                右侧
              </div>
            </div>
            {question.options?.map((left, i) => (
              <div key={i} className="grid grid-cols-2 gap-2 items-center">
                <div className="text-center py-2.5 rounded-[var(--r-sm)] font-medium text-[13px]"
                  style={{ background: 'var(--bg-muted)', color: 'var(--n-600)' }}>
                  {left}
                </div>
                <select
                  value=""
                  onChange={e => {
                    const right = e.target.value
                    const newPair = `${left}-${right}`
                    let newVal = inputValue
                    if (newVal.includes(left)) {
                      const existingPairs = newVal.split(';').filter(p => !p.startsWith(left))
                      existingPairs.push(newPair)
                      newVal = existingPairs.join(';')
                    } else {
                      newVal = newVal ? `${newVal};${newPair}` : newPair
                    }
                    handleInputChange(newVal)
                  }}
                  disabled={disabled}
                  className="border-2 rounded-[var(--r-sm)] py-2.5 px-3 text-[13px] outline-none"
                  style={{ 
                    borderColor: 'var(--border-default)',
                    background: disabled ? 'var(--bg-muted)' : 'var(--bg-card)'
                  }}
                >
                  <option value="">请选择...</option>
                  {pairs.map(([, right]) => (
                    <option key={right} value={right}>{right}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )
      }
      case 'pinyin_write':
      case 'fill_blank':
      case 'word_form':
      case 'antonym':
        return (
          <div className="space-y-3">
            <p className="text-[15px] font-medium leading-relaxed" style={{ color: 'var(--n-700)' }}>
              {question.prompt}
            </p>
            <input
              type="text"
              value={inputValue}
              onChange={e => handleInputChange(e.target.value)}
              placeholder="请输入你的答案..."
              disabled={disabled}
              className={inputBaseStyle}
              style={{ 
                borderColor: showResult 
                  ? isCorrect ? 'var(--success-400)' : 'var(--warning-400)' 
                  : 'var(--border-default)',
                background: disabled ? 'var(--bg-muted)' : 'var(--bg-card)',
                boxShadow: showResult ? 'none' : '0 1px 3px rgba(0,0,0,0.04)'
              }}
            />
          </div>
        )
      case 'multi_pronunciation':
      case 'word_select':
      case 'reading_choice':
      case 'character_pinyin':
        return (
          <div className="space-y-3">
            <p className="text-[15px] font-medium leading-relaxed" style={{ color: 'var(--n-700)' }}>
              {question.prompt}
            </p>
            <div className="space-y-2">
              {question.options?.map((option, i) => {
                const isSelected = inputValue === option || inputValue.includes(option)
                const isThisCorrect = showResult && (
                  question.answer === option ||
                  (Array.isArray(question.answer) && question.answer.includes(option))
                )
                const isThisWrong = showResult && isSelected && !isThisCorrect
                return (
                  <button
                    key={i}
                    onClick={() => !disabled && handleInputChange(option)}
                    disabled={disabled}
                    className="w-full text-left px-4 py-3 rounded-[var(--r-md)] border-2 transition-all text-[14px] font-medium btn-press"
                    style={{ 
                      background: showResult
                        ? isThisCorrect ? 'var(--success-50)' 
                          : isThisWrong ? 'var(--warning-50)'
                          : 'var(--bg-muted)'
                        : isSelected ? 'var(--info-50)' : 'var(--bg-muted)',
                      borderColor: showResult
                        ? isThisCorrect ? 'var(--success-400)' 
                          : isThisWrong ? 'var(--warning-400)'
                          : 'transparent'
                        : isSelected ? 'var(--info-400)' : 'transparent',
                      color: showResult
                        ? isThisCorrect ? 'var(--success-700)' 
                          : isThisWrong ? 'var(--warning-600)'
                          : 'var(--n-500)'
                        : isSelected ? 'var(--info-600)' : 'var(--n-600)'
                    }}
                  >
                    <span className="inline-flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold"
                        style={{ 
                          background: isSelected 
                            ? showResult 
                              ? isThisCorrect ? 'var(--success-400)' : 'var(--warning-400)'
                              : 'var(--info-400)'
                            : 'var(--n-200)',
                          color: isSelected ? 'white' : 'var(--n-400)'
                        }}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      {option}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )
      default:
        return (
          <div className="space-y-3">
            <p className="text-[15px] font-medium" style={{ color: 'var(--n-700)' }}>
              {question.prompt}
            </p>
            <input
              type="text"
              value={inputValue}
              onChange={e => handleInputChange(e.target.value)}
              placeholder="请输入你的答案..."
              disabled={disabled}
              className={inputBaseStyle}
              style={{ 
                borderColor: 'var(--border-default)',
                background: disabled ? 'var(--bg-muted)' : 'var(--bg-card)'
              }}
            />
          </div>
        )
    }
  }

  return (
    <div className="surface-card p-5">
      {/* 题目类型标签 */}
      <div className="flex items-center gap-2 mb-4">
        <span className="px-2.5 py-1 rounded-[var(--r-xs)] text-[11px] font-semibold"
          style={{ background: 'var(--info-50)', color: 'var(--info-600)' }}>
          {typeLabels[question.type] || '其他'}
        </span>
        <span className="text-[11px]" style={{ color: 'var(--n-300)' }}>
          {question.points}分
        </span>
      </div>
      
      {/* 题目内容 */}
      {renderQuestion()}
      
      {/* 提示 */}
      {showHint && question.hint && showResult && !isCorrect && (
        <div className="mt-4 rounded-[var(--r-sm)] p-3"
          style={{ background: 'var(--warning-50)', border: '1px solid var(--warning-100)' }}>
          <span className="text-[12px]" style={{ color: 'var(--warning-600)' }}>
            提示：{question.hint}
          </span>
        </div>
      )}
    </div>
  )
}
