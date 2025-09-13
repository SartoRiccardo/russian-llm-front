import { useState, useCallback, useRef } from 'react';
import { getWords } from '@/services/russian-llm-api';
import type { IWord } from '@/types/words';

/**
 * A hook to manage and provide words data.
 */
export default function useWords() {
  const [words, setWords] = useState<IWord[]>([]);
  const [pages, setPages] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const lastFetchId = useRef<{ [key: number]: number }>({});

  const fetchWords = useCallback(async (page: number): Promise<boolean> => {
    const currentFetchId = Math.random();
    lastFetchId.current[page] = currentFetchId;

    setIsLoading(true);
    let notStale = false;
    try {
      const data = await getWords(page);
      if (lastFetchId.current[page] === currentFetchId) {
        setWords((prev) => [...prev, ...data.words]);
        setPages(data.pages);
      }
    } catch (err: unknown) {
      if (lastFetchId.current[page] === currentFetchId) {
        throw err;
      }
    } finally {
      if (lastFetchId.current[page] === currentFetchId) {
        notStale = lastFetchId.current[page] === currentFetchId;
        delete lastFetchId.current[page];
        setIsLoading(false);
      }
    }

    return notStale;
  }, []);

  return {
    words,
    pages,
    isLoading,
    fetchWords,
  };
}
