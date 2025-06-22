import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import api from '../../src/services/api';


import SearchBar from '../../src/components/SearchBar';
import TrendingMovies from '../../src/components/TrendingMovies';
import CategoryMenu from '../../src/components/CategoryMenu';
import MovieGrid from '../../src/components/MovieGrid';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
}

const CATEGORIES = [
  { key: 'now_playing', title: 'Em cartaz' },
  { key: 'upcoming', title: 'Próximos' },
  { key: 'top_rated', title: 'Melhor Avaliado' },
  { key: 'popular', title: 'Popular' },
];

export default function HomeScreen() {
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  

  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].key);
  const [categoryMovies, setCategoryMovies] = useState<Movie[]>([]);
  const [isCategoryLoading, setIsCategoryLoading] = useState(false);
  
  const [isPageLoading, setIsPageLoading] = useState(true);

  
  useEffect(() => {
    async function loadInitialData() {
      try {
        const [trendingResponse, categoryResponse] = await Promise.all([
          api.get('/movie/popular'),
          api.get(`/movie/${activeCategory}`)
        ]);
        
        setTrendingMovies(trendingResponse.data.results.slice(0, 5));
        setCategoryMovies(categoryResponse.data.results);

      } catch (error) {
        console.error("Erro ao buscar dados iniciais:", error);
      } finally {
        setIsPageLoading(false);
      }
    }
    loadInitialData();
  }, [activeCategory]); 

  
  const handleSelectCategory = async (categoryKey: string) => {
    if (categoryKey === activeCategory) return;

    setIsCategoryLoading(true);
    setActiveCategory(categoryKey);

    try {
      const response = await api.get(`/movie/${categoryKey}`);
      setCategoryMovies(response.data.results);
    } catch (error) {
      console.error(`Erro ao buscar a categoria ${categoryKey}:`, error);
    } finally {
      setIsCategoryLoading(false);
    }
  };

  if (isPageLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#FFF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>O que você quer assistir?</Text>
          <SearchBar />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tendências</Text>
          <TrendingMovies data={trendingMovies} />
        </View>
        
        <View style={styles.section}>
          <CategoryMenu 
            categories={CATEGORIES}
            activeCategory={activeCategory}
            onSelectCategory={handleSelectCategory}
          />
          {isCategoryLoading ? (
            <ActivityIndicator size="large" color="#0296E5" style={{ marginTop: 20 }} />
          ) : (
            <MovieGrid movies={categoryMovies} />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#242A32',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 20,
  },
});
