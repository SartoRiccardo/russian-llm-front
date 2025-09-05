import { useEffect, useState, useMemo, useRef } from 'react';
import useWords from '@/hooks/useWords';
import { useStats } from '@/hooks/useStats';
import { useAuth } from '@/hooks/useAuth';
import { UnauthorizedError, ServerError } from '@/types/errors';
import WordCategory from '@/components/vocabulary/WordCategory';
import Loader from '@/components/ui/Loader';
import ErrorMessage from '@/components/ui/ErrorMessage';
import type { IWord } from '@/types/words';
import type { IWordSkillSchema } from '@/types/main';
import WordSkill from '@/components/vocabulary/WordSkill';

/**
 * Vocabulary page component.
 * Displays the user's words, grouped by category.
 */
export default function VocabularyPage() {
  const { words, pages, fetchWords, isLoading: isLoadingWords } = useWords();
  const { wordSkills, isLoadingStats, loadStats } = useStats();
  const { logout } = useAuth();
  const [statsError, setStatsError] = useState<Error | null>(null);
  const [wordsError, setWordsError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const fetchWordsRetryTimeout = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  // Stats fetching logic
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
      if (fetchWordsRetryTimeout.current)
        clearTimeout(fetchWordsRetryTimeout.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const groupedWords = useMemo(() => {
    return words.reduce(
      (acc, word) => {
        if (!acc[word.category]) {
          acc[word.category] = [];
        }
        acc[word.category].push(word);
        return acc;
      },
      {} as Record<string, IWord[]>,
    ) as Record<string, IWord[]>;
  }, [words]);

  const handleLoadMore = async () => {
    if (isLoadingWords || (pages !== null && currentPage >= pages)) return;

    const doFetchWords = async (page: number) => {
      try {
        await fetchWords(page);
        setCurrentPage((prev) => prev + 1);
        setWordsError(null);
      } catch (err: unknown) {
        const error = err as Error;
        if (error instanceof UnauthorizedError) {
          logout('/vocabulary');
          return;
        }
        if (error instanceof ServerError) {
          setWordsError(error);
        } else {
          // Network error
          fetchWordsRetryTimeout.current = setTimeout(
            () => doFetchWords(page),
            2000,
          );
        }
      }
    };

    doFetchWords(currentPage + 1);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Vocabulary</h1>
      {/* Display Stats */}
      {isLoadingStats && !wordSkills.length && !statsError ? (
        <div>Loading stats...</div>
      ) : statsError ? (
        <div data-cy="vocabulary-stats-error">
          <ErrorMessage message="Error fetching vocabulary stats." />
        </div>
      ) : (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Word Skills</h2>
          {wordSkills.map((skill: IWordSkillSchema) => (
            <WordSkill key={skill.id} skill={skill} />
          ))}
        </div>
      )}

      {/* Display Words */}
      <h2 className="text-2xl font-bold mb-4">Words</h2>
      {Object.entries(groupedWords).map(([category, words]) => (
        <WordCategory key={category} category={category} words={words} />
      ))}
      {(pages === null || currentPage < pages) && (
        <Loader key={currentPage} onVisible={handleLoadMore}>
          Loading...
        </Loader>
      )}
      {wordsError && (
        <div data-cy="words-error-message" className="text-red-500">
          Error loading words
        </div>
      )}
    </div>
  );
}
