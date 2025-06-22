// Local: app/(auth)/onboarding.tsx

import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native'; // CORREÇÃO AQUI
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function OnboardingScreen() {
  return (
    <ImageBackground
      // Certifique-se que esta imagem existe em 'assets'
      source={require('../../assets/images/splash-icon.png')} 
      style={styles.container}
    >
      <LinearGradient
        colors={['transparent', 'rgba(36, 42, 50, 0.8)', '#242A32']}
        locations={[0.4, 0.7, 1]}
        style={styles.gradient}
      />
      <View style={styles.content}>
        <Text style={styles.title}>Bem-vindo ao FilmesApp</Text>
        <Text style={styles.subtitle}>Descubra, organize e explore o mundo do cinema.</Text>
        <Link href="/login" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Entrar agora</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'flex-end',
    backgroundColor: '#000',
  },
  gradient: { 
    ...StyleSheet.absoluteFillObject 
  },
  content: { 
    padding: 30, 
    paddingBottom: 60,
    alignItems: 'center' 
  },
  title: { 
    color: 'white', 
    fontSize: 32, 
    fontWeight: 'bold', 
    textAlign: 'center' 
  },
  subtitle: { 
    color: '#E5E5E5', 
    fontSize: 18, 
    textAlign: 'center', 
    marginTop: 10, 
    marginBottom: 30 
  },
  button: {
    backgroundColor: 'rgba(2, 150, 229, 0.8)', // Tom de azul do app
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  buttonText: { 
    color: 'white', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
});