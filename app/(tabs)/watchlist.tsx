import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

export default function WatchlistScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Sua Lista de Desejos</Text>
        <Text style={styles.subtitle}>Filmes que você salvar serão exibidos aqui.</Text>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#242A32' },
  content: { padding: 20 },
  title: { color: 'white', fontSize: 24, fontWeight: 'bold' },
  subtitle: { color: '#92929D', fontSize: 16, marginTop: 10 }
});