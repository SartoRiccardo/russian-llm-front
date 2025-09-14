import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { useStats } from '@/hooks/useStats';
import { useAuth } from '@/hooks/useAuth';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { UnauthorizedError, ServerError } from '@/types/errors';
import type { ISkillSchema } from '@/types/main';
import withAuthLoading from '@/components/hoc/withAuthLoading';

/**
 * Stats page component.
 * Displays the user's language skills.
 */
function StatsPage() {
  const { languageSkills, isLoadingStats, loadStats } = useStats();
  const { logout } = useAuth();
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let retryTimout: ReturnType<typeof setTimeout> | null = null;

    const doLoadStats = async () => {
      try {
        await loadStats();
        setError(null);
      } catch (err) {
        const error = err as Error;
        if (error instanceof UnauthorizedError) {
          logout('/stats');
          return;
        }
        if (error instanceof ServerError) {
          setError(error);
          return;
        }
        // Network error, retry
        retryTimout = setTimeout(doLoadStats, 2000);
      }
    };

    doLoadStats();

    return () => {
      if (retryTimout) clearTimeout(retryTimout);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (error) {
    return <ErrorMessage message="Something went wrong on the server" />;
  }

  if (isLoadingStats && !languageSkills.length) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Stats</h1>
      <div
        data-cy="skill-list"
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {languageSkills.map((skill: ISkillSchema) => (
          <div
            key={skill.id}
            data-cy="skill-item"
            className="p-4 border rounded-lg"
          >
            <h2 className="text-xl font-semibold">{skill.id}</h2>
            <p className="text-lg">{skill.mastery}</p>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <Link
          to="/vocabulary"
          data-cy="words-link"
          className="text-blue-500 hover:underline"
        >
          View Vocabulary
        </Link>
      </div>
    </div>
  );
}

const AuthenticatedStatsPage = withAuthLoading(StatsPage);

export default AuthenticatedStatsPage;
