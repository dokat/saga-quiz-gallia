import { motion } from 'motion/react';
import VideoPlayer from '../VideoPlayer';

interface WaitingScreenProps {
  onStart: () => void;
  videoFormat: '16_9' | '16_10';
}

const WaitingScreen = ({ onStart, videoFormat }: WaitingScreenProps) => {
  return (
    <motion.div
      key="waiting"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <VideoPlayer
        src={`./videos/${videoFormat}/0_ATTENTE_IPA_SHOW_LONG.mp4`}
        loop
        onClick={onStart}
        className="brightness-75"
      />
    </motion.div>
  );
};

export default WaitingScreen;
