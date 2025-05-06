import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useColorScheme } from 'react-native';
import Slider from '@react-native-community/slider';

const Metronomo: React.FC<{ initialBpm?: number, isPlaying: boolean, setIsPlaying: any }> = ({ setIsPlaying, isPlaying, initialBpm }) => {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];
  
  const [bpm, setBpm] = useState<number>(initialBpm ?? 120); // Default to 120 BPM if undefined

  const [beat, setBeat] = useState<number>(0);
  const soundRef = useRef<Audio.Sound | null>(null);
  const beatsPerMeasure = 4; // Padrão 4/4

  // Carrega o som do metrônomo
  const loadSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('@/assets/audio/metronome-click.mp3') // Substitua pelo seu arquivo de som
    );
    soundRef.current = sound;
  };

  // Efeito para carregar/descarregar o som
  useEffect(() => {
    loadSound();
    return () => {
      soundRef.current?.unloadAsync();
    };
  }, []);

  // Efeito principal do metrônomo
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (isPlaying && soundRef.current) {
      const intervalTime = (60 / bpm) * 1000; // Calcula o intervalo em ms
      
      interval = setInterval(() => {
        setBeat(prev => (prev % beatsPerMeasure) + 1);
        soundRef.current?.replayAsync(); // Toca o som
      }, intervalTime);
    }

    return () => {
      clearInterval(interval);
      setBeat(0);
    };
  }, [isPlaying, bpm]);

  // Alterna entre play/pause
  const toggleMetronome = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <View className="p-4 bg-white dark:bg-transparent rounded-lg ">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-bold dark:text-white">Metrônomo</Text>
        
        <View className="flex-row items-center space-x-2">
          {[...Array(beatsPerMeasure)].map((_, i) => (
            <View 
              key={i}
              className={`w-4 h-4 rounded-full ${beat === i + 1 ? 'bg-indigo-500' : 'bg-gray-300 dark:bg-gray-500'}`}
            />
          ))}
        </View>
      </View>

      <View className="flex-row items-center space-x-4 mb-4">
        <Text className="text-gray-600 dark:text-gray-300">BPM:</Text>
        <Text className="font-bold dark:text-white">{bpm}</Text>
        
        <View className="flex-1">
          <Slider
            minimumValue={40}
            maximumValue={240}
            step={1}
            value={bpm}
            onValueChange={setBpm}
            minimumTrackTintColor={themeColors.tint}
            maximumTrackTintColor="#d1d5db"
            thumbTintColor={themeColors.tint}
          />
        </View>
      </View>

      <TouchableOpacity
        onPress={toggleMetronome}
        className={`flex-row items-center justify-center p-3 rounded-full ${isPlaying ? 'bg-red-500' : 'bg-neutral-600'}`}
      >
        <MaterialCommunityIcons 
          name={isPlaying ? 'pause' : 'play'} 
          size={24} 
          color="white" 
        />
        <Text className="text-white ml-2 font-bold">
          {isPlaying ? 'Parar' : 'Iniciar'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Metronomo;