import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-12 py-8 text-center text-navy/60">
      <p>© {new Date().getFullYear()} Fire Safety Education • Windhoek</p>
      <p className="text-sm mt-2">Remember: In an emergency, stay calm and call 061-211111</p>
    </footer>
  );
};