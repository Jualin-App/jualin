import React from 'react';
import Image from 'next/image';

const Logo = ({ size = 'xl', className = '' }) => {
  const sizeClasses = {
    small: 'w-12 h-12',
    medium: 'w-20 h-20', 
    large: 'w-28 h-28',
    xl: 'w-36 h-36'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative">
        <Image
          src="/Logo.png?v=2"
          alt="Jualin"
          width={parseInt(sizeClasses[size].split('w-')[1]) * 4}
          height={parseInt(sizeClasses[size].split('h-')[1]) * 4}
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
};

export default Logo;