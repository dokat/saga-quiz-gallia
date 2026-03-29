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
  console.log(questions);

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
      console.log(teamIndex, ' --> ', zoneIndex);
    },
    [teams, currentQuestionIdx]
  );

  if (questions.length === 0) {
    return <div className="w-screen h-screen bg-zinc-900" />;
  }

  //TEST

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

      {/* 5. SCORE STATE */}
    </div>
  );
}

export default App;
