import React, { useState } from 'react';
import { STOP_DROP_ROLL_LYRICS } from '../constants';
import { Button } from './Button';

export const ChapterStopDropRoll: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSteps, setShowSteps] = useState(false);

  const playDemonstration = () => {
    if ('speechSynthesis' in window) {
      setIsPlaying(true);
      setShowSteps(true);
      
      const utterance = new SpeechSynthesisUtterance(STOP_DROP_ROLL_LYRICS);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      
      utterance.onend = () => {
        setIsPlaying(false);
      };
      
      window.speechSynthesis.speak(utterance);
    } else {
      // Fallback
      setShowSteps(true);
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-xl border-4 border-navy/10 mt-8">
      <h2 className="text-3xl font-bold text-navy mb-4">Chapter 2: If Clothes Catch Fire...</h2>
      <p className="mb-6 text-lg">Do not run! Running makes the fire bigger. Listen to the song and learn what to do.</p>

      <div className="flex flex-col items-center">
        <div className={`transition-all duration-500 ease-out overflow-hidden ${showSteps ? 'max-h-96 opacity-100 mb-6' : 'max-h-0 opacity-0'}`}>
           <div className="flex flex-col sm:flex-row gap-4 text-center">
              <div className="bg-red-100 p-4 rounded-xl flex-1 animate-pulse">
                <div className="text-5xl mb-2">🛑</div>
                <h3 className="text-xl font-bold text-redAccent">STOP</h3>
                <p>Don't run!</p>
              </div>
              <div className="bg-orange-100 p-4 rounded-xl flex-1 animate-pulse delay-150">
                <div className="text-5xl mb-2">⬇️</div>
                <h3 className="text-xl font-bold text-orange-600">DROP</h3>
                <p>Get on the ground.</p>
              </div>
              <div className="bg-green-100 p-4 rounded-xl flex-1 animate-pulse delay-300">
                <div className="text-5xl mb-2">🔄</div>
                <h3 className="text-xl font-bold text-greenSuccess">ROLL</h3>
                <p>Roll until fire is out.</p>
              </div>
           </div>
        </div>

        <Button onClick={playDemonstration} disabled={isPlaying} className="w-full sm:w-auto">
          {isPlaying ? "Listening..." : "🔊 Play the Song & Learn"}
        </Button>
      </div>
    </div>
  );
};