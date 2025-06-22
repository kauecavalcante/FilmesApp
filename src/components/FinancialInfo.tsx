import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface FinancialInfoProps {
  title: string;
  amount: number;
}


const formatCurrency = (value: number) => {
  if (value === 0 || !value) {
    return '-'; 
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
};

export default function FinancialInfo({ title, amount }: FinancialInfoProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.amount}>{formatCurrency(amount)}</Text>
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
    marginBottom: 5,
  },
  amount: {
    color: '#E5E5E5',
    fontSize: 16,
  },
});