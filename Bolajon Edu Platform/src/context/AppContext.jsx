import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAppStore, mockData } from '../store';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const store = useAppStore();

  const playClickSound = () => {
    try {
      const audio = new Audio('/click.mp3'); // Mocking the sound
      audio.volume = 0.5;
      audio.play().catch(e => console.log('Audio error:', e));
    } catch(e) {}
  };

  return (
    <AppContext.Provider value={{ ...store, mockData, playClickSound }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
