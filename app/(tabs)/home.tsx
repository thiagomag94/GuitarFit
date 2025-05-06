import { View, Text, ScrollView, useColorScheme, Pressable, TextInput, Modal } from 'react-native';
import { Link, router } from 'expo-router';
import { treinos } from '@/data/treinos';
import { TreinoType, ExercicioType } from '@/types/TreinoType';
import TreinoCard from '../../components/TreinoCard';
import Colors from '@/constants/Colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { useTreinos } from '@/hooks/useTreinos';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Home() {
  
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];
  
  const { customTreinos, setCustomTreinos, addTreino, loading } = useTreinos();
  const [showModal, setShowModal] = useState(false);
 
  const [novoTreino, setNovoTreino] = useState<Omit<TreinoType, 'id' | 'exerciciosCount'>>({
    titulo: '',
    descricao: '',
    categoria: 'técnica',
    nivel: 'iniciante',
    exercicios: [],
    restTime: 30,
    duracao: 0 // Agora calculado automaticamente
  });


  const [novoExercicio, setNovoExercicio] = useState<Omit<ExercicioType, 'id'>>({
    titulo: '',
    descricao: '',
    repeticoes: 1,
    dica: '',
    duracao: 60, // 1 minuto padrão
    metronomo: undefined,
    videoUrl: ''
  });

  const [showExercicioForm, setShowExercicioForm] = useState(false);

  const adicionarExercicio = () => {
    if (novoExercicio.titulo.trim() === '') return;
    
    const exercicio: ExercicioType = {
      ...novoExercicio,
      id: `ex-${Date.now()}`,
      duracao: novoExercicio.duracao || 60 // Garante mínimo 60 segundos
    };
    
    setNovoTreino({
      ...novoTreino,
      exercicios: [...novoTreino.exercicios, exercicio],
      duracao: novoTreino.duracao + Math.ceil(exercicio.duracao / 60) // Converte para minutos
    });
    
    setNovoExercicio({
      titulo: '',
      descricao: '',
      repeticoes: 1,
      dica: '',
      duracao: 60,
      metronomo: undefined,
      videoUrl: ''
    });
    setShowExercicioForm(false);
  };
  
  const resetFormStates = () => {
    setNovoTreino({
      titulo: '',
      descricao: '',
      categoria: 'técnica',
      nivel: 'iniciante',
      exercicios: [],
      restTime: 30,
      duracao: 0
    });
    
    setNovoExercicio({
      titulo: '',
      descricao: '',
      repeticoes: 1,
      dica: '',
      duracao: 60,
      metronomo: undefined,
      videoUrl: ''
    });
    
    setShowExercicioForm(false);
  };

  const removerExercicio = (id: string) => {
    const exercicioRemovido = novoTreino.exercicios.find(ex => ex.id === id);
    if (!exercicioRemovido) return;
    
    setNovoTreino({
      ...novoTreino,
      exercicios: novoTreino.exercicios.filter(ex => ex.id !== id),
      duracao: novoTreino.duracao - Math.ceil(exercicioRemovido.duracao / 60)
    });
  };

  const adicionarTreino = (novoTreino: TreinoType) => {
    const treino: TreinoType = {
      ...novoTreino,
      id: `custom-${Date.now()}`,
      exerciciosCount: novoTreino.exercicios.length
    };
    addTreino(treino);
    resetFormStates();
    setShowModal(false);
  };
  const handleDeleteTreino = async (id: string) => {
    try {
      const saved = await AsyncStorage.getItem('@customTreinos');
      const treinos = saved ? JSON.parse(saved) : [];
      const updatedTreinos = treinos.filter((t: TreinoType) => t.id !== id);
      await AsyncStorage.setItem('@customTreinos', JSON.stringify(updatedTreinos));
      setCustomTreinos(updatedTreinos);
    } catch (error) {
      console.error('Erro ao excluir treino:', error);
    }
  };
  return (
    <ScrollView 
      className="flex-1 px-4 py-8 pb-32 min-h-screen gap-2" 
      style={{ backgroundColor: themeColors.background }} 
      contentContainerStyle={{ paddingBottom: 200 }}
    >
     
      {/* ... (cabeçalho e botão permanecem iguais) */}
      {/* Cabeçalho */}
      <View className="mb-8 items-center">
        <View className="flex-row items-center">
          <View className="bg-indigo-600 dark:bg-indigo-500 p-2 rounded-full mr-3">
            <MaterialCommunityIcons name="guitar-electric" size={24} color="#ffff" />
          </View>
          <Text className="text-2xl font-bold text-gray-800 dark:text-white">
            Meus Treinos
          </Text>
        </View>
        <View className="w-20 h-1 bg-indigo-500 dark:bg-indigo-400 mt-2 rounded-full" />
      </View>

      {/* Botão para adicionar novo treino */}
      <Pressable
        className="bg-indigo-600 dark:bg-indigo-600 p-4 rounded-lg mb-6 flex-row items-center justify-center"
        onPress={() => setShowModal(true)}
      >
        <MaterialCommunityIcons name="plus" size={20} color="white" />
        <Text className="text-white font-bold ml-2">Adicionar Treino</Text>
      </Pressable>

      {/* Treinos padrão */}
      {treinos.map((treino: TreinoType) => (
        <TreinoCard
          key={treino.id}
          id={treino.id}
          titulo={treino.titulo}
          descricao={treino.descricao}
          duracao={treino.duracao}
          nivel={treino.nivel}
          exerciciosCount={treino.exercicios.length}
          categoria={treino.categoria}
         
        />
      ))}

      {/* Treinos personalizados */}
      {customTreinos.map((treino: TreinoType) => (
        <TreinoCard
          key={treino.id}
          id={treino.id}
          titulo={treino.titulo}
          descricao={treino.descricao}
          duracao={treino.duracao}
          nivel={treino.nivel}
          exerciciosCount={treino.exerciciosCount}
          categoria={treino.categoria}
          onDelete={() => handleDeleteTreino(treino.id)} // Adicione esta prop
         
        />
      ))}

      <Modal
        visible={showModal}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowModal(false)}
      >
        <ScrollView 
          className="flex-1 bg-black/50 dark:bg-neutral-950"
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        >
          <View className="w-full bg-white dark:bg-neutral-900 dark:border dark:border-gray-600 p-6 rounded-lg">
  {/* Cabeçalho */}
  <Text className="text-xl font-bold text-gray-800 dark:text-white mb-4">
    Criar Novo Treino
  </Text>

  {/* Seção: Informações Básicas do Treino */}
  <View className="mb-6">
    <Text className="text-lg font-semibold text-gray-800 dark:text-white mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">
      Informações do Treino
    </Text>
    
    <TextInput
       className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 mb-4 text-gray-800 dark:text-white"
       placeholder="Título do treino*"
       placeholderTextColor="#9CA3AF"
       value={novoTreino.titulo}
       onChangeText={(text) => setNovoTreino({...novoTreino, titulo: text})}
       onFocus={() => setNovoTreino(prev => ({...prev}))} // Força atualização do estado
       keyboardType="default"
       returnKeyType="done"
       
    />

    <TextInput
       className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 mb-4 text-gray-800 dark:text-white h-20"
       placeholder="Descrição*"
       placeholderTextColor="#9CA3AF"
       multiline
       value={novoTreino.descricao}
       onChangeText={(text) => setNovoTreino({...novoTreino, descricao: text})}
       onFocus={() => setNovoTreino(prev => ({...prev}))} // Força atualização do estado
       keyboardType="default"
       returnKeyType="default"
    />

    <View className="flex-row gap-4 mb-4">
      <View className="flex-1">
        <Text className="text-gray-800 dark:text-white mb-2">Categoria*</Text>
        <View className="flex-row flex-wrap gap-2">
          {['técnica', 'teoria', 'repertório', 'improvisação'].map((cat) => (
            <Pressable
              key={cat}
              className={`px-3 py-1 rounded-full ${novoTreino.categoria === cat ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'}`}
              onPress={() => setNovoTreino({...novoTreino, categoria: cat as any})}
            >
              <Text className={novoTreino.categoria === cat ? 'text-white' : 'text-gray-800 dark:text-white'}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View className="flex-1">
        <Text className="text-gray-800 dark:text-white mb-2">Nível*</Text>
        <View className="flex-row flex-wrap gap-2">
          {['iniciante', 'intermediário', 'avançado'].map((nivel) => (
            <Pressable
              key={nivel}
              className={`px-3 py-1 rounded-full ${novoTreino.nivel === nivel ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'}`}
              onPress={() => setNovoTreino({...novoTreino, nivel: nivel as any})}
            >
              <Text className={novoTreino.nivel === nivel ? 'text-white' : 'text-gray-800 dark:text-white'}>
                {nivel.charAt(0).toUpperCase() + nivel.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>

    <View className="flex-row items-center justify-between mb-2">
      <Text className="text-gray-800 dark:text-white">Tempo de Descanso*</Text>
      <View className="flex-row items-center gap-4">
        <Pressable
          className="bg-gray-200 dark:bg-gray-700 w-8 h-8 items-center justify-center rounded-lg"
          onPress={() => setNovoTreino({...novoTreino, restTime: Math.max(10, (novoTreino.restTime ?? 30) - 5)})}
        >
          <Text className="text-gray-800 dark:text-white">-</Text>
        </Pressable>
        <Text className="text-gray-800 dark:text-white">
          {novoTreino.restTime}s
        </Text>
        <Pressable
          className="bg-gray-200 dark:bg-gray-700 w-8 h-8 items-center justify-center rounded-lg"
          onPress={() => setNovoTreino({...novoTreino, restTime: (novoTreino.restTime ?? 30) + 5})}
        >
          <Text className="text-gray-800 dark:text-white">+</Text>
        </Pressable>
      </View>
    </View>
  </View>

  {/* Seção: Exercícios */}
  <View className="mb-6">
    <Text className="text-lg font-semibold text-gray-800 dark:text-white mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">
      Exercícios ({novoTreino.exercicios.length})
    </Text>

    {novoTreino.exercicios.length > 0 ? (
      <View className="mb-4 gap-2">
        {novoTreino.exercicios.map((exercicio) => (
          <View key={exercicio.id} className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
            <View className="flex-row justify-between items-start mb-2">
              <Text className="text-lg font-bold text-gray-800 dark:text-white">
                {exercicio.titulo}
              </Text>
              <Pressable onPress={() => removerExercicio(exercicio.id)}>
                <MaterialCommunityIcons name="delete-outline" size={20} color="#ef4444" />
              </Pressable>
            </View>
            
            {exercicio.descricao && (
              <Text className="text-gray-600 dark:text-gray-300 mb-2">
                {exercicio.descricao}
              </Text>
            )}

            <View className="flex-row flex-wrap gap-2">
              <View className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded-full">
                <Text className="text-blue-800 dark:text-blue-200 text-xs">
                  {exercicio.repeticoes} {exercicio.repeticoes === 1 ? 'repetição' : 'repetições'}
                </Text>
              </View>
              
              <View className="bg-green-100 dark:bg-green-900 px-2 py-1 rounded-full">
                <Text className="text-green-800 dark:text-green-200 text-xs">
                  {exercicio.duracao}s
                </Text>
              </View>
              
              {exercicio.metronomo && (
                <View className="bg-purple-100 dark:bg-purple-900 px-2 py-1 rounded-full">
                  <Text className="text-purple-800 dark:text-purple-200 text-xs">
                    ♪ {exercicio.metronomo} BPM
                  </Text>
                </View>
              )}
            </View>

            {exercicio.dica && (
              <View className="mt-2 bg-yellow-100 dark:bg-yellow-900 p-2 rounded">
                <Text className="text-yellow-800 dark:text-yellow-200 text-sm">
                  💡 {exercicio.dica}
                </Text>
              </View>
            )}
          </View>
        ))}
      </View>
    ) : (
      <Text className="text-gray-500 dark:text-gray-400 mb-4 text-center">
        Nenhum exercício adicionado ainda
      </Text>
    )}

    {showExercicioForm ? (
      <View className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <Text className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
          Novo Exercício
        </Text>

        <TextInput
          className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 mb-3 text-gray-800 dark:text-white"
          placeholder="Título do exercício*"
          placeholderTextColor="#9CA3AF"
          value={novoExercicio.titulo}
          onChangeText={(text) => setNovoExercicio({...novoExercicio, titulo: text})}
        />

        <TextInput
          className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 mb-3 text-gray-800 dark:text-white h-16"
          placeholder="Descrição"
          placeholderTextColor="#9CA3AF"
          multiline
          value={novoExercicio.descricao}
          onChangeText={(text) => setNovoExercicio({...novoExercicio, descricao: text})}
        />

        <View className="flex-row gap-4 mb-3">
          <View className="flex-1">
            <Text className="text-gray-800 dark:text-white mb-1">Repetições*</Text>
            <View className="flex-row items-center gap-2">
              <Pressable
                className="bg-gray-200 dark:bg-gray-700 w-8 h-8 items-center justify-center rounded-lg"
                onPress={() => setNovoExercicio({...novoExercicio, repeticoes: Math.max(1, novoExercicio.repeticoes - 1)})}
              >
                <Text className="text-gray-800 dark:text-white">-</Text>
              </Pressable>
              <TextInput
                className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-gray-800 dark:text-white text-center"
                keyboardType="numeric"
                value={novoExercicio.repeticoes.toString()}
                onChangeText={(text) => setNovoExercicio({...novoExercicio, repeticoes: parseInt(text) || 1})}
              />
              <Pressable
                className="bg-gray-200 dark:bg-gray-700 w-8 h-8 items-center justify-center rounded-lg"
                onPress={() => setNovoExercicio({...novoExercicio, repeticoes: novoExercicio.repeticoes + 1})}
              >
                <Text className="text-gray-800 dark:text-white">+</Text>
              </Pressable>
            </View>
          </View>

          <View className="flex-1">
            <Text className="text-gray-800 dark:text-white mb-1">Duração (s)*</Text>
            <View className="flex-row items-center gap-2">
              <Pressable
                className="bg-gray-200 dark:bg-gray-700 w-8 h-8 items-center justify-center rounded-lg"
                onPress={() => setNovoExercicio({...novoExercicio, duracao: Math.max(30, novoExercicio.duracao - 30)})}
              >
                <Text className="text-gray-800 dark:text-white">-</Text>
              </Pressable>
              <TextInput
                className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-gray-800 dark:text-white text-center"
                keyboardType="numeric"
                value={novoExercicio.duracao.toString()}
                onChangeText={(text) => setNovoExercicio({...novoExercicio, duracao: parseInt(text) || 60})}
              />
              <Pressable
                className="bg-gray-200 dark:bg-gray-700 w-8 h-8 items-center justify-center rounded-lg"
                onPress={() => setNovoExercicio({...novoExercicio, duracao: novoExercicio.duracao + 30})}
              >
                <Text className="text-gray-800 dark:text-white">+</Text>
              </Pressable>
            </View>
          </View>
        </View>

        <TextInput
          className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 mb-3 text-gray-800 dark:text-white"
          placeholder="Metrônomo (BPM, opcional)"
          placeholderTextColor="#9CA3AF"
          keyboardType="numeric"
          value={novoExercicio.metronomo?.toString() || ''}
          onChangeText={(text) => setNovoExercicio({...novoExercicio, metronomo: parseInt(text) || undefined})}
        />

        <TextInput
          className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 mb-3 text-gray-800 dark:text-white"
          placeholder="Dica (opcional)"
          placeholderTextColor="#9CA3AF"
          value={novoExercicio.dica}
          onChangeText={(text) => setNovoExercicio({...novoExercicio, dica: text})}
        />

        <TextInput
          className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 mb-4 text-gray-800 dark:text-white"
          placeholder="URL do vídeo (opcional)"
          placeholderTextColor="#9CA3AF"
          value={novoExercicio.videoUrl}
          onChangeText={(text) => setNovoExercicio({...novoExercicio, videoUrl: text})}
        />

        <View className="flex-row gap-2">
          <Pressable
            className="flex-1 bg-gray-200 dark:bg-gray-700 p-3 rounded-lg items-center"
            onPress={() => setShowExercicioForm(false)}
          >
            <Text className="text-gray-800 dark:text-white">Cancelar</Text>
          </Pressable>
          <Pressable
            className="flex-1 bg-green-600 p-3 rounded-lg items-center"
            onPress={adicionarExercicio}
            disabled={!novoExercicio.titulo.trim()}
          >
            <Text className="text-white font-bold">Adicionar</Text>
          </Pressable>
        </View>
      </View>
    ) : (
      <Pressable
        className="bg-indigo-600 p-3 rounded-lg items-center flex-row justify-center gap-2"
        onPress={() => setShowExercicioForm(true)}
      >
        <MaterialCommunityIcons name="plus" size={20} color="white" />
        <Text className="text-white font-bold">Adicionar Exercício</Text>
      </Pressable>
    )}
  </View>

  {/* Resumo e Botões de Ação */}
  <View className="bg-indigo-100 dark:bg-indigo-900 p-3 rounded-lg mb-4">
    <Text className="text-indigo-800 dark:text-indigo-200 font-bold text-center">
      Duração Total: {novoTreino.duracao} minutos • {novoTreino.exercicios.length} exercícios
    </Text>
  </View>

  <View className="flex-row gap-3">
    <Pressable
      className="flex-1 bg-gray-200 dark:bg-gray-700 px-4 py-3 rounded-lg items-center"
      onPress={() => setShowModal(false)}
    >
      <Text className="text-gray-800 dark:text-white">Cancelar</Text>
    </Pressable>
    <Pressable
      className={`flex-1 px-4 py-3 rounded-lg items-center ${novoTreino.titulo && novoTreino.descricao && novoTreino.exercicios.length > 0 ? 'bg-indigo-600' : 'bg-indigo-400'}`}
      onPress={() => adicionarTreino({
        ...novoTreino,
        id: `custom-${Date.now()}`,
        exerciciosCount: novoTreino.exercicios.length
      })}
      disabled={!novoTreino.titulo || !novoTreino.descricao || novoTreino.exercicios.length === 0}
    >
      <Text className="text-white font-bold">
        Salvar Treino
      </Text>
    </Pressable>
  </View>
</View>
        </ScrollView>
      </Modal>
      
    </ScrollView>
  );
}