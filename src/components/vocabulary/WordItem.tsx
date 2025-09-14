import { useState, useMemo } from 'react';
import type { IWord } from '@/types/words';
import Modal from '@/components/ui/Modal';
import WordInfoModal from './WordInfoModal';

interface IWordItemProps {
  word: IWord;
}

/**
 * Displays a single word with its translation and an info button.
 */
export default function WordItem({ word }: IWordItemProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const averageWinPercent = useMemo(() => {
    if (!word.variants || word.variants.length === 0) {
      return 0;
    }
    const totalWinPercent = word.variants.reduce(
      (sum, variant) => sum + variant.win_percent,
      0,
    );
    return totalWinPercent / word.variants.length;
  }, [word.variants]);

  return (
    <div
      data-cy="word-item"
      className="flex justify-between items-center p-2 border-b border-gray-200 last:border-b-0"
    >
      <div className="flex items-center">
        <span data-cy="word-ru" className="font-semibold">
          {word.word_ru}
        </span>{' '}
        - <span data-cy="word-en">{word.word_en}</span>
        <span className="ml-2 text-sm text-gray-500">
          ({Math.round(averageWinPercent * 100)}%)
        </span>
      </div>
      <button
        data-cy="word-info-button"
        onClick={() => setIsModalOpen(true)}
        className="ml-4 p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        i
      </button>

      <Modal show={isModalOpen} onHide={() => setIsModalOpen(false)}>
        <WordInfoModal word={word} onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}
