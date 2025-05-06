import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import { Post, PostContent, UserLevel } from '@/types/PostType';

interface PostCardProps {
  post: Post;
  onLikePress?: (postId: string) => void;
  onCommentPress?: (postId: string) => void;
  onSharePress?: (postId: string) => void;
  onSavePress?: (postId: string) => void;
}

const getLevelColor = (level: UserLevel) => {
  switch(level) {
    case 'Iniciante': return 'text-green-600';
    case 'Intermediário': return 'text-yellow-600';
    case 'Avançado': return 'text-orange-600';
    case 'Professor': return 'text-purple-600';
    default: return 'text-gray-600';
  }
};

export default function PostCard({ 
  post, 
  onLikePress, 
  onCommentPress, 
  onSharePress, 
  onSavePress 
}: PostCardProps) {
  return (
    <View className="bg-white mb-4 border-b border-gray-100 pb-4">
      {/* Cabeçalho do Post */}
      <View className="flex-row items-center p-3">
        <Image
          source={{ uri: post.user.avatar }}
          className="w-10 h-10 rounded-full mr-3"
        />
        <View className="flex-1">
          <View className="flex-row items-center">
            <Text className="font-semibold mr-1">{post.user.name}</Text>
            {post.user.verified && (
              <Ionicons name="checkmark-circle" size={14} color="#6366f1" />
            )}
          </View>
          <Text className={`text-xs ${getLevelColor(post.user.level)}`}>
            {post.user.level} • {post.timestamp}
          </Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={20} color="#6b7280" />
        </TouchableOpacity>
      </View>
      
      {/* Conteúdo */}
      <View className="px-3 mb-2">
        <Text className="mb-1">{post.content.description}</Text>
        {post.content.exercise && (
          <View className="flex-row items-center">
            <MaterialCommunityIcons 
              name="guitar-electric" 
              size={16} 
              color="#6366f1" 
            />
            <Text className="text-indigo-600 text-sm ml-1">
              {post.content.exercise}
              {post.content.bpm && ` • ${post.content.bpm} BPM`}
            </Text>
          </View>
        )}
      </View>
      
      {/* Mídia - Renderização condicional por tipo */}
      {post.content.type === 'image' && (
        <Image
          source={{ uri: post.content.url }}
          className="w-full aspect-square"
        />
      )}
      
      {post.content.type === 'video' && (
        <View className="relative">
          <Image
            source={{ uri: post.content.thumbnail }}
            className="w-full aspect-square"
          />
          <View className="absolute inset-0 items-center justify-center">
            <Ionicons name="play-circle" size={48} color="rgba(255,255,255,0.8)" />
          </View>
        </View>
      )}
      
      {post.content.type === 'challenge' && (
        <View className="bg-indigo-50 p-4 mx-3 rounded-lg">
          <Text className="font-bold text-indigo-800">
            {post.content.challenge.challengeName}
          </Text>
          <Text className="text-indigo-600 text-sm mt-1">
            Progresso: {post.content.challenge.progress}
          </Text>
          <View className="mt-2 bg-white rounded-full h-2 overflow-hidden">
            <View 
              className="bg-indigo-600 h-full rounded-full" 
              style={{ 
                width: `${(post.content.challenge.daysCompleted / post.content.challenge.totalDays) * 100}%` 
              }} 
            />
          </View>
        </View>
      )}
      
      {/* Rodapé */}
      <View className="px-3 pt-3">
        <View className="flex-row justify-between">
          <View className="flex-row space-x-4">
            <TouchableOpacity 
              className="flex-row items-center"
              onPress={() => onLikePress?.(post.id)}
            >
              <FontAwesome 
                name={post.liked ? "heart" : "heart-o"} 
                size={20} 
                color={post.liked ? "#ef4444" : "#1f2937"} 
              />
              <Text className="text-gray-600 ml-1">{post.stats.likes}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className="flex-row items-center"
              onPress={() => onCommentPress?.(post.id)}
            >
              <FontAwesome name="comment-o" size={20} color="#1f2937" />
              <Text className="text-gray-600 ml-1">{post.stats.comments}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className="flex-row items-center"
              onPress={() => onSharePress?.(post.id)}
            >
              <FontAwesome name="send-o" size={18} color="#1f2937" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => onSavePress?.(post.id)}>
            <Ionicons 
              name={post.saved ? "bookmark" : "bookmark-outline"} 
              size={22} 
              color="#1f2937" 
            />
          </TouchableOpacity>
        </View>
        
        {/* Comentários recentes */}
        {post.stats.comments > 0 && (
          <View className="mt-2">
            <Text className="text-gray-500 text-sm">
              <Text className="font-semibold text-gray-800">João</Text> Que evolução incrível! Parabéns 👏
            </Text>
            <TouchableOpacity onPress={() => onCommentPress?.(post.id)}>
              <Text className="text-gray-500 text-sm mt-1">
                Ver todos os {post.stats.comments} comentários
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}