import React from 'react';

const AnimatedSection = ({ children, className = "" }) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};

export default AnimatedSection;
