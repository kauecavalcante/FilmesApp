import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

interface Category {
  key: string;
  title: string;
}

interface CategoryMenuProps {
  categories: Category[];
  activeCategory: string;
  onSelectCategory: (key: string) => void;
}

export default function CategoryMenu({ categories, activeCategory, onSelectCategory }: CategoryMenuProps) {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      contentContainerStyle={styles.container}
    >
      {categories.map((category) => (
        <TouchableOpacity 
          key={category.key} 
          onPress={() => onSelectCategory(category.key)}
          style={styles.tab}
        >
          <Text 
            style={[
              styles.tabText, 
              activeCategory === category.key && styles.activeTabText
            ]}
          >
            {category.title}
          </Text>
          {activeCategory === category.key && <View style={styles.activeIndicator} />}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tab: {
    marginRight: 25,
    alignItems: 'center',
  },
  tabText: {
    color: '#92929D', 
    fontSize: 16,
  },
  activeTabText: {
    color: '#FFF', 
    fontWeight: 'bold',
  },
  activeIndicator: {
    height: 3,
    width: 25,
    backgroundColor: '#0296E5', 
    borderRadius: 2,
    marginTop: 5,
  },
});