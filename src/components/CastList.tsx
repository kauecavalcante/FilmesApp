import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';

interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

interface CastListProps {
  cast: CastMember[];
}

export default function CastList({ cast }: CastListProps) {
  return (
    <FlatList
      data={cast}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.castMember}>
          <Image
            source={
              item.profile_path
                ? { uri: `https://image.tmdb.org/t/p/w200/${item.profile_path}` }
                : require('../../assets/images/not-found.png')
            }
            style={styles.image}
          />
          <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
        </View>
      )}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingTop: 15 },
  castMember: { marginRight: 15, width: 80, alignItems: 'center' },
  image: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#3A3F47' },
  name: { color: '#FFF', marginTop: 5, textAlign: 'center', fontSize: 12 },
});