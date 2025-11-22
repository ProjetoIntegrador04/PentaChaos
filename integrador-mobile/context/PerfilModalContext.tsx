import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PerfilModalContextType {
  isVisible: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const PerfilModalContext = createContext<PerfilModalContextType | undefined>(undefined);

interface PerfilModalProviderProps {
  children: ReactNode;
}

export function PerfilModalProvider({ children }: PerfilModalProviderProps) {
  const [isVisible, setIsVisible] = useState(false);

  const openModal = () => setIsVisible(true);
  const closeModal = () => setIsVisible(false);

  return (
    <PerfilModalContext.Provider value={{ isVisible, openModal, closeModal }}>
      {children}
    </PerfilModalContext.Provider>
  );
}

export function usePerfilModal() {
  const context = useContext(PerfilModalContext);
  if (context === undefined) {
    throw new Error('usePerfilModal deve ser usado dentro de um PerfilModalProvider');
  }
  return context;
}
