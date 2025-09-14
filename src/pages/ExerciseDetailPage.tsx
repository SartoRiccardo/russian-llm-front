import { useParams } from 'react-router';
import withAuthLoading from '@/components/hoc/withAuthLoading';

/**
 * A page to display details for a specific exercise, currently not implemented.
 */
const ExerciseDetailPage = () => {
  const { id } = useParams();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Exercise {id} - Not Implemented Yet
        </h1>
        <p className="text-gray-600">
          This exercise page is under development. Please check back later!
        </p>
      </div>
    </div>
  );
};

const AuthenticatedExerciseDetailPage = withAuthLoading(ExerciseDetailPage);

export default AuthenticatedExerciseDetailPage;
