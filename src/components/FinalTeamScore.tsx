import { motion } from 'motion/react';
import type { Team } from '../types';

interface FinalTeamScoreProps {
  teams: Team[];
}
export const FinalTeamScore: React.FC<FinalTeamScoreProps> = ({ teams }) => (
  <div className="fixed bottom-100 left-0 w-full pointer-events-none select-none z-100">
    {/* Team 1 (Left) */}
    {teams[0] && (
      <motion.div
        key={`team-0-${teams[0].score}`}
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100, damping: 15 }}
        className="absolute left-175 top-15"
      >
        <motion.span
          initial={{ scale: 1.5, color: '#000' }}
          animate={{ scale: 1, color: '#000' }}
          className="text-9xl font-black tabular-nums "
        >
          {teams[0].score}
        </motion.span>
      </motion.div>
    )}

    {/* Team 2 (Right) */}
    {teams[1] && (
      <motion.div
        key={`team-0-${teams[1].score}`}
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100, damping: 15 }}
        className="absolute right-175 top-15"
      >
        <motion.span
          initial={{ scale: 1.5, color: '#000' }}
          animate={{ scale: 1, color: '#000' }}
          className="text-9xl font-black tabular-nums "
        >
          {teams[1].score}
        </motion.span>
      </motion.div>
    )}
  </div>
);
