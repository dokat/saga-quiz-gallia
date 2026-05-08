/// <reference types="vite/client" />
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { GameState, Team, Sequence } from './types';
import InitScreen from './components/screens/InitScreen';
import WaitingScreen from './components/screens/WaitingScreen';
import { motion } from 'motion/react';
import VideoPlayer from './components/VideoPlayer';
import { DraggableTeams } from './components/DraggableTeams';
import ResultFeedbackScreen from './components/screens/ResultFeedbackScreen';
import { IntermediateScoreScreen } from './components/screens/IntermediateScoreScreen';
import { FinalScoreScreen } from './components/screens/FinalScoreScreen';
import { useHardwareInput } from './hooks/useHardwareInput';

// const basePath = import.meta.env.BASE_URL.endsWith('/')
//   ? import.meta.env.BASE_URL
//   : `${import.meta.env.BASE_URL}/`;
// console.log('basePath ', basePath);

function App() {
  const [gameState, setGameState] = useState<GameState>('INIT');
  const [teams, setTeams] = useState<Team[]>([
    { name: 'Équipe 1', score: 0, color: 'bg-red-500' },
    { name: 'Équipe 2', score: 0, color: 'bg-blue-500' },
  ]);
  const [currentSequenceIdx, setCurrentSequenceIdx] = useState(0);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [currentAnswerVideoIdx, setCurrentAnswerVideoIdx] = useState(0);
  const [sequences, setSequences] = useState<Sequence[]>([]);
  const [lastResult, setLastResult] = useState<'TRUE' | 'FALSE' | null>(null);
  const [appMode, setAppMode] = useState<'TOUCHSCREEN' | 'BUZZER'>('TOUCHSCREEN');

  const containerRef = useRef<HTMLDivElement>(null);

  const globalQuestionIdx = useMemo(() => {
    let idx = 0;
    for (let i = 0; i < currentSequenceIdx; i++) {
      if (sequences[i]?.questions) {
        idx += sequences[i].questions.length;
      }
    }
    return idx + currentQuestionIdx;
  }, [currentSequenceIdx, currentQuestionIdx, sequences]);

  useEffect(() => {
    // fetch(`${basePath}questions.json`)
    fetch(`./questions.json`)
      .then((res) => res.json())
      .then((data) => setSequences(data as Sequence[]))
      .catch((err) => console.error('Failed to load sequences:', err));
  }, []);

  const resetGame = useCallback(() => {
    setTeams((prev) => prev.map((t) => ({ ...t, score: 0 })));
    setCurrentSequenceIdx(0);
    setCurrentQuestionIdx(0);
    setGameState('SEQUENCE_TITLE');
  }, []);

  const handleQuestionTitleEnded = useCallback(() => {
    setGameState('QUESTION');
  }, []);

  const handleQuestionEnded = useCallback(() => {
    setGameState('RESPONSE');
  }, []);

  const handleResponse = useCallback(
    (zoneIndex: number, teamIndex: number) => {
      const sequence = sequences[currentSequenceIdx];
      if (!sequence) return;

      const question = sequence.questions[currentQuestionIdx];
      const isCorrect = Array.isArray(question.correctAnswerIndex)
        ? question.correctAnswerIndex.includes(zoneIndex)
        : zoneIndex === question.correctAnswerIndex;

      setLastResult(isCorrect ? 'TRUE' : 'FALSE');
      setGameState('RESULT_FEEDBACK');

      if (isCorrect) {
        setTeams((prev) => {
          const newTeams = [...prev];
          newTeams[teamIndex] = { ...newTeams[teamIndex], score: newTeams[teamIndex].score + 1 };
          return newTeams;
        });
      }
    },
    [currentSequenceIdx, currentQuestionIdx, sequences]
  );

  const handleResultFeedbackEnded = useCallback(() => {
    if (lastResult === 'TRUE') {
      setCurrentAnswerVideoIdx(0);
      setGameState('ANSWER_VIDEO');
    } else {
      setGameState('RESPONSE');
    }
  }, [lastResult]);

  const handleAnswerVideoEnded = useCallback(() => {
    const question = sequences[currentSequenceIdx]?.questions[currentQuestionIdx];
    if (question && Array.isArray(question.correctAnswerIndex)) {
      if (currentAnswerVideoIdx < question.correctAnswerIndex.length - 1) {
        setCurrentAnswerVideoIdx((prev) => prev + 1);
        return;
      }
    }
    setGameState('INTERMEDIATE_SCORE');
  }, [currentSequenceIdx, currentQuestionIdx, currentAnswerVideoIdx, sequences]);

  const handleIntermediateScoreEnded = useCallback(() => {
    const sequence = sequences[currentSequenceIdx];
    if (!sequence) return;

    if (currentQuestionIdx < sequence.questions.length - 1) {
      setCurrentQuestionIdx((idx) => idx + 1);
      setGameState('QUESTION_TITLE');
    } else if (currentSequenceIdx < sequences.length - 1) {
      setCurrentSequenceIdx((idx) => idx + 1);
      setCurrentQuestionIdx(0);
      setGameState('SEQUENCE_TITLE');
    } else {
      setGameState('SCORE_SCREEN');
    }
  }, [currentSequenceIdx, currentQuestionIdx, sequences]);

  const handleScoreScreenEnded = useCallback(() => {
    setGameState('DEGUSTATION_VIDEO');
  }, []);

  const handleStartApp = useCallback(() => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    }
    setGameState('WAITING');
  }, []);

  // Handle hardware inputs (Keyboard & Serial)
  const handleHardwareInput = useCallback((key: string) => {
    console.log('Hardware input received:', key);

    // Map keys to game actions here based on gameState
    if (gameState === 'RESPONSE') {
      // Example Key Mapping:
      // Team 1 (index 0): 1=Zone 0, 2=Zone 1, 3=Zone 2, 4=Zone 3
      // Team 2 (index 1): q=Zone 0, w=Zone 1, e=Zone 2, r=Zone 3

      const team1Keys = ['1', '2', '3', '4'];
      const team2Keys = ['q', 'w', 'e', 'r'];

      if (team1Keys.includes(key)) {
        handleResponse(team1Keys.indexOf(key), 0);
      } else if (team2Keys.includes(key)) {
        handleResponse(team2Keys.indexOf(key), 1);
      }
    } else if (gameState === 'INIT' && key === ' ') {
      handleStartApp();
    } else if (gameState === 'WAITING' && key === ' ') {
      resetGame();
    } else if (gameState === 'SCORE_SCREEN' && key === ' ') {
      handleScoreScreenEnded();
    } else if (gameState === 'INTERMEDIATE_SCORE' && key === ' ') {
      handleIntermediateScoreEnded();
    }
  }, [gameState, handleResponse, handleStartApp, resetGame, handleScoreScreenEnded, handleIntermediateScoreEnded]);

  const { connectSerial, serialConnected, isSerialSupported } = useHardwareInput(handleHardwareInput, appMode);

  if (sequences.length === 0) {
    return <div className="w-screen h-screen bg-zinc-900" />;
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-zinc-900 overflow-hidden select-none touch-none"
    >
      {/* Global persistent UI layer */}
      {/* {(gameState === 'INTERMEDIATE_SCORE') && <TeamUI teams={teams} />} */}

      {/* 0. INIT STATE */}
      {gameState === 'INIT' && (
        <InitScreen
          onStart={handleStartApp}
          onConnectSerial={connectSerial}
          serialConnected={serialConnected}
          isSerialSupported={isSerialSupported}
          appMode={appMode}
          setAppMode={setAppMode}
        />
      )}

      {/* 1. WAITING STATE */}
      {gameState === 'WAITING' && <WaitingScreen onStart={resetGame} />}

      {/* 2. SEQUENCE TITLE STATE */}
      {gameState === 'SEQUENCE_TITLE' && (
        <motion.div
          key={`sequence-title-cycle-${currentSequenceIdx}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-0"
        >
          <VideoPlayer
            src={`./videos/${sequences[currentSequenceIdx].sequence}`}
            onEnded={() => setGameState('QUESTION_TITLE')}
          />
        </motion.div>
      )}

      {/* 3. QUESTION TITLE STATE */}
      {gameState === 'QUESTION_TITLE' && (
        <motion.div
          key={`question-title-cycle-${globalQuestionIdx}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-0"
        >
          <VideoPlayer
            src={`./videos/QUIZ_${globalQuestionIdx + 1}_TITRAGE.mp4`}
            onEnded={handleQuestionTitleEnded}
          />
        </motion.div>
      )}

      {/* 4 & 5. QUESTION AND RESPONSE STATE */}
      {(gameState === 'QUESTION' || gameState === 'RESPONSE') && (
        <motion.div
          key={`question-cycle-${globalQuestionIdx}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-0"
        >
          <VideoPlayer
            src={`./videos/QUIZ_${globalQuestionIdx + 1}_QUESTION.mp4`}
            onEnded={gameState === 'QUESTION' ? handleQuestionEnded : undefined}
            loop={false}
          />

          {gameState === 'RESPONSE' && appMode === 'TOUCHSCREEN' && (
            <DraggableTeams
              teams={teams}
              question={sequences[currentSequenceIdx].questions[currentQuestionIdx]}
              containerRef={containerRef}
              onResponse={handleResponse}
            />
          )}
        </motion.div>
      )}

      {/* 6. RESULT FEEDBACK STATE */}
      {gameState === 'RESULT_FEEDBACK' && (
        <ResultFeedbackScreen
          isCorrect={lastResult === 'TRUE'}
          onEnded={handleResultFeedbackEnded}
        />
      )}

      {/* 7. ANSWER VIDEO STATE */}
      {gameState === 'ANSWER_VIDEO' && (
        <motion.div
          key={`answer-video-${currentAnswerVideoIdx}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-0"
          onClick={handleAnswerVideoEnded}
        >
          <VideoPlayer
            src={
              Array.isArray(sequences[currentSequenceIdx]?.questions[currentQuestionIdx]?.correctAnswerIndex)
                ? `./videos/QUIZ_${globalQuestionIdx + 1}_REPONSE_${currentAnswerVideoIdx + 1}.mp4`
                : `./videos/QUIZ_${globalQuestionIdx + 1}_REPONSE.mp4`
            }
          />
        </motion.div>
      )}

      {/* 8. INTERMEDIATE SCORE STATE */}
      {gameState === 'INTERMEDIATE_SCORE' && (
        <IntermediateScoreScreen onClick={handleIntermediateScoreEnded} teams={teams} />
      )}

      {/* 9. FINAL SCORE STATE */}
      {gameState === 'SCORE_SCREEN' && (
        <FinalScoreScreen onClick={handleScoreScreenEnded} teams={teams} />
      )}

      {/* 10. DEGUSTATION VIDEO STATE */}
      {gameState === 'DEGUSTATION_VIDEO' && (
        <motion.div
          key="degustation-video"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-0"
        >
          <VideoPlayer
            src="./videos/4_TITRAGE_DEGUSTATION.mp4"
            onEnded={() => setGameState('WAITING')}
          />
        </motion.div>
      )}
    </div>
  );
}

export default App;
