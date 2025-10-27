import React from 'react';
import { motion } from 'framer-motion';

// --- Subtle Slide Animation Settings ---
const pageVariants = {
  initial: {
    opacity: 0,
    x: "30vw"  // Start 30% to the right
  },
  in: {
    opacity: 1,
    x: 0         // Animate to center
  },
  out: {
    opacity: 0,
    x: "-30vw" // Animate 30% to the left
  }
};

// --- Fast, Clean Transition ---
const pageTransition = {
  type: "tween",
  ease: "easeOut", // A simple, clean easing
  duration: 0.2     // A fast duration (400ms)
};

const AnimatedPage = ({ children }) => (
  <motion.div
    initial="initial"
    animate="in"
    exit="out"
    variants={pageVariants}
    transition={pageTransition}
  >
    {children}
  </motion.div>
);

export default AnimatedPage;
