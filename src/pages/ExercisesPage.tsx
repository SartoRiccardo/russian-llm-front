import { useEffect, useState } from 'react';
import { getExercises } from '@/services/russian-llm-api';
import type { IExercisesApiResponse } from '@/types/exercises';
import { useAuth } from '@/hooks/useAuth';
import { ServerError, UnauthorizedError } from '@/types/errors';
import ExerciseGroup from '@/components/other/ExerciseGroup';
import withAuthLoading from '@/components/hoc/withAuthLoading';
import ErrorMessage from '@/components/ui/ErrorMessage';

/**
 * The main page for browsing exercises.
 * It fetches the list of exercise types and exercises from the API
 * and displays them, grouped by type.
 */
const ExercisesPage = () => {
  const [data, setData] = useState<IExercisesApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { logout } = useAuth();

  useEffect(() => {
    const controller = new AbortController();
    let loaded = false;
    let retryTimeout: ReturnType<typeof setTimeout>;

    const fetchExercises = async () => {
      try {
        const response = await getExercises(controller.signal);
        loaded = true;
        setData(response);
        setError(null);
      } catch (err) {
        if (err instanceof UnauthorizedError) {
          logout('/exercises');
        } else if (err instanceof ServerError) {
          setError('Something went wrong on the server');
        } else if (
          !(err instanceof DOMException && err.name === 'AbortError')
        ) {
          // Network or other error
          retryTimeout = setTimeout(fetchExercises, 2000);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchExercises();

    return () => {
      if (!loaded) controller.abort();
      clearTimeout(retryTimeout);
    };
  }, [logout]);

  if (isLoading) {
    return <div>Loading exercises...</div>;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">Exercises</h1>
      <div>
        {data?.types.map((type) => (
          <ExerciseGroup
            key={type.id}
            type={type}
            exercises={data.exercises.filter((ex) => ex.type === type.id)}
          />
        ))}
      </div>
    </div>
  );
};

const AuthenticatedExercisesPage = withAuthLoading(ExercisesPage);

export default AuthenticatedExercisesPage;
