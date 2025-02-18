import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { getVehicles } from '../services/api';
import VehicleCard from '../components/VehicleCard';

const VehiclesScreen = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    const data = await getVehicles();
    setVehicles(data);
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={vehicles}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <VehicleCard vehicle={item} />}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 }
});

export default VehiclesScreen;
