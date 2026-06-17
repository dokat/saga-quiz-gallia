import { motion } from 'motion/react';
import VideoPlayer from '../VideoPlayer';
import { useState } from 'react';
import type { Team } from '../../types';
import { FinalTeamScore } from '../FinalTeamScore';

interface FinalScoreScreenProps {
  teams: Team[];
  onClick: () => void;
  videoFormat: '16_9' | '16_10';
  adjustZone: (zone: { x: number; y: number; w: number; h: number }) => { x: number; y: number; w: number; h: number };
}

export const FinalScoreScreen = ({ onClick, teams, videoFormat, adjustZone }: FinalScoreScreenProps) => {
  const [showScore, setShowScore] = useState(false);

  return (
    <>
      {showScore && <FinalTeamScore teams={teams} videoFormat={videoFormat} adjustZone={adjustZone} />}
      <motion.div
        key="final-score"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 z-0 bg-black flex items-center justify-center cursor-pointer"
        onClick={onClick}
      >
        <VideoPlayer
          src={`./videos/${videoFormat}/SCORES_FINAL_ON.mp4`}
          onEnded={() => setShowScore(true)}
        />
      </motion.div>
    </>
  );
};
