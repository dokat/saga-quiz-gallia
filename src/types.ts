export type GameState =
  | 'INIT' // Initial state to handle autoplay policy
  | 'WAITING' // Initial waiting video
  | 'COUNTDOWN' // Countdown before showing question
  | 'SEQUENCE_TITLE' // Playing sequence title video
  | 'QUESTION_TITLE' // Playing question title video
  | 'QUESTION' // Playing question video
  | 'RESPONSE' // Video ended, waiting for drag & drop
  | 'RESULT_FEEDBACK' // Playing True or False video
  | 'ANSWER_VIDEO' // Playing the actual answer video
  | 'INTERMEDIATE_SCORE' // Showing score between questions
  | 'SCORE_SCREEN' // Final score screen
  | 'FIN'; // Final degustation video before reset

export type LastResult = 'TRUE' | 'FALSE' | null;

export interface Sequence {
  sequence: string;
  questions: Question[];
}

export interface Question {
  correctAnswerIndex: number | number[]; // 0-3
  zones?: {
    id: string;
    label: string;
    // Normalized coordinates (0-1) for 4 zones on screen
    x: number;
    y: number;
    w: number;
    h: number;
  }[];
}

export interface Team {
  name: string;
  score: number;
  color: string;
}
