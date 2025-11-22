import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PROFILE_IMAGE_KEY = 'my-profile-image-uri';

interface ProfileImageContextType {
  profileImage: string | null;
  setProfileImage: (uri: string | null) => Promise<void>;
  loadProfileImage: () => Promise<void>;
}

const ProfileImageContext = createContext<ProfileImageContextType | undefined>(undefined);

interface ProfileImageProviderProps {
  children: ReactNode;
}

export function ProfileImageProvider({ children }: ProfileImageProviderProps) {
  const [profileImage, setProfileImageState] = useState<string | null>(null);

  // Carregar imagem ao iniciar
  useEffect(() => {
    loadProfileImage();
  }, []);

  const loadProfileImage = async () => {
    try {
      const savedImageUri = await AsyncStorage.getItem(PROFILE_IMAGE_KEY);
      if (savedImageUri) {
        setProfileImageState(savedImageUri);
      }
    } catch (e) {
      console.error("Erro ao carregar imagem do perfil:", e);
    }
  };

  const setProfileImage = async (uri: string | null) => {
    try {
      if (uri) {
        await AsyncStorage.setItem(PROFILE_IMAGE_KEY, uri);
        setProfileImageState(uri);
      } else {
        await AsyncStorage.removeItem(PROFILE_IMAGE_KEY);
        setProfileImageState(null);
      }
    } catch (e) {
      console.error("Erro ao salvar imagem do perfil:", e);
    }
  };

  return (
    <ProfileImageContext.Provider value={{ profileImage, setProfileImage, loadProfileImage }}>
      {children}
    </ProfileImageContext.Provider>
  );
}

export function useProfileImage() {
  const context = useContext(ProfileImageContext);
  if (context === undefined) {
    throw new Error('useProfileImage deve ser usado dentro de um ProfileImageProvider');
  }
  return context;
}
