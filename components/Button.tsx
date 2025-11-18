import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'success' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  ...props 
}) => {
  let baseStyles = "px-6 py-3 rounded-full font-bold text-lg transition-transform transform active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-redAccent text-white hover:bg-red-600",
    success: "bg-greenSuccess text-white hover:bg-green-600",
    secondary: "bg-navy text-white hover:bg-slate-700"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};