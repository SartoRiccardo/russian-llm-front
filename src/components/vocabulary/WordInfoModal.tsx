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
  } | null>(null);

  const handleShowRules = (rules: IWordRule[], ruleIds: number[]) => {
    setSelectedRuleInfo({ rules, ruleIds });
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
          title={`${word.word_ru} - ${word.word_en}`}
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
              variant={variant}
              type={word.type}
              onShowRules={handleShowRules}
            />
          ))}
        </div>
      )}
    </div>
  );
}
