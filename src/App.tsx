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
import NextButton from './components/NextButton';

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
  const [appMode, setAppMode] = useState<'TOUCHSCREEN' | 'BUZZER'>('BUZZER');
  const [visibleTeams, setVisibleTeams] = useState<boolean[]>([true, true]);

  useEffect(() => {
    if (appMode === 'BUZZER' && gameState === 'RESPONSE') {
      setVisibleTeams([false, false]);
    } else {
      setVisibleTeams([true, true]);
    }
  }, [gameState, appMode]);

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
        handleAddScore(teamIndex);
      }
    },
    [currentSequenceIdx, currentQuestionIdx, sequences]
  );

  const handleAddScore = useCallback((teamIndex: number) => {
    setTeams((prev) => {
      const newTeams = [...prev];
      newTeams[teamIndex] = { ...newTeams[teamIndex], score: newTeams[teamIndex].score + 1 };
      return newTeams;
    });
  }, []);

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
    setGameState('FIN');
  }, []);

  const handleStartApp = useCallback(() => {
    console.log('Starting app in ', appMode);
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    }
    setGameState('WAITING');
  }, []);

  const restartApp = useCallback(() => {
    setTeams((prev) => prev.map((t) => ({ ...t, score: 0 })));
    setCurrentSequenceIdx(0);
    setCurrentQuestionIdx(0);
    setGameState('INIT');
  }, []);

  const lastClickTime = useRef<number>(0);
  const handleRestartClick = useCallback(() => {
    const now = Date.now();
    if (now - lastClickTime.current < 300) {
      restartApp();
    }
    lastClickTime.current = now;
  }, [restartApp]);

  // Handle hardware inputs (Keyboard & Serial)
  const handleHardwareInput = useCallback((key: string) => {
    console.log('Hardware input received:', key);
    console.log('Game state:', gameState);
    console.log('App mode:', appMode);
    console.log('Visible teams:', visibleTeams);

    // Map keys to game actions here based on gameState
    if (gameState === 'RESPONSE' && appMode === 'BUZZER') {
      const lowerKey = key.toLowerCase();
      let zoneIndex = -1;
      if (lowerKey.includes('a')) zoneIndex = 0;
      else if (lowerKey.includes('b')) zoneIndex = 1;
      else if (lowerKey.includes('c')) zoneIndex = 2;
      else if (lowerKey.includes('d')) zoneIndex = 3;
      else if (lowerKey.includes('e')) zoneIndex = 4;
      else if (lowerKey.includes('f')) zoneIndex = 5;
      // If a team has already buzzed in (at least one is visible)
      if (visibleTeams.includes(true)) {
        if (zoneIndex !== -1) {
          const answeringTeamIndex = visibleTeams.indexOf(true);
          handleResponse(zoneIndex, answeringTeamIndex);
          return;
        }
        console.log('A team has already buzzed in, ignoring non-answer input.');
        return;
      }

      if (key.includes('1')) {
        console.log('Team 1 selected');
        setVisibleTeams([true, false]);
        return;
      } else if (key.includes('2')) {
        console.log('Team 2 selected');
        setVisibleTeams([false, true]);
        return;
      }
    }
  }, [gameState, visibleTeams, appMode, handleResponse]);

  const { connectSerial, serialConnected, isSerialSupported, serialPortName } = useHardwareInput(handleHardwareInput, appMode);

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
          serialPortName={serialPortName}
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
          {gameState === 'QUESTION' ? (
            <VideoPlayer
              src={`./videos/QUIZ_${globalQuestionIdx + 1}_QUESTION.mp4`}
              onEnded={handleQuestionEnded}
              loop={false}
            />
          ) : (
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              src={`./images/QUIZ_${globalQuestionIdx + 1}_QUESTION_last.jpg`}
              className="absolute inset-0 w-full h-full object-cover"
              alt=""
            />
          )}

          {gameState === 'RESPONSE' && (
            <>
              <DraggableTeams
                teams={teams}
                question={sequences[currentSequenceIdx].questions[currentQuestionIdx]}
                containerRef={containerRef}
                onResponse={handleResponse}
                addScore={handleAddScore}
                visibleTeams={visibleTeams}
                appMode={appMode}
              />
              {(!sequences[currentSequenceIdx].questions[currentQuestionIdx].zones ||
                sequences[currentSequenceIdx].questions[currentQuestionIdx].zones.length === 0) && (
                  <NextButton onClick={handleIntermediateScoreEnded} />
                )}
            </>
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

      {/* 10. FINAL VIDEO STATE */}
      {gameState === 'FIN' && (
        <motion.div
          key="final-video"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-0"
        >
          <VideoPlayer
            src="./videos/0_MERCI.mp4"
            onEnded={() => setGameState('WAITING')}
          />
        </motion.div>
      )}

      {/* Invisible restart button (200x200 px, top-left) */}
      <button
        onClick={handleRestartClick}
        onDoubleClick={restartApp}
        className="absolute top-0 left-0 w-[200px] h-[200px] bg-transparent border-none outline-none cursor-default z-[9999] pointer-events-auto"
        aria-label="Restart Application"
      />
    </div>
  );
}

export default App;
