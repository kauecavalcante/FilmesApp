import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { AntDesign, Feather } from '@expo/vector-icons';

interface RatingFilterModalProps {
  isVisible: boolean;
  onClose: () => void;
  ratings: string[];
  selectedRatings: string[];
  onApply: (selected: string[]) => void;
}

const areArraysEqual = (arr1: string[], arr2: string[]) => {
  if (arr1.length !== arr2.length) return false;
  const sortedArr1 = [...arr1].sort();
  const sortedArr2 = [...arr2].sort();
  return sortedArr1.every((value, index) => value === sortedArr2[index]);
};

export default function RatingFilterModal({
  isVisible,
  onClose,
  ratings,
  selectedRatings,
  onApply,
}: RatingFilterModalProps) {
  const [tempSelected, setTempSelected] = useState<string[]>(selectedRatings);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setTempSelected(selectedRatings);
      setIsDirty(false);
    }
  }, [isVisible, selectedRatings]);

  const toggleRating = (rating: string) => {
    const newSelection = tempSelected.includes(rating) 
      ? tempSelected.filter(r => r !== rating) 
      : [...tempSelected, rating];
    
    setTempSelected(newSelection);
    setIsDirty(!areArraysEqual(newSelection, selectedRatings));
  };
  
  const handleApplyOrClear = () => {
    if (!isDirty && selectedRatings.length > 0) {
      onApply([]);
    } else {
      onApply(tempSelected);
    }
    onClose();
  };

  const buttonText = !isDirty && selectedRatings.length > 0 ? 'Limpar Filtro' : 'Aplicar Filtros';

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Filtrar por Classificação</Text>
              <TouchableOpacity onPress={onClose}>
                <AntDesign name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.optionsContainer}>
              {ratings.map(rating => (
                <TouchableOpacity 
                  key={rating} 
                  style={styles.optionRow}
                  onPress={() => toggleRating(rating)}
                >
                  <Feather 
                    name={tempSelected.includes(rating) ? 'check-square' : 'square'}
                    size={24} 
                    color={tempSelected.includes(rating) ? '#0296E5' : '#92929D'}
                  />
                  <Text style={styles.optionText}>{rating === 'L' ? 'Livre' : `${rating} anos`}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.footer}>
              <TouchableOpacity style={styles.applyButton} onPress={handleApplyOrClear}>
                <Text style={styles.applyButtonText}>{buttonText}</Text>
              </TouchableOpacity>
            </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#2A313A',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#3A3F47',
    paddingBottom: 15,
  },
  headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  optionsContainer: {
    marginVertical: 10,
  },
  optionRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15 },
  optionText: { color: '#E5E5E5', fontSize: 18, marginLeft: 15 },
  footer: {
    paddingTop: 10,
  },
  applyButton: {
    backgroundColor: '#0296E5',
    borderRadius: 16,
    padding: 15,
    alignItems: 'center',
  },
  applyButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});