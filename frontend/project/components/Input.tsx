'use client';

import { useState } from 'react';
import styles from './Input.module.css';

interface InputProps {
  type: 'text' | 'email' | 'password';
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  showPasswordToggle?: boolean;
}

export default function Input({
  type,
  placeholder,
  value,
  onChange,
  error,
  showPasswordToggle = false
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className={styles.container}>
      <div className={`${styles.inputWrapper} ${isFocused ? styles.focused : ''} ${error ? styles.error : ''}`}>
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={styles.input}
        />
        
        {showPasswordToggle && type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={styles.passwordToggle}
            aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
          >
            {showPassword ? '👁️' : '👁️‍🗨️'}
          </button>
        )}
      </div>
      
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
}