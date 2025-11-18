import React, { useState } from 'react';
import { EMERGENCY_NUMBER, EMERGENCY_NUMBER_DISPLAY } from '../constants';
import { Button } from './Button';
import { Modal } from './Modal';

export const ChapterEmergencyNumber: React.FC = () => {
  const [inputVal, setInputVal] = useState('');
  const [modal, setModal] = useState({ open: false, title: '', message: '', type: 'info' as 'success' | 'error' | 'info' });

  const playNumber = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance("The emergency number for Windhoek is Zero Six One, Two One One, One One One One.");
      window.speechSynthesis.speak(utterance);
    }
  };

  const showNumber = () => {
    setModal({
      open: true,
      title: "Emergency Number",
      message: `The number is: ${EMERGENCY_NUMBER_DISPLAY}`,
      type: 'info'
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = inputVal.replace(/[^0-9]/g, '');
    
    if (cleanInput === EMERGENCY_NUMBER) {
      setModal({
        open: true,
        title: "Correct!",
        message: `You remembered! ${EMERGENCY_NUMBER_DISPLAY} is the number for the Windhoek Fire Brigade.`,
        type: 'success'
      });
    } else {
      setModal({
        open: true,
        title: "Try Again",
        message: "That's not quite right. Listen to the hint or peek at the number, then try again!",
        type: 'error'
      });
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-xl border-4 border-navy/10 mt-8">
      <h2 className="text-3xl font-bold text-navy mb-4">Chapter 3: Who do we call?</h2>
      <p className="mb-4 text-lg">If there is a fire, we need to call the Windhoek Fire Brigade. Can you remember the number?</p>

      <div className="flex flex-col items-center gap-6">
        <div className="flex flex-wrap justify-center gap-4">
          <button 
            onClick={playNumber}
            className="text-navy font-bold flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-navy/10 transition-colors"
          >
            <span>🔊 Listen to Number</span>
          </button>
          <button 
            onClick={showNumber}
            className="text-navy font-bold flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-navy/10 transition-colors"
          >
            <span>👀 Show Number</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-4">
          <input 
            type="tel" 
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="061-..." 
            className="w-full text-center text-3xl tracking-widest font-mono p-4 border-2 border-navy rounded-xl focus:outline-none focus:ring-4 focus:ring-redAccent/30"
          />
          <Button type="submit" variant="secondary" className="w-full">Check Number</Button>
        </form>
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