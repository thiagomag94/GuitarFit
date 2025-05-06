import { View, Text, TouchableOpacity, ImageBackground, useColorScheme, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';
import Colors from '@/constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TreinoType } from '@/types/TreinoType';

interface TreinoCardProps {
  id: string;
  titulo: string;
  descricao?: string;
  duracao: number;
  categoria: 'técnica' | 'teoria' | 'repertório' | 'improvisação'| 'placeholder' | undefined;
  nivel: 'iniciante' | 'intermediário' | 'avançado';
  exerciciosCount: number;
  customImageUrl?: string;
  onPress?: () => void;
  onDelete?: () => void; // Nova prop para deletar
}

const DEFAULT_IMAGES = {
  'técnica': require('../assets/images/tecnica-bg.jpg'),
  'teoria': require('../assets/images/teoria-bg.jpg'),
  'repertório': require('../assets/images/repertorio-bg.jpg'),
  'improvisação': require('../assets/images/improvisacao-bg.jpg'),
  'placeholder': require('../assets/images/placeholder-bg.jpg')
};

export default function TreinoCard({
  id,
  titulo,
  descricao,
  duracao,
  categoria,
  nivel,
  exerciciosCount,
  customImageUrl,
  onPress,
  onDelete
}: TreinoCardProps) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];

  const getNivelColor = () => {
    switch(nivel) {
      case 'iniciante': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200';
      case 'intermediário': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
      case 'avançado': return 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getCategoriaIcon = () => {
    switch(categoria) {
      case 'técnica': return 'guitar-pick';
      case 'teoria': return 'music-circle';
      case 'repertório': return 'playlist-music';
      case 'improvisação': return 'auto-fix';
      default: return 'music-note';
    }
  };

  const getCategoryImage = () => {
    return customImageUrl ? { uri: customImageUrl } : DEFAULT_IMAGES[categoria || 'placeholder'];
  };

  const handleDelete = () => {
    Alert.alert(
      "Confirmar exclusão",
      `Deseja realmente excluir o treino "${titulo}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", onPress: onDelete, style: "destructive" }
      ]
    );
  };

  const handlePress = async () => {
    if (onPress) {
      onPress();
    } else {
      try {
        if (id.startsWith('custom-')) {
          const saved = await AsyncStorage.getItem('@customTreinos');
          const customTreinos = saved ? JSON.parse(saved) : [];
          const treino = customTreinos.find((t: TreinoType) => t.id === id);
          
          if (treino) {
            router.push({
              pathname: '/treino/[id]',
              params: {
                ...treino,
                isCustom: 'true',
                exerciciosCount: treino.exercicios.length.toString(),
                exercicios: JSON.stringify(treino.exercicios),
                duracao: treino.duracao.toString(),
                restTime: treino.restTime?.toString() || '30'
              }
            });
          }
        } else {
          router.push({
            pathname: '/treino/[id]',
            params: {
              id,
              titulo,
              descricao: descricao || '',
              duracao: duracao.toString(),
              categoria: categoria || '',
              nivel,
              exerciciosCount: exerciciosCount.toString(),
              isCustom: 'false'
            }
          });
        }
      } catch (error) {
        console.error('Erro ao navegar para treino:', error);
      }
    }
  };

  return (
    <Menu>
      <MenuTrigger customStyles={{
        triggerWrapper: {
          borderRadius: 12,
          overflow: 'hidden',
          marginBottom: 20
        }
      }}>
        <View className="w-full rounded-2xl overflow-hidden shadow-lg shadow-black/80 dark:border dark:border-neutral-800 dark:shadow-black/20">
          <ImageBackground
            source={getCategoryImage()}
            className="h-40 justify-end"
            resizeMode="cover"
            imageStyle={{ 
              opacity: 0.97,
              backgroundColor: colorScheme === 'dark' ? '#0a0a0a' : '#f8fafc'
            }}
          >
            <LinearGradient
              colors={['rgba(0,0,0,0.9)', 'rgba(0,0,0,0.4)', 'transparent']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              className="absolute inset-0"
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              className="absolute bottom-0 left-0 right-0 h-1/2"
            />
            
            <View className="p-5">
              <View className="flex-row justify-between items-start">
                <Text className="text-xl font-bold text-white flex-1 pr-2">
                  {titulo}
                </Text>
                <View className="flex-row items-center">
                  <View className={`px-2 py-1 rounded-full ${getNivelColor()}`}>
                    <Text className="text-xs  capitalize dark:text-gray-300">
                      {nivel}
                    </Text>
                  </View>
                  <MaterialCommunityIcons 
                    name="dots-vertical" 
                    size={24} 
                    color="white"
                    style={{ marginLeft: 10 }}
                  />
                </View>
              </View>
            </View>
          </ImageBackground>

          <View className="bg-white dark:bg-neutral-950 p-5">
            {descricao && (
              <Text 
                className="text-gray-600 dark:text-gray-300 mb-3 text-sm"
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {descricao}
              </Text>
            )}

            <View className="flex-row items-center mb-4">
              <View className="flex-row items-center mr-4">
                <Ionicons 
                  name="time-outline" 
                  size={16} 
                  color={colorScheme === 'light' ? "#6b7280" : "#a1a1aa"} 
                />   
                <Text className="text-gray-600 dark:text-gray-300 ml-1.5 text-sm">
                  {duracao} min
                </Text>
              </View>
              <View className="flex-row items-center">
                <MaterialCommunityIcons 
                  name="dumbbell" 
                  size={16} 
                  color={colorScheme === 'light' ? "#6b7280" : "#a1a1aa"}
                />
                <Text className="text-gray-600 dark:text-gray-300 ml-1.5 text-sm">
                  {exerciciosCount} {exerciciosCount === 1 ? 'exercício' : 'exercícios'}
                </Text>
              </View>
            </View>

            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full">
                <MaterialCommunityIcons 
                  name={getCategoriaIcon()} 
                  size={16} 
                  color={colorScheme === 'light' ? "#4f46e5" : "#818cf8"} 
                />
                <Text className="text-indigo-600 dark:text-indigo-400 ml-2 text-sm capitalize">
                  {categoria}
                </Text>
              </View>

              <TouchableOpacity
                className="flex-row items-center bg-indigo-600 dark:bg-indigo-700 px-4 py-2 rounded-full"
                onPress={handlePress}
              >
                <Text className="text-white font-medium mr-2">Iniciar</Text>
                <FontAwesome name="play" size={14} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </MenuTrigger>

      <MenuOptions customStyles={{
        optionsContainer: {
          backgroundColor: themeColors.background,
          borderRadius: 8,
          padding: 8,
          borderWidth: 1,
          borderColor: colorScheme === 'dark' ? '#374151' : '#e5e7eb',
          width: 150
        }
      }}>
        <MenuOption onSelect={handlePress}>
          <View className="flex-row items-center p-2">
            <MaterialCommunityIcons 
              name="play" 
              size={20} 
              color={themeColors.text} 
            />
            <Text className="ml-2 dark:text-white">Iniciar</Text>
          </View>
        </MenuOption>
        
        <MenuOption onSelect={() => router.push({
          pathname: '/treino/[id]',
          params: { id, isCustom: id.startsWith('custom-') ? 'true' : 'false' }
        })}>
          <View className="flex-row items-center p-2">
            <MaterialCommunityIcons 
              name="pencil" 
              size={20} 
              color={themeColors.text} 
            />
            <Text className="ml-2 dark:text-white">Editar</Text>
          </View>
        </MenuOption>
        
        {onDelete && (
          <MenuOption onSelect={handleDelete}>
            <View className="flex-row items-center p-2">
              <MaterialCommunityIcons 
                name="delete" 
                size={20} 
                color="#ef4444" 
              />
              <Text className="ml-2 text-red-500">Excluir</Text>
            </View>
          </MenuOption>
        )}
      </MenuOptions>
    </Menu>
  );
}