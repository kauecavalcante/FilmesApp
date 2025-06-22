import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function EmptyState() {
  return (
    <View style={styles.container}>
      <Image
       
        source={require('../../assets/images/not-found.png')} 
        style={styles.image}
      />
      <Text style={styles.title}>Desculpe, não encontramos o filme :(</Text>
      <Text style={styles.subtitle}>Tente buscar por outro título.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 50,
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    color: '#92929D',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
});
