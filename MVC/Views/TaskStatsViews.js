// Views/TaskStatsViews.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Platform,
  StatusBar,
} from 'react-native';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { Text, Surface } from 'react-native-paper';
import taskController from '../Controllers/taskController';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import 'moment/locale/es';
moment.locale('es');

export default function TaskStatsViews({ navigation }) {
  const [stats, setStats] = useState({
    Pendiente: 0,
    'En progreso': 0,
    Completada: 0,
  });
  const [weeklyPend, setWeeklyPend] = useState({});
  const [weeklyComp, setWeeklyComp] = useState({});
  const [refreshing, setRefreshing] = useState(false);

  const loadStats = async () => {
    const userId = await AsyncStorage.getItem('userId');
    if (!userId) return;
    const tasks = await taskController.getTasksByUserId(userId);

    // Estado global
    const counts = { Pendiente: 0, 'En progreso': 0, Completada: 0 };
    tasks.forEach(t => {
      if (counts[t.status] !== undefined) counts[t.status]++;
    });
    setStats(counts);

    // Inicializa 4 semanas genéricas
    const wPend = { 'Sem 1': 0, 'Sem 2': 0, 'Sem 3': 0, 'Sem 4': 0 };
    const wComp = { 'Sem 1': 0, 'Sem 2': 0, 'Sem 3': 0, 'Sem 4': 0 };
    // Asigna cada tarea a la semana relativa (0 = hace 3 semanas, 3 = actual)
    tasks.forEach(t => {
      const date = moment(t.due_date, 'DD-MM-YYYY');
      const diffWeeks = moment().diff(date, 'weeks');
      const idx = 3 - Math.min(diffWeeks, 3);
      const key = `Sem ${idx + 1}`;
      if (t.status === 'Pendiente') wPend[key]++;
      if (t.completed) wComp[key]++;
    });
    setWeeklyPend(wPend);
    setWeeklyComp(wComp);
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

  // PieChart data
  const slices = [
    { name: 'Pendiente',   count: stats.Pendiente,   color: '#FF6B6B' },
    { name: 'En progreso', count: stats['En progreso'], color: '#FFD93D' },
    { name: 'Completada',  count: stats.Completada,  color: '#6BCB77' },
  ].filter(s => s.count > 0);
  const pieData = slices.map(s => ({
    name: s.name,
    percent: total ? (s.count / total) * 100 : 0,
    color: s.color,
    legendFontColor: '#333',
    legendFontSize: 12,
  }));

  // BarChart labels and values (etiquetas uniformes)
  const weekLabels = ['Sem 1','Sem 2','Sem 3','Sem 4'];
  const pendValues = weekLabels.map(l => weeklyPend[l] || 0);
  const compValues = weekLabels.map(l => weeklyComp[l] || 0);

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
      <Text variant="bodyMedium" style={styles.totalText}>
        Total de tareas: {total}
      </Text>

      <Surface style={styles.chartSurface} elevation={2}>
        <PieChart
          data={pieData}
          width={Dimensions.get('window').width - 40}
          height={200}
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
            decimalPlaces: 1,
          }}
          accessor="percent"
          backgroundColor="transparent"
          paddingLeft="0"
          absolute
          hasLegend={false}
        />
        <View style={styles.legendContainer}>
          {slices.map((s, i) => {
            const pct = total ? (s.count / total) * 100 : 0;
            return (
              <View key={i} style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: s.color }]} />
                <Text variant="bodyMedium">
                  {s.name}: {s.count} ({pct.toFixed(1)}%)
                </Text>
              </View>
            );
          })}
        </View>
      </Surface>

      <Text variant="titleMedium" style={styles.barTitle}>
        Pendientes últimas 4 semanas
      </Text>
      <BarChart
        data={{
          labels: weekLabels,
          datasets: [{ data: pendValues }]
        }}
        width={Dimensions.get('window').width - 40}
        height={180}
        chartConfig={{
          backgroundColor: '#fff',
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          color: (opacity = 1) => `rgba(255,107,107,${opacity})`,
          decimalPlaces: 0,
          style: { borderRadius: 16 },
        }}
        style={styles.barChart}
        fromZero
        showValuesOnTopOfBars
        verticalLabelRotation={-30}
      />

      <Text variant="titleMedium" style={styles.barTitle}>
        Completadas últimas 4 semanas
      </Text>
      <BarChart
        data={{
          labels: weekLabels,
          datasets: [{ data: compValues }]
        }}
        width={Dimensions.get('window').width - 40}
        height={180}
        chartConfig={{
          backgroundColor: '#fff',
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          color: (opacity = 1) => `rgba(107,203,119,${opacity})`,
          decimalPlaces: 0,
          style: { borderRadius: 16 },
        }}
        style={styles.barChart}
        fromZero
        showValuesOnTopOfBars
        verticalLabelRotation={-30}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'android'
      ? (StatusBar.currentHeight || 0) + 12
      : 12,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#F8FAFC',
    flexGrow: 1,
    gap: 12,
  },
  pageTitle: {
    fontWeight: '600',
    color: '#1E293B',
    textAlign: 'center',
  },
  totalText: {
    fontSize: 16,
    color: '#475569',
    textAlign: 'center',
    marginBottom: 16,
  },
  chartSurface: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
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
  barTitle: {
    marginTop: 24,
    marginBottom: 8,
    fontWeight: '500',
    textAlign: 'center',
    color: '#1E293B',
  },
  barChart: {
    borderRadius: 16,
    backgroundColor: '#fff',
    alignSelf: 'center',
  },
});