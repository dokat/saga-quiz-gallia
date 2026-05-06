import { motion } from 'motion/react';
import VideoPlayer from '../VideoPlayer';
import { useState } from 'react';
import { TeamUI } from '../TeamUI';
import type { Team } from '../../types';

interface IntermediateScoreScreenProps {
    teams: Team[];
    onClick: () => void;
}

export const IntermediateScoreScreen = ({ onClick, teams }: IntermediateScoreScreenProps) => {
    const [showScore, setShowScore] = useState(false);

    return (
        <>
            {showScore && <TeamUI teams={teams} />}
            <motion.div
                key="intermediate-score"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-0 bg-black flex items-center justify-center cursor-pointer"
                onClick={onClick}
            >
                <VideoPlayer
                    src="./videos/SCORES_JEU.mp4"
                    onEnded={() => setShowScore(true)}
                />
            </motion.div>
        </>
    )
}   