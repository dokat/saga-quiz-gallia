import { motion } from 'motion/react';

interface InitScreenProps {
  onStart: () => void;
  onConnectSerial?: () => void;
  serialConnected?: boolean;
  isSerialSupported?: boolean;
  appMode: 'TOUCHSCREEN' | 'BUZZER';
  setAppMode: (mode: 'TOUCHSCREEN' | 'BUZZER') => void;
  serialPortName?: string | null;
  videoFormat: '16_9' | '16_10';
  setVideoFormat: (format: '16_9' | '16_10') => void;
}

export const InitScreen = ({
  onStart,
  onConnectSerial,
  serialConnected,
  isSerialSupported,
  appMode,
  setAppMode,
  serialPortName,
  videoFormat,
  setVideoFormat,
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
      <div className="px-16 py-8 rounded-full bg-white/10 backdrop-blur-xl border-4 border-white/20 text-white font-black text-3xl uppercase tracking-[0.2em] hover:bg-white/20 hover:scale-105 transition-all shadow-[0_0_50px_rgba(255,255,255,0.1)]">
        Lancer l'application
      </div>

      {/* Configurations & Controls Panel */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-6 z-[100]"
      >
        {/* Serial Connect Button (only shown if BUZZER mode is selected and not connected) */}
        {appMode === 'BUZZER' && isSerialSupported && !serialConnected && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={(e) => {
              e.stopPropagation();
              onConnectSerial?.();
            }}
            className="px-6 py-3 rounded-full bg-green-500 text-white font-bold hover:bg-green-400 transition-all shadow-lg animate-bounce"
          >
            Connecter l'Arduino (Série)
          </motion.button>
        )}

        <div className="flex items-center gap-8 bg-white/5 p-4 rounded-3xl border border-white/10 backdrop-blur-md shadow-2xl">
          {/* Input Mode Selector */}
          <div className="flex flex-col gap-2">
            <span className="text-white/40 text-[10px] font-black uppercase tracking-widest text-center">
              Mode de jeu
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setAppMode('TOUCHSCREEN')}
                className={`px-6 py-3 rounded-xl font-black uppercase tracking-wider transition-all text-sm ${
                  appMode === 'TOUCHSCREEN'
                    ? 'bg-white text-zinc-900 shadow-xl scale-105'
                    : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                }`}
              >
                Tactile
              </button>
              <button
                onClick={() => setAppMode('BUZZER')}
                className={`px-6 py-3 rounded-xl font-black uppercase tracking-wider transition-all text-sm flex items-center gap-2 ${
                  appMode === 'BUZZER'
                    ? 'bg-yellow-500 text-white shadow-xl scale-105'
                    : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                }`}
              >
                Buzzer{serialConnected && serialPortName ? ` (${serialPortName})` : ''}
                {appMode === 'BUZZER' && serialConnected && (
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                )}
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="w-[1px] h-12 bg-white/15" />

          {/* Video Format Selector */}
          <div className="flex flex-col gap-2">
            <span className="text-white/40 text-[10px] font-black uppercase tracking-widest text-center">
              Format vidéo
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setVideoFormat('16_9')}
                className={`px-6 py-3 rounded-xl font-black uppercase tracking-wider transition-all text-sm ${
                  videoFormat === '16_9'
                    ? 'bg-white text-zinc-900 shadow-xl scale-105'
                    : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                }`}
              >
                16/9
              </button>
              <button
                onClick={() => setVideoFormat('16_10')}
                className={`px-6 py-3 rounded-xl font-black uppercase tracking-wider transition-all text-sm ${
                  videoFormat === '16_10'
                    ? 'bg-white text-zinc-900 shadow-xl scale-105'
                    : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                }`}
              >
                16/10
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default InitScreen;
