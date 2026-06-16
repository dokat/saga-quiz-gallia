import { motion } from 'motion/react';
import type { Team } from '../types';

interface FinalTeamScoreProps {
  teams: Team[];
  videoFormat: string;
}
export const FinalTeamScore: React.FC<FinalTeamScoreProps> = ({ teams, videoFormat }) => (
  <div className={`fixed ${videoFormat === '16_10' ? 'bottom-115' : 'bottom-100'} left-0 w-full pointer-events-none select-none z-100`}>
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
          initial={{ scale: 1.5, color: '#00B1a9' }}
          animate={{ scale: 1, color: '#00B1a9' }}
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
          initial={{ scale: 1.5, color: '#00B1a9' }}
          animate={{ scale: 1, color: '#00B1a9' }}
          className="text-9xl font-black tabular-nums "
        >
          {teams[1].score}
        </motion.span>
      </motion.div>
    )}
  </div>
);
