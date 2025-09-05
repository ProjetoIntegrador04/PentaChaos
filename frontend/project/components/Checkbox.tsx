'use client';

import { useState } from 'react';
import styles from './Checkbox.module.css';

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export default function Checkbox({
  label,
  checked,
  onChange,
  disabled = false
}: CheckboxProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <label className={`${styles.container} ${disabled ? styles.disabled : ''}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={styles.input}
      />
      <span className={`${styles.checkmark} ${checked ? styles.checked : ''} ${isFocused ? styles.focused : ''}`}>
        {checked && <span className={styles.checkIcon}>✓</span>}
      </span>
      <span className={styles.label}>{label}</span>
    </label>
  );
}