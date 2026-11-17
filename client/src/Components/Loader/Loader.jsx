import React from 'react';

export default function Loader({ fullScreen = true, text = "Loading Veyora..." }) {
  const containerClasses = fullScreen
    ? "fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#1c1917]/90 backdrop-blur-md"
    : "flex flex-col items-center justify-center py-16 w-full";

  return (
    <div className={containerClasses}>
      {/* Brand Icon Spinner */}
      <div className="relative flex items-center justify-center">
        {/* Outer Pulsing Ring */}
        <div className="absolute w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-500 opacity-30 animate-ping" />
        
        {/* Glowing Border Box */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-500 p-0.5 shadow-lg shadow-indigo-500/20 animate-pulse">
          <div className="w-full h-full bg-[#1c1917] rounded-[14px] flex items-center justify-center">
            <span className="text-white font-extrabold text-lg tracking-tight">V</span>
          </div>
        </div>
      </div>

      {/* Loading Text */}
      {text && (
        <p className="mt-5 text-sm font-medium text-slate-400 tracking-wider animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
}