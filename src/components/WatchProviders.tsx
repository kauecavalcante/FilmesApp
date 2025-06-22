import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';


interface Provider {
  logo_path: string;
  provider_name: string;
}
interface WatchData {
  flatrate?: Provider[]; 
  rent?: Provider[];     
  buy?: Provider[];      
}

interface WatchProvidersProps {
  providers: {
    BR?: WatchData; 
  };
}


const ProviderSection = ({ title, data }: { title: string; data?: Provider[] }) => {
  if (!data || data.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.providerList}>
        {data.map((provider) => (
          <Image
            key={provider.provider_name}
            source={{ uri: `https://image.tmdb.org/t/p/w200/${provider.logo_path}` }}
            style={styles.logo}
          />
        ))}
      </View>
    </View>
  );
};

export default function WatchProviders({ providers }: WatchProvidersProps) {
  const watchData = providers?.BR;

  if (!watchData || (!watchData.flatrate && !watchData.rent && !watchData.buy)) {
    return (
      <Text style={styles.unavailableText}>
        Informações de onde assistir não disponíveis para esta região.
      </Text>
    );
  }

  return (
    <View style={styles.container}>
      <ProviderSection title="Streaming" data={watchData.flatrate} />
      <ProviderSection title="Alugar" data={watchData.rent} />
      <ProviderSection title="Comprar" data={watchData.buy} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  section: {
    marginBottom: 20,
  },
  title: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  providerList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: '#FFF',
  },
  unavailableText: {
    color: '#92929D',
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
  }
});