import { motion } from 'motion/react';
import VideoPlayer from '../VideoPlayer';

interface WaitingScreenProps {
  onStart: () => void;
}

const WaitingScreen = ({ onStart }: WaitingScreenProps) => {
  return (
    <motion.div
      key="waiting"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <VideoPlayer src="./videos/0_ATTENTE.mp4" loop onClick={onStart} className="brightness-75" />
      <motion.div
        animate={{ opacity: [0.3, 1, 0.3], scale: [0.98, 1.02, 0.98] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
      >
        <div className="text-white/20 text-9xl font-black uppercase tracking-tighter mix-blend-overlay">
          QUIZ
        </div>
        <h1 className="text-5xl text-white font-black tracking-[0.5em] uppercase drop-shadow-2xl">
          Toucher pour commencer
        </h1>
      </motion.div>
    </motion.div>
  );
};

export default WaitingScreen;
