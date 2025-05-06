import { View, Text, ScrollView, TouchableOpacity, Linking, useColorScheme } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { treinos } from '@/data/treinos';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import TreinoType, { ExercicioType } from '@/types/TreinoType';
import { Colors } from 'react-native/Libraries/NewAppScreen';


type CardExercicioProps = {
  exercicio: ExercicioType;
  index: number;
  onPress?: () => void;
};

export default function CardExercicio({ exercicio, index, onPress }: CardExercicioProps) {
  const handleVideoPress = () => {
    if (exercicio.videoUrl) {
      Linking.openURL(exercicio.videoUrl).catch(err => 
        console.error("Failed to open video:", err)
      );
    }
  };
   const colorScheme = useColorScheme();
    const themeColors = Colors[colorScheme ?? 'light'];

  return (
    <TouchableOpacity 
      onPress={onPress}
      activeOpacity={0.9}
      className="bg-white border border-gray-200 rounded-xl p-4 mb-3 shadow-sm dark:shadow-sm dark:bg-neutral-900 dark:border-gray-700"
    >
      {/* Cabeçalho do Card */}
      <View className="flex-row justify-between items-start mb-2">
        {/* Número e Título */}
        <View className="flex-row items-center flex-1">
          <View className="bg-blue-100 w-7 h-7 rounded-full justify-center items-center mr-3">
            <Text className="text-blue-600 font-bold">{index + 1}</Text>
          </View>
          <Text className="text-lg font-semibold text-gray-900 flex-1 dark:text-white">
            {exercicio.titulo}
          </Text>
        </View>

        {/* Ícone de vídeo (se disponível) */}
        {exercicio.videoUrl && (
          <TouchableOpacity 
            onPress={handleVideoPress}
            className="ml-2"
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          >
            <FontAwesome name="youtube-play" size={24} color="#FF0000" />
          </TouchableOpacity>
        )}
      </View>

      {/* Descrição */}
      <Text className="text-gray-600 mb-3 dark:text-gray-400">{exercicio.descricao}</Text>

      {/* Metadados */}
      <View className="flex-row flex-wrap gap-2">
        {/* Repetições */}
        {exercicio.repeticoes > 0 && (
          <View className="flex-row items-center bg-gray-100 px-3 py-1 rounded-full dark:bg-indigo-400">
            <FontAwesome name="repeat" size={14} color={`${colorScheme==='light' ? "#6b7280" : '#fff'}`} />
            <Text className="text-gray-700 ml-2 text-sm dark:text-white">
              {exercicio.repeticoes} rep.
            </Text>
          </View>
        )}

        {/* Metrônomo */}
        {exercicio.metronomo && (
          <View className="flex-row items-center bg-gray-100 px-3 py-1 rounded-full dark:bg-indigo-400">
            <FontAwesome name="tachometer" size={14}  color={`${colorScheme==='light' ? "#6b7280" : '#fff'}`} />
            <Text className="text-gray-700 ml-2 text-sm dark:text-white">
              {exercicio.metronomo} BPM
            </Text>
          </View>
        )}

        {/* Duração estimada (calculada) */}
        <View className="flex-row items-center bg-gray-100 px-3 py-1 rounded-full dark:bg-indigo-400">
          <FontAwesome name="clock-o" size={14} color={`${colorScheme==='light' ? "#6b7280" : '#fff'}`}  />
          <Text className="text-gray-700 ml-2 text-sm dark:text-white">
            {exercicio.repeticoes > 0 
              ? `${Math.ceil(exercicio.repeticoes / 2)} min` 
              : '3 min'}
          </Text>
        </View>
      </View>

      {/* Dica (se existir) */}
      {exercicio.dica && (
        <View className="mt-3 bg-blue-50 p-3 rounded-lg border border-blue-100 ">
          <Text className="text-blue-800 text-sm">
            <Text className="font-bold">💡 Dica: </Text>
            {exercicio.dica}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}