import { motion } from 'motion/react';

interface InitScreenProps {
  onStart: () => void;
  onConnectSerial?: () => void;
  serialConnected?: boolean;
  isSerialSupported?: boolean;
  appMode: 'TOUCHSCREEN' | 'BUZZER';
  setAppMode: (mode: 'TOUCHSCREEN' | 'BUZZER') => void;
}

export const InitScreen = ({ 
  onStart, 
  onConnectSerial, 
  serialConnected, 
  isSerialSupported,
  appMode,
  setAppMode
}: InitScreenProps) => {
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
      
      {/* Input Mode Selector */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/10 backdrop-blur-md">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setAppMode('TOUCHSCREEN');
          }}
          className={`px-8 py-4 rounded-xl font-black uppercase tracking-wider transition-all ${
            appMode === 'TOUCHSCREEN'
              ? 'bg-white text-zinc-900 shadow-xl scale-105'
              : 'text-white/40 hover:text-white/70 hover:bg-white/5'
          }`}
        >
          Tactile
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setAppMode('BUZZER');
          }}
          className={`px-8 py-4 rounded-xl font-black uppercase tracking-wider transition-all flex items-center gap-3 ${
            appMode === 'BUZZER'
              ? 'bg-yellow-500 text-white shadow-xl scale-105'
              : 'text-white/40 hover:text-white/70 hover:bg-white/5'
          }`}
        >
          Buzzer
          {appMode === 'BUZZER' && serialConnected && (
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          )}
        </button>
      </div>

      {/* Serial Connect Button (only shown if BUZZER mode is selected and not connected) */}
      {appMode === 'BUZZER' && isSerialSupported && !serialConnected && (
        <motion.button 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={(e) => {
            e.stopPropagation();
            onConnectSerial?.();
          }}
          className="absolute bottom-32 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full bg-green-500 text-white font-bold hover:bg-green-400 transition-all shadow-lg animate-bounce"
        >
          Connecter l'Arduino (Série)
        </motion.button>
      )}
    </motion.div>
  );
};

export default InitScreen;
