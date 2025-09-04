import type { IWordRule } from '@/types/main';

interface IGrammarRulesProps {
  rules: IWordRule[];
  highlightedRuleIds?: number[];
  title: string;
}

/**
 * Component to display a list of grammar rules.
 */

/* Pass category and subcategory id as separate props */
export default function GrammarRules({
  rules,
  highlightedRuleIds = [],
  title,
}: IGrammarRulesProps) {
  const sortedRules = [...rules].sort((a, b) => {
    const aIsHighlighted = highlightedRuleIds.includes(a.id);
    const bIsHighlighted = highlightedRuleIds.includes(b.id);
    if (aIsHighlighted && !bIsHighlighted) {
      return -1;
    }
    if (!aIsHighlighted && bIsHighlighted) {
      return 1;
    }
    return 0;
  });

  return (
    <div data-cy="grammar-rules">
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <ul>
        {sortedRules.map((rule) => (
          <li
            key={rule.id}
            data-cy="rule-item"
            className={`p-2 my-1 border rounded ${
              highlightedRuleIds.includes(rule.id) ? 'bg-yellow-200' : ''
            }`}
          >
            {rule.rule}
          </li>
        ))}
      </ul>
    </div>
  );
}
