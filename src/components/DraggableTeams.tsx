import React from 'react';
import { motion } from 'motion/react';
import type { Team, Question } from '../types';

interface DraggableTeamsProps {
  teams: Team[];
  question: Question;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onResponse: (zoneIndex: number, teamIndex: number) => void;
}

export const DraggableTeams: React.FC<DraggableTeamsProps> = ({
  teams,
  question,
  containerRef,
  onResponse,
}) => {
  return (
    <div className="absolute inset-0 bg">
      {/* Visual debug zones */}
      <div className="absolute inset-0 pointer-events-none">
        {question.zones.map((zone) => (
          <div
            key={zone.id}
            className="absolute border-2 border-dashed border-white/5 rounded-3xl"
            style={{
              left: `${zone.x}px`,
              top: `${zone.y}px`,
              width: `${zone.w}px`,
              height: `${zone.h}px`,
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 pointer-events-none">
        {teams.map((_, index) => (
          <motion.div
            key={`colonne-${index}`}
            initial={{
              y: 800,
              opacity: 0,
              scale: 0.9
            }}
            animate={{
              y: 350,
              opacity: 1,
              scale: 1
            }}
            transition={{
              type: 'spring',
              stiffness: 70,
              damping: 12,
              delay: index * 0.4,
              duration: 1.5
            }}
            className={`fixed bottom-0 ${index === 0 ? 'left-10' : 'right-10'}`}
          >
            <img
              src={`./images/colonne_inter_${index + 1}.png`}
              className="w-32 h-auto "
              alt=""
            />
          </motion.div>
        ))}
      </div>


      {/* Team Avatars to Drag */}
      <div className="absolute inset-0 flex justify-between items-center px-10 pointer-events-none z-50">
        {teams.map((_team, teamIdx) => (
          <motion.div
            key={teamIdx}
            drag
            dragConstraints={containerRef}
            dragElastic={0.05}
            dragSnapToOrigin
            whileDrag={{ scale: 1.3, zIndex: 100, rotate: teamIdx === 0 ? -5 : 5 }}
            onDragEnd={(_, info) => {
              const screenX = info.point.x; // / window.innerWidth;
              const screenY = info.point.y; // / window.innerHeight;

              question.zones.forEach((zone, zIdx) => {
                if (
                  screenX >= zone.x &&
                  screenX <= zone.x + zone.w &&
                  screenY >= zone.y &&
                  screenY <= zone.y + zone.h
                ) {
                  onResponse(zIdx, teamIdx);
                }
              });
            }}
            style={{ touchAction: 'none' }}
            className='pointer-events-auto w-32 h-32 flex items-center justify-center cursor-grab active:cursor-grabbing'
          >
            <img className="w-24 pointer-events-none select-none" src={`./images/logo_team_fill_${teamIdx + 1}.png`} draggable={false} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};
