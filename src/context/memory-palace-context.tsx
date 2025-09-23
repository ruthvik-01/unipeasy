"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface MemoryItem {
    id: string;
    title: string;
    content: string;
    type: 'Explanation' | 'Analogy' | 'Mind Map' | 'Other';
    topic: string;
}

interface MemoryPalaceContextType {
  memoryItems: MemoryItem[];
  addMemoryItem: (item: MemoryItem) => void;
  clearMemoryPalace: () => void;
}

const MemoryPalaceContext = createContext<MemoryPalaceContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'memoryPalaceItems';

export function MemoryPalaceProvider({ children }: { children: ReactNode }) {
  const [memoryItems, setMemoryItems] = useState<MemoryItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const items = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      return items ? JSON.parse(items) : [];
    } catch (error) {
      console.error("Failed to parse memory palace items from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(memoryItems));
    } catch (error) {
        console.error("Failed to save memory palace items to localStorage", error);
    }
  }, [memoryItems]);

  const addMemoryItem = (item: MemoryItem) => {
    setMemoryItems((prevItems) => [item, ...prevItems]);
  };

  const clearMemoryPalace = () => {
    setMemoryItems([]);
  };

  return (
    <MemoryPalaceContext.Provider value={{ memoryItems, addMemoryItem, clearMemoryPalace }}>
      {children}
    </MemoryPalaceContext.Provider>
  );
}

export function useMemoryPalace() {
  const context = useContext(MemoryPalaceContext);
  if (context === undefined) {
    throw new Error('useMemoryPalace must be used within a MemoryPalaceProvider');
  }
  return context;
}
