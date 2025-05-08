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
import { Text, Surface, useTheme, Chip, Divider } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import taskController from '../Controllers/taskController';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import 'moment/locale/es';
moment.locale('es');

export default function TaskStatsViews({ navigation }) {
  const { colors } = useTheme();
  const [stats, setStats] = useState({ Pendiente: 0, 'En progreso': 0, Completada: 0 });
  const [barData, setBarData] = useState({ labels: [], pending: [], completed: [] });
  const [priorityData, setPriorityData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState('week');

  const chartConfig = mainColor => ({
    backgroundColor: colors.surface,
    backgroundGradientFrom: colors.surface,
    backgroundGradientTo: colors.surface,
    decimalPlaces: 0,
    color: () => mainColor,
    labelColor: () => colors.onSurface,
    propsForLabels: { fontSize: 12 },
    barPercentage: 0.6,
  });

  const generateTimeSegments = () => {
    const segments = [];
    const format = timeRange === 'week' ? 'DD MMM' : timeRange === 'month' ? 'MMM YYYY' : 'YYYY';
    const unit = timeRange === 'week' ? 'week' : timeRange === 'month' ? 'month' : 'year';
    for (let i = 3; i >= 0; i--) {
      const date = moment().subtract(i, unit).startOf(unit);
      segments.push({ label: date.format(format), start: date.clone(), end: date.clone().endOf(unit) });
    }
    return segments;
  };

  const loadStats = async () => {
    const userId = await AsyncStorage.getItem('userId');
    if (!userId) return;
    const tasks = await taskController.getTasksByUserId(userId);

    const counts = { Pendiente: 0, 'En progreso': 0, Completada: 0 };
    const prioCounts = { Baja: 0, Media: 0, Alta: 0 };
    const segments = generateTimeSegments();
    const pend = Array(4).fill(0);
    const comp = Array(4).fill(0);

    tasks.forEach(t => {
      counts[t.status]++;
      const date = moment(t.due_date, 'DD-MM-YYYY');

      segments.forEach((seg, idx) => {
        if (date.isBetween(seg.start, seg.end, null, '[]')) {
          if (t.status === 'Pendiente') pend[idx]++;
          if (t.status === 'Completada') comp[idx]++;
        }
      });

      // Solo contar prioridades en el último segmento visible
      const lastSegment = segments[3];
      if (date.isBetween(lastSegment.start, lastSegment.end, null, '[]')) {
        prioCounts[t.priority]++;
      }
    });

    setStats(counts);
    setBarData({
      labels: segments.map(s => s.label),
      pending: pend,
      completed: comp,
    });
    setPriorityData(
      Object.entries(prioCounts).map(([label, value]) => ({
        label,
        value,
        color:
          label === 'Alta' ? '#FF6B6B' : label === 'Media' ? '#FFD93D' : '#6BCB77',
      }))
    );
  };

  useEffect(() => {
    loadStats();
    const unsub = navigation.addListener('focus', loadStats);
    return unsub;
  }, [navigation, timeRange]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
  };

  const total = stats.Pendiente + stats['En progreso'] + stats.Completada;
  const completionRate = total ? (stats.Completada / total) * 100 : 0;

  const slices = [
    { name: 'Pendiente', count: stats.Pendiente, color: '#FF6B6B' },
    { name: 'En progreso', count: stats['En progreso'], color: '#FFD93D' },
    { name: 'Completada', count: stats.Completada, color: '#6BCB77' },
  ]
    .filter(s => s.count > 0)
    .map(s => ({
      name: s.name,
      count: s.count,
      percent: total ? (s.count / total) * 100 : 0,
      color: s.color,
      legendFontColor: colors.onSurface,
      legendFontSize: 12,
    }));

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />
      }
    >
      <Surface style={[styles.headerSurface, { backgroundColor: colors.primaryContainer }]}>
        <Text variant="headlineSmall" style={{ color: colors.primary, fontWeight: '600' }}>
          <MaterialCommunityIcons name="chart-box" size={24} /> Estadísticas
        </Text>
        <View style={styles.timeRangeSelector}>
          {['week', 'month', 'year'].map(r => (
            <Chip
              key={r}
              selected={timeRange === r}
              onPress={() => setTimeRange(r)}
              style={[styles.chip, { backgroundColor: timeRange === r ? colors.primary : colors.primaryContainer }]}
              textStyle={{ color: timeRange === r ? '#fff' : colors.primary }}
            >
              {r === 'week' ? 'Semana' : r === 'month' ? 'Mes' : 'Año'}
            </Chip>
          ))}
        </View>
      </Surface>

      <View style={styles.summaryContainer}>
        <Surface style={[styles.summaryCard, { backgroundColor: colors.surface }]} elevation={2}>
          <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant }}>Total tareas</Text>
          <Text variant="titleLarge" style={{ color: colors.primary }}>{total}</Text>
          <MaterialCommunityIcons name="format-list-checks" size={28} color={colors.primary} />
        </Surface>
        <Surface style={[styles.summaryCard, { backgroundColor: colors.surface }]} elevation={2}>
          <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant }}>Tasa completado</Text>
          <Text variant="titleLarge" style={{ color: colors.success }}>{completionRate.toFixed(1)}%</Text>
          <MaterialCommunityIcons name="chart-line" size={28} color={colors.success} />
        </Surface>
      </View>

      <Surface style={[styles.card, { backgroundColor: colors.surface }]} elevation={3}>
        <Text variant="titleMedium" style={[styles.cardTitle, { color: colors.onSurface }]}>Distribución de estados</Text>
        <Divider style={styles.divider} />
        <PieChart
          data={slices}
          width={Dimensions.get('window').width - 64}
          height={180}
          chartConfig={chartConfig(colors.primary)}
          accessor="percent"
          backgroundColor="transparent"
          paddingLeft="16"
          absolute
          hasLegend={false}
        />
        <View style={styles.legendContainer}>
          {slices.map((s, i) => (
            <View key={i} style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: s.color }]} />
              <Text variant="bodySmall">{s.name}: {s.count} ({s.percent.toFixed(1)}%)</Text>
            </View>
          ))}
        </View>
      </Surface>

      <Surface style={[styles.card, { backgroundColor: colors.surface }]} elevation={3}>
        <Text variant="titleMedium" style={[styles.cardTitle, { color: colors.onSurface }]}>
          Pendientes últimos {timeRange === 'week' ? '4 semanas' : timeRange === 'month' ? '4 meses' : '4 años'}
        </Text>
        <Divider style={styles.divider} />
        <BarChart
          data={{ labels: barData.labels, datasets: [{ data: barData.pending }] }}
          width={Dimensions.get('window').width - 64}
          height={160}
          chartConfig={chartConfig('#FF6B6B')}
          style={styles.barChartCentered}
          fromZero
          showValuesOnTopOfBars
          verticalLabelRotation={-30}
          withHorizontalLabels
        />
      </Surface>

      <Surface style={[styles.card, { backgroundColor: colors.surface }]} elevation={3}>
        <Text variant="titleMedium" style={[styles.cardTitle, { color: colors.onSurface }]}>
          Completadas últimos {timeRange === 'week' ? '4 semanas' : timeRange === 'month' ? '4 meses' : '4 años'}
        </Text>
        <Divider style={styles.divider} />
        <BarChart
          data={{ labels: barData.labels, datasets: [{ data: barData.completed }] }}
          width={Dimensions.get('window').width - 64}
          height={160}
          chartConfig={chartConfig('#6BCB77')}
          style={styles.barChartCentered}
          fromZero
          showValuesOnTopOfBars
          verticalLabelRotation={-30}
          withHorizontalLabels
        />
      </Surface>

      <Surface style={[styles.card, { backgroundColor: colors.surface }]} elevation={3}>
        <Text variant="titleMedium" style={[styles.cardTitle, { color: colors.onSurface }]}>Prioridad en {barData.labels[3]}</Text>
        <Divider style={styles.divider} />
        <BarChart
          data={{ labels: priorityData.map(d => d.label), datasets: [{ data: priorityData.map(d => d.value) }] }}
          width={Dimensions.get('window').width - 64}
          height={140}
          chartConfig={chartConfig(colors.primary)}
          style={styles.barChartCentered}
          fromZero
          showValuesOnTopOfBars
          verticalLabelRotation={-30}
        />
      </Surface>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 12 : 12,
    paddingBottom: 32,
    paddingHorizontal: 16,
    flexGrow: 1,
    gap: 20,
  },
  headerSurface: { marginHorizontal: 16, marginBottom: 8, borderRadius: 12, padding: 12 },
  timeRangeSelector: { flexDirection: 'row' },
  chip: { marginHorizontal: 4 },
  summaryContainer: { flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 16, gap: 12 },
  summaryCard: { flex: 1, borderRadius: 12, padding: 16, alignItems: 'center', gap: 8 },
  card: { marginHorizontal: 16, borderRadius: 12, padding: 16, gap: 12 },
  cardTitle: { fontWeight: '600', fontSize: 16 },
  divider: { marginVertical: 8 },
  barChart: { marginVertical: 8, borderRadius: 12 },
  barChartCentered: {
    marginVertical: 8,
    borderRadius: 12,
    alignSelf: 'center',
  },
  legendContainer: { marginTop: 8 },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  legendColor: { width: 12, height: 12, borderRadius: 6, marginRight: 8 },
});