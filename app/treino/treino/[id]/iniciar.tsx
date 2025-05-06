import { View, Text, Button, Modal, Animated, Easing, Alert, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useEffect, useRef } from 'react';
import { treinos } from '@/data/treinos';
import { TreinoType, ExercicioType } from '@/types/TreinoType';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Metronomo from '@/components/Metronomo';

export default function IniciarTreino() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  // Estados do treino
  const [treino, setTreino] = useState<TreinoType | null>(null);
  const [currentExercise, setCurrentExercise] = useState({
    index: 0,
    reps: 0,
    completed: false
  });
  const [timer, setTimer] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isResting, setIsResting] = useState(false);
  const [restTime, setRestTime] = useState(30);
  const [modalVisible, setModalVisible] = useState(false);
  const [pauseMetronome, setPauseMetronome] = useState(false)

  // Carrega o treino
  useEffect(() => {
    setCurrentExercise({
      index: 0,
      reps: 0,
      completed: false
    })
    setTimer(0)
    const loadTreino = async () => {
      try {
        let loadedTreino: TreinoType | null = null;
        
        if (params.isCustom === 'true') {
          // Busca treino personalizado
          const saved = await AsyncStorage.getItem('@customTreinos');
          const customTreinos = saved ? JSON.parse(saved) : [];
          loadedTreino = customTreinos.find((t: TreinoType) => t.id === params.id);
          
          if (loadedTreino) {
            // Garante que exercícios estão no formato correto
            loadedTreino.exercicios = typeof loadedTreino.exercicios === 'string' ?
              JSON.parse(loadedTreino.exercicios) :
              loadedTreino.exercicios;
          }
        } else {
          // Busca treino mockado
          loadedTreino = treinos.find(t => t.id === params.id) || null;
        }

        if (loadedTreino) {
          setTreino(loadedTreino);
          setRestTime(loadedTreino.restTime || 30);
        }

        // Animação de entrada
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          easing: Easing.ease,
          useNativeDriver: true,
        }).start();
      } catch (error) {
        console.error('Erro ao carregar treino:', error);
      }
    };

    loadTreino();
  }, [params.id, params.isCustom]);

  // Timer principal
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (treino && !isPaused) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [treino, isPaused]);

  // Controle de descanso
  useEffect(() => {
    if (isResting && treino) {
      const restInterval = setInterval(() => {
        setRestTime(prev => {
          if (prev <= 1) {
            clearInterval(restInterval);
            setIsResting(false);
            handleNextExercise();
            return treino.restTime || 30;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(restInterval);
    }
  }, [isResting, treino]);

  if (!treino) {
    return (
      <Animated.View style={{ opacity: fadeAnim }} className="flex-1 justify-center items-center">
        <Text className="text-lg">Carregando treino...</Text>
      </Animated.View>
    );
  }

  if (!treino.exercicios || treino.exercicios.length === 0) {
    return (
      <Animated.View style={{ opacity: fadeAnim }} className="flex-1 justify-center items-center">
        <Text className="text-lg">Nenhum exercício encontrado neste treino.</Text>
        <Button title="Voltar" onPress={() => router.back()} />
      </Animated.View>
    );
  }

  const exercicio = treino.exercicios[currentExercise.index] as ExercicioType;
  const isLastExercise = currentExercise.index === treino.exercicios.length - 1;
  const progress = (currentExercise.index / treino.exercicios.length) * 100;

  const handleRepetition = () => {
    const newReps = currentExercise.reps + 1;
    const isCompleted = exercicio.repeticoes ? newReps >= exercicio.repeticoes : false;
    
    setCurrentExercise({
      ...currentExercise,
      reps: newReps,
      completed: isCompleted
    });
  };

  const handleNextExercise = () => {
    if (currentExercise.index < (treino.exercicios.length - 1)) {
      setCurrentExercise({
        index: currentExercise.index + 1,
        reps: 0,
        completed: false
      });
      setRestTime(treino.restTime || 30);
    } else {
      setModalVisible(true);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  return (
    
      <ScrollView contentContainerStyle={{ paddingBottom:200}} className="flex-1 flex-1 flex flex-col p-8 gap-4 bg-gray-100 dark:bg-neutral-950">
        {/* Cabeçalho */}
      <View className="flex-row justify-between items-center mb-4">
        <Button title="Voltar" color={"rgb(79 70 229)"} onPress={() => {
          setIsPlaying(false)
          router.back()
        
        }} />
        <Text className="text-lg font-bold dark:text-white">{formatTime(timer)}</Text>
        <Button 
          title={isPaused ? "Continuar" : "Pausar"} 
          onPress={togglePause} 
          color={isPaused ? "#4CAF50" : "#F44336"}
        />
      </View>
      
      {/* Barra de progresso */}
      <View className="h-2 bg-gray-300 rounded-full mb-4">
        <View 
          className="h-full bg-indigo-900 rounded-full" 
          style={{ width: `${progress}%` }}
        />
      </View>
      
      <Text className="text-xl font-bold mb-2 dark:text-white">{treino.titulo}</Text>
      <Text className="mb-4 text-gray-600 dark:text-gray-300">{treino.descricao}</Text>
      <Text className="mb-4 dark:text-white">
        Exercício {currentExercise.index + 1} de {treino.exercicios.length} • {treino.nivel}
      </Text>
      {/* Controles de navegação */}
      <View className="flex-row justify-between ">
        <Button
          title="Exercício Anterior"
          color={"rgb(79 70 229)"}
          onPress={() => {
            setCurrentExercise({
              index: Math.max(0, currentExercise.index - 1),
              reps: 0,
              completed: false
            });
          }}
          disabled={currentExercise.index === 0 || isResting}
        />
        
        <Button
          title={isLastExercise ? "Finalizar Treino" : "Próximo Exercício"}
          onPress={() => {
            if (exercicio.repeticoes > 0 && !currentExercise.completed) {
              Alert.alert("Atenção", "Complete as repetições antes de avançar");
            } else {
              setIsResting(true);
            }
          }}
          disabled={isResting}
          color={isLastExercise ? "#4CAF50" : 'rgb(79 70 229)'}
        />
      </View>

      {/* Card do exercício */}
      <View className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-lg mb-4 w-full mt-4">
        {isResting ? (
          <View className="items-center">
            <Text className="text-2xl font-bold mb-4 dark:text-white">Tempo de Descanso</Text>
            <Text className="text-5xl font-bold mb-6 dark:text-white">{restTime}s</Text>
            <Text className="text-gray-600 dark:text-gray-300 mb-4">
              Próximo: {treino.exercicios[currentExercise.index + 1]?.titulo}
            </Text>
            <Button 
              title="Pular Descanso" 
              onPress={() => {
                setIsResting(false);
                handleNextExercise();
              }}
              color="#9E9E9E"
            />
          </View>
        ) : (
          <>
            <Text className="text-2xl font-bold mb-2 dark:text-white">{exercicio.titulo}</Text>
            <Text className="text-gray-600 dark:text-gray-300 mb-4">{exercicio.descricao}</Text>
            
            {exercicio.dica && (
              <View className="bg-yellow-50 dark:bg-yellow-900 p-3 rounded-lg mb-4 border border-yellow-200 dark:border-yellow-700">
                <Text className="text-yellow-800 dark:text-yellow-200 font-medium">💡 Dica: {exercicio.dica}</Text>
              </View>
            )}
            
            <View className="flex-row justify-between items-center mb-6">
              {exercicio.repeticoes > 0 && (
                <View>
                  <Text className="text-sm text-gray-500 dark:text-gray-400">Repetições</Text>
                  <Text className="text-2xl font-bold dark:text-white">
                    {currentExercise.reps} / {exercicio.repeticoes}
                  </Text>
                </View>
              )}
              
              
                {exercicio.metronomo && (
                  <View className="mt-4">
                    <Text className="text-gray-600 dark:text-gray-300 mb-2">
                      Metrônomo sugerido: {exercicio.metronomo} BPM
                    </Text>
                    <Metronomo initialBpm={exercicio.metronomo} isPlaying={isPlaying} setIsPlaying={setIsPlaying}/>
                  </View>
                )}
            </View>
            
            {exercicio.repeticoes>0  ? (
              <Button 
                title={currentExercise.completed ? "Exercício Concluído!" : "Registrar Repetição"} 
                onPress={handleRepetition}
                disabled={currentExercise.completed}
                color={currentExercise.completed ? "#4CAF50" : "rgb(79 70 229)"}
              />
            ) : (
              <Button 
                title="Marcar como Praticado" 
                onPress={() => setCurrentExercise({...currentExercise, completed: true})}
                color="#2196F3"
              />
            )}
          </>
        )}
      </View>
      
      
      {/* Modal de finalização do treino */}
      <Modal 
        visible={modalVisible} 
        transparent 
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/60">
          <View className="bg-white dark:bg-gray-800 p-8 rounded-xl">
            <Text className="text-xl font-bold dark:text-white">Treino Completo!</Text>
            <Text className="mt-2 dark:text-white">Você finalizou: {treino.titulo}</Text>
            <View className="mt-4">
              <Button 
                title="OK" 
                onPress={() => {
                  setModalVisible(false);
                  setCurrentExercise({
                    index: 0,
                    reps: 0,
                    completed: false
                  })
                  router.push('/(tabs)/home');
                }} 
              />
            </View>
          </View>
        </View>
      </Modal>
      </ScrollView>
   
  );
}