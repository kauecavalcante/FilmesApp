import React from 'react';
import { View, Text, StyleSheet, FlatList, ImageBackground, TextStyle, TouchableOpacity } from 'react-native';
import { useFonts, Montserrat_600SemiBold } from '@expo-google-fonts/montserrat';
import { Link } from 'expo-router'; 

interface Movie {
  id: number;
  title: string;
  poster_path: string;
}

interface TrendingMoviesProps {
  data: Movie[];
}

function TrendingCard({ item, index }: { item: Movie; index: number }) {
  let [fontsLoaded] = useFonts({
    Montserrat_600SemiBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    
    <Link href={`/movie/${item.id}`} asChild>
      <TouchableOpacity>
        <ImageBackground
          source={{ uri: `https://image.tmdb.org/t/p/w500/${item.poster_path}` }}
          style={styles.poster}
          imageStyle={{ borderRadius: 16 }}
        >
          <View style={styles.numberContainer}>
            <Text style={styles.numberStroke}>{index + 1}</Text>
            <Text style={styles.numberFill}>{index + 1}</Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    </Link>
  );
}

export default function TrendingMovies({ data }: TrendingMoviesProps) {
  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContentContainer}
        renderItem={({ item, index }) => <TrendingCard item={item} index={index} />}
      />
    </View>
  );
}


const numberBase: TextStyle = {
  fontFamily: 'Montserrat_600SemiBold',
  fontSize: 96,
  lineHeight: 100,
};

const styles = StyleSheet.create({
  container: {
    height: 240,
    marginTop: 10,
  },
  listContentContainer: {
    paddingLeft: 15,
    paddingRight: 15,
  },
  poster: {
    width: 160,
    height: 240,
    marginHorizontal: 10,
    justifyContent: 'flex-end',
    position: 'relative',
    overflow: 'visible', 
  },
  numberContainer: {
    position: 'absolute',
    bottom: -30,
    left: -20,
  },
  numberStroke: {
    ...StyleSheet.absoluteFillObject,
    ...numberBase,
    color: '#0296E5',
    zIndex: 1,
  },
  numberFill: {
    ...numberBase,
    color: '#242A32',
    zIndex: 2,
    marginLeft: 1.5,
    marginTop: 1.5,
  },
});