import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import type { Question, Zones } from '../types';
import { useVideoFormatContext } from '../contexts/VideoFormatContext';
import { useTeamsContext } from '../contexts/TeamsContext';
import { useAppModeContext } from '../contexts/AppModeContext';

interface DraggableTeamsProps {
  question: Question;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onResponse: (zoneIndex: number, teamIndex: number) => void;
  visibleTeams: boolean[];
  zones: Zones;
}

export const DraggableTeams: React.FC<DraggableTeamsProps> = ({
  question,
  containerRef,
  onResponse,
  visibleTeams,
  zones,
}) => {
  const { videoFormat, adjustZone } = useVideoFormatContext();
  const { teams, addScore } = useTeamsContext();
  const { appMode } = useAppModeContext();
  const [displayAvatar, setDisplayAvatar] = useState(false);

  const currentZones = zones[videoFormat][question.numberOfQuestions];

  useEffect(() => {
    const hasVisibleTeam = visibleTeams.some((v) => v);
    if (!hasVisibleTeam) {
      setDisplayAvatar(false);
    }
  }, [visibleTeams]);

  return (
    <div className="absolute inset-0 bg">
      {/* Visual debug zones */}
      {/* {currentZones && (
        <div className="absolute inset-0 pointer-events-none">
          {Object.values(currentZones).map((zone, zIdx) => {
            const adjustedZone = adjustZone(zone);
            return (
              <div
                key={zIdx}
                className="absolute border-2 border-dashed border-red/5 rounded-3xl"
                style={{
                  left: `${adjustedZone.x}px`,
                  top: `${adjustedZone.y}px`,
                  width: `${adjustedZone.w}px`,
                  height: `${adjustedZone.h}px`,
                }}
              />
            );
          })}
        </div>
      )} */}

      <div className="absolute inset-0 pointer-events-none">
        {teams.map((_, index) => {
          if (!visibleTeams[index]) return null;
          return (
            <motion.div
              key={`colonne-${index}`}
              initial={{
                y: 800,
                opacity: 0,
                scale: 0.9,
              }}
              animate={{
                y: adjustZone({ x: 0, y: videoFormat === '16_10' ? 180 : 320, w: 0, h: 0 }).y,
                opacity: 1,
                scale: 1,
              }}
              transition={{
                type: 'spring',
                stiffness: 70,
                damping: 12,
                delay: appMode === 'BUZZER' ? 0 : index * 0.4,
                duration: 1.5,
              }}
              className={`fixed bottom-0 ${index === 0 ? 'left-10' : 'right-10'}`}
              onAnimationComplete={(_e) => {
                const maxVisibleIndex = visibleTeams.reduce(
                  (max, isVis, idx) => (isVis ? idx : max),
                  -1
                );
                if (index === maxVisibleIndex) setDisplayAvatar(true);
              }}
            >
              <img
                src={`./images/${videoFormat}/colonne_inter_${index + 1}.png`}
                className="w-32 h-auto "
                alt=""
              />
            </motion.div>
          );
        })}
      </div>

      {question.numberOfQuestions !== 4 && (
        <div className="absolute inset-0 flex justify-between items-center px-10 pointer-events-none z-0">
          {teams.map((team, teamIdx) => {
            return (
              <motion.div
                key={teamIdx}
                initial={{
                  y: 800,
                  opacity: 0,
                  scale: 0.9,
                }}
                animate={{
                  y: 100,
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 70,
                  damping: 12,
                  delay: appMode === 'BUZZER' ? 0 : teamIdx * 0.4,
                  duration: 1.5,
                }}
                drag={false}
                style={{
                  touchAction: 'none',
                  visibility: visibleTeams[teamIdx] ? 'visible' : 'hidden',
                }}
                className="pointer-events-auto w-32 h-32 flex items-center justify-center cursor-grab active:cursor-grabbing text-8xl font-black text-white italic"
              >
                <div>{team.score}</div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Team Avatars to Drag */}
      {displayAvatar && (
        <div className="absolute inset-0 flex justify-between items-center px-10 pointer-events-none z-50">
          {teams.map((_team, teamIdx) => {
            return (
              <motion.div
                key={teamIdx}
                drag={question.numberOfQuestions === 4}
                dragConstraints={containerRef}
                dragElastic={0.05}
                dragSnapToOrigin
                whileDrag={{ scale: 1.3, zIndex: 100, rotate: teamIdx === 0 ? -5 : 5 }}
                onDragEnd={(_, info) => {
                  const screenX = info.point.x; // / window.innerWidth;
                  const screenY = info.point.y; // / window.innerHeight;

                  if (question.numberOfQuestions !== 4) return;
                  Object.values(currentZones).forEach((zone, zIdx) => {
                    const adjustedZone = adjustZone(zone);
                    if (
                      screenX >= adjustedZone.x &&
                      screenX <= adjustedZone.x + adjustedZone.w &&
                      screenY >= adjustedZone.y &&
                      screenY <= adjustedZone.y + adjustedZone.h
                    ) {
                      onResponse(zIdx, teamIdx);
                    }
                  });
                }}
                onTap={() => {
                  if (question.numberOfQuestions !== 4) addScore(teamIdx);
                }}
                style={{
                  touchAction: 'none',
                  visibility: visibleTeams[teamIdx] ? 'visible' : 'hidden',
                }}
                className="pointer-events-auto w-32 h-32 flex items-center justify-center cursor-grab active:cursor-grabbing"
              >
                <img
                  className="w-24 pointer-events-none select-none"
                  src={`./images/${videoFormat}/logo_team_fill_${teamIdx + 1}.png`}
                  draggable={false}
                />
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
