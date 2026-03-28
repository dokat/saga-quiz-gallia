export type GameState =
  | 'INIT' // Initial state to handle autoplay policy
  | 'WAITING' // Initial waiting video
  | 'COUNTDOWN' // Countdown before showing question
  | 'QUESTION_TITLE' // Playing question title video
  | 'QUESTION' // Playing question video
  | 'RESPONSE' // Video ended, waiting for drag & drop
  | 'RESULT_FEEDBACK' // Playing True or False video
  | 'ANSWER_VIDEO'; // Playing the actual answer video

export interface Question {
  id: string;
  titleVideoUrl: string;
  questionVideoUrl: string;
  answerVideoUrl: string;
  correctAnswerIndex: number; // 0-3
  zones: {
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
