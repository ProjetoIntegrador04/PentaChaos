'use client';

import { useState } from 'react';
import LoginForm from '@/components/LoginForm';
import styles from './login.module.css';

export default function LoginPage() {
  return (
    <div className={styles.container}>
      <div className={styles.leftSection}>
        <div className={styles.welcomeContent}>
          <h1 className={styles.greeting}>Olá,</h1>
          <h2 className={styles.welcome}>Bem vindo a</h2>
          
          <div className={styles.logoSection}>
            <div className={styles.logo}>
              <div className={styles.globeIcon}>🌍</div>
              <div className={styles.logoText}>
                <span className={styles.logoMain}>2RP</span>
                <span className={styles.logoSub}>Monitoring</span>
                <span className={styles.logoDesc}>Data-driven<br />Company</span>
              </div>
            </div>
          </div>

          <p className={styles.description}>
            2RP net Monitoring, onde o gerenciamento, 
            acompanhamento, organizado é possível!
          </p>

          <button className={styles.learnMoreBtn}>
            Saber mais
            <span className={styles.arrow}>▶</span>
          </button>
        </div>
      </div>

      <div className={styles.rightSection}>
        <div className={styles.loginContainer}>
          <h2 className={styles.loginTitle}>Entre na sua conta agora!</h2>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}