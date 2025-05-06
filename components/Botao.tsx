// src/components/Botao.tsx
import { Pressable, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

interface BotaoProps {
  onPress: () => void;
  texto: string;
  icone?: keyof typeof Ionicons.glyphMap;
}

export default function Botao({ onPress, texto, icone }: BotaoProps) {
  return (
    <Pressable
      onPress={onPress}
      className="mt-3 bg-blue-600 px-4 py-2 rounded-xl flex flex-cols items-center justify-center w-full"
    >
      <View className="flex-rows items-center w-full">
        {icone && <Ionicons name={icone} size={18} color="white"/>}
       
      </View>
      <Text className="text-white text-base font-medium ml-2">{texto}</Text>
    </Pressable>
  );
}
