import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ExploreHeader() {
  return (
    <View className="bg-white pt-12 pb-3 px-4 border-b border-gray-100">
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-2xl font-bold text-gray-900">Explorar</Text>
        <View className="flex-row space-x-3">
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={24} color="#1f2937" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="send-outline" size={24} color="#1f2937" />
          </TouchableOpacity>
        </View>
      </View>
      
      <View className="relative">
        <TextInput
          placeholder="Buscar exercícios, desafios..."
          className="bg-gray-100 rounded-lg py-2 pl-10 pr-4 text-gray-800"
        />
        <Ionicons 
          name="search" 
          size={18} 
          color="#6b7280" 
          style={{ position: 'absolute', left: 12, top: 12 }}
        />
      </View>
      
      <View className="flex-row mt-4 space-x-4">
        <TouchableOpacity className="bg-indigo-600 px-3 py-1 rounded-full">
          <Text className="text-white text-sm">Todos</Text>
        </TouchableOpacity>
        <TouchableOpacity className="px-3 py-1 rounded-full border border-gray-200">
          <Text className="text-gray-600 text-sm">Técnicas</Text>
        </TouchableOpacity>
        <TouchableOpacity className="px-3 py-1 rounded-full border border-gray-200">
          <Text className="text-gray-600 text-sm">Desafios</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}