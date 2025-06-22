import { useEffect, useState, useCallback } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  SafeAreaView, 
  ActivityIndicator, 
  Image, 
  TouchableOpacity,
  Platform, 
  StatusBar as RNStatusBar 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Link, useRouter } from 'expo-router';
import api from '../../src/services/api';
import SearchBar from '../../src/components/SearchBar';
import TrendingMovies from '../../src/components/TrendingMovies';
import CategoryMenu from '../../src/components/CategoryMenu';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
}

const CATEGORIES = [
  { key: 'upcoming', title: 'Próximos' },
  { key: 'now_playing', title: 'Em cartaz' },
  { key: 'top_rated', title: 'Melhor Avaliado' },
  { key: 'popular', title: 'Popular' },
];


const HomeHeader = ({ trendingMovies, activeCategory, onSelectCategory }: any) => {
  const router = useRouter();


  const handleSearchSubmit = (query: string) => {
    if (!query.trim()) return;
    router.push({
      pathname: '/(tabs)/search',
      params: { initialQuery: query }
    });
  };

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.title}>O que você quer assistir?</Text>
        <SearchBar onSearchSubmit={handleSearchSubmit} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tendências</Text>
        <TrendingMovies data={trendingMovies} />
      </View>
      
      <View style={styles.section}>
        <CategoryMenu 
          categories={CATEGORIES}
          activeCategory={activeCategory}
          onSelectCategory={onSelectCategory}
        />
      </View>
    </>
  );
};


export default function HomeScreen() {
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].key);
  const [categoryMovies, setCategoryMovies] = useState<Movie[]>([]);
  const [isCategoryLoading, setIsCategoryLoading] = useState(true);

  useEffect(() => {
    async function loadTrending() {
      try {
        const response = await api.get('/movie/popular');
        setTrendingMovies(response.data.results.slice(0, 5));
      } catch (error) {
        console.error("Erro ao buscar tendências:", error);
      }
    }
    loadTrending();
  }, []);

  useEffect(() => {
    async function fetchMoviesByCategory() {
      setIsCategoryLoading(true);
      try {
        const response = await api.get(`/movie/${activeCategory}`);
        let movies = response.data.results;
        
        if (activeCategory === 'upcoming') {
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          movies = movies.filter((movie: Movie) => {
            const releaseDate = new Date(movie.release_date);
            return releaseDate > today;
          });
        }
        
        setCategoryMovies(movies);
      } catch (error) {
        console.error(`Erro ao buscar a categoria ${activeCategory}:`, error);
      } finally {
        setIsCategoryLoading(false);
      }
    }

    fetchMoviesByCategory();
  }, [activeCategory]);

  const handleSelectCategory = useCallback((categoryKey: string) => {
    setActiveCategory(categoryKey);
  }, []);
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <FlatList
        data={isCategoryLoading ? [] : categoryMovies}
        numColumns={3}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={
          <HomeHeader 
            trendingMovies={trendingMovies}
            activeCategory={activeCategory}
            onSelectCategory={handleSelectCategory}
          />
        }
        renderItem={({ item }) => (
          <Link href={`/movie/${item.id}`} asChild>
            <TouchableOpacity style={styles.gridItem}>
              <Image
                source={{ uri: `https://image.tmdb.org/t/p/w500/${item.poster_path}` }}
                style={styles.poster}
              />
            </TouchableOpacity>
          </Link>
        )}
        ListFooterComponent={
          isCategoryLoading ? <ActivityIndicator size="large" color="#0296E5" style={{ marginVertical: 20 }} /> : null
        }
        contentContainerStyle={styles.gridContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#242A32',
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 20 : 0, 
  },
  title: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  section: {
    marginTop: 30,
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 20,
    marginBottom: 15,
  },
  gridContainer: {
    paddingHorizontal: 15,
  },
  gridItem: {
    flex: 1 / 3,
    margin: 5,
  },
  poster: {
    width: '100%',
    height: 150,
    borderRadius: 12,
  },
});