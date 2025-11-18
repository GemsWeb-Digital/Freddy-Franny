import React from 'react';
import { EMERGENCY_NUMBER_DISPLAY, CITY_NAME } from '../constants';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 bg-navy text-white shadow-lg rounded-b-3xl px-4 py-4 mb-8">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 text-center sm:text-left">
        <div>
          <h1 className="text-2xl font-bold text-yellow-400">Freddy & Franny</h1>
          <p className="text-sm opacity-90">Learn Fire Safety in {CITY_NAME}</p>
        </div>
        <div className="bg-redAccent px-4 py-2 rounded-xl animate-pulse">
          <p className="text-xs font-bold uppercase tracking-wider">Emergency</p>
          <p className="text-xl font-bold font-mono">{EMERGENCY_NUMBER_DISPLAY}</p>
        </div>
      </div>
    </header>
  );
};