import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
}

interface Workspace {
  id: string
  name: string
  slug: string
  role: string
}

interface AuthState {
  user: User | null
  workspaces: Workspace[]
  currentWorkspace: Workspace | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  
  setAuth: (user: User, workspaces: Workspace[], token: string) => void
  setCurrentWorkspace: (workspace: Workspace) => void
  logout: () => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      workspaces: [],
      currentWorkspace: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,
      
      setAuth: (user, workspaces, token) =>
        set({
          user,
          workspaces,
          currentWorkspace: workspaces[0] || null,
          token,
          isAuthenticated: true,
          isLoading: false,
        }),
      
      setCurrentWorkspace: (workspace) =>
        set({ currentWorkspace: workspace }),
      
      logout: () =>
        set({
          user: null,
          workspaces: [],
          currentWorkspace: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        }),
      
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        workspaces: state.workspaces,
        currentWorkspace: state.currentWorkspace,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
