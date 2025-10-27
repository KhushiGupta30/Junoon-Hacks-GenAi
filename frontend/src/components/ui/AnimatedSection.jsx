import React from 'react';

/**
 * This component is intentionally left simple to match the Google app
 * aesthetic. It no longer performs on-scroll animations and
 * just renders its children immediately.
 * * The main page transition animation is handled by `AnimatedPage.jsx`.
 */
const AnimatedSection = ({ children, className = "" }) => {
  // All animation logic has been removed.
  // We just return a simple div that passes along the className.
  return (
    <div className={className}>
      {children}
    </div>
  );
};

export default AnimatedSection;
