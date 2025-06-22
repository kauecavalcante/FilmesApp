// Local: app/(auth)/login.tsx
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../src/services/firebaseConfig';

const loginSchema = z.object({
  email: z.string().email("E-mail inválido."),
  password: z.string().min(1, "A senha é obrigatória."),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const router = useRouter();
  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      router.replace('/(tabs)/home');
    } catch (error: any) {
      Alert.alert("Erro no Login", "E-mail ou senha incorretos.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      
      <Controller control={control} name="email" render={({ field: { onChange, onBlur, value } }) => (
        <TextInput placeholder="E-mail" style={styles.input} value={value} onChangeText={onChange} onBlur={onBlur} autoCapitalize="none" keyboardType="email-address" />
      )} />
      {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

      <Controller control={control} name="password" render={({ field: { onChange, onBlur, value } }) => (
        <TextInput placeholder="Senha" style={styles.input} value={value} onChangeText={onChange} onBlur={onBlur} secureTextEntry />
      )} />
      {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
      
      <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <Link href="/register" style={styles.link}>
        <Text>Não tem conta? Cadastre-se</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 30, backgroundColor: '#242A32' },
    title: { fontSize: 32, fontWeight: 'bold', color: 'white', textAlign: 'center', marginBottom: 40 },
    input: { backgroundColor: '#3A3F47', color: 'white', padding: 15, borderRadius: 10, marginBottom: 15, fontSize: 16 },
    button: { backgroundColor: '#0296E5', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
    buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
    link: { marginTop: 20, alignSelf: 'center', color: '#0296E5' },
    errorText: { color: 'red', marginBottom: 10, alignSelf: 'flex-start' }
});