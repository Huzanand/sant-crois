import React from 'react';
import styles from './buttons.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const ButtonSecondary: React.FC<ButtonProps> = ({ onClick, children, className, ...props }) => {
  return (
    <button
      className={`buttons-l blue-b500 ${styles.btn} ${styles.buttonSecondary} ${className || ''}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};