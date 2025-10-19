import React from 'react';

const Button = ({
  as: Component = 'button', // Allows us to use it as <button> or <a>
  children,
  className = '',
  ...props
}) => {
  const createRipple = (event) => {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const d = Math.max(button.clientWidth, button.clientHeight);
    const rect = button.getBoundingClientRect();

    ripple.style.width = ripple.style.height = `${d}px`;
    ripple.style.left = `${event.clientX - rect.left - d / 2}px`;
    ripple.style.top = `${event.clientY - rect.top - d / 2}px`;
    
    ripple.classList.add('ripple');
    
    // Remove old ripples
    const oldRipple = button.querySelector('.ripple');
    if (oldRipple) oldRipple.remove();
    
    button.appendChild(ripple);
  };

  return (
    <Component
      className={`btn-ripple ${className}`} // Uses .btn-ripple from index.css
      onClick={createRipple}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Button;