// hooks/useTreinos.ts
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TreinoType } from '@/types/TreinoType';
import { treinos } from '@/data/treinos';

export const useTreinos = () => {
  const [customTreinos, setCustomTreinos] = useState<TreinoType[]>([]);
  const [loading, setLoading] = useState(true);

  // Carrega treinos do AsyncStorage
  useEffect(() => {
    const loadTreinos = async () => {
      try {
        const saved = await AsyncStorage.getItem('@customTreinos');
        if (saved) setCustomTreinos(JSON.parse(saved));
      } catch (error) {
        console.error('Erro ao carregar treinos:', error);
      } finally {
        setLoading(false);
      }
    };
    loadTreinos();
  }, []);

  // Salva treinos no AsyncStorage
  useEffect(() => {
    if (loading) return;
    AsyncStorage.setItem('@customTreinos', JSON.stringify(customTreinos));
  }, [customTreinos, loading]);

  const addTreino = (treino: TreinoType) => {
    setCustomTreinos([...customTreinos, treino]);
  };

  // Função para buscar qualquer treino (mockado ou personalizado)
  const getTreino = async (id: string) => {
    if (id.startsWith('custom-')) {
      return customTreinos.find(t => t.id === id);
    }
    return treinos.find(t => t.id === id);
  };

  return { 
    customTreinos, 
    addTreino, 
    getTreino,
    loading ,
    setCustomTreinos
  };
};