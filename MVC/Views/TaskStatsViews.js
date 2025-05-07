import React, { useEffect, useState } from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  ScrollView,
  RefreshControl
} from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { Text, Surface } from 'react-native-paper';
import taskController from '../Controllers/taskController';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TaskStatsViews({ navigation }) {
  const [stats, setStats] = useState({
    Pendiente: 0,
    'En progreso': 0,
    Completada: 0,
  });
  const [refreshing, setRefreshing] = useState(false);

  const loadStats = async () => {
    const userId = await AsyncStorage.getItem('userId');
    if (!userId) return;
    const tasks = await taskController.getTasksByUserId(userId);
    const counts = { Pendiente: 0, 'En progreso': 0, Completada: 0 };
    tasks.forEach(task => {
      if (counts[task.status] !== undefined) counts[task.status]++;
    });
    setStats(counts);
  };

  useEffect(() => {
    loadStats();
    const unsub = navigation.addListener('focus', loadStats);
    return unsub;
  }, [navigation]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
  };

  const total = stats.Pendiente + stats['En progreso'] + stats.Completada;

  // Prepara datos del gráfico
  const chartData = [
    { name: 'Pendiente', count: stats.Pendiente, color: '#FF6B6B' },
    { name: 'En progreso', count: stats['En progreso'], color: '#FFD93D' },
    { name: 'Completada', count: stats.Completada, color: '#6BCB77' },
  ];

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#6BCB77']}
          tintColor="#6BCB77"
        />
      }
    >
      <Text variant="titleLarge" style={styles.pageTitle}>
        Estadísticas de Tareas
      </Text>

      <Surface style={styles.chartSurface} elevation={2}>
        <PieChart
          data={chartData.map(item => ({
            name: item.name,
            count: item.count,
            color: item.color,
            legendFontColor: '#333',
            legendFontSize: 12,
          }))}
          width={Dimensions.get('window').width - 40}
          height={200}
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
            decimalPlaces: 0,
          }}
          accessor="count"
          backgroundColor="transparent"
          paddingLeft="0"
          absolute
          hasLegend={false}
        />
        <View style={styles.legendContainer}>
          {chartData.map((item, i) => (
            <View key={i} style={styles.legendItem}>
              <View
                style={[styles.legendColor, { backgroundColor: item.color }]}
              />
              <Text variant="bodyMedium">
                {item.name}: {item.count}
              </Text>
            </View>
          ))}
        </View>
      </Surface>

      <View style={styles.statusGrid}>
        {[
          ...chartData,
          { name: 'Total', count: total, color: '#3B82F6' }
        ].map((item, i) => (
          <Surface
            key={i}
            style={[styles.statusCard, { borderLeftColor: item.color }]}
            elevation={1}
          >
            <Text variant="bodyMedium" style={styles.statusLabel}>
              {item.name}
            </Text>
            <Text variant="titleMedium" style={styles.statusCount}>
              {item.count}
            </Text>
          </Surface>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F8FAFC',
    flexGrow: 1,
    gap: 20,
  },
  pageTitle: {
    fontWeight: '600',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 16,
  },
  chartSurface: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
  },
  legendContainer: {
    marginTop: 16,
    width: '100%',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  statusCard: {
    width: '48%',
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 4,
  },
  statusLabel: {
    color: '#64748B',
    marginBottom: 4,
  },
  statusCount: {
    fontWeight: '600',
    color: '#1E293B',
  },
});