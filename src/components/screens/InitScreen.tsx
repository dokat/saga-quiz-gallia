import { motion } from 'motion/react';

interface InitScreenProps {
  onStart: () => void;
}

export const InitScreen = ({ onStart }: InitScreenProps) => {
  return (
    <motion.div
      key="init"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className=" bg-zinc-900 flex w-full h-full inset-0 z-50 flex-col items-center justify-center cursor-pointer select-none touch-none gap-20"
      onClick={onStart}
    >
      <div className="text-white/10 text-9xl font-black uppercase tracking-widest animate-pulse">
        QUIZ
      </div>
      <div className="px-16 py-8 rounded-full bg-white/10 backdrop-blur-xl border-4 border-white/20 text-white font-black text-3xl uppercase tracking-[0.2em] hover:bg-white/20 hover:scale-105 transition-all shadow-[0_0_50px_rgba(255,255,255,0.1)]">
        Lancer l'application
      </div>
    </motion.div>
  );
};

export default InitScreen;
