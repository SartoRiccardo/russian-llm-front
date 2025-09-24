import type { IWordVariant } from '@/types/words';
import { useStats } from '@/hooks/useStats';
import type { IWordRule, IWordSubcategory } from '@/types/main';

interface IWordVariantProps {
  type: string;
  variant: IWordVariant;
  onShowRules: (rules: IWordRule[], ruleIds: number[]) => void;
}

/**
 * Displays a single word variant with its details and a button to show associated rules.
 */
export default function WordVariant({
  type,
  variant,
  onShowRules,
}: IWordVariantProps) {
  const { wordSkills } = useStats();
  const hasRules = variant.rules && variant.rules.length > 0;

  const getRulesForVariant = (): IWordRule[] => {
    const skill = wordSkills.find((s) => s.id === type);
    if (!skill) return [];
    const subcategory = skill.subcategories.find(
      (sc: IWordSubcategory) => sc.id === variant.subcategory,
    );
    if (!subcategory) return [];
    return subcategory.rules;
  };

  return (
    <div
      data-cy="variant-item"
      className="p-2 border-b border-gray-200 last:border-b-0"
    >
      <div className="flex justify-between items-center">
        <div>
          <span className="font-semibold">{variant.word_ru}</span> (
          {variant.name})
        </div>
        {hasRules && wordSkills.length && (
          <button
            data-cy="variant-rules-button"
            onClick={() => onShowRules(getRulesForVariant(), variant.rules)}
            className="ml-4 p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Rules
          </button>
        )}
      </div>
      <div className="text-sm text-gray-600">
        Group: {variant.group}, Subcategory: {variant.subcategory}
      </div>
      <div className="text-sm text-gray-600">
        Win Percent: {Math.round(variant.win_percent * 100)}%
      </div>
    </div>
  );
}
