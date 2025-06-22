import React from 'react';
import { Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface GenreCardProps {
  genreName: string;
  imageSource: any; 
  onPress: () => void;
}

export default function GenreCard({ genreName, imageSource, onPress }: GenreCardProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <ImageBackground
        source={imageSource}
        style={styles.container}
        imageStyle={styles.imageStyle}
      >
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.gradient}
        />
        <Text style={styles.title}>{genreName}</Text>
      </ImageBackground>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 100,
    width: '100%',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  imageStyle: {
    borderRadius: 16,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
  },
  title: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
});