import { motion } from 'motion/react';
import { useVideoFormatContext } from '../../contexts/VideoFormatContext';
import { useTeamsContext } from '../../contexts/TeamsContext';

interface IntermediateScoreScreenProps {
  onClick: () => void;
}

export const IntermediateScoreScreen = ({ onClick }: IntermediateScoreScreenProps) => {
  const { videoFormat, adjustZone, scaleSize } = useVideoFormatContext();
  const { teams } = useTeamsContext();

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
        <img
          src={`./images/${videoFormat}/SCORES_JEU.jpg`}
          className="pointer-events-none select-none w-full h-full object-cover"
          alt=""
          draggable={false}
        />
      </motion.div>
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
            className="fixed flex flex-col items-center"
            style={{
              bottom: `${adjustZone({ x: 0, y: 0, w: 0, h: videoFormat === '16_10' ? 205 : 146 }).h}px`,
              ...(index === 0
                ? { left: `${adjustZone({ x: 500, y: 0, w: 0, h: 0 }).x}px` }
                : { right: `${adjustZone({ x: 500, y: 0, w: 0, h: 0 }).x}px` }),
            }}
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
              style={{ fontSize: scaleSize(96) }}
            >
              {teams[index].score}
            </motion.div>
            <img
              src={`./images/${videoFormat}/colonne_final_${index + 1}.png`}
              style={{ width: scaleSize(128) }}
              className="h-auto pointer-events-none select-none"
              alt=""
              draggable={false}
            />
          </motion.div>
        ))}
      </div>
    </>
  );
};
