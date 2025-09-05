import { useState } from 'react';
import type { IWord } from '@/types/words';
import WordVariant from './WordVariant';
import RulesModal from './RulesModal';
import type { IWordRule } from '@/types/main';

interface IWordInfoModalProps {
  word: IWord;
  onClose: () => void;
}

/**
 * Modal to display detailed information about a word, including its variants.
 */
export default function WordInfoModal({ word, onClose }: IWordInfoModalProps) {
  const [selectedRuleInfo, setSelectedRuleInfo] = useState<{
    rules: IWordRule[];
    ruleIds: number[];
    title: string;
  } | null>(null);

  const handleShowRules = (
    rules: IWordRule[],
    ruleIds: number[],
    title: string,
  ) => {
    setSelectedRuleInfo({ rules, ruleIds, title });
  };

  const handleBackToVariants = () => {
    setSelectedRuleInfo(null);
  };

  return (
    <div data-cy="word-info-modal">
      {selectedRuleInfo ? (
        <RulesModal
          rules={selectedRuleInfo.rules}
          highlightedRuleIds={selectedRuleInfo.ruleIds}
          title={selectedRuleInfo.title}
          onClose={onClose}
          onBack={handleBackToVariants}
        />
      ) : (
        <div data-cy="word-group">
          <h2 className="text-xl font-bold mb-4">
            {word.word_ru} - {word.word_en}
          </h2>
          {word.variants.map((variant, index) => (
            <WordVariant
              key={index}
              type={word.type}
              variant={variant}
              onShowRules={handleShowRules}
            />
          ))}
        </div>
      )}
    </div>
  );
}
