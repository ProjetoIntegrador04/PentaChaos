import React from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';

// Coordenadas e raio definidos aqui ou passados como props
const sorocabaCoords = { latitude: -23.5017, longitude: -47.4580, latitudeDelta: 0.04, longitudeDelta: 0.04 };
const pointLocation = { latitude: -23.5017, longitude: -47.4580 };
const geofenceRadius = 1000;

// Este componente SÓ será usado no mobile
export default function MapDisplay() {
  return (
    <MapView
      style={styles.map}
      initialRegion={sorocabaCoords}
      scrollEnabled={false}
      zoomEnabled={false}
    >
      <Marker coordinate={pointLocation} />
      <Circle
        center={pointLocation}
        radius={geofenceRadius}
        strokeColor="rgba(255, 0, 0, 0.5)"
        fillColor="rgba(255, 0, 0, 0.2)"
      />
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject, // Faz o mapa preencher o container
  },
});