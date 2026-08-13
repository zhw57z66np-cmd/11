import { useState } from 'react'
import type { Question } from '../../types'

interface QuizQuestionProps {
  question: Question
  userAnswer: string
  onAnswer: (answer: string) => void
  showResult: boolean
  showHint: boolean
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
}

function isAnswerCorrect(question: Question, userAnswer: string): boolean {
  if (!userAnswer.trim()) return false
  const normalized = userAnswer.trim()

  if (typeof question.answer === 'object' && !Array.isArray(question.answer) && question.answer !== null) {
    const answerObj = question.answer as Record<string, string>
    const keys = Object.keys(answerObj)
    return keys.every(key => normalized.includes(key) && normalized.includes(answerObj[key]))
  }
  if (Array.isArray(question.answer)) {
    if (question.type === 'word_form') {
      return question.answer.some(a => normalized.includes(a.trim()))
    }
    return question.answer.every(a => normalized.includes(a.trim()))
  }
  if (typeof question.answer === 'string') {
    return normalized === question.answer || normalized.includes(question.answer) || question.answer.includes(normalized)
  }
  return false
}

export default function QuizQuestion({
  question,
  userAnswer,
  onAnswer,
  showResult,
  showHint,
}: QuizQuestionProps) {
  const [inputValue, setInputValue] = useState(userAnswer)
  const isCorrect = showResult && isAnswerCorrect(question, inputValue)

  const handleInputChange = (val: string) => {
    setInputValue(val)
    onAnswer(val)
  }

  const renderQuestion = () => {
    switch (question.type) {
      case 'match': {
        // 连线匹配题：用 "左-右" 格式输入
        const answerObj = typeof question.answer === 'object' && !Array.isArray(question.answer)
          ? question.answer as Record<string, string>
          : {}
        const pairs = Object.entries(answerObj)
        return (
          <div className="space-y-4">
            <p className="text-lg text-gray-800">{question.prompt}</p>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="text-center text-sm font-medium text-gray-500">左侧</div>
              <div className="text-center text-sm font-medium text-gray-500">右侧</div>
            </div>
            {question.options?.map((left, i) => (
              <div key={i} className="grid grid-cols-2 gap-2 items-center">
                <span className="text-center bg-gray-100 rounded-lg py-2 font-medium text-gray-700">{left}</span>
                <select
                  value=""
                  onChange={e => {
                    const right = e.target.value
                    const newPair = `${left}-${right}`
                    // 替换或追加
                    let newVal = inputValue
                    if (newVal.includes(left)) {
                      // 简单处理：重新构建
                      const existingPairs = newVal.split(';').filter(p => !p.startsWith(left))
                      existingPairs.push(newPair)
                      newVal = existingPairs.join(';')
                    } else {
                      newVal = newVal ? `${newVal};${newPair}` : newPair
                    }
                    handleInputChange(newVal)
                  }}
                  disabled={showResult}
                  className="border-2 border-gray-200 rounded-lg py-2 px-3 text-sm focus:border-indigo-400 outline-none"
                >
                  <option value="">请选择...</option>
                  {pairs.map(([, right]) => (
                    <option key={right} value={right}>{right}</option>
                  ))}
                </select>
              </div>
            ))}
            {!question.options?.length && (
              <input
                type="text"
                value={inputValue}
                onChange={e => handleInputChange(e.target.value)}
                placeholder="格式：左-右, 左-右..."
                disabled={showResult}
                className="w-full px-4 py-3 text-lg border-2 rounded-xl outline-none transition-colors border-gray-200 focus:border-indigo-400"
              />
            )}
          </div>
        )
      }
      case 'pinyin_write':
      case 'fill_blank':
      case 'word_form':
      case 'antonym':
        return (
          <div className="space-y-4">
            <p className="text-lg text-gray-800">{question.prompt}</p>
            <input
              type="text"
              value={inputValue}
              onChange={e => handleInputChange(e.target.value)}
              placeholder="请输入答案..."
              disabled={showResult}
              className={`w-full px-4 py-3 text-lg border-2 rounded-xl outline-none transition-colors
                ${showResult
                  ? isCorrect ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50'
                  : 'border-gray-200 focus:border-indigo-400'
                }`}
            />
          </div>
        )
      case 'multi_pronunciation':
      case 'word_select':
      case 'reading_choice':
      case 'character_pinyin':
        return (
          <div className="space-y-4">
            <p className="text-lg text-gray-800">{question.prompt}</p>
            <div className="space-y-2">
              {question.options?.map((option, i) => {
                const isSelected = inputValue === option || inputValue.includes(option)
                const isThisCorrect = question.answer === option ||
                  (Array.isArray(question.answer) && question.answer.includes(option))
                return (
                  <button
                    key={i}
                    onClick={() => !showResult && handleInputChange(option)}
                    disabled={showResult}
                    className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all
                      ${showResult
                        ? isThisCorrect ? 'border-green-400 bg-green-50 text-green-800'
                          : isSelected ? 'border-red-400 bg-red-50 text-red-800'
                          : 'border-gray-100 bg-gray-50 text-gray-400'
                        : isSelected ? 'border-indigo-400 bg-indigo-50 text-indigo-800'
                          : 'border-gray-200 hover:border-indigo-200 hover:bg-indigo-50'
                      }`}
                  >
                    {option}
                  </button>
                )
              })}
            </div>
          </div>
        )
      default:
        return (
          <div className="space-y-4">
            <p className="text-lg text-gray-800">{question.prompt}</p>
            <input
              type="text"
              value={inputValue}
              onChange={e => handleInputChange(e.target.value)}
              placeholder="请输入答案..."
              disabled={showResult}
              className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl outline-none focus:border-indigo-400"
            />
          </div>
        )
    }
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium">
          {typeLabels[question.type] || '其他'}
        </span>
        <span className="text-xs text-gray-400">{question.points}分</span>
      </div>
      {renderQuestion()}
      {showHint && question.hint && !showResult && (
        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-xl p-3">
          <span className="text-yellow-700 text-sm">💡 提示：{question.hint}</span>
        </div>
      )}
      {showResult && (
        <div className={`mt-4 rounded-xl p-4 ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          {isCorrect ? (
            <p className="text-green-700 font-medium">✅ 回答正确！太棒了！</p>
          ) : (
            <div>
              <p className="text-red-700 font-medium mb-1">❌ 回答错误</p>
              <p className="text-gray-600 text-sm">
                正确答案：<span className="font-bold text-green-700">
                  {typeof question.answer === 'object' && !Array.isArray(question.answer)
                    ? Object.entries(question.answer).map(([k, v]) => `${k}→${v}`).join('；')
                    : Array.isArray(question.answer)
                      ? question.answer.join('、')
                      : String(question.answer)}
                </span>
              </p>
              {question.explanation && (
                <p className="text-gray-500 text-sm mt-2">📖 {question.explanation}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
