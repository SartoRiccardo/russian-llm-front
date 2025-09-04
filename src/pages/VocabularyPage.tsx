import { useEffect, useState } from 'react';
import { useStats } from '@/hooks/useStats';
import WordSkill from '@/components/other/WordSkill';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { UnauthorizedError, ServerError } from '@/types/errors';
import type { IWordSkillSchema } from '@/types/main';
import { useToast } from '@/hooks/useToast';
import { useAuth } from '@/hooks/useAuth';

/**
 * Vocabulary page component.
 * Displays the user's word skills.
 */
export default function VocabularyPage() {
  const { wordSkills, isLoadingStats, loadStats } = useStats();
  const { createToast } = useToast();
  const { logout } = useAuth();
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const doLoadStats = async () => {
      try {
        await loadStats();
      } catch (err) {
        setError(err as Error);
      }
    };
    doLoadStats();
  }, [loadStats]);

  // Handle the error directly inside the catch
  if (error) {
    if (error instanceof UnauthorizedError) {
      logout('/vocabulary');
      return null;
    }
    if (error instanceof ServerError) {
      createToast({
        id: 'vocab-server-error',
        title: 'Server Error',
        content: 'Error fetching data, retrying...',
        type: 'ERROR',
        dataCy: 't-vocab-server-error',
      });
    } else {
      return <ErrorMessage message="Something went wrong" />;
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Vocabulary</h1>
      {isLoadingStats && !wordSkills.length ? (
        <div>Loading...</div>
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
