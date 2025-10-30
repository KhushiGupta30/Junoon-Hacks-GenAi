import React from 'react';
import { motion } from 'framer-motion';

const springTransition = {
  type: "spring",
  stiffness: 400,
  damping: 20
};

const Button = ({
  as: Component = 'button',
  children,
  className = '',
  ...props
}) => {
  const MotionComponent = motion(Component);

  return (
    <MotionComponent
      className={className}
      {...props}
      
      
      whileHover={{ 
        scale: 1.05,
      }}
      
      whileTap={{ 
        scale: 0.95,
      }}
      
      transition={springTransition}
    >
      {children}
    </MotionComponent>
  );
};

export default Button;