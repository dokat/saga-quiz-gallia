import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type AppModeContextType = {
  appMode: 'TOUCHSCREEN' | 'BUZZER';
  setAppMode: (mode: 'TOUCHSCREEN' | 'BUZZER') => void;
  debugMode: boolean;
  setDebugMode: (debug: boolean) => void;
  numScenario: number;
  setNumScenario: (numScenario: number) => void;
};

const AppModeContext = createContext<AppModeContextType | null>(null);

export function AppModeProvider({ children }: { children: ReactNode }) {
  const [appMode, setAppMode] = useState<'TOUCHSCREEN' | 'BUZZER'>(() => {
    const saved = localStorage.getItem('appMode');
    return saved === 'TOUCHSCREEN' || saved === 'BUZZER' ? saved : 'BUZZER';
  });

  const [debugMode, setDebugMode] = useState<boolean>(false);

  const [numScenario, setNumScenario] = useState<number>(1);

  useEffect(() => {
    localStorage.setItem('appMode', appMode);
  }, [appMode]);

  return (
    <AppModeContext.Provider value={{ appMode, setAppMode, debugMode, setDebugMode, numScenario, setNumScenario }}>
      {children}
    </AppModeContext.Provider>
  );
}

export function useAppModeContext() {
  const ctx = useContext(AppModeContext);
  if (!ctx) throw new Error('useAppModeContext must be used within an AppModeProvider');
  return ctx;
}
