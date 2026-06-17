import { motion } from 'framer-motion';
import VideoPlayer from '../VideoPlayer';
import { useVideoFormatContext } from '../../contexts/VideoFormatContext';

interface ResultFeedbackScreenProps {
  isCorrect: boolean;
  onEnded: () => void;
}

const ResultFeedbackScreen = ({ isCorrect, onEnded }: ResultFeedbackScreenProps) => {
  const { videoFormat } = useVideoFormatContext();
  return (
    <motion.div
      key="result"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50"
    >
      <VideoPlayer
        src={
          isCorrect
            ? `./videos/${videoFormat}/2_QUIZ_REPONSE_TRUTH.mp4`
            : `./videos/${videoFormat}/2_QUIZ_REPONSE_FALSE.mp4`
        }
        onEnded={onEnded}
        className="bg-black"
      />
    </motion.div>
  );
};

export default ResultFeedbackScreen;
