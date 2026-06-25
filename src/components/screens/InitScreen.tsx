import { motion } from 'motion/react';
import { useAppModeContext } from '../../contexts/AppModeContext';
import { useVideoFormat } from '../../hooks/useVideoFormat';

interface InitScreenProps {
  onStart: () => void;
  onConnectSerial?: () => void;
  serialConnected?: boolean;
  isSerialSupported?: boolean;
  serialPortName?: string | null;
}

const scenarioNames = [
  "SCENARIO DEGUSTATION",
  "SCENARIO QUIZ IPA + DEGUSTATION",
  "SCENARIO QUIZ BIERE + QUIZ GALLIA + QUIZ IPA + DEGUSTATION",
]

export const InitScreen = ({
  onStart,
  onConnectSerial,
  serialConnected,
  isSerialSupported,
  serialPortName,
}: InitScreenProps) => {
  const { appMode, setAppMode, debugMode, setDebugMode, setNumScenario } = useAppModeContext();
  const { videoFormat } = useVideoFormat();
  return (
    <motion.div
      key="init"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className=" bg-zinc-900 flex w-full h-full inset-0 z-50 flex-col items-center justify-center select-none touch-none gap-20"
    >
      <img
        src={`./images/${videoFormat}/ecran_logo.png`}
        className="absolute inset-0 w-full h-full object-cover z-0"
        alt="Logo"
      />
      <div className="flex flex-col gap-8 z-10 w-1/2 items-center ">
        {[1, 2, 3].map((scenario) => (
          <button
            key={scenario}
            onClick={(e) => {
              e.stopPropagation();
              setNumScenario(scenario);
              onStart();
            }}
            className="w-full px-12 py-6 cursor-pointer rounded-full bg-black/40 backdrop-blur-md border-4 border-white/20 text-white font-black text-2xl uppercase tracking-[0.2em] hover:bg-black/40 hover:scale-105 transition-all shadow-[0_0_50px_rgba(0,0,0,0.5)] drop-shadow-xl"
          >{scenarioNames[scenario - 1]}
          </button>
        ))}
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

        <div className="flex items-center gap-8 bg-white/50 p-4 rounded-3xl border border-white/10 backdrop-blur-md shadow-2xl">
          {/* Input Mode Selector */}
          <div className="flex flex-col gap-2">
            <span className="text-secondary text-[10px] font-black uppercase tracking-widest text-center">
              Mode de jeu
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setAppMode('TOUCHSCREEN')}
                className={`px-6 py-3 rounded-xl font-black uppercase tracking-wider transition-all text-sm ${appMode === 'TOUCHSCREEN'
                  ? 'bg-white text-secondary shadow-xl scale-105'
                  : 'text-secondary/40 hover:text-secondary/70 hover:bg-white/5'
                  }`}
              >
                Tactile
              </button>
              <button
                onClick={() => setAppMode('BUZZER')}
                className={`px-6 py-3 rounded-xl font-black uppercase tracking-wider transition-all text-sm  text-secondary flex items-center gap-2 ${appMode === 'BUZZER'
                  ? 'bg-yellow-500 text-white shadow-xl scale-105'
                  : 'text-secondary hover:text-secondary hover:bg-white/5'
                  }`}
              >
                Buzzer{serialConnected && serialPortName ? ` (${serialPortName})` : ''}
                {appMode === 'BUZZER' && serialConnected && (
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                )}
              </button>
            </div>
          </div>

          <div className="w-px h-12 bg-white/10" />

          {/* Debug Mode Toggle */}
          <div className="flex flex-col gap-2">
            <span className="text-secondary text-[10px] font-black uppercase tracking-widest text-center">
              Debug
            </span>
            <button
              onClick={() => setDebugMode(!debugMode)}
              className={`px-6 py-3 rounded-xl font-black uppercase tracking-wider transition-all text-sm ${debugMode
                ? 'bg-orange-500 text-white shadow-xl scale-105'
                : 'text-secondary hover:bg-white/5'
                }`}
            >
              {debugMode ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default InitScreen;
