import { motion } from 'motion/react';
import { useVideoFormatContext } from '../contexts/VideoFormatContext';
import { useTeamsContext } from '../contexts/TeamsContext';

export const FinalTeamScore: React.FC = () => {
  const { videoFormat, adjustZone } = useVideoFormatContext();
  const { teams } = useTeamsContext();
  const bottom = adjustZone({ x: 0, y: 0, w: 0, h: videoFormat === '16_10' ? 460 : 400 }).h;
  const leftRight = adjustZone({ x: 700, y: 0, w: 0, h: 0 }).x;
  const top = adjustZone({ x: 0, y: 60, w: 0, h: 0 }).y;

  return (
    <div
      className="fixed left-0 w-full pointer-events-none select-none z-100"
      style={{ bottom: `${bottom}px` }}
    >
      {/* Team 1 (Left) */}
      {teams[0] && (
        <motion.div
          key={`team-0-${teams[0].score}`}
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 100, damping: 15 }}
          className="absolute"
          style={{ left: `${leftRight}px`, top: `${top}px` }}
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
          className="absolute"
          style={{ right: `${leftRight}px`, top: `${top}px` }}
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
};
