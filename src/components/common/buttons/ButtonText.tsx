import React from 'react';
import styles from './buttons.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const ButtonText: React.FC<ButtonProps> = ({ children, onClick, disabled, className, ...props }) => {
    return (
        <button
            disabled={disabled}
            className={`body-m--underline ${styles.btn} ${styles.buttonText} ${className || ''}`}
            onClick={onClick}
            {...props}
        >
            {children}
        </button>
    );
};