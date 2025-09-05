import { useState } from 'react';
import Modal from '../ui/Modal';
import GrammarRules from './GrammarRules';
import type { IWordSubcategory } from '@/types/main';

interface IWordSubcategoryProps {
  subcategory: IWordSubcategory;
  category: string;
}

/**
 * Component to display a word subcategory.
 * Clicking on it opens a modal with the grammar rules.
 */
export default function WordSubcategory({
  subcategory,
  category,
}: IWordSubcategoryProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div
        data-cy={`subcategory-${subcategory.id}`}
        className="flex justify-between items-center py-1 cursor-pointer"
        onClick={() => setShowModal(true)}
      >
        <span>{subcategory.id}</span>
        <span>{subcategory.mastery}/4</span>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <h3 className="text-xl font-bold mb-4">
          {category} - {subcategory.id}
        </h3>
        <GrammarRules rules={subcategory.rules} />
      </Modal>
    </>
  );
}
