import { motion } from 'motion/react';
import VideoPlayer from '../VideoPlayer';
import { useState } from 'react';
import type { Team } from '../../types';
import { FinalTeamScore } from '../FinalTeamScore';

interface FinalScoreScreenProps {
    teams: Team[];
    onClick: () => void;
}

export const FinalScoreScreen = ({ onClick, teams }: FinalScoreScreenProps) => {
    const [showScore, setShowScore] = useState(false);

    return (
        <>
            {showScore && <FinalTeamScore teams={teams} />}
            <motion.div
                key="final-score"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-0 bg-black flex items-center justify-center cursor-pointer"
                onClick={onClick}
            >
                <VideoPlayer
                    src="./videos/SCORES_FINAL_ON.mp4"
                    onEnded={() => setShowScore(true)}
                />
            </motion.div>
        </>
    )
}
