import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';

const stories = [
  { id: '1', name: 'Desafio Diário', avatar: 'https://img.icons8.com/color/96/guitar--v1.png' },
  { id: '2', name: 'GuitarFit', avatar: 'https://img.icons8.com/fluency/96/guitar.png' },
  { id: '3', name: 'Maria', avatar: 'https://randomuser.me/api/portraits/women/33.jpg' },
  { id: '4', name: 'Lucas', avatar: 'https://randomuser.me/api/portraits/men/22.jpg' },
  { id: '5', name: 'Banda X', avatar: 'https://img.icons8.com/color/96/rock-music.png' },
  { id: '6', name: 'Prof. Carlos', avatar: 'https://randomuser.me/api/portraits/men/75.jpg' },
];

export default function UserStories() {
  return (
    <View className="py-3 border-b border-gray-100 bg-white">
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-3">
        {stories.map((story) => (
          <TouchableOpacity key={story.id} className="items-center mx-2">
            <View className="border-2 border-indigo-500 rounded-full p-0.5">
              <Image
                source={{ uri: story.avatar }}
                className="w-16 h-16 rounded-full"
              />
            </View>
            <Text className="text-xs mt-1 text-gray-600">{story.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}