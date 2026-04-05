import React from 'react';
import styles from './buttons.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const ButtonPrimary: React.FC<ButtonProps> = ({ children, onClick, className, ...props }) => {
  return (
    <button
      className={`buttons-l ${styles.btn} ${styles.buttonPrimary} ${className || ''}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};