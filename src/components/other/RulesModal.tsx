import GrammarRules from './GrammarRules';
import type { IWordRule } from '@/types/main';

interface IRulesModalProps {
  rules: IWordRule[];
  highlightedRuleIds: number[];
  title: string;
  onClose: () => void;
  onBack: () => void;
}

/**
 * Modal to display grammar rules.
 */
export default function RulesModal({
  rules,
  highlightedRuleIds,
  title,
  onClose,
  onBack,
}: IRulesModalProps) {
  return (
    <div data-cy="rules-modal">
      <div className="flex justify-between items-center mb-4">
        <button
          data-cy="modal-back-button"
          onClick={onBack}
          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
        >
          &lt; Back
        </button>
        <h2 className="text-xl font-bold">{title}</h2>
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        >
          X
        </button>
      </div>
      <GrammarRules
        rules={rules}
        highlightedRuleIds={highlightedRuleIds}
        title={title}
      />
    </div>
  );
}
