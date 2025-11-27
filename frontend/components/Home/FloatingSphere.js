import React from 'react';

export const FloatingSphere = ({ 
  size, 
  position, 
  delay = '0s', 
  zIndex = 'z-10' 
}) => {
  return (
    <div 
      className={`absolute rounded-full sphere-gradient ${size} ${position} ${zIndex} animate-bounce`} 
      style={{ animationDuration: '3s', animationDelay: delay }}
    />
  );
};