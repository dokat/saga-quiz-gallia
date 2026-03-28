import React from 'react';
import { Users } from 'lucide-react';
import { motion } from 'motion/react';
import type { Team, Question } from '../types';
import { cn } from '../utils/cn';

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
    <div className="absolute inset-0">
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

      {/* Team Avatars to Drag */}
      <div className="absolute inset-0 flex justify-between items-center px-8 pointer-events-none z-50">
        {teams.map((team, teamIdx) => (
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
            className={cn(
              'pointer-events-auto w-32 h-32 rounded-3xl flex flex-col items-center justify-center cursor-grab active:cursor-grabbing shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] border-4 border-white/30',
              team.color
            )}
          >
            <Users className="text-white w-12 h-12 mb-2" />
            <span className="text-[10px] text-white font-black uppercase tracking-widest">
              {team.name}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
