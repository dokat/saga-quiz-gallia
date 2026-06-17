import { motion } from 'motion/react';
import VideoPlayer from '../VideoPlayer';
import { useState } from 'react';
import { FinalTeamScore } from '../FinalTeamScore';
import { useVideoFormatContext } from '../../contexts/VideoFormatContext';

interface FinalScoreScreenProps {
  onClick: () => void;
}

export const FinalScoreScreen = ({ onClick }: FinalScoreScreenProps) => {
  const { videoFormat } = useVideoFormatContext();
  const [showScore, setShowScore] = useState(false);

  return (
    <>
      {showScore && <FinalTeamScore />}
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
