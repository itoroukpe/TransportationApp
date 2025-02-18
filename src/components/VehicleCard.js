import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const VehicleCard = ({ vehicle }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{vehicle.name}</Text>
      <Text>Type: {vehicle.type}</Text>
      <Text>Capacity: {vehicle.capacity}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { padding: 15, marginBottom: 10, backgroundColor: '#f9f9f9', borderRadius: 5 },
  name: { fontSize: 18, fontWeight: 'bold' }
});

export default VehicleCard;
