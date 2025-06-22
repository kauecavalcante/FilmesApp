import React from 'react';
import { StyleSheet, FlatList, Image, TouchableOpacity, Dimensions } from 'react-native'; // 1. Importar o Dimensions
import { Link } from 'expo-router';

interface Movie {
  id: number;
  poster_path: string;
}

interface MovieGridProps {
  movies: Movie[];
}


const NUM_COLUMNS = 3;
const PADDING_HORIZONTAL = 15;
const MARGIN_ITEM = 5;


const screenWidth = Dimensions.get('window').width;

const availableWidth = screenWidth - (PADDING_HORIZONTAL * 2);

const itemWidth = (availableWidth / NUM_COLUMNS) - (MARGIN_ITEM * 2);



export default function MovieGrid({ movies }: MovieGridProps) {
  return (
    <FlatList
      data={movies}
      keyExtractor={(item) => item.id.toString()}
      numColumns={NUM_COLUMNS}
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
    paddingHorizontal: PADDING_HORIZONTAL,
  },
  posterContainer: {
    width: itemWidth,
    margin: MARGIN_ITEM,
  },
  poster: {
    width: '100%',
    height: 150,
    borderRadius: 12,
  },
});