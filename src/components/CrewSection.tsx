import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface CrewMember {
  name: string;
  job: string;
}

interface CrewSectionProps {
  title: string;
  crew: CrewMember[];
}

const jobTranslations: { [key: string]: string } = {
  Director: 'Diretor',
  Screenplay: 'Argumentista',
  Writer: 'Escritor',
};

export default function CrewSection({ title, crew }: CrewSectionProps) {
  
  if (!crew || crew.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {crew.map((member, index) => (
        <View key={`${member.name}-${index}`} style={styles.memberContainer}>
          <Text style={styles.name}>{member.name}</Text>
          <Text style={styles.job}>{jobTranslations[member.job] || member.job}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  memberContainer: {
    marginBottom: 8,
  },
  name: {
    color: '#E5E5E5',
    fontSize: 16,
    fontWeight: '600',
  },
  job: {
    color: '#92929D',
    fontSize: 14,
  },
});