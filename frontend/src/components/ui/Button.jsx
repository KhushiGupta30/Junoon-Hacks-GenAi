import React from 'react';
import { motion } from 'framer-motion';

// Define a spring transition to be reused
const springTransition = {
  type: "spring",
  stiffness: 400,
  damping: 20
};

const Button = ({
  as: Component = 'button', // Allows us to use it as <button> or <a>
  children,
  className = '',
  ...props
}) => {
  // We wrap the dynamic component 'Component' with 'motion'
  // This gives it all the animation props.
  const MotionComponent = motion(Component);

  return (
    <MotionComponent
      className={className} // Pass through any user-defined classes
      {...props} // Pass through all other props (like onClick, to, href, etc.)
      
      // --- Framer Motion Animations ---
      
      // Animation to play when the user hovers over the button
      whileHover={{ 
        scale: 1.05, // Gently scale up
        // You could add other hover effects here, e.g.,
        // backgroundColor: "#f0f0f0" 
      }}
      
      // Animation to play when the user clicks/taps the button
      whileTap={{ 
        scale: 0.95, // Gently scale down
      }}
      
      // Use the spring transition for all animations on this component
      transition={springTransition}
    >
      {children}
    </MotionComponent>
  );
};

export default Button;