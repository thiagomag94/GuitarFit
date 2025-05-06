import { View, Text } from 'react-native';
import { SplashScreen, Redirect } from 'expo-router';
import { useEffect, useState } from 'react';



export default function Index() {
  const [isReady, setIsReady] = useState(false);

  

 

  return (
   <Redirect href="/onboarding" /> // Redireciona para a tela inicial após o carregamento
  );
}