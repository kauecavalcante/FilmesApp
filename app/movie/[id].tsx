// Local: app/movie/[id].tsx

import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, SafeAreaView, TouchableOpacity } from 'react-native'; // Adicionado TouchableOpacity
import { useLocalSearchParams } from 'expo-router';
import api from '../../src/services/api';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome, AntDesign, Feather } from '@expo/vector-icons';
import CastList from '../../src/components/CastList';
import WatchProviders from '../../src/components/WatchProviders';

// ... (A interface MovieDetail permanece a mesma)
interface MovieDetail {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  runtime: number;
  genres: { id: number; name:string }[];
  credits: {
    cast: { id: number; name: string; character: string; profile_path: string | null }[];
  };
  'watch/providers': {
    results: any;
  };
}


type ActiveTab = 'about' | 'watch' | 'cast';

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>('about');

  useEffect(() => {
    if (!id) return;
    async function fetchDetails() {
      setLoading(true);
      try {
        const response = await api.get(`/movie/${id}`, {
          params: { append_to_response: 'credits,watch/providers' }
        });
        setMovie(response.data);
      } catch (error) {
        console.error("Erro ao procurar detalhes do filme:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [id]);

  if (loading) {
     return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#242A32', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FFF" />
      </SafeAreaView>
    );
  }

  if (!movie) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#242A32', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={styles.errorText}>Filme não encontrado.</Text>
      </SafeAreaView>
    );
  }
  
  const getYear = (date: string) => (date ? date.split('-')[0] : '');
  const getFirstGenre = (genres: any[]) => (genres && genres.length > 0 ? genres[0].name : '');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'about':
        return <Text style={styles.overview}>{movie.overview || "Sinopse não disponível."}</Text>;
      case 'watch':
        return <WatchProviders providers={movie['watch/providers'].results} />;
      case 'cast':
        return <CastList cast={movie.credits.cast} />;
      default:
        return null;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.backdropContainer}>
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w1280/${movie.backdrop_path}` }}
          style={styles.backdrop}
        />
        <LinearGradient
          colors={['rgba(36, 42, 50, 0.2)', 'rgba(36, 42, 50, 0.8)', '#242A32']}
          locations={[0.5, 0.8, 1]}
          style={StyleSheet.absoluteFill}
        />
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.headerContent}>
          <Image
            source={{ uri: `https://image.tmdb.org/t/p/w500/${movie.poster_path}` }}
            style={styles.poster}
          />
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{movie.title}</Text>
          </View>
          <View style={styles.ratingContainer}>
            <FontAwesome name="star" size={16} color="#FFC319" />
            <Text style={styles.rating}>{movie.vote_average.toFixed(1)}</Text>
          </View>
        </View>
      
        <View style={styles.metadataContainer}>
          <AntDesign name="calendar" size={14} color="#92929D" />
          <Text style={styles.metadataText}>{getYear(movie.release_date)}</Text>
          <Text style={styles.separator}>|</Text>
          <AntDesign name="clockcircleo" size={14} color="#92929D" />
          <Text style={styles.metadataText}>{movie.runtime} minutos</Text>
          <Text style={styles.separator}>|</Text>
          <Feather name="tag" size={14} color="#92929D" />
          <Text style={styles.metadataText}>{getFirstGenre(movie.genres)}</Text>
        </View>

        <View style={styles.tabsContainer}>
          <TouchableOpacity onPress={() => setActiveTab('about')}>
            <Text style={[styles.tabText, activeTab === 'about' && styles.activeTabText]}>Sobre o Filme</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab('watch')}>
            <Text style={[styles.tabText, activeTab === 'watch' && styles.activeTabText]}>Onde Assistir</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab('cast')}>
            <Text style={[styles.tabText, activeTab === 'cast' && styles.activeTabText]}>Elenco</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tabContent}>
          {renderTabContent()}
        </View>
      </View>
    </ScrollView>
  );
}

// Estilos (Ajustes principais)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#242A32' },
  errorText: { color: 'white' },
  backdropContainer: { height: 250, width: '100%' },
  backdrop: { width: '100%', height: '100%' },
  contentContainer: { marginTop: -100 },
  headerContent: { 
    paddingHorizontal: 20, 
    flexDirection: 'row', 
    alignItems: 'flex-end',
    height: 180,
  },
  poster: { width: 120, height: 180, borderRadius: 16, borderWidth: 2, borderColor: 'white' },
  titleContainer: { 
    flex: 1, 
    marginLeft: 15, 
    justifyContent: 'flex-end',
  },
  title: { color: 'white', fontSize: 24, fontWeight: 'bold' },
  ratingContainer: { 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    borderRadius: 8, 
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    flexDirection: 'row', 
    alignItems: 'center', 
    position: 'absolute', 
    top: 0, 
    right: 20,
  },
  rating: { color: '#FFC319', marginLeft: 5, fontWeight: 'bold' },
  metadataContainer: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 20, 
    paddingHorizontal: 20 
  },
  metadataText: { color: '#E5E5E5', fontSize: 14, marginLeft: 5 },
  separator: { color: '#92929D', marginHorizontal: 10 },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3F47',
    marginHorizontal: 20,
  },
  tabText: {
    color: '#92929D',
    fontSize: 16,
    paddingBottom: 10,
  },
  activeTabText: {
    color: '#FFF',
    fontWeight: 'bold',
    borderBottomWidth: 3,
    borderBottomColor: '#0296E5',
  },
  tabContent: {
    padding: 20,
    minHeight: 200,
  },
  overview: {
    color: '#E5E5E5',
    fontSize: 14,
    lineHeight: 22,
  },
});
