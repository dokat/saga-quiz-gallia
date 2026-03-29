import { motion } from 'framer-motion';
import VideoPlayer from '../VideoPlayer';

interface ResultFeedbackScreenProps {
  isCorrect: boolean;
  onEnded: () => void;
}

const ResultFeedbackScreen = ({ isCorrect, onEnded }: ResultFeedbackScreenProps) => {
  return (
    <motion.div
      key="result"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50"
    >
      <VideoPlayer
        src={isCorrect ? './videos/2_QUIZ_REPONSE_TRUTH.mp4' : './videos/2_QUIZ_REPONSE_FALSE.mp4'}
        onEnded={onEnded}
        className="bg-black"
      />
    </motion.div>
  );
};

export default ResultFeedbackScreen;
