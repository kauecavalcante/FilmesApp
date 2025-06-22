import { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, SafeAreaView, TouchableOpacity, Modal, Linking, Platform, BackHandler } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { WebView } from 'react-native-webview';
import api from '../../src/services/api';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome, AntDesign, Feather } from '@expo/vector-icons';
import CastList from '../../src/components/CastList';
import WatchProviders from '../../src/components/WatchProviders';
import CrewSection from '../../src/components/CrewSection';
import FinancialInfo from '../../src/components/FinancialInfo';


interface MovieDetail {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  runtime: number;
  budget: number;
  revenue: number;
  genres: { id: number; name:string }[];
  credits: {
    cast: { id: number; name: string; character: string; profile_path: string | null }[];
    crew: { id: number; name: string; job: string }[];
  };
  'watch/providers': {
    results: any;
  };
  videos: {
    results: { id: string; key: string; name: string; site: string; type: string }[];
  };
  release_dates: {
    results: {
      iso_3166_1: string;
      release_dates: { certification: string; }[];
    }[];
  };
}

type ActiveTab = 'about' | 'watch' | 'cast';

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>('about');
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [isTrailerVisible, setIsTrailerVisible] = useState(false);

  useEffect(() => {
    const handleBackButton = () => {
      if (isTrailerVisible) {
        setIsTrailerVisible(false);
        return true;
      }
      if (router.canGoBack()) {
        router.back();
      }
      return true; 
    };

    if (Platform.OS === 'android') {
      const subscription = BackHandler.addEventListener('hardwareBackPress', handleBackButton);
      return () => subscription.remove();
    }
  }, [isTrailerVisible, router]);

  useEffect(() => {
    if (!id) return;
    async function fetchDetails() {
      setLoading(true);
      try {
        const response = await api.get(`/movie/${id}`, {
          params: { append_to_response: 'credits,watch/providers,videos,release_dates' }
        });
        setMovie(response.data);

        const officialTrailer = response.data.videos?.results.find(
          (video: any) => video.site === 'YouTube' && video.type === 'Trailer'
        );
        
        if (officialTrailer) {
          setTrailerKey(officialTrailer.key);
        }
      } catch (error) {
        console.error("Erro ao procurar detalhes do filme:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [id]);

  const directors = useMemo(() => {
    return movie?.credits.crew.filter((member) => member.job === 'Director') || [];
  }, [movie]);

  const writers = useMemo(() => {
    return movie?.credits.crew.filter(
      (member) => member.job === 'Screenplay' || member.job === 'Writer'
    ) || [];
  }, [movie]);


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
  
  const getCertification = () => {
    const brRelease = movie?.release_dates.results.find(r => r.iso_3166_1 === 'BR');
    if (brRelease && brRelease.release_dates.length > 0) {
      const certification = brRelease.release_dates[0].certification;
      return certification || 'N/I'; // N/I = Não Informado
    }
    return 'N/I';
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'about':
        return (
          <View>
            <Text style={styles.overview}>{movie.overview || "Sinopse não disponível."}</Text>
            <CrewSection title="Direção" crew={directors} />
            <CrewSection title="Roteiro" crew={writers} />
            <FinancialInfo title="Orçamento" amount={movie.budget} />
            <FinancialInfo title="Receita" amount={movie.revenue} />
          </View>
        );
      case 'watch':
        return <WatchProviders providers={movie['watch/providers'].results} />;
      case 'cast':
        return <CastList cast={movie.credits.cast} />;
      default:
        return null;
    }
  };
  
  const handlePlayTrailer = () => {
    if (!trailerKey) return;

    if (Platform.OS === 'web') {
      Linking.openURL(`https://www.youtube.com/watch?v=${trailerKey}`);
    } else {
      setIsTrailerVisible(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
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
          
          {trailerKey && (
            <TouchableOpacity style={styles.playButton} onPress={handlePlayTrailer}>
              <FontAwesome name="play-circle" size={60} color="rgba(255, 255, 255, 0.8)" />
            </TouchableOpacity>
          )}
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
            <Text style={styles.separator}>|</Text>
            <View style={styles.certificationBox}>
              <Text style={styles.certificationText}>{getCertification()}</Text>
            </View>
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

      <Modal
        visible={isTrailerVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsTrailerVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={() => setIsTrailerVisible(false)}>
            <AntDesign name="close" size={32} color="white" />
          </TouchableOpacity>
          <View style={styles.webviewContainer}>
            <WebView
              source={{ uri: `https://www.youtube.com/embed/${trailerKey}` }}
              javaScriptEnabled={true}
              domStorageEnabled={true}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#242A32' },
  errorText: { color: 'white', fontSize: 16, textAlign: 'center' },
  backdropContainer: { 
    height: 250, 
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: { width: '100%', height: '100%', position: 'absolute' },
  playButton: {
    zIndex: 10,
  },
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
  certificationBox: {
    borderColor: '#92929D',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  certificationText: {
    color: '#E5E5E5',
    fontSize: 12,
    fontWeight: '600',
  },
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
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
  },
  webviewContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
});