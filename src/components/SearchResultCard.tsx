import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { FontAwesome, Feather, AntDesign } from '@expo/vector-icons';
import { Link } from 'expo-router'; 

interface MovieDetail {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  runtime: number;
  genres: { id: number; name: string }[];
}

interface SearchResultCardProps {
  movie: MovieDetail;
}

export default function SearchResultCard({ movie }: SearchResultCardProps) {
  const getYear = (date: string) => (date ? date.split('-')[0] : 'N/A');
  const getFirstGenre = (genres: { name: string }[]) => (genres && genres.length > 0 ? genres[0].name : 'N/A');

  return (
    <Link href={`/movie/${movie.id}`} asChild>
      <TouchableOpacity style={styles.container}>
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w500/${movie.poster_path}` }}
          style={styles.poster}
        />
        <View style={styles.infoContainer}>
          <Text style={styles.title} numberOfLines={2}>{movie.title}</Text>
          <View style={styles.detailRow}>
            <FontAwesome name="star" size={14} color="#FFC319" />
            <Text style={styles.detailText}>{movie.vote_average.toFixed(1)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Feather name="tag" size={14} color="#E5E5E5" />
            <Text style={styles.detailText}>{getFirstGenre(movie.genres)}</Text>
          </View>
          <View style={styles.detailRow}>
            <AntDesign name="calendar" size={14} color="#E5E5E5" />
            <Text style={styles.detailText}>{getYear(movie.release_date)}</Text>
          </View>
          <View style={styles.detailRow}>
            <AntDesign name="clockcircleo" size={14} color="#E5E5E5" />
            <Text style={styles.detailText}>{movie.runtime} minutos</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#3A3F47',
    borderRadius: 16,
    padding: 10,
    marginBottom: 15,
  },
  poster: { width: 100, height: 140, borderRadius: 8 },
  infoContainer: { flex: 1, marginLeft: 15, justifyContent: 'center' },
  title: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  detailText: { color: '#E5E5E5', marginLeft: 8, fontSize: 14 },
});