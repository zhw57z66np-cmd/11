import { create } from 'zustand'

type Role = 'kid' | 'parent' | null

interface AuthState {
  role: Role
  setRole: (role: Role) => void
  clearRole: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  role: (localStorage.getItem('chinese_app_role') as Role) || null,
  setRole: (role) => {
    if (role) {
      localStorage.setItem('chinese_app_role', role)
    } else {
      localStorage.removeItem('chinese_app_role')
    }
    set({ role })
  },
  clearRole: () => {
    localStorage.removeItem('chinese_app_role')
    set({ role: null })
  },
}))
