import React from 'react';
import { Header } from './components/Header';
import { ChapterSpotDanger } from './components/ChapterSpotDanger';
import { ChapterStopDropRoll } from './components/ChapterStopDropRoll';
import { ChapterEmergencyNumber } from './components/ChapterEmergencyNumber';
import { ChapterMaze } from './components/ChapterMaze';
import { ChapterFunDay } from './components/ChapterFunDay';
import { Certificate } from './components/Certificate';
import { Footer } from './components/Footer';

function App() {
  return (
    <div className="min-h-screen font-sans selection:bg-redAccent selection:text-white pb-10">
      <Header />
      
      <main className="max-w-3xl mx-auto px-4 space-y-8">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-navy mb-2">Welcome, Future Firefighter!</h2>
          <p className="text-lg text-gray-700">Complete the training chapters below to earn your certificate.</p>
        </div>

        <ChapterSpotDanger />
        <ChapterStopDropRoll />
        <ChapterEmergencyNumber />
        <ChapterMaze />
        <ChapterFunDay />
        <Certificate />
      </main>

      <Footer />
    </div>
  );
}

export default App;