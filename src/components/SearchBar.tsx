import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Platform } from 'react-native'; 
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface SearchBarProps {
  initialQuery?: string;
}

export default function SearchBar({ initialQuery = '' }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);


  const handleSearch = () => {
    if (!query.trim()) return;
    router.push(`/search?query=${query}`);
  };

  return (
    <View style={styles.container}>
      <Feather name="search" size={20} color="#E5E5E5" style={styles.icon} />
      <TextInput
        // @ts-ignore: 'outline' é um estilo válido apenas para a web.
        style={[styles.input, Platform.OS === 'web' && { outline: 'none' }]}
        placeholder="Buscar filmes..."
        placeholderTextColor="#92929D"
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={handleSearch}
        returnKeyType="search"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#3A3F47',
    height: 42,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginVertical: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#FEFEFE',
  },
});
