import { useState, useMemo } from 'react';
import type { IWord } from '@/types/words';
import WordItem from './WordItem';

interface IWordCategoryProps {
  category: string;
  words: IWord[];
}

/**
 * A component that displays a category of words.
 */
export default function WordCategory({ category, words }: IWordCategoryProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const averageWinPercent = useMemo(() => {
    const nonLockedWords = words.filter((word) => !word.locked);
    if (nonLockedWords.length === 0) return 0;
    const totalWinPercent = nonLockedWords.reduce(
      (acc, word) =>
        acc +
        word.variants.reduce((acc, v) => acc + v.win_percent, 0) /
          word.variants.length,
      0,
    );
    return totalWinPercent / nonLockedWords.length;
  }, [words]);

  const sortedWords = useMemo(() => {
    return [...words].sort((a, b) => {
      if (a.locked !== b.locked) {
        return a.locked ? 1 : -1;
      }
      const aWin =
        a.variants.reduce((acc, v) => acc + v.win_percent, 0) /
        a.variants.length;
      const bWin =
        b.variants.reduce((acc, v) => acc + v.win_percent, 0) /
        b.variants.length;
      if (aWin !== bWin) {
        return bWin - aWin;
      }
      return a.word_en.localeCompare(b.word_en);
    });
  }, [words]);

  return (
    <div data-cy="word-category" className="mb-4">
      <div
        className="flex justify-between items-center p-4 bg-gray-100 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="text-xl font-bold">{category}</h2>
        <div className="text-lg">{Math.round(averageWinPercent * 100)}%</div>
      </div>
      {isExpanded && (
        <div className="p-4 border border-t-0 border-gray-200">
          {sortedWords.map((word) => (
            <WordItem key={word.word_en} word={word} />
          ))}
        </div>
      )}
    </div>
  );
}
