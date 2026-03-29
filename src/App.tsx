/// <reference types="vite/client" />
import { useCallback, useEffect, useRef, useState } from 'react';
import type { GameState, Team, Question } from './types';
import InitScreen from './components/screens/InitScreen';
import WaitingScreen from './components/screens/WaitingScreen';
import { TeamUI } from './components/TeamUI';
import CountdownScreen from './components/screens/CountdownScreen';
import { motion } from 'motion/react';
import VideoPlayer from './components/VideoPlayer';
import { DraggableTeams } from './components/DraggableTeams';
import ResultFeedbackScreen from './components/screens/ResultFeedbackScreen';

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
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [lastResult, setLastResult] = useState<'TRUE' | 'FALSE' | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // fetch(`${basePath}questions.json`)
    fetch(`./questions.json`)
      .then((res) => res.json())
      .then((data) => setQuestions(data as Question[]))
      .catch((err) => console.error('Failed to load questions:', err));
  }, []);

  const resetGame = useCallback(() => {
    setTeams((prev) => prev.map((t) => ({ ...t, score: 0 })));
    setCurrentQuestionIdx(0);
    setGameState('COUNTDOWN');
  }, []);

  const handleQuestionTitleEnded = useCallback(() => {
    setGameState('QUESTION');
  }, []);

  const handleQuestionEnded = useCallback(() => {
    setGameState('RESPONSE');
  }, []);

  const handleResponse = useCallback(
    (zoneIndex: number, teamIndex: number) => {
      const question = questions[currentQuestionIdx];
      const isCorrect = zoneIndex === question.correctAnswerIndex;

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
    [currentQuestionIdx, questions]
  );

  const handleResultFeedbackEnded = useCallback(() => {
    if (lastResult === 'TRUE') {
      setGameState('ANSWER_VIDEO');
    } else {
      setGameState('RESPONSE');
    }
  }, [lastResult, currentQuestionIdx, questions.length]);

  const handleAnswerVideoEnded = useCallback(() => {
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx((idx) => idx + 1);
      setGameState('COUNTDOWN');
    } else {
      console.log('fin');
    }
  }, [currentQuestionIdx, questions.length]);

  if (questions.length === 0) {
    return <div className="w-screen h-screen bg-zinc-900" />;
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-zinc-900 overflow-hidden select-none touch-none"
    >
      {/* Global persistent UI layer */}
      {(gameState === 'COUNTDOWN' || gameState === 'QUESTION_TITLE') && <TeamUI teams={teams} />}

      {/* 0. INIT STATE */}
      {gameState === 'INIT' && <InitScreen onStart={() => setGameState('WAITING')} />}

      {/* 1. WAITING STATE */}
      {gameState === 'WAITING' && <WaitingScreen onStart={resetGame} />}

      {/* 2. TITLE STATE */}
      {gameState === 'COUNTDOWN' && (
        <CountdownScreen onStartQuestion={() => setGameState('QUESTION_TITLE')} />
      )}

      {/* 3. QUESTION TITLE STATE */}
      {gameState === 'QUESTION_TITLE' && (
        <motion.div
          key="question-title-cycle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-0"
        >
          <VideoPlayer
            src={`./${questions[currentQuestionIdx].titleVideoUrl}`}
            onEnded={handleQuestionTitleEnded}
          />
        </motion.div>
      )}

      {/* 4. QUESTION & RESPONSE STATE */}
      {(gameState === 'QUESTION' || gameState === 'RESPONSE') && (
        <motion.div
          key="question-cycle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-0"
        >
          <VideoPlayer
            src={`./${questions[currentQuestionIdx].questionVideoUrl}`}
            onEnded={handleQuestionEnded}
          />

          {/* Draggable Interaction Layer */}
          {gameState === 'RESPONSE' && (
            <DraggableTeams
              teams={teams}
              question={questions[currentQuestionIdx]}
              containerRef={containerRef}
              onResponse={handleResponse}
            />
          )}
        </motion.div>
      )}

      {/* 5. RESULT FEEDBACK STATE */}
      {gameState === 'RESULT_FEEDBACK' && (
        <ResultFeedbackScreen
          isCorrect={lastResult === 'TRUE'}
          onEnded={handleResultFeedbackEnded}
        />
      )}

      {/* 6. ANSWER VIDEO STATE */}
      {gameState === 'ANSWER_VIDEO' && (
        <motion.div
          key="answer-video"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-0"
        >
          <VideoPlayer
            src={`./${questions[currentQuestionIdx].answerVideoUrl}`}
            onEnded={handleAnswerVideoEnded}
          />
        </motion.div>
      )}
    </div>
  );
}

export default App;
