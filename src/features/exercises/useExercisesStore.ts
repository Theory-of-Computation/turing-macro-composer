import { create } from "zustand";
import { persist } from "zustand/middleware";

type ExerciseKey =
  | "multipleChoice"
  | "matching"
  | "simulation"
  | "shortAnswer"
  | "codeQuiz";

interface ExerciseState {
  scores: Partial<Record<ExerciseKey, number>>;
  responses: Partial<Record<ExerciseKey, unknown>>;
  setScore: (key: ExerciseKey, score: number) => void;
  setResponse: (key: ExerciseKey, response: unknown) => void;
  reset: () => void;
}

export const useExercisesStore = create<ExerciseState>()(
  persist<ExerciseState>(
    (
      set: (
        fn:
          | ExerciseState
          | Partial<ExerciseState>
          | ((state: ExerciseState) => ExerciseState | Partial<ExerciseState>)
      ) => void
    ) => ({
      scores: {},
      responses: {},
      setScore: (key: ExerciseKey, score: number) =>
        set((state) => ({
          scores: { ...state.scores, [key]: score }
        })),
      setResponse: (key: ExerciseKey, response: unknown) =>
        set((state) => ({
          responses: { ...state.responses, [key]: response }
        })),
      reset: () => set({ scores: {}, responses: {} })
    }),
    {
      name: "tmc-exercises"
    }
  )
);

export const computeTotalScore = (scores: Partial<Record<ExerciseKey, number>>) => {
  const values = Object.values(scores);
  if (!values.length) return 0;
  const total = values.reduce((sum, value) => sum + (value ?? 0), 0);
  return Math.round((total / (values.length * 100)) * 100);
};
