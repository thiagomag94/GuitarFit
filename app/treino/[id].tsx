import { useLocalSearchParams, Link } from 'expo-router';
import { View, Text, TouchableOpacity, useColorScheme, ScrollView, ActivityIndicator } from 'react-native';
import { treinos } from '@/data/treinos';
import { TreinoType, ExercicioType } from '@/types/TreinoType';
import CardExercicio from '@/components/ExerciciosCard';
import { FontAwesome } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '@/constants/Colors';

export default function DetalhesTreino() {
  const params = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];
  const [treino, setTreino] = useState<TreinoType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Params recebidos:', params); // Debug
    
    const loadTreino = async () => {
      try {
        if (params.isCustom === 'true') {
          console.log('Buscando treino personalizado...');
          const saved = await AsyncStorage.getItem('@customTreinos');
          console.log('Dados do AsyncStorage:', saved);
          
          const customTreinos = saved ? JSON.parse(saved) : [];
          const found = customTreinos.find((t: TreinoType) => t.id === params.id);
          
          if (found) {
            console.log('Treino encontrado:', found);
            setTreino({
              ...found,
              exercicios: typeof found.exercicios === 'string' ? 
                JSON.parse(found.exercicios) : 
                found.exercicios
            });
          } else {
            console.warn('Treino personalizado não encontrado');
          }
        } else {
          console.log('Buscando treino mockado...');
          const found = treinos.find(t => t.id === params.id);
          
          if (found) {
            console.log('Treino mockado encontrado:', found);
            setTreino(found);
          } else {
            console.warn('Treino mockado não encontrado');
          }
        }
      } catch (error) {
        console.error('Erro ao carregar treino:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTreino();
  }, [params.id, params.isCustom]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!treino) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Treino não encontrado</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      className="flex-1 px-4 py-8 min-h-screen gap-2" 
      style={{backgroundColor: themeColors.background}} 
      contentContainerStyle={{ paddingBottom: 200 }}
    >
      <View className="mb-4 items-center">
        <Text className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">
          {treino.titulo}
        </Text>
        <View className="w-12 h-1 bg-indigo-400 dark:bg-indigo-500 mt-2" />
      </View>

      <Link
        href={{
          pathname: '/treino/treino/[id]/iniciar',
          params: { 
            id: treino.id,
            isCustom: params.isCustom || 'false'
          },
        }}
        asChild
        className='mb-8'
      >
        <TouchableOpacity className="flex-row items-center justify-center bg-indigo-600 p-4 rounded-lg mt-2">
          <Text className="text-white font-medium mr-2">Iniciar</Text>
          <FontAwesome name="play" size={14} color="white" />
        </TouchableOpacity>
      </Link>

      {treino.exercicios.map((ex: ExercicioType, i: number) => (
        <CardExercicio 
          key={ex.id}
          exercicio={ex}
          index={i}
        />
      ))}
    </ScrollView>
  );
}