import { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import api from '../../src/services/api';


import SearchResultCard from '../../src/components/SearchResultCard';
import SearchBar from '../../src/components/SearchBar';
import EmptyState from '../../src/components/EmptyState'; 

interface MovieSearchResult {
  id: number;
}

interface MovieDetail {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  runtime: number;
  genres: { id: number; name: string }[];
}

export default function SearchScreen() {
  const { query } = useLocalSearchParams();
  const [results, setResults] = useState<MovieDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const searchQuery = Array.isArray(query) ? query[0] : query;

    if (!searchQuery) {
      setResults([]); 
      setLoading(false);
      return;
    }

    async function fetchSearchResults() {
      setLoading(true);
      try {
        const searchResponse = await api.get('/search/movie', {
          params: { query: searchQuery },
        });

        const movieResults = searchResponse.data.results;
        
        if (movieResults.length === 0) {
          setResults([]);
          return; 
        }

        const detailedMoviesPromises = movieResults.map((movie: MovieSearchResult) => 
          api.get(`/movie/${movie.id}`)
        );
        
        const detailedMoviesResponses = await Promise.all(detailedMoviesPromises);
        const detailedMovies = detailedMoviesResponses.map(response => response.data);

        setResults(detailedMovies);

      } catch (error) {
        console.error("Erro ao buscar resultados:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSearchResults();
  }, [query]);

  const initialSearchQuery = Array.isArray(query) ? query[0] : query || '';

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Busca', headerStyle: { backgroundColor: '#242A32' }, headerTintColor: '#FFF' }} />

      <View style={styles.searchContainer}>
        <SearchBar initialQuery={initialSearchQuery} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0296E5" style={{ flex: 1 }}/>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <SearchResultCard movie={item} />}
          ListEmptyComponent={<EmptyState />}
          contentContainerStyle={{ flexGrow: 1 }} 
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#242A32',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
});