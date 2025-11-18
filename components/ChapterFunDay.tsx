import React, { useState, useRef, useEffect } from 'react';
import { MATCHING_ITEMS } from '../constants';
import { TileItem } from '../types';
import { Button } from './Button';

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
      const link = document.createElement('a');
      link.download = 'my_safe_exit_map.png';
      link.href = canvas.toDataURL();
      link.click();
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
                <span className