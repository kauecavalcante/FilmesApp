import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useRouter } from 'expo-router';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../src/services/firebaseConfig';
import { StatusBar } from 'expo-status-bar';
import { AntDesign } from '@expo/vector-icons';


const registerSchema = z.object({
  name: z.string().min(3, "O nome precisa de pelo menos 3 caracteres."),
  dob: z.string().refine(val => /^\d{2}\/\d{2}\/\d{4}$/.test(val), "Use o formato DD/MM/AAAA").refine(val => {
    const [day, month, year] = val.split('/').map(Number);
    const eighteenYearsAgo = new Date();
    eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
    const birthDate = new Date(year, month - 1, day);
    return birthDate <= eighteenYearsAgo;
  }, "Você precisa ter pelo menos 18 anos."),
  email: z.string().email("Por favor, insira um e-mail válido."),
  password: z.string().min(6, "A senha precisa de no mínimo 6 caracteres.")
    .regex(/[A-Z]/, "Precisa de ao menos uma letra maiúscula.")
    .regex(/[0-9]/, "Precisa de ao menos um número.")
    .regex(/[^A-Za-z0-9]/, "Precisa de ao menos um caractere especial."),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "As senhas não correspondem.",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterScreen() {
  const router = useRouter();
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur'
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;
      
      await updateProfile(user, { displayName: data.name });

      await setDoc(doc(db, "users", user.uid), {
        name: data.name,
        dob: data.dob,
        email: data.email
      });

      Alert.alert("Sucesso!", "A sua conta foi criada com sucesso.");
      router.replace('/(tabs)/home');

    } catch (error: any) {
      console.error(error);
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert("Erro no Cadastro", "Este endereço de e-mail já está a ser utilizado por outra conta.");
      } else {
        Alert.alert("Erro no Cadastro", "Ocorreu um erro inesperado. Por favor, tente novamente.");
      }
    }
  };
  
  
  const applyDateMask = (text: string) => {
    const cleaned = text.replace(/\D/g, ''); 
    const match = cleaned.match(/^(\d{0,2})(\d{0,2})(\d{0,4})$/);
    if (!match) return '';
    
   
    const [, day, month, year] = match;

    
    let formatted = '';
    if (day) formatted += day;
    if (month) formatted += `/${month}`;
    if (year) formatted += `/${year}`;
    
    return formatted;
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <StatusBar style="light" />
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <AntDesign name="left" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.title}>Criar Conta</Text>
          </View>
          
          <Text style={styles.subtitle}>Complete os seus dados para começar a explorar.</Text>

          <Controller control={control} name="name" render={({ field: { onChange, onBlur, value } }) => (
            <TextInput placeholder="Nome completo" style={styles.input} value={value} onChangeText={onChange} onBlur={onBlur} placeholderTextColor="#92929D" />
          )} />
          {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}

          
          <Controller 
            control={control} 
            name="dob" 
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput 
                placeholder="Data de Nascimento (DD/MM/AAAA)" 
                style={styles.input} 
                value={value} 
                onChangeText={(text) => onChange(applyDateMask(text))} 
                onBlur={onBlur} 
                placeholderTextColor="#92929D" 
                keyboardType="numeric"
                maxLength={10} 
              />
            )} 
          />
          {errors.dob && <Text style={styles.errorText}>{errors.dob.message}</Text>}
          
          <Controller control={control} name="email" render={({ field: { onChange, onBlur, value } }) => (
            <TextInput placeholder="E-mail" style={styles.input} value={value} onChangeText={onChange} onBlur={onBlur} placeholderTextColor="#92929D" autoCapitalize="none" keyboardType="email-address" />
          )} />
          {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

          <Controller control={control} name="password" render={({ field: { onChange, onBlur, value } }) => (
            <TextInput placeholder="Senha" style={styles.input} value={value} onChangeText={onChange} onBlur={onBlur} placeholderTextColor="#92929D" secureTextEntry />
          )} />
          {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

          <Controller control={control} name="confirmPassword" render={({ field: { onChange, onBlur, value } }) => (
            <TextInput placeholder="Confirmar Senha" style={styles.input} value={value} onChangeText={onChange} onBlur={onBlur} placeholderTextColor="#92929D" secureTextEntry />
          )} />
          {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>}

          <TouchableOpacity style={[styles.button, isSubmitting && styles.buttonDisabled]} onPress={handleSubmit(onSubmit)} disabled={isSubmitting}>
            <Text style={styles.buttonText}>Cadastrar</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Já tem uma conta? </Text>
            <Link href="/login" asChild>
              <TouchableOpacity>
                <Text style={styles.linkText}>Faça Login</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: '#242A32',
    },
    container: { 
        flexGrow: 1, 
        justifyContent: 'center', 
        paddingHorizontal: 30,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    backButton: {
        position: 'absolute',
        left: 0,
        zIndex: 1,
        padding: 5,
    },
    title: { 
        flex: 1,
        fontSize: 32, 
        fontWeight: 'bold', 
        color: 'white', 
        textAlign: 'center', 
    },
    subtitle: {
        color: '#92929D',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 40,
    },
    input: { 
        backgroundColor: '#3A3F47', 
        color: 'white', 
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 16, 
        marginBottom: 5, 
        fontSize: 16 
    },
    button: { 
        backgroundColor: '#0296E5', 
        padding: 15, 
        borderRadius: 16, 
        alignItems: 'center', 
        marginTop: 20 
    },
    buttonDisabled: {
        backgroundColor: '#5A788A',
    },
    buttonText: { 
        color: 'white', 
        fontSize: 18, 
        fontWeight: 'bold' 
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 30,
    },
    footerText: {
        color: '#92929D',
        fontSize: 16,
    },
    linkText: { 
        color: '#0296E5',
        fontSize: 16,
        fontWeight: 'bold'
    },
    errorText: { 
        color: '#FF5A5F', 
        marginBottom: 10, 
        marginLeft: 5,
        alignSelf: 'flex-start' 
    }
});