import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { useEffect, useRef } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useColorScheme } from 'react-native';

export default function LoadingScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  
  const spinValue = useRef(new Animated.Value(0)).current;
  const progressValue = useRef(new Animated.Value(0)).current;

  // Animação de rotação e progresso
  useEffect(() => {
    Animated.parallel([
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1500,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ),
      Animated.timing(progressValue, {
        toValue: 1,
        duration: 2500,
        easing: Easing.quad,
        useNativeDriver: false,
      })
    ]).start();
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const progressWidth = progressValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <MaterialCommunityIcons 
          name="music-circle" 
          size={80} 
          color={theme.tabIconSelected}
        />
      </Animated.View>
      
      <Text style={[styles.title, { color: theme.text }]}>Guitar Trainer</Text>
      <Text style={[styles.subtitle, { color: theme.tabIconDefault }]}>
        Preparando tudo para você...
      </Text>
      
      <View style={[styles.progressBarContainer, { backgroundColor: colorScheme === 'dark' ? '#1f2937' : '#e5e7eb' }]}>
        <Animated.View 
          style={[
            styles.progressBar,
            { 
              backgroundColor: theme.tabIconSelected,
              width: progressWidth,
            }
          ]} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
    maxWidth: 300,
  },
  progressBarContainer: {
    height: 4,
    width: 200,
    borderRadius: 2,
    marginTop: 20,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
});