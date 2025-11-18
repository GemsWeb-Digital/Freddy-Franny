import React, { useState } from 'react';
import { HAZARDS } from '../constants';
import { Button } from './Button';
import { Modal } from './Modal';

export const ChapterSpotDanger: React.FC = () => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [modal, setModal] = useState({ open: false, title: '', message: '', type: 'info' as 'success' | 'error' | 'info' });

  const toggleSelection = (id: number) => {
    if (isSubmitted) return;
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const checkAnswers = () => {
    setIsSubmitted(true);
    const allCorrect = HAZARDS.every(h => selectedIds.includes(h.id));
    if (allCorrect) {
      setModal({
        open: true,
        title: "Great Job!",
        message: "You spotted all the fire dangers! Always tell an adult if you see these things.",
        type: 'success'
      });
    } else {
      setModal({
        open: true,
        title: "Almost there!",
        message: "Look closely! There are more dangers hidden in the list.",
        type: 'info'
      });
    }
  };

  const reset = () => {
    setSelectedIds([]);
    setIsSubmitted(false);
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-xl border-4 border-navy/10">
      <h2 className="text-3xl font-bold text-navy mb-4">Chapter 1: Spot the Danger</h2>
      <p className="mb-6 text-lg">Help Freddy find the things that could start a fire. Tap on them!</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {HAZARDS.map((hazard) => {
          const isSelected = selectedIds.includes(hazard.id);
          // Logic: If submitted and it IS a danger, show green. If submitted and selected but NOT danger (not applicable here as all are dangers), show red.
          const borderColor = isSubmitted 
            ? 'border-greenSuccess bg-green-50' 
            : isSelected 
              ? 'border-redAccent bg-red-50' 
              : 'border-gray-200 hover:border-navy';

          return (
            <div 
              key={hazard.id}
              onClick={() => toggleSelection(hazard.id)}
              className={`cursor-pointer border-4 rounded-xl p-4 flex items-center gap-4 transition-all ${borderColor}`}
            >
              <span className="text-4xl">{hazard.icon}</span>
              <span className="font-bold text-lg">{hazard.label}</span>
              {isSubmitted && <span className="ml-auto text-greenSuccess text-2xl">✓</span>}
            </div>
          );
        })}
      </div>

      <div className="flex gap-4 justify-center">
        {!isSubmitted ? (
          <Button onClick={checkAnswers} disabled={selectedIds.length === 0}>Check Answers</Button>
        ) : (
          <Button onClick={reset} variant="secondary">Play Again</Button>
        )}
      </div>

      <Modal 
        isOpen={modal.open} 
        title={modal.title} 
        message={modal.message} 
        type={modal.type} 
        onClose={() => setModal({ ...modal, open: false })} 
      />
    </div>
  );
};