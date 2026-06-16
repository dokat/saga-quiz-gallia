import { motion } from 'motion/react';
import VideoPlayer from '../VideoPlayer';
import { useState } from 'react';
import type { Team } from '../../types';

interface IntermediateScoreScreenProps {
  teams: Team[];
  onClick: () => void;
  videoFormat: '16_9' | '16_10';
}

export const IntermediateScoreScreen = ({
  onClick,
  teams,
  videoFormat,
}: IntermediateScoreScreenProps) => {
  const [showScore, setShowScore] = useState(false);

  return (
    <>
      <motion.div
        key="intermediate-score"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 z-0 bg-black flex items-center justify-center cursor-pointer"
        onClick={onClick}
      >
        <VideoPlayer
          src={`./videos/${videoFormat}/SCORES_JEU.mp4`}
          onEnded={() => setShowScore(true)}
        />
      </motion.div>
      {showScore && (
        <div className="absolute inset-0 pointer-events-none z-10 ">
          {teams.map((_, index) => (
            <motion.div
              key={`colonne-${index}`}
              initial={{
                y: 300,
                opacity: 0,
                scale: 0.9,
              }}
              animate={{
                y: 0,
                opacity: 1,
                scale: 1,
              }}
              transition={{
                type: 'spring',
                stiffness: 70,
                damping: 12,
                delay: 0,
                duration: 1.5,
              }}
              className={`fixed bottom-[146px] ${index === 0 ? 'left-[500px]' : 'right-[500px]'} flex flex-col items-center`}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  delay: index * 0.4 + 1.2,
                  type: 'spring',
                  stiffness: 200,
                  damping: 15,
                }}
                className="text-8xl font-black text-white italic"
              >
                {teams[index].score}
              </motion.div>
              <img
                src={`./images/${videoFormat}/colonne_final_${index + 1}.png`}
                className="w-32 h-auto pointer-events-none select-none"
                alt=""
                draggable={false}
              />
            </motion.div>
          ))}
        </div>
      )}
    </>
  );
};
