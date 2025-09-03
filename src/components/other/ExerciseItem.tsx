import { Link } from 'react-router';
import type { IExerciseOverview } from '@/types/exercises';

interface IExerciseItemProps {
  exercise: IExerciseOverview;
}

/**
 * A component that displays a single exercise overview.
 * It shows the exercise name, description, and mastery level.
 * If the exercise is locked, it is not clickable.
 * @param {IExerciseItemProps} props The props for the component.
 * @returns A React component.
 */
const ExerciseItem = ({ exercise }: IExerciseItemProps) => {
  const content = (
    <div
      className={`p-4 border rounded-lg shadow-sm ${
        exercise.locked
          ? 'bg-gray-200 cursor-not-allowed'
          : 'bg-white hover:shadow-md'
      }`}
      data-cy={`exercise-${exercise.id}`}
      data-cy-type={exercise.type}
      data-locked={exercise.locked}
      title={exercise.locked ? 'This component is locked.' : undefined}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">{exercise.name}</h3>
        <span className="font-mono">Mastery: {exercise.mastery}</span>
      </div>
      {exercise.description && (
        <p className="text-sm text-gray-600 mt-2">{exercise.description}</p>
      )}
    </div>
  );

  if (exercise.locked) {
    return content;
  }

  return <Link to={`/exercises/${exercise.id}`}>{content}</Link>;
};

export default ExerciseItem;
