// 题目类型枚举
export type QuestionType =
  | 'pinyin_write'
  | 'multi_pronunciation'
  | 'word_select'
  | 'match'
  | 'antonym'
  | 'fill_blank'
  | 'reading_choice'
  | 'reading_short'
  | 'sentence_write'
  | 'character_pinyin'
  | 'word_form'
  | 'dictionary'
  | 'image_write'
  | 'handwriting'

// 单道题目
export interface Question {
  id: string
  type: QuestionType
  lessonId: string
  unitId: string
  grade: 1 | 2
  difficulty: 1 | 2 | 3
  points: number
  prompt: string
  options?: string[]
  answer: string | string[] | Record<string, string>
  explanation?: string
  hint?: string
  audioUrl?: string
}

// 课文/单元元数据
export interface Lesson {
  id: string
  title: string
  unitId: string
  grade: 1 | 2
  semester: '上' | '下'
  type: '课文' | '识字' | '语文园地'
  vocabulary: VocabItem[]
  keyPoints: string[]
  questionIds: string[]
}

export interface Unit {
  id: string
  name: string
  grade: 1 | 2
  semester: '上' | '下'
  lessonIds: string[]
}

// 生字词
export interface VocabItem {
  character: string
  pinyin: string
  strokes?: number
  radical?: string
  meanings: string[]
  examples: string[]
}

// 汉字详情 (用于田字格学习)
export interface HanziDetail {
  char: string
  pinyin: string
  strokeCount: number
  structure: string
  radical: string
  meanings: string[]
  examples: string[]
  strokeOrder: string[]
  strokes?: string[]  // SVG path 数组 (viewBox 0 0 100 100)
}

// 学习进度
export interface ProgressRecord {
  lessonId: string
  studyCount: number
  practiceCount: number
  examCount: number
  correctRate: number
  lastStudiedAt: string
  masteryLevel: '未学习' | '学习中' | '已掌握' | '优秀'
  wrongQuestions: string[]
}

// 孩子档案
export interface ChildProfile {
  id: string
  name: string
  avatar: number // 0-5 对应不同预设头像
  createdAt: string
}

// 考试记录
export interface ExamRecord {
  id: string
  examName: string
  startedAt: string
  finishedAt: string
  totalScore: number
  earnedScore: number
  duration: number
  questionResults: {
    questionId: string
    isCorrect: boolean
    userAnswer: string
    timeSpent: number
  }[]
}
