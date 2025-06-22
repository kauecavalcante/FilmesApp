import { useEffect, useState, useMemo } from 'react';
import { 
  View, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator, 
  Text, 
  SafeAreaView, 
  TouchableOpacity,
  Image
} from 'react-native';
import { useLocalSearchParams, Link } from 'expo-router';
import { AntDesign, Feather } from '@expo/vector-icons';
import api from '../../src/services/api';
import SearchBar from '../../src/components/SearchBar';
import EmptyState from '../../src/components/EmptyState';
import GenreCard from '../../src/components/GenreCard';
import SearchResultCard from '../../src/components/SearchResultCard';
import RatingFilterModal from '../../src/components/RatingFilterModal';


interface Movie {
  id: number;
  poster_path: string;
}
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
interface Genre {
  id: number;
  name: string;
}


const DISPLAY_GENRES: { [key: string]: any } = {
  'Animação': require('../../assets/images/animacao.jpg'),
  'Aventura': require('../../assets/images/aventura.jpg'),
  'Comédia': require('../../assets/images/comedia.jpg'),
  'Documentário': require('../../assets/images/documentario.jpg'),
  'Drama': require('../../assets/images/drama.jpg'),
  'Família': require('../../assets/images/familia.jpg'),
  'Ficção científica': require('../../assets/images/ficcao.jpg'),
  'Romance': require('../../assets/images/romance.jpg'),
  'Terror': require('../../assets/images/terror.jpg'),
};

const RATING_OPTIONS = ['L', '10', '12', '14', '16', '18'];

export default function SearchTabScreen() {
  const params = useLocalSearchParams<{ initialQuery?: string }>();
  
  
  const [query, setQuery] = useState(params.initialQuery || '');
  const [searchResults, setSearchResults] = useState<MovieDetail[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const [genreMovies, setGenreMovies] = useState<Movie[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isGenreLoading, setIsGenreLoading] = useState(false);

  
  const [selectedRatings, setSelectedRatings] = useState<string[]>([]);
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);

  
  useEffect(() => {
    api.get('/genre/movie/list').then(response => {
      setGenres(response.data.genres);
    });
  }, []);

  
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query.trim()) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }
      setIsSearching(true);
      try {
        const searchResponse = await api.get('/search/movie', { params: { query } });
        const movieResults = searchResponse.data.results;
        
        if (movieResults.length === 0) {
          setSearchResults([]);
        } else {
          const detailedMoviesPromises = movieResults.map((movie: MovieSearchResult) => 
            api.get(`/movie/${movie.id}`)
          );
          const detailedMoviesResponses = await Promise.all(detailedMoviesPromises);
          setSearchResults(detailedMoviesResponses.map(res => res.data));
        }
      } catch (error) {
        console.error("Erro ao buscar filmes:", error);
      } finally {
        setIsSearching(false);
      }
    };
    const timer = setTimeout(fetchSearchResults, 500);
    return () => clearTimeout(timer);
  }, [query]);

  
  useEffect(() => {
    if (!selectedGenre) return;

    const fetchMoviesByGenre = async () => {
      setIsGenreLoading(true);
      try {
        const apiParams: any = {
          with_genres: selectedGenre.id,
          page: currentPage,
          'certification.gte': '0',
          certification_country: 'BR',
        };

        if (selectedRatings.length > 0) {
          apiParams.certification = selectedRatings.join('|');
        }

        const response = await api.get('/discover/movie', { params: apiParams });
        
        if (currentPage === 1) {
          setGenreMovies(response.data.results);
        } else {
          setGenreMovies(prevMovies => {
            const newMovies = response.data.results;
            const combined = [...prevMovies, ...newMovies];
            const unique = combined.filter((movie, index, self) =>
              index === self.findIndex((m) => m.id === movie.id)
            );
            return unique;
          });
        }
        
        setTotalPages(response.data.total_pages);
      } catch (error) {
        console.error("Erro ao buscar por género:", error);
      } finally {
        setIsGenreLoading(false);
      }
    };

    fetchMoviesByGenre();
  }, [selectedGenre, currentPage, selectedRatings]);

  const handleGenrePress = (genre: Genre) => {
    setCurrentPage(1);
    setGenreMovies([]);
    setSelectedRatings([]);
    setSelectedGenre(genre);
  };

  const handleLoadMore = () => {
    if (!isGenreLoading && currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handleApplyFilter = (newRatings: string[]) => {
    setCurrentPage(1);
    setGenreMovies([]);
    setSelectedRatings(newRatings);
  };

  const genresToShow = useMemo(() => 
    genres.filter(genre => DISPLAY_GENRES[genre.name]), 
  [genres]);


  const renderContent = () => {
    if (query.trim()) {
      return isSearching ? 
        <ActivityIndicator size="large" color="#0296E5" style={{flex: 1}} /> : 
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={<EmptyState />}
          renderItem={({ item }) => <SearchResultCard movie={item} />}
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingTop: 10 }}
        />;
    }
  
    if (selectedGenre) {
      return (
        <>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setSelectedGenre(null)} style={styles.backButton}>
              <AntDesign name="left" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{selectedGenre.name}</Text>
            <TouchableOpacity onPress={() => setFilterModalVisible(true)} style={styles.filterButton}>
              <Feather name="filter" size={24} color="white" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={genreMovies}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            numColumns={3}
            contentContainerStyle={styles.gridContainer}
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
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={isGenreLoading ? <ActivityIndicator size="large" color="#0296E5" style={{marginVertical: 20}} /> : null}
          />
        </>
      );
    }
  
    return (
      <FlatList
        data={genresToShow}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <GenreCard
            genreName={item.name}
            imageSource={DISPLAY_GENRES[item.name]}
            onPress={() => handleGenrePress(item)}
          />
        )}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 10 }}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <SearchBar onQueryChange={setQuery} initialQuery={params.initialQuery} />
      </View>
      <View style={{flex: 1}}>
        {renderContent()}
      </View>
      <RatingFilterModal
        isVisible={isFilterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        ratings={RATING_OPTIONS}
        selectedRatings={selectedRatings}
        onApply={handleApplyFilter}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#242A32' },
  searchContainer: { paddingHorizontal: 20, paddingTop: 50, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#3A3F47' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingBottom: 20,
    justifyContent: 'space-between'
  },
  backButton: {
    padding: 5,
  },
  headerTitle: { 
    color: 'white', 
    fontSize: 22, 
    fontWeight: 'bold', 
  },
  filterButton: {
    padding: 5,
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