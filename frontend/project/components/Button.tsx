'use client';

import styles from './Button.module.css';

interface ButtonProps {
  children: React.ReactNode;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  onClick,
  disabled = false,
  isLoading = false
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${styles.button} ${styles[variant]} ${isLoading ? styles.loading : ''}`}
    >
      {isLoading && <span className={styles.spinner}></span>}
      <span className={isLoading ? styles.hiddenText : ''}>{children}</span>
    </button>
  );
}