import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  organizationId?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  mfaEnabled: boolean;
  ssoEnabled: boolean;
  organizationId: string | null;
}

interface AuthActions {
  setUser: (user: User | null) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setMfaEnabled: (enabled: boolean) => void;
  setSsoEnabled: (enabled: boolean) => void;
  setOrganizationId: (id: string | null) => void;
  logout: () => void;
}

interface AppState extends AuthState, AuthActions {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  mfaEnabled: false,
  ssoEnabled: false,
  organizationId: null,
};

const useStore = create<AppState>()(
  persist(
    (set) => ({
      ...initialState,
      theme: 'light',
      
      // Auth Actions
      setUser: (user) => set({ user }),
      setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      setMfaEnabled: (mfaEnabled) => set({ mfaEnabled }),
      setSsoEnabled: (ssoEnabled) => set({ ssoEnabled }),
      setOrganizationId: (organizationId) => set({ organizationId }),
      logout: () => set(initialState),
      
      // Theme Actions
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
    }),
    {
      name: 'app-store',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        theme: state.theme,
        mfaEnabled: state.mfaEnabled,
        ssoEnabled: state.ssoEnabled,
        organizationId: state.organizationId,
      }),
    }
  )
);

export default useStore; 