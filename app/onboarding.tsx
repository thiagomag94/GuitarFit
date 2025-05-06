import { View, Text, Pressable, StyleSheet, Animated, Easing } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '@/constants/Colors';
import { useColorScheme } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import LoadingScreen from '@/components/LoadingScreen';

export default function Onboarding() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  
  




  return (
    
      <LoadingScreen/>
   
  );
}
