import { motion } from 'motion/react';
import VideoPlayer from '../VideoPlayer';
import { useVideoFormatContext } from '../../contexts/VideoFormatContext';

interface WaitingScreenProps {
  onStart: () => void;
}

const WaitingScreen = ({ onStart }: WaitingScreenProps) => {
  const { videoFormat } = useVideoFormatContext();
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
      />
    </motion.div>
  );
};

export default WaitingScreen;
