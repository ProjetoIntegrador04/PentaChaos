'use client';

import { useState } from 'react';
import Input from './Input';
import Button from './Button';
import Checkbox from './Checkbox';
import styles from './LoginForm.module.css';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export default function LoginForm() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false
  });

  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof LoginFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginFormData> = {};

    if (!formData.email) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    // Simulate login request
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Login attempt:', formData);
      alert('Login realizado com sucesso!');
    } catch (error) {
      console.error('Login error:', error);
      alert('Erro no login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <Input
        type="email"
        placeholder="E-mail"
        value={formData.email}
        onChange={(value) => handleInputChange('email', value)}
        error={errors.email}
      />

      <Input
        type="password"
        placeholder="Senha"
        value={formData.password}
        onChange={(value) => handleInputChange('password', value)}
        error={errors.password}
        showPasswordToggle
      />

      <div className={styles.optionsRow}>
        <Checkbox
          label="Lembrar-me"
          checked={formData.rememberMe}
          onChange={(checked) => handleInputChange('rememberMe', checked)}
        />
        
        <a href="#" className={styles.forgotLink}>
          Esqueci minha senha
        </a>
      </div>

      <Button 
        type="submit" 
        variant="primary" 
        isLoading={isLoading}
        disabled={isLoading}
      >
        Entrar
      </Button>
    </form>
  );
}