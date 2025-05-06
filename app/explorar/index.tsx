import { ScrollView, View, RefreshControl, useColorScheme } from 'react-native';
import Colors from '@/constants/Colors'; // Adjust the path based on your project structure
import ExploreHeader from '@/components/ExploreHeader';
import UserStories from '@/components/UserStories';
import PostCard from '@/components/PostCard';
import { useState } from 'react';
import {Post} from '@/types/PostType';

export default function ExploreScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const colorScheme = useColorScheme();
    const themeColors = Colors[colorScheme ?? 'light'];

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <View className="flex-1" >
      <ExploreHeader />
      
      <ScrollView
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor="#6366f1"
          />
        }
      >
        <UserStories />
        
        {/* Feed de Posts */}
        <View className="pb-20">
          {mockPosts.map((post, index) => (
            <PostCard key={`post-${index}`} post={post} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

// Substitua o mockPosts atual por:
const mockPosts: Post[] = [
    {
      id: '1',
      user: {
        id: 'user1',
        name: 'Carlos Shredder',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        level: 'Avançado',
        verified: true
      },
      content: {
        type: 'video',
        url: 'https://example.com/video1.mp4',
        thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        description: 'Dominando o sweep picking após 30 dias do desafio #GuitarFit',
        exercise: 'Sweep Picking - Arpejo de 3 cordas',
        bpm: 120,
        tags: ['GuitarFit', 'Desafio30Dias', 'SweepPicking'],
        duration: 86
      },
      stats: {
        likes: 142,
        comments: 28,
        shares: 12,
        saves: 45
      },
      timestamp: '2 horas atrás',
      liked: false,
      saved: true
    },
    // ... outros posts com tipos diferentes
  ];