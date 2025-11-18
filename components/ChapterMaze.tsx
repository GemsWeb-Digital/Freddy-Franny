import React, { useRef, useEffect, useState } from 'react';
import { Rect, PlatformStateSubmission } from '../types';
import { Button } from './Button';

const CANVAS_WIDTH = 560;
const CANVAS_HEIGHT = 360;

// Maze Layout
const START_ZONE: Rect = { x: 10, y: 10, w: 60, h: 60 };
const END_ZONE: Rect = { x: 490, y: 290, w: 60, h: 60 };
const OBSTACLES: Rect[] = [
  { x: 80, y: 0, w: 30, h: 280 },
  { x: 180, y: 80, w: 30, h: 280 },
  { x: 280, y: 0, w: 30, h: 200 },
  { x: 280, y: 260, w: 150, h: 30 },
  { x: 400, y: 80, w: 30, h: 280 },
];

export const ChapterMaze: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [playerPos, setPlayerPos] = useState({ x: 40, y: 40 });
  const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing');

  // --- Integrity Data Collection ---
  const startTime = useRef<number>(Date.now());
  const pathHistory = useRef<[number, number][]>([[40, 40]]);

  const resetGame = () => {
    setPlayerPos({ x: 40, y: 40 });
    setStatus('playing');
    // Reset integrity data
    startTime.current = Date.now();
    pathHistory.current = [[40, 40]];
  };

  const drawGame = (ctx: CanvasRenderingContext2D) => {
    // Background
    ctx.fillStyle = "#fff8f0";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Start Zone
    ctx.fillStyle = "#FFD700"; // Gold
    ctx.fillRect(START_ZONE.x, START_ZONE.y, START_ZONE.w, START_ZONE.h);
    ctx.fillStyle = "#000";
    ctx.font = "12px Arial";
    ctx.fillText("START", START_ZONE.x + 10, START_ZONE.y + 35);

    // End Zone
    ctx.fillStyle = "#2a9d8f"; // Green
    ctx.fillRect(END_ZONE.x, END_ZONE.y, END_ZONE.w, END_ZONE.h);
    ctx.fillStyle = "#fff";
    ctx.fillText("TRUCK", END_ZONE.x + 10, END_ZONE.y + 35);

    // Obstacles
    ctx.fillStyle = "#d9534f"; // Red
    OBSTACLES.forEach(obs => {
      ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
    });

    // Player
    ctx.beginPath();
    ctx.arc(playerPos.x, playerPos.y, 10, 0, Math.PI * 2);
    ctx.fillStyle = "#073b4c";
    ctx.fill();
    ctx.closePath();

    // Optional: Visualize path for debug (Integrity check visualization)
    // ctx.beginPath();
    // ctx.strokeStyle = "rgba(7, 59, 76, 0.2)";
    // pathHistory.current.forEach((point, i) => {
    //   if (i === 0) ctx.moveTo(point[0], point[1]);
    //   else ctx.lineTo(point[0], point[1]);
    // });
    // ctx.stroke();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) drawGame(ctx);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerPos]);

  const generateSubmissionPayload = () => {
    // Calculate path length (simple euclidean sum)
    let length = 0;
    for(let i = 1; i < pathHistory.current.length; i++) {
      const p1 = pathHistory.current[i-1];
      const p2 = pathHistory.current[i];
      const dist = Math.sqrt(Math.pow(p2[0] - p1[0], 2) + Math.pow(p2[1] - p1[1], 2));
      length += dist;
    }

    const payload: PlatformStateSubmission = {
      user_uuid: "mock-user-uuid-12345", // In real app, from auth context
      session_id: "mock-session-id-67890",
      challenge_metadata: {
        challenge_id: 4,
        challenge_type: 'MAZE',
        client_elapsed_time_ms: Date.now() - startTime.current
      },
      submission_data: {
        path_array: pathHistory.current,
        path_length: Math.round(length)
      }
    };

    console.log("🔒 [INTEGRITY] Generated Maze Submission Payload:", JSON.stringify(payload, null, 2));
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (status !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        clientX = (e as React.MouseEvent).clientX;
        clientY = (e as React.MouseEvent).clientY;
    }

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const clickX = (clientX - rect.left) * scaleX;
    const clickY = (clientY - rect.top) * scaleY;

    // Check collision with obstacles (Hit Test on Click)
    const hitObstacle = OBSTACLES.some(obs => 
      clickX >= obs.x && clickX <= obs.x + obs.w &&
      clickY >= obs.y && clickY <= obs.y + obs.h
    );

    if (hitObstacle) {
      setStatus('lost');
      return;
    }

    // Update State
    setPlayerPos({ x: clickX, y: clickY });
    
    // --- Integrity: Record Move ---
    pathHistory.current.push([Math.round(clickX), Math.round(clickY)]);

    // Check win condition
    const hitGoal = clickX >= END_ZONE.x && clickX <= END_ZONE.x + END_ZONE.w &&
                    clickY >= END_ZONE.y && clickY <= END_ZONE.y + END_ZONE.h;

    if (hitGoal) {
      setStatus('won');
      generateSubmissionPayload();
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-xl border-4 border-navy/10 mt-8">
      <h2 className="text-3xl font-bold text-navy mb-4">Chapter 4: The Fire Maze</h2>
      <p className="mb-4 text-lg">Tap on the path to move Freddy. Avoid the red hot zones! Get to the Fire Truck.</p>

      <div className="relative w-full max-w-[560px] mx-auto border-4 border-navy rounded-lg overflow-hidden touch-none">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="w-full h-auto cursor-pointer"
          onMouseDown={handleCanvasClick}
          onTouchStart={handleCanvasClick} // Mobile support
        />
        {status !== 'playing' && (
          <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center p-4">
            <h3 className={`text-3xl font-bold mb-4 ${status === 'won' ? 'text-greenSuccess' : 'text-redAccent'}`}>
              {status === 'won' ? 'You Made It!' : 'Ouch! Hot Zone!'}
            </h3>
            <Button onClick={resetGame}>Try Again</Button>
          </div>
        )}
      </div>
    </div>
  );
};