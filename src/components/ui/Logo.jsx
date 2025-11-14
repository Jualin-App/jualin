import React from 'react';

const Logo = () => {
  return (
    <div className="flex items-center gap-3 mb-8">
      {/* Shopping Bag Icon */}
      <div className="w-10 h-10 bg-[#E83030] rounded-lg flex items-center justify-center">
        <svg 
          className="w-6 h-6 text-white" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
      </div>
      <h1 className="text-3xl font-bold text-[#E83030]">Jualin</h1>
    </div>
  );
};

export default Logo;