import { Sequence } from '../types';

/**
 * Shuffles an array using the Fisher-Yates algorithm (returns a new array).
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Prepares the game sequences based on the selected scenario.
 * - For Scenarios 1, 2, 3: returns raw sequences as-is.
 * - For Scenario 4: return random array of questions
 */
export function prepareSequences(rawSequences: Sequence[], numScenario: number): Sequence[] {
  if (numScenario !== 4 || rawSequences.length === 0) {
    return rawSequences;
  }

  const firstSequence = rawSequences[0];
  const selectedQuestions = shuffleArray(firstSequence.questions);

  return [
    {
      ...firstSequence,
      questions: selectedQuestions,
    },
  ];
}
