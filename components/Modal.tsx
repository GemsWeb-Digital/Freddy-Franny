import React from 'react';

interface ModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
  type?: 'success' | 'error' | 'info';
}

export const Modal: React.FC<ModalProps> = ({ isOpen, title, message, onClose, type = 'info' }) => {
  if (!isOpen) return null;

  const colors = {
    success: 'border-greenSuccess text-greenSuccess',
    error: 'border-redAccent text-redAccent',
    info: 'border-navy text-navy'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className={`bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border-l-8 ${colors[type]} animate-bounce-in`}>
        <h3 className={`text-2xl font-bold mb-2 ${type === 'error' ? 'text-redAccent' : 'text-navy'}`}>
          {title}
        </h3>
        <p className="text-lg text-gray-700 mb-6">
          {message}
        </p>
        <div className="flex justify-end">
          <button 
            onClick={onClose}
            className="bg-navy text-white px-6 py-2 rounded-lg font-bold hover:bg-opacity-90"
          >
            Okay!
          </button>
        </div>
      </div>
    </div>
  );
};