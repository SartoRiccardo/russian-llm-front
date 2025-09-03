import type { IExerciseType, IExerciseOverview } from '@/types/exercises';
import ExerciseItem from './ExerciseItem';

interface IExerciseGroupProps {
  type: IExerciseType;
  exercises: IExerciseOverview[];
}

/**
 * A component that displays a group of exercises for a specific type.
 * It shows the type's name and description, followed by a list of exercises.
 * @param {IExerciseGroupProps} props The props for the component.
 * @returns A React component.
 */
const ExerciseGroup = ({ type, exercises }: IExerciseGroupProps) => {
  return (
    <div className="mb-8" data-cy="exercise-container">
      <h2 className="text-2xl font-bold border-b pb-2 mb-4">{type.name}</h2>
      {type.description && (
        <p className="text-lg text-gray-700 mb-4">{type.description}</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {exercises.map((exercise) => (
          <ExerciseItem key={exercise.id} exercise={exercise} />
        ))}
      </div>
    </div>
  );
};

export default ExerciseGroup;
