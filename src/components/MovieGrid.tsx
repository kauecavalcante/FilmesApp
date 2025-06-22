import React from 'react';
import { StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router'; 

interface Movie {
  id: number;
  poster_path: string;
}

interface MovieGridProps {
  movies: Movie[];
}

export default function MovieGrid({ movies }: MovieGridProps) {
  return (
    <FlatList
      data={movies}
      keyExtractor={(item) => item.id.toString()}
      numColumns={3}
      renderItem={({ item }) => (

        <Link href={`/movie/${item.id}`} asChild>
          <TouchableOpacity style={styles.posterContainer}>
            <Image
              source={{ uri: `https://image.tmdb.org/t/p/w500/${item.poster_path}` }}
              style={styles.poster}
            />
          </TouchableOpacity>
        </Link>
      )}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
  },
  posterContainer: {
    flex: 1,
    margin: 5,
  },
  poster: {
    width: '100%',
    height: 150,
    borderRadius: 12,
  },
});