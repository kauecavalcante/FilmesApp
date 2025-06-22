import { Stack, useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

export default function RootLayout() {
  const router = useRouter();

  return (
    <Stack>
     
      <Stack.Screen name="index" options={{ headerShown: false }} />

      
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      
      <Stack.Screen 
        name="movie/[id]" 
        options={{ 
          title: 'Detalhes',
          headerTransparent: true,
          headerTintColor: '#FFF',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 15 }}>
              <AntDesign name="left" size={24} color="white" />
            </TouchableOpacity>
          ),
        }} 
      />
    </Stack>
  );
}
