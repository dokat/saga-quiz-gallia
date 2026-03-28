import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface CountdownScreenProps {
  onStartQuestion: () => void;
}

const CountdownScreen = ({ onStartQuestion }: CountdownScreenProps) => {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count === 0) {
      onStartQuestion();
      return;
    }

    const timer = setTimeout(() => {
      setCount((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [count, onStartQuestion]);

  return (
    <motion.div
      key="countdown"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex items-center justify-center bg-black/80 z-50"
    >
      <AnimatePresence mode="wait">
        {count > 0 && (
          <motion.div
            key={count}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="text-white text-9xl font-bold"
          >
            {count}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CountdownScreen;
