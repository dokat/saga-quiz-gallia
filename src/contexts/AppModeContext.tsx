import { createContext, useContext } from 'react';

export type AppModeContextType = {
  appMode: 'TOUCHSCREEN' | 'BUZZER';
  setAppMode: (mode: 'TOUCHSCREEN' | 'BUZZER') => void;
};

const AppModeContext = createContext<AppModeContextType | null>(null);

export const AppModeProvider = AppModeContext.Provider;

export function useAppModeContext() {
  const ctx = useContext(AppModeContext);
  if (!ctx) throw new Error('useAppModeContext must be used within an AppModeProvider');
  return ctx;
}
