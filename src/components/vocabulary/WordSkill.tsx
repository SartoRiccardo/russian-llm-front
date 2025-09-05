import { useState } from 'react';
import WordSubcategory from './WordSubcategory';
import type { IWordSkillSchema, IWordSubcategory } from '@/types/main';

interface IWordSkillProps {
  skill: IWordSkillSchema;
}

/**
 * Component to display a word skill and its subcategories.
 */
export default function WordSkill({ skill }: IWordSkillProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div data-cy="word-skill" className="border-b py-2">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="text-xl font-semibold">{skill.id}</h2>
        <span className="text-lg">{skill.mastery}/4</span>
      </div>
      {isExpanded && (
        <div data-cy="subcategory-section" className="mt-4 pl-4">
          {skill.subcategories.map((subcategory: IWordSubcategory) => (
            <WordSubcategory
              key={subcategory.id}
              subcategory={subcategory}
              category={skill.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
