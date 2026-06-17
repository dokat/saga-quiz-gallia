import { createContext, useContext } from 'react';
import type { Team } from '../types';

export type TeamsContextType = {
  teams: Team[];
  addScore: (teamIndex: number) => void;
};

const TeamsContext = createContext<TeamsContextType | null>(null);

export const TeamsProvider = TeamsContext.Provider;

export function useTeamsContext() {
  const ctx = useContext(TeamsContext);
  if (!ctx) throw new Error('useTeamsContext must be used within a TeamsProvider');
  return ctx;
}
