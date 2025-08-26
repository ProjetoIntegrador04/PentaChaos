import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const RANKING_DATA = [
  { id: '1', name: 'Ana', score: 1500 },
  { id: '2', name: 'Bruno', score: 1450 },
  { id: '3', name: 'Carla', score: 1200 },
  { id: '4', name: 'Daniel', score: 950 },
  { id: '5', name: 'Elisa', score: 800 },
];

export default function RankingScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ranking de Usuários </Text>
      <FlatList
        data={RANKING_DATA}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View style={styles.rankItem}>
            <Text style={styles.position}>{index + 1}º</Text>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.score}>{item.score} pts</Text>
          </View>
        )}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2B73BB'
  },
  list: {
    width: '100%',
  },
  rankItem: {
    flexDirection: 'row',
    padding: 15,
    marginHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  position: {
    fontSize: 18,
    fontWeight: 'bold',
    width: 40,
  },
  name: {
    fontSize: 18,
    flex: 1,
  },
  score: {
    fontSize: 16,
    color: '#2B73BB',
    fontWeight: '500',
  },
});