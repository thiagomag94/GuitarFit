import FontAwesome from '@expo/vector-icons/FontAwesome';
import "../styles/global.css"
import { Tabs } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { View, Text} from 'react-native';
import { useColorScheme } from 'react-native';
import { Menu, MenuProvider } from 'react-native-popup-menu';
import Colors from '@/constants/Colors';
import { BlurView } from 'expo-blur';
export default function Layout() {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];

  return (
    <MenuProvider>
      <Tabs
     
     screenOptions={{
       tabBarActiveTintColor: themeColors.tabIconSelected,
       tabBarInactiveTintColor: themeColors.tabIconDefault,
       headerShown:false,
       tabBarStyle: {
         position: 'absolute',
         bottom:0,
         paddingTop:16,
         borderTopWidth: 1,
         borderColor: `${colorScheme === 'dark' ? '#1e293b' : '#e5e7eb'}`,
         borderBottomWidth:0,
         backgroundColor: themeColors.background,
         elevation: 0, 
         height: 70,
       },
      
       headerBackground: () => (
         <LinearGradient
           colors={colorScheme === 'dark' 
             ? ['#0f172a', '#1e293b'] 
             : ['#1e1b4b', '#312e81']}
           style={{ flex: 1 }}
           start={{ x: 0, y: 0 }}
           end={{ x: 1, y: 0 }}
         />
       ),
       headerTitleStyle: {
         color: themeColors.text,
         fontFamily: 'Inter-SemiBold',
         fontSize: 20,
       },
       headerTintColor: themeColors.text,
       headerTitleAlign: 'center',
     }}
   >
     <Tabs.Screen
       name="(tabs)/home"
       options={{
         title: "Home",
       
         tabBarIcon: ({ color, size }) => (
           <View className="items-center">
             <MaterialCommunityIcons 
               name="guitar-electric" 
               size={size} 
               color={color} 
             />
             <Text 
               style={{ color, fontFamily: 'Inter-Medium' }} 
               className="text-xs mt-1"
             >
              
             </Text>
           </View>
         ),
       }}
     />

     <Tabs.Screen
    
       name="explorar/index"
       options={{
         title: "Explorar",
         tabBarIcon: ({ color, size }) => (
           <View className="items-center">
             <Ionicons 
               name="compass" 
               size={size} 
               color={color} 
             />
             <Text 
               style={{ color, fontFamily: 'Inter-Medium' }} 
               className="text-xs mt-1"
             >
              
             </Text>
           </View>
         ),
       }}
     />

     <Tabs.Screen
       name="progresso"
       options={{
         title: "Progresso",
         tabBarIcon: ({ color, size }) => (
           <View className="items-center">
             <MaterialCommunityIcons 
               name="chart-line" 
               size={size} 
               color={color} 
             />
             <Text 
               style={{ color, fontFamily: 'Inter-Medium' }} 
               className="text-xs mt-1"
             >
              
             </Text>
           </View>
         ),
       }}
     />

     {/* Rotas ocultas */}
     <Tabs.Screen
       name="treino/treino/[id]/iniciar"
       options={{ href: null }}
     />
      
      <Tabs.Screen
       name="treino/[id]"
       options={{ href: null }}
     />
      <Tabs.Screen
        name="index"
        options={{ href: null }}    
      />
     <Tabs.Screen
       name="onboarding"
       options={{ href: null }}
     />
   </Tabs>
   
    </MenuProvider>
  );
}
