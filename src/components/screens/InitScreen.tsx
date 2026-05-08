import { motion } from 'motion/react';

interface InitScreenProps {
  onStart: () => void;
  onConnectSerial?: () => void;
  serialConnected?: boolean;
  isSerialSupported?: boolean;
}

export const InitScreen = ({ onStart, onConnectSerial, serialConnected, isSerialSupported }: InitScreenProps) => {
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
      
      {isSerialSupported && (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onConnectSerial?.();
          }}
          className={`absolute bottom-8 right-8 px-6 py-3 rounded-full font-bold transition-all shadow-lg ${
            serialConnected 
              ? 'bg-green-500/20 text-green-400 border-2 border-green-500/50' 
              : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10 hover:text-white'
          }`}
        >
          {serialConnected ? 'Arduino Connecté (Série)' : 'Connecter Arduino (Série)'}
        </button>
      )}
    </motion.div>
  );
};

export default InitScreen;
