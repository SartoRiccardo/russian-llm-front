type ExerciseId = 'alphabet' | 'grammar' | 'vocabulary';

/**
 * Represents a single exercise overview.
 */
export interface IExerciseOverview {
  id: string;
  name: string;
  description: string | null;
  type: ExerciseId;
  mastery: number;
  locked: boolean;
  sort_order: number;
}

/**
 * Represents a type or category of exercises.
 */
export interface IExerciseType {
  id: ExerciseId;
  name: string;
  description: string | null;
}

/**
 * Represents the successful response structure for the GET /exercises API call.
 */
export interface IExercisesApiResponse {
  types: IExerciseType[];
  exercises: IExerciseOverview[];
}
