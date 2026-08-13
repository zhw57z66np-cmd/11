import { create } from 'zustand'
import type { ChildProfile } from '../types'
import { storage } from '../utils/storage'

interface ChildState {
  children: ChildProfile[]
  currentChildId: string | null
  addChild: (name: string, avatar: number) => ChildProfile
  removeChild: (id: string) => void
  updateChild: (id: string, name: string, avatar: number) => void
  setCurrentChild: (id: string | null) => void
  getChild: (id: string) => ChildProfile | undefined
}

export const useChildStore = create<ChildState>((set, get) => ({
  children: storage.get('child_profiles', []),
  currentChildId: storage.get('current_child_id', null),

  addChild: (name: string, avatar: number) => {
    const child: ChildProfile = {
      id: `child_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      name,
      avatar,
      createdAt: new Date().toISOString(),
    }
    set(state => {
      const newChildren = [...state.children, child]
      storage.set('child_profiles', newChildren)
      return { children: newChildren }
    })
    return child
  },

  removeChild: (id: string) => {
    set(state => {
      const newChildren = state.children.filter(c => c.id !== id)
      storage.set('child_profiles', newChildren)
      // 清除该孩子的进度数据
      storage.remove(`progress_${id}`)
      storage.remove(`exam_${id}`)
      // 如果删除的是当前孩子，清空当前选择
      const newCurrentId = state.currentChildId === id ? null : state.currentChildId
      storage.set('current_child_id', newCurrentId)
      return { children: newChildren, currentChildId: newCurrentId }
    })
  },

  updateChild: (id: string, name: string, avatar: number) => {
    set(state => {
      const newChildren = state.children.map(c =>
        c.id === id ? { ...c, name, avatar } : c
      )
      storage.set('child_profiles', newChildren)
      return { children: newChildren }
    })
  },

  setCurrentChild: (id: string | null) => {
    storage.set('current_child_id', id)
    set({ currentChildId: id })
  },

  getChild: (id: string) => {
    return get().children.find(c => c.id === id)
  },
}))
