import { motion } from 'motion/react';

interface ResetButtonProps {
  onClick: () => void;
}

export const ResetButton = ({ onClick }: ResetButtonProps) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="pointer-events-auto focus:outline-none
               bg-white/10 backdrop-blur-md border border-white/20 px-12 py-4 rounded-full
               text-white text-3xl font-bold italic tracking-wider shadow-2xl
               hover:bg-white/20 transition-colors"
  >
    RELANCE
  </motion.button>
);

export default ResetButton;
