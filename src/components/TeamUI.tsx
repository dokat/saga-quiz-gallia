import React from 'react';
import { Users } from 'lucide-react';
import { motion } from 'motion/react';
import type { Team } from '../types';

interface TeamUIProps {
  teams: Team[];
}
export const TeamUI: React.FC<TeamUIProps> = ({ teams }) => (
  <div className="fixed top-12 left-0 w-full pointer-events-none select-none z-100">
    {/* Team 1 (Left) */}
    {teams[0] && (
      <motion.div
        key={`team-0-${teams[0].score}`}
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100, damping: 15 }}
        className="absolute left-16 top-0 bg-black/40 backdrop-blur-xl p-8 rounded-3xl border-4 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex items-center gap-8 min-w-75 border-red-500/30"
      >
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3 bg-red-500">
          <Users className="text-white w-10 h-10" />
        </div>
        <div className="flex flex-col">
          <span className="text-white/40 text-sm font-bold tracking-[0.2em] uppercase">
            {teams[0].name}
          </span>
          <motion.span
            initial={{ scale: 1.5, color: '#fff' }}
            animate={{ scale: 1, color: '#fff' }}
            className="text-7xl font-black tabular-nums"
          >
            {teams[0].score}
          </motion.span>
        </div>
      </motion.div>
    )}

    {/* Team 2 (Right) */}
    {teams[1] && (
      <motion.div
        key={`team-1-${teams[1].score}`}
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100, damping: 15 }}
        className="absolute right-16 top-0 bg-black/40 backdrop-blur-xl p-8 rounded-3xl border-4 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex items-center gap-8 min-w-75 border-blue-500/30 flex-row-reverse text-right"
      >
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 bg-blue-500">
          <Users className="text-white w-10 h-10" />
        </div>
        <div className="flex flex-col items-end">
          <span className="text-white/40 text-sm font-bold tracking-[0.2em] uppercase">
            {teams[1].name}
          </span>
          <motion.span
            initial={{ scale: 1.5, color: '#fff' }}
            animate={{ scale: 1, color: '#fff' }}
            className="text-7xl font-black tabular-nums"
          >
            {teams[1].score}
          </motion.span>
        </div>
      </motion.div>
    )}
  </div>
);
