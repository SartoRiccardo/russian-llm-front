import { useEffect, useState, useCallback } from 'react';
import { useStats } from '@/hooks/useStats';
import WordSkill from '@/components/other/WordSkill';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { UnauthorizedError, ServerError } from '@/types/errors';
import type { IWordSkillSchema } from '@/types/main';
import { useAuth } from '@/hooks/useAuth';

/**
 * Vocabulary page component.
 * Displays the user's word skills.
 */
export default function VocabularyPage() {
  const { wordSkills, isLoadingStats, loadStats } = useStats();
  const { logout } = useAuth();
  const [statsError, setStatsError] = useState<Error | null>(null);

  useEffect(() => {
    let retryTimout: ReturnType<typeof setTimeout> | null = null;

    const doLoadStats = async () => {
      try {
        await loadStats();
        setStatsError(null);
      } catch (err) {
        const error = err as Error;
        if (error instanceof UnauthorizedError) {
          logout('/vocabulary');
          return;
        }
        if (error instanceof ServerError) {
          setStatsError(error);
        } else {
          // Network error
          retryTimout = setTimeout(doLoadStats, 2000);
        }
      }
    };

    doLoadStats();

    return () => {
      if (retryTimout) clearTimeout(retryTimout);
    };
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Vocabulary</h1>
      {isLoadingStats && !wordSkills.length && !statsError ? (
        <div>Loading...</div>
      ) : statsError ? (
        <div data-cy="vocabulary-stats-error">
          <ErrorMessage message="Error fetching vocabulary stats." />
        </div>
      ) : (
        <div>
          {wordSkills.map((skill: IWordSkillSchema) => (
            <WordSkill key={skill.id} skill={skill} />
          ))}
        </div>
      )}
    </div>
  );
}
