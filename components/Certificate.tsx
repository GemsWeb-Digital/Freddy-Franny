import React, { useRef, useState } from 'react';
import { Button } from './Button';
import { jsPDF } from 'jspdf';

export const Certificate: React.FC = () => {
  const [name, setName] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateCertificate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsGenerating(true);

    // Fill Background
    ctx.fillStyle = "#fff8f0";
    ctx.fillRect(0, 0, 1200, 850);

    // Border
    ctx.strokeStyle = "#073b4c";
    ctx.lineWidth = 20;
    ctx.strokeRect(30, 30, 1140, 790);
    ctx.strokeStyle = "#d9534f";
    ctx.lineWidth = 5;
    ctx.strokeRect(50, 50, 1100, 750);

    // Text
    ctx.fillStyle = "#073b4c";
    ctx.textAlign = "center";
    
    ctx.font = "bold 80px Arial";
    ctx.fillText("CERTIFICATE", 600, 150);
    
    ctx.font = "40px Arial";
    ctx.fillText("OF FIRE SAFETY", 600, 220);

    ctx.font = "italic 50px Arial";
    ctx.fillText("This is awarded to:", 600, 350);

    // Name Line
    ctx.beginPath();
    ctx.moveTo(300, 500);
    ctx.lineTo(900, 500);
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#073b4c";
    ctx.stroke();

    // Name
    ctx.font = "bold 70px Arial";
    ctx.fillStyle = "#d9534f";
    ctx.fillText(name || "Junior Firefighter", 600, 480);

    // Footer
    ctx.font = "30px Arial";
    ctx.fillStyle = "#073b4c";
    ctx.fillText("For completing the Freddy & Franny Fire Safety Course", 600, 600);
    ctx.fillText("Windhoek Fire Brigade: 061-211111", 600, 700);

    // Emoji decoration
    ctx.font = "80px Arial";
    ctx.fillText("🚒", 150, 700);
    ctx.fillText("🔥", 1050, 700);

    // Generate PDF
    try {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [1200, 850]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, 1200, 850);
      pdf.save('Fire_Safety_Certificate.pdf');
    } catch (error) {
      console.error("Error generating PDF", error);
      alert("Sorry, there was an error creating the PDF.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-xl border-4 border-navy/10 mt-8 text-center">
      <h2 className="text-3xl font-bold text-navy mb-4">Get Your Certificate!</h2>
      <div className="flex flex-col items-center gap-4 max-w-md mx-auto">
        <label className="text-lg font-bold w-full text-left">Enter your name:</label>
        <input 
          type="text" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 border-2 border-navy rounded-lg text-xl"
          placeholder="Your Name"
        />
        <Button onClick={generateCertificate} disabled={!name || isGenerating}>
          {isGenerating ? 'Generating PDF...' : 'Download PDF Certificate'}
        </Button>
        <canvas ref={canvasRef} width={1200} height={850} style={{ display: 'none' }} />
      </div>
    </div>
  );
};