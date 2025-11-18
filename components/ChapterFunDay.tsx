import React, { useState, useRef, useEffect } from 'react';
import { MATCHING_ITEMS } from '../constants';
import { TileItem } from '../types';
import { Button } from './Button';
import { jsPDF } from 'jspdf';

// Helper to shuffle
const shuffle = (array: TileItem[]) => [...array].sort(() => Math.random() - 0.5);

export const ChapterFunDay: React.FC = () => {
  // --- Drag and Drop Matching Logic ---
  const [tiles, setTiles] = useState<TileItem[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Create 4 pairs (8 items total) for the matching game
    const pairs = [...MATCHING_ITEMS, ...MATCHING_ITEMS].map((item, i) => ({
      ...item,
      instanceId: i // unique key for React rendering
    }));
    setTiles(shuffle(pairs));
  }, []);

  useEffect(() => {
    // Check for win condition: All adjacent pairs (0-1, 2-3, etc.) must match
    if (tiles.length === 0) return;
    
    let matches = 0;
    for (let i = 0; i < tiles.length; i += 2) {
      if (tiles[i].id === tiles[i + 1].id) {
        matches++;
      }
    }
    
    if (matches === tiles.length / 2) {
      setIsComplete(true);
    } else {
      setIsComplete(false);
    }
  }, [tiles]);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    // Required for Firefox
    e.dataTransfer.effectAllowed = "move";
    // Create a drag image slightly offset if needed, default is usually fine
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault(); // Necessary to allow dropping
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    // Swap tiles
    const newTiles = [...tiles];
    const draggedTile = newTiles[draggedIndex];
    newTiles[draggedIndex] = newTiles[targetIndex];
    newTiles[targetIndex] = draggedTile;

    setTiles(newTiles);
    setDraggedIndex(null);
  };

  // --- Drawing Logic ---
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);

  const startDraw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.setPointerCapture(e.pointerId);
    setIsDrawing(true);
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      ctx.beginPath();
      ctx.moveTo((e.clientX - rect.left) * scaleX, (e.clientY - rect.top) * scaleY);
    }
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      
      ctx.lineTo((e.clientX - rect.left) * scaleX, (e.clientY - rect.top) * scaleY);
      ctx.strokeStyle = "#073b4c";
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.stroke();
    }
  };

  const endDraw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (canvas) canvas.releasePointerCapture(e.pointerId);
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const saveCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      try {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'px',
          format: [600, 400]
        });
        
        pdf.addImage(imgData, 'PNG', 0, 0, 600, 400);
        pdf.save('my_safe_exit_map.pdf');
      } catch (error) {
        console.error("Error creating PDF:", error);
        alert("Sorry, could not save map as PDF.");
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-xl border-4 border-navy/10 mt-8">
      <h2 className="text-3xl font-bold text-navy mb-4">Chapter 5: Fun Day</h2>
      
      {/* Matching Section */}
      <div className="mb-10">
        <h3 className="text-xl font-bold mb-2">Sorting Game</h3>
        <p className="mb-4 text-gray-600">Drag and drop the tiles to put matching pairs side-by-side!</p>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-lg mx-auto p-4 bg-navy/5 rounded-xl">
          {tiles.map((tile, idx) => {
            // Determine if this tile is part of a matched pair (0-1, 2-3, etc)
            // A pair is matched if the current index's partner (adjacent index) has the same ID
            const partnerIdx = idx % 2 === 0 ? idx + 1 : idx - 1;
            const isMatched = tiles[partnerIdx]?.id === tile.id;

            return (
              <div
                key={tile.instanceId}
                draggable
                onDragStart={(e) => handleDragStart(e, idx)}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDrop={(e) => handleDrop(e, idx)}
                className={`
                  aspect-square rounded-xl flex flex-col items-center justify-center p-2
                  cursor-grab active:cursor-grabbing shadow-sm transition-all duration-200
                  border-4
                  ${isMatched 
                    ? 'bg-greenSuccess/20 border-greenSuccess scale-95' 
                    : 'bg-white border-navy hover:border-redAccent hover:-translate-y-1'
                  }
                `}
              >
                <span className="text-4xl mb-1 select-none">{tile.emoji}</span>
                <span className={`text-xs font-bold text-center select-none leading-tight ${isMatched ? 'text-green-800' : 'text-navy'}`}>
                  {tile.label}
                </span>
              </div>
            );
          })}
        </div>
        {isComplete && (
          <div className="mt-4 text-center animate-bounce-in">
            <p className="text-2xl font-bold text-greenSuccess">🌟 All Paired Up! Great Job! 🌟</p>
          </div>
        )}
      </div>

      {/* Drawing Section */}
      <div>
        <h3 className="text-xl font-bold mb-2">Draw Your Exit Plan</h3>
        <p className="mb-4 text-gray-600">Draw a map of your room and show the safe way out.</p>
        
        {showTooltip && (
          <div className="bg-blue-50 border-l-4 border-navy p-4 mb-4 rounded-r shadow-sm flex justify-between items-start animate-fade-in">
             <div className="flex-1">
                <p className="font-bold text-navy text-sm flex items-center gap-2">
                   <span>✏️</span> How to Draw:
                </p>
                <p className="text-sm text-gray-700 mt-1">
                  Touch (or click) and hold to draw. Draw your room's walls and a big arrow showing how you would leave safely!
                </p>
             </div>
             <button 
               onClick={() => setShowTooltip(false)} 
               className="ml-2 text-gray-400 hover:text-redAccent font-bold px-2"
               aria-label="Close tip"
             >
               ✕
             </button>
          </div>
        )}

        <div className="border-2 border-dashed border-navy rounded-lg overflow-hidden mb-4 bg-white touch-none">
           <canvas 
             ref={canvasRef}
             width={600}
             height={400}
             className="w-full h-auto bg-[url('https://picsum.photos/id/11/600/400?blur=10')] bg-cover bg-opacity-10 cursor-crosshair"
             onPointerDown={startDraw}
             onPointerMove={draw}
             onPointerUp={endDraw}
           />
        </div>
        <div className="flex gap-4 justify-center">
          <Button onClick={clearCanvas} variant="secondary">Clear</Button>
          <Button onClick={saveCanvas} variant="primary">Save Map</Button>
        </div>
      </div>
    </div>
  );
}