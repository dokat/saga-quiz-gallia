import { motion } from 'motion/react';

interface NextButtonProps {
  onClick: () => void;
}

export const NextButton = ({ onClick }: NextButtonProps) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[60] pointer-events-auto
               bg-white/10 backdrop-blur-md border border-white/20 px-12 py-4 rounded-full
               text-white text-3xl font-bold italic tracking-wider shadow-2xl
               hover:bg-white/20 transition-colors"
  >
    SUIVANT
  </motion.button>
);

export default NextButton;
