// Pantalla de estadísticas, gráficos con mejor responsivo, tema, accesibilidad, explicaciones, retry, filtros y tabla
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Platform,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import {
  PieChart,
  BarChart,
  LineChart,
  ProgressChart,
} from 'react-native-chart-kit';
import {
  Text,
  Surface,
  Chip,
  Divider,
  ActivityIndicator,
  Button,
  useTheme,
  Portal,
  Dialog,
  Paragraph,
  IconButton,
  DataTable,
} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import taskController from '../Controllers/taskController';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import 'moment/locale/es';
import { useColorScheme } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

// Configuración global
const FOCUS_TOP_N = 5;
const CHART_WIDTH_RATIO = 0.9; // 90% del ancho de pantalla
const ITEMS_PER_PAGE = 10; // Para paginación de tabla

// Componente reutilizable para manejar carga / error / estado vacío y retry
function ChartCard({
  title,
  loading,
  error,
  emptyMessage,
  onRetry,
  children,
  infoText,
  accessibilityLabel,
}) {
  const theme = useTheme();
  const [visibleInfo, setVisibleInfo] = useState(false);

  return (
    <Surface
      style={styles.card}
      elevation={3}
      accessibilityLabel={accessibilityLabel}
    >
      <View style={styles.cardHeader}>
        <Text style={[styles.cardTitle, { color: theme.colors.onSurface }]}>
          {title}
        </Text>
        {infoText ? (
          <IconButton
            icon="information"
            size={20}
            onPress={() => setVisibleInfo(true)}
            accessibilityLabel={`Información sobre ${title}`}
          />
        ) : null}
      </View>
      <Divider style={styles.divider} />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator animating size="small" />
          <Text style={styles.centerText}>Cargando...</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={[styles.centerText, { color: theme.colors.error }]}>
            Error: {error}
          </Text>
          {onRetry ? (
            <Button mode="outlined" onPress={onRetry} style={styles.retryButton}>
              Reintentar
            </Button>
          ) : null}
        </View>
      ) : React.Children.count(children) === 0 ? (
        <Text style={styles.centerText}>{emptyMessage}</Text>
      ) : (
        children
      )}

      {/* Modal de información si se proporciona infoText */}
      <Portal>
        <Dialog visible={visibleInfo} onDismiss={() => setVisibleInfo(false)}>
          <Dialog.Title>Información</Dialog.Title>
          <Dialog.Content>
            <Paragraph>{infoText}</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setVisibleInfo(false)}>Cerrar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </Surface>
  );
}

export default function TaskStatsViews({ navigation }) {
  // Estados de Focus Time
  const [focusSummary, setFocusSummary] = useState([]); // Datos de focus-time
  const [loadingFocus, setLoadingFocus] = useState(false);
  const [errorFocus, setErrorFocus] = useState(null);

  // Estados de refresco y rango de tiempo
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState('week');

  // Estado de estadísticas generales de tareas: counts, pend/completed, prioCounts, segments
  const [statsData, setStatsData] = useState({
    counts: { Pendiente: 0, 'En progreso': 0, Completada: 0 },
    pend: [],
    comp: [],
    prioCounts: { Baja: 0, Media: 0, Alta: 0 },
    segments: [],
  });

  // Estados de filtros y lista de tareas / etiquetas
  const [tasksList, setTasksList] = useState([]);
  const [filterStatus, setFilterStatus] = useState('Todas');
  const [filterPriority, setFilterPriority] = useState('Todas');
  const [filterTags, setFilterTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [customDateRange, setCustomDateRange] = useState({ from: null, to: null });
  const [showDatePicker, setShowDatePicker] = useState({ field: null, visible: false });

  // Estados de tabla: ordenamiento y paginación
  const [sortColumn, setSortColumn] = useState('title');
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(0);

  // Tema claro/oscuro
  const colorScheme = useColorScheme();
  const theme = useTheme();
  const isDark = colorScheme === 'dark';

  // Obtener dinámicamente ancho de pantalla
  const { width: screenWidth } = useWindowDimensions();

  // Paleta adaptada según tema
  const palette = {
    background: isDark ? '#121212' : '#FFFFFF',
    primary: isDark ? '#90CAF9' : '#74B9E8',
    primaryContainer: isDark ? '#1976D2' : '#AEDFF7',
    surface: isDark ? '#1E1E1E' : '#FFFFFF',
    outline: isDark ? '#BBBBBB' : '#95A5A6',
    onSurface: isDark ? '#FFFFFF' : '#000000',
    onPrimary: isDark ? '#000000' : '#FFFFFF',
    error: '#CF6679',
  };

  // Configuración de chartConfig basada en react-native-chart-kit
  const chartConfig = mainColor => ({
    backgroundColor: palette.surface,
    backgroundGradientFrom: palette.surface,
    backgroundGradientTo: palette.surface,
    decimalPlaces: 0,
    color: () => mainColor,
    labelColor: () => palette.onSurface,
    propsForLabels: { fontSize: 12 },
    barPercentage: 0.6,
  });

  // Genera segmentos de tiempo
  const generateTimeSegments = useCallback(() => {
    const segments = [];
    const format =
      timeRange === 'week'
        ? 'DD MMM'
        : timeRange === 'month'
        ? 'MMM YYYY'
        : 'YYYY';
    const unit =
      timeRange === 'week' ? 'week' : timeRange === 'month' ? 'month' : 'year';
    for (let i = 3; i >= 0; i--) {
      const date = moment().subtract(i, unit).startOf(unit);
      segments.push({
        label: date.format(format),
        start: date.clone(),
        end: date.clone().endOf(unit),
      });
    }
    return segments;
  }, [timeRange]);

  // Función pura para procesar estadísticas de tareas
  const computeTaskStats = useCallback((tasks, segments) => {
    const counts = { Pendiente: 0, 'En progreso': 0, Completada: 0 };
    const prioCounts = { Baja: 0, Media: 0, Alta: 0 };
    const pend = Array(segments.length).fill(0);
    const comp = Array(segments.length).fill(0);

    tasks.forEach(t => {
      if (counts[t.status] !== undefined) counts[t.status]++;
      // Detectar formato de due_date (ISO o DD-MM-YYYY)
      let date = null;
      if (t.due_date) {
        if (moment(t.due_date, moment.ISO_8601, true).isValid()) {
          date = moment(t.due_date);
        } else {
          date = moment(t.due_date, 'DD-MM-YYYY');
        }
      }
      if (date && date.isValid()) {
        segments.forEach((seg, idx) => {
          if (date.isBetween(seg.start, seg.end, null, '[]')) {
            if (t.status === 'Pendiente') pend[idx]++;
            if (t.status === 'Completada') comp[idx]++;
          }
        });
        // Prioridad en último segmento
        const lastSegment = segments[segments.length - 1];
        if (date.isBetween(lastSegment.start, lastSegment.end, null, '[]')) {
          if (prioCounts[t.priority] !== undefined) prioCounts[t.priority]++;
        }
      }
    });
    return { counts, pend, comp, prioCounts };
  }, []);

  // Función pura para preparar datos de Focus Time
  const prepareFocusData = useCallback(focusSummary => {
    const sortedFocus = [...focusSummary].sort((a, b) => b.total_minutes - a.total_minutes);
    const focusTop = sortedFocus.slice(0, FOCUS_TOP_N);
    const focusLabels = focusTop.map(item => {
      const maxLen = 10;
      const title = item.task_title || 'Sin título';
      return title.length > maxLen ? title.substring(0, maxLen) + '…' : title;
    });
    const focusValues = focusTop.map(item => item.total_minutes);

    // Para PieChart: nueva paleta de colores
    const focusColors = ['#FFA500', '#00CED1', '#9370DB', '#FF69B4', '#20B2AA'];
    const focusPieData = focusTop.map((item, idx) => {
      const title = item.task_title || `Tarea ${idx + 1}`;
      const name = title.length > 12 ? title.substring(0, 12) + '…' : title;
      return {
        name,
        population: item.total_minutes,
        color: focusColors[idx % focusColors.length],
        legendFontColor: palette.onSurface,
        legendFontSize: 12,
      };
    });

    // Para ProgressChart: proporciones relativas
    const sumFocusTop = focusValues.reduce((a, b) => a + b, 0) || 1;
    const focusPercents = focusValues.map(val => val / sumFocusTop);

    return { focusTop, focusLabels, focusValues, focusPieData, focusPercents };
  }, [palette.onSurface]);

  // Función para recalcular estadísticas al cambiar filtros
  const recalcStatsWithFilters = useCallback((tasks) => {
    let filtered = tasks || [];
    // Estado
    if (filterStatus && filterStatus !== 'Todas') {
      filtered = filtered.filter(t => t.status === filterStatus);
    }
    // Prioridad
    if (filterPriority && filterPriority !== 'Todas') {
      filtered = filtered.filter(t => t.priority === filterPriority);
    }
    // Etiquetas
    if (filterTags.length > 0) {
      filtered = filtered.filter(t => Array.isArray(t.tags) && filterTags.some(tag => t.tags.includes(tag)));
    }
    // Rango personalizado de vencimiento
    if (customDateRange.from || customDateRange.to) {
      filtered = filtered.filter(t => {
        if (!t.due_date) return false;
        let date = null;
        if (moment(t.due_date, moment.ISO_8601, true).isValid()) {
          date = moment(t.due_date);
        } else {
          date = moment(t.due_date, 'DD-MM-YYYY');
        }
        if (!date.isValid()) return false;
        if (customDateRange.from && date.isBefore(moment(customDateRange.from), 'day')) return false;
        if (customDateRange.to && date.isAfter(moment(customDateRange.to), 'day')) return false;
        return true;
      });
    }
    const segments = generateTimeSegments();
    const { counts, pend, comp, prioCounts } = computeTaskStats(filtered, segments);
    setStatsData({ counts, pend, comp, prioCounts, segments });
  }, [filterStatus, filterPriority, filterTags, customDateRange, computeTaskStats, generateTimeSegments]);

  // Carga de estadísticas generales y FocusTime
  const loadStats = useCallback(async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) return;

      // 1) Cargar todas las tareas
      const tasks = await taskController.getTasksByUserId(userId);
      const tasksArr = Array.isArray(tasks) ? tasks : [];
      setTasksList(tasksArr);

      // Extraer etiquetas únicas
      const tagsSet = new Set();
      tasksArr.forEach(t => {
        if (Array.isArray(t.tags)) {
          t.tags.forEach(tag => {
            if (tag) tagsSet.add(tag);
          });
        }
      });
      setAvailableTags([...tagsSet]);

      // 2) Recalcular estadísticas con filtros actuales
      recalcStatsWithFilters(tasksArr);

      // 3) Cargar resumen de focus-time
      setLoadingFocus(true);
      setErrorFocus(null);
      try {
        const focusData = await taskController.getFocusSummaryByUserId();
        setFocusSummary(Array.isArray(focusData) ? focusData : []);
      } catch (err) {
        console.error('Error al cargar resumen de focus-time:', err.message);
        setErrorFocus(err.message || 'Error desconocido');
        setFocusSummary([]);
      } finally {
        setLoadingFocus(false);
      }
    } catch (err) {
      console.error('Error en loadStats:', err.message);
    }
  }, [recalcStatsWithFilters]);

  // Efecto para recargar cuando cambie timeRange o al enfocar pantalla
  useEffect(() => {
    loadStats();
    const unsub = navigation.addListener('focus', loadStats);
    return unsub;
  }, [navigation, timeRange, loadStats]);

  // Recalcular estadísticas cuando cambian filtros y lista de tareas
  useEffect(() => {
    if (tasksList.length > 0) {
      recalcStatsWithFilters(tasksList);
    }
  }, [filterStatus, filterPriority, filterTags, customDateRange, tasksList, recalcStatsWithFilters]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
  };

  // Extraer valores para render
  const { counts, pend, comp, prioCounts, segments } = statsData;
  const totalTasks = counts.Pendiente + counts['En progreso'] + counts.Completada;
  const completionRate = totalTasks ? (counts.Completada / totalTasks) * 100 : 0;

  // Datos para PieChart de estados
  const slices = [
    { name: 'Pendiente', count: counts.Pendiente, color: '#FF6B6B' },
    { name: 'En progreso', count: counts['En progreso'], color: '#FFD93D' },
    { name: 'Completada', count: counts.Completada, color: '#6BCB77' },
  ]
    .filter(s => s.count > 0)
    .map(s => ({
      name: s.name,
      count: s.count,
      percent: totalTasks ? (s.count / totalTasks) * 100 : 0,
      color: s.color,
      legendFontColor: palette.onSurface,
      legendFontSize: 12,
    }));

  // Preparar datos de prioridad a partir de prioCounts
  const priorityDataArr = Object.entries(prioCounts).map(([label, value]) => ({
    label,
    value,
    color: label === 'Alta' ? '#FF6B6B' : label === 'Media' ? '#FFD93D' : '#6BCB77',
  }));

  // Prepara datos de Focus Time
  const { focusTop, focusLabels, focusValues, focusPieData, focusPercents } =
    prepareFocusData(focusSummary);

  // Cálculo de ancho para gráficos con scroll horizontal:
  const perItemWidth = 60;
  const horizontalChartWidth = Math.max(
    screenWidth * CHART_WIDTH_RATIO,
    (focusLabels.length || 1) * perItemWidth,
  );

  // Opcional: layout de dos columnas si ancho grande
  const isWide = screenWidth > 600;

  // Preparar datos de la tabla de detalle de tareas
  const tableData = useMemo(() => {
    let filtered = tasksList;
    if (filterStatus && filterStatus !== 'Todas') {
      filtered = filtered.filter(t => t.status === filterStatus);
    }
    if (filterPriority && filterPriority !== 'Todas') {
      filtered = filtered.filter(t => t.priority === filterPriority);
    }
    if (filterTags.length > 0) {
      filtered = filtered.filter(t => Array.isArray(t.tags) && filterTags.some(tag => t.tags.includes(tag)));
    }
    if (customDateRange.from || customDateRange.to) {
      filtered = filtered.filter(t => {
        if (!t.due_date) return false;
        let date = moment(t.due_date, moment.ISO_8601, true).isValid()
          ? moment(t.due_date)
          : moment(t.due_date, 'DD-MM-YYYY');
        if (!date.isValid()) return false;
        if (customDateRange.from && date.isBefore(moment(customDateRange.from), 'day')) return false;
        if (customDateRange.to && date.isAfter(moment(customDateRange.to), 'day')) return false;
        return true;
      });
    }
    // Map de focusSummary
    const focusMap = {};
    focusSummary.forEach(item => {
      focusMap[item.task_id] = item.total_minutes;
    });
    // Construir filas
    return filtered.map(t => ({
      id: t.id,
      title: t.title,
      status: t.status,
      priority: t.priority,
      due_date: t.due_date,
      focusMinutes: focusMap[t.id] || 0,
    }));
  }, [tasksList, filterStatus, filterPriority, filterTags, customDateRange, focusSummary]);

  // Ordenar tabla
  const sortedTableData = useMemo(() => {
    const dataCopy = [...tableData];
    dataCopy.sort((a, b) => {
      let cmp = 0;
      if (sortColumn === 'title') {
        cmp = a.title.localeCompare(b.title);
      } else if (sortColumn === 'status') {
        cmp = a.status.localeCompare(b.status);
      } else if (sortColumn === 'priority') {
        cmp = a.priority.localeCompare(b.priority);
      } else if (sortColumn === 'due_date') {
        const da = moment(a.due_date, ['DD-MM-YYYY', moment.ISO_8601], true);
        const db = moment(b.due_date, ['DD-MM-YYYY', moment.ISO_8601], true);
        if (da.isValid() && db.isValid()) cmp = da.diff(db);
        else cmp = a.due_date.localeCompare(b.due_date);
      } else if (sortColumn === 'focusMinutes') {
        cmp = a.focusMinutes - b.focusMinutes;
      }
      return sortAsc ? cmp : -cmp;
    });
    return dataCopy;
  }, [tableData, sortColumn, sortAsc]);

  // Paginación
  const from = page * ITEMS_PER_PAGE;
  const to = Math.min((page + 1) * ITEMS_PER_PAGE, sortedTableData.length);

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { backgroundColor: palette.background }]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[palette.primary]}
          tintColor={palette.primary}
        />
      }
    >
      {/* HEADER y contexto */}
      <Surface
        style={[styles.headerSurface, { backgroundColor: palette.primaryContainer }]}
        accessibilityRole="header"
      >
        <Text
          style={{ color: palette.onPrimary, fontSize: 24, fontWeight: '700' }}
          accessibilityRole="header"
        >
          Estadísticas de Tareas
        </Text>
        <Text style={{ color: palette.onPrimary, fontSize: 14, marginTop: 4 }}>
          Visualiza tu progreso y tiempo
        </Text>
      </Surface>

      {/* Selector de rango */}
      <Surface style={[styles.card, { backgroundColor: palette.surface }]} elevation={2}>
        <Text style={[styles.cardTitle, { color: palette.onSurface }]}>Rango de tiempo</Text>
        <View style={styles.timeRangeSelector}>
          {['week', 'month', 'year'].map(r => (
            <Chip
              key={r}
              selected={timeRange === r}
              onPress={() => setTimeRange(r)}
              style={[
                styles.chip,
                { backgroundColor: timeRange === r ? palette.primary : palette.primaryContainer },
              ]}
              textStyle={{ color: timeRange === r ? palette.onPrimary : palette.primary, fontSize: 12 }}
              accessibilityRole="button"
              accessibilityState={{ selected: timeRange === r }}
            >
              {r === 'week' ? 'Semana' : r === 'month' ? 'Mes' : 'Año'}
            </Chip>
          ))}
        </View>
      </Surface>

      {/* Panel de filtros */}
      <Surface style={[styles.card, { backgroundColor: palette.surface }]} elevation={2}>
        <Text style={[styles.cardTitle, { color: palette.onSurface }]}>Filtros</Text>
        {/* Filtro Estado */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 }}>
          {['Todas', 'Pendiente', 'En progreso', 'Completada'].map(opt => (
            <Chip
              key={opt}
              selected={filterStatus === opt}
              onPress={() => {
                setFilterStatus(opt);
                setPage(0);
              }}
              style={[styles.chip, { marginRight: 8, marginBottom: 8 }]}
            >
              {opt}
            </Chip>
          ))}
        </View>
        {/* Filtro Prioridad */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 }}>
          {['Todas', 'Baja', 'Media', 'Alta'].map(opt => (
            <Chip
              key={opt}
              selected={filterPriority === opt}
              onPress={() => {
                setFilterPriority(opt);
                setPage(0);
              }}
              style={[styles.chip, { marginRight: 8, marginBottom: 8 }]}
            >
              {opt}
            </Chip>
          ))}
        </View>
        {/* Filtro Etiquetas */}
        {availableTags.length > 0 && (
          <>
            <Text style={{ color: palette.onSurface, marginTop: 8 }}>Etiquetas:</Text>
            <ScrollView horizontal contentContainerStyle={{ paddingVertical: 8 }}>
              {availableTags.map(tag => (
                <Chip
                  key={tag}
                  selected={filterTags.includes(tag)}
                  onPress={() => {
                    const newTags = filterTags.includes(tag)
                      ? filterTags.filter(t => t !== tag)
                      : [...filterTags, tag];
                    setFilterTags(newTags);
                    setPage(0);
                  }}
                  style={[styles.chip, { marginRight: 8 }]}
                >
                  {tag}
                </Chip>
              ))}
            </ScrollView>
          </>
        )}
        {/* Filtro rango de vencimiento */}
        <Text style={{ color: palette.onSurface, marginTop: 8 }}>Rango de fecha de vencimiento:</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
          <Button mode="outlined" onPress={() => setShowDatePicker({ field: 'from', visible: true })}>
            {customDateRange.from ? moment(customDateRange.from).format('DD/MM/YYYY') : 'Desde'}
          </Button>
          <Text style={{ marginHorizontal: 8, color: palette.onSurface }}>—</Text>
          <Button mode="outlined" onPress={() => setShowDatePicker({ field: 'to', visible: true })}>
            {customDateRange.to ? moment(customDateRange.to).format('DD/MM/YYYY') : 'Hasta'}
          </Button>
          {(customDateRange.from || customDateRange.to) && (
            <IconButton
              icon="close-circle"
              onPress={() => {
                setCustomDateRange({ from: null, to: null });
                setPage(0);
              }}
              accessibilityLabel="Limpiar rango de fechas"
            />
          )}
        </View>
        {showDatePicker.visible && (
          <DateTimePicker
            value={
              showDatePicker.field === 'from'
                ? (customDateRange.from || new Date())
                : (customDateRange.to || new Date())
            }
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker({ field: null, visible: false });
              if (selectedDate) {
                const newRange = { ...customDateRange };
                newRange[showDatePicker.field] = selectedDate;
                setCustomDateRange(newRange);
                setPage(0);
              }
            }}
          />
        )}
      </Surface>

      {/* Resumen numérico */}
      <View style={[styles.summaryContainer, isWide && { justifyContent: 'space-around' }]}>
        <Surface style={[styles.summaryCard, { backgroundColor: palette.surface }]} elevation={2}>
          <Text style={{ color: palette.onSurface, fontSize: 14 }}>Total tareas</Text>
          <Text
            style={{ color: palette.primary, fontSize: 24, fontWeight: '600' }}
            accessibilityLabel={`Total de tareas: ${totalTasks}`}
          >
            {totalTasks}
          </Text>
          <MaterialCommunityIcons
            name="format-list-checks"
            size={28}
            color={palette.primary}
            accessibilityIgnoresInvertColors={false}
            accessibilityLabel="Icono de lista"
          />
        </Surface>
        <Surface style={[styles.summaryCard, { backgroundColor: palette.surface }]} elevation={2}>
          <Text style={{ color: palette.onSurface, fontSize: 14 }}>Tasa completado</Text>
          <Text
            style={{ color: palette.primary, fontSize: 24, fontWeight: '600' }}
            accessibilityLabel={`Tasa de completado: ${completionRate.toFixed(1)} por ciento`}
          >
            {completionRate.toFixed(1)}%
          </Text>
          <MaterialCommunityIcons
            name="chart-line"
            size={28}
            color={palette.primary}
            accessibilityLabel="Icono de gráfica"
          />
        </Surface>
      </View>

      {/* Distribución de estados */}
      <ChartCard
        title="Distribución de estados"
        loading={false}
        error={null}
        emptyMessage="No hay tareas para mostrar."
        infoText="Este gráfico muestra la proporción de tareas en estado Pendiente, En progreso y Completada."
        onRetry={loadStats}
        accessibilityLabel="Gráfico de pastel con distribución de estados de tareas"
      >
        <PieChart
          data={slices}
          width={screenWidth * CHART_WIDTH_RATIO}
          height={180}
          chartConfig={chartConfig(palette.primary)}
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
              <Text style={{ color: palette.onSurface, fontSize: 12 }}>
                {s.name}: {s.count} ({s.percent.toFixed(1)}%)
              </Text>
            </View>
          ))}
        </View>
      </ChartCard>

      {/* Barras pendientes y completadas en un contenedor de dos columnas si es ancho */}
      <View style={[styles.rowContainer, isWide && { flexDirection: 'row', justifyContent: 'space-between' }]}>
        {/* Pendientes */}
        <ChartCard
          title={`Pendientes últimos ${timeRange === 'week' ? '4 semanas' : timeRange === 'month' ? '4 meses' : '4 años'}`}
          loading={false}
          error={null}
          emptyMessage="Sin datos de pendientes."
          infoText="Número de tareas pendientes distribuidas en el rango de tiempo seleccionado según fecha de vencimiento."
          onRetry={loadStats}
          accessibilityLabel="Gráfico de barras de tareas pendientes"
        >
          <BarChart
            data={{ labels: segments.map(s => s.label), datasets: [{ data: pend }] }}
            width={screenWidth * CHART_WIDTH_RATIO}
            height={160}
            chartConfig={chartConfig('#FF6B6B')}
            style={styles.barChartCentered}
            fromZero
            showValuesOnTopOfBars
            verticalLabelRotation={-30}
            withHorizontalLabels
          />
        </ChartCard>
        {/* Completadas */}
        <ChartCard
          title={`Completadas últimos ${timeRange === 'week' ? '4 semanas' : timeRange === 'month' ? '4 meses' : '4 años'}`}
          loading={false}
          error={null}
          emptyMessage="Sin datos de completadas."
          infoText="Número de tareas completadas distribuidas en el rango de tiempo seleccionado según fecha de vencimiento."
          onRetry={loadStats}
          accessibilityLabel="Gráfico de barras de tareas completadas"
        >
          <BarChart
            data={{ labels: segments.map(s => s.label), datasets: [{ data: comp }] }}
            width={screenWidth * CHART_WIDTH_RATIO}
            height={160}
            chartConfig={chartConfig('#6BCB77')}
            style={styles.barChartCentered}
            fromZero
            showValuesOnTopOfBars
            verticalLabelRotation={-30}
            withHorizontalLabels
          />
        </ChartCard>
      </View>

      {/* Barras de prioridad */}
      <ChartCard
        title={`Prioridad en ${segments[segments.length - 1]?.label || ''}`}
        loading={false}
        error={null}
        emptyMessage="Sin datos de prioridad."
        infoText="Distribución de prioridades (Baja, Media, Alta) en el último segmento de tiempo."
        onRetry={loadStats}
        accessibilityLabel="Gráfico de barras de prioridad de tareas"
      >
        {priorityDataArr.length > 0 && (
          <BarChart
            data={{
              labels: priorityDataArr.map(d => d.label),
              datasets: [{ data: priorityDataArr.map(d => d.value) }],
            }}
            width={screenWidth * CHART_WIDTH_RATIO}
            height={140}
            chartConfig={chartConfig(palette.primary)}
            style={styles.barChartCentered}
            fromZero
            showValuesOnTopOfBars
            verticalLabelRotation={-30}
          />
        )}
      </ChartCard>

      {/* FocusTime: Barras (Top 5) */}
      <ChartCard
        title={`Focus Time por tarea (Top ${FOCUS_TOP_N})`}
        loading={loadingFocus}
        error={errorFocus}
        emptyMessage="No hay datos de focus-time aún."
        infoText="Muestra el tiempo total en Focus Mode acumulado por cada una de las Top 5 tareas."
        onRetry={loadStats}
        accessibilityLabel="Gráfico de barras de Focus Time por tarea"
      >
        {focusSummary.length > 0 && (
          <ScrollView horizontal contentContainerStyle={{ paddingVertical: 8 }}>
            <BarChart
              data={{ labels: focusLabels, datasets: [{ data: focusValues }] }}
              width={horizontalChartWidth}
              height={200}
              chartConfig={chartConfig(palette.primary)}
              style={styles.barChartCentered}
              fromZero
              showValuesOnTopOfBars
              verticalLabelRotation={-30}
              withHorizontalLabels
              onDataPointClick={({ index }) => {
                const tarea = focusTop[index];
                if (tarea && tarea.task_id) {
                  navigation.navigate('TaskDetail', { taskId: tarea.task_id });
                }
              }}
            />
          </ScrollView>
        )}
      </ChartCard>

      {/* FocusTime: PieChart de distribución Top 5 */}
      <ChartCard
        title={`Distribución Focus Time (Top ${FOCUS_TOP_N})`}
        loading={loadingFocus}
        error={errorFocus}
        emptyMessage="No hay datos de focus-time para graficar."
        infoText="Proporción de Focus Time distribuida entre las Top 5 tareas con más minutos acumulados."
        onRetry={loadStats}
        accessibilityLabel="Gráfico de pastel de Focus Time"
      >
        {focusPieData.length > 0 && (
          <>
            <PieChart
              data={focusPieData}
              width={screenWidth * CHART_WIDTH_RATIO}
              height={180}
              chartConfig={chartConfig('#00CED1')}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="16"
              absolute
              hasLegend={false}
            />
            <View style={styles.legendContainer}>
              {focusPieData.map((item, idx) => (
                <View key={idx} style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                  <Text style={{ color: palette.onSurface, fontSize: 12 }}>
                    {item.name}: {item.population} min
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}
      </ChartCard>

      {/* FocusTime: LineChart de Top 5 */}
      <ChartCard
        title={`Tendencia Focus Time (Top ${FOCUS_TOP_N})`}
        loading={loadingFocus}
        error={errorFocus}
        emptyMessage="No hay datos para graficar tendencia."
        infoText="Representa en una línea los minutos de Focus Time de las Top 5 tareas."
        onRetry={loadStats}
        accessibilityLabel="Gráfico de línea de Focus Time"
      >
        {focusValues.length > 0 && (
          <ScrollView horizontal contentContainerStyle={{ paddingVertical: 8 }}>
            <LineChart
              data={{
                labels: focusLabels,
                datasets: [{ data: focusValues }],
              }}
              width={horizontalChartWidth}
              height={200}
              chartConfig={chartConfig('#9370DB')}
              style={styles.barChartCentered}
              fromZero
              verticalLabelRotation={-30}
              withDots
              withShadow={false}
              onDataPointClick={({ index }) => {
                const tarea = focusTop[index];
                if (tarea && tarea.task_id) {
                  navigation.navigate('TaskDetail', { taskId: tarea.task_id });
                }
              }}
            />
          </ScrollView>
        )}
      </ChartCard>

      {/* FocusTime: ProgressChart de proporción relativa Top 5 */}
      <ChartCard
        title={`Proporción Focus Time (Top ${FOCUS_TOP_N})`}
        loading={loadingFocus}
        error={errorFocus}
        emptyMessage="No hay datos para proporciones."
        infoText="Anillo que muestra la proporción relativa de Focus Time entre las Top 5 tareas."
        onRetry={loadStats}
        accessibilityLabel="Gráfico de anillo de proporción Focus Time"
      >
        {focusPercents.length > 0 && (
          <>
            <ProgressChart
              data={{
                labels: [], // omitimos labels internos para evitar recorte
                data: focusPercents,
              }}
              width={screenWidth * CHART_WIDTH_RATIO}
              height={200}
              strokeWidth={16}
              radius={32}
              chartConfig={chartConfig('#FF69B4')}
              hideLegend={true}
            />
            <View style={[styles.legendContainer, { marginTop: 12 }]}>
              {focusTop.map((item, idx) => (
                <View key={idx} style={styles.legendItem}>
                  <View
                    style={[
                      styles.legendColor,
                      { backgroundColor: focusPieData[idx]?.color || palette.primary },
                    ]}
                  />
                  <Text style={{ color: palette.onSurface, fontSize: 12, flexShrink: 1 }}>
                    {item.task_title}: {(focusPercents[idx] * 100).toFixed(1)}%
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}
      </ChartCard>

      {/* Tabla de detalle de tareas */}
      <Surface style={[styles.card, { backgroundColor: palette.surface }]} elevation={3}>
        <Text style={[styles.cardTitle, { color: palette.onSurface }]}>Detalle de tareas</Text>
        <Divider style={styles.divider} />
        {sortedTableData.length === 0 ? (
          <Text style={styles.centerText}>No hay tareas en la tabla.</Text>
        ) : (
          <ScrollView horizontal>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title
                  style={{ flex: 2 }}
                  sortDirection={sortColumn === 'title' ? (sortAsc ? 'ascending' : 'descending') : null}
                  onPress={() => {
                    if (sortColumn === 'title') setSortAsc(!sortAsc);
                    else {
                      setSortColumn('title');
                      setSortAsc(true);
                    }
                  }}
                >
                  Título
                </DataTable.Title>
                <DataTable.Title
                  sortDirection={sortColumn === 'status' ? (sortAsc ? 'ascending' : 'descending') : null}
                  onPress={() => {
                    if (sortColumn === 'status') setSortAsc(!sortAsc);
                    else {
                      setSortColumn('status');
                      setSortAsc(true);
                    }
                  }}
                >
                  Status
                </DataTable.Title>
                <DataTable.Title
                  sortDirection={sortColumn === 'priority' ? (sortAsc ? 'ascending' : 'descending') : null}
                  onPress={() => {
                    if (sortColumn === 'priority') setSortAsc(!sortAsc);
                    else {
                      setSortColumn('priority');
                      setSortAsc(true);
                    }
                  }}
                >
                  Prioridad
                </DataTable.Title>
                <DataTable.Title
                  sortDirection={sortColumn === 'due_date' ? (sortAsc ? 'ascending' : 'descending') : null}
                  onPress={() => {
                    if (sortColumn === 'due_date') setSortAsc(!sortAsc);
                    else {
                      setSortColumn('due_date');
                      setSortAsc(true);
                    }
                  }}
                >
                  Vence
                </DataTable.Title>
                <DataTable.Title
                  numeric
                  sortDirection={sortColumn === 'focusMinutes' ? (sortAsc ? 'ascending' : 'descending') : null}
                  onPress={() => {
                    if (sortColumn === 'focusMinutes') setSortAsc(!sortAsc);
                    else {
                      setSortColumn('focusMinutes');
                      setSortAsc(true);
                    }
                  }}
                >
                  Focus (min)
                </DataTable.Title>
              </DataTable.Header>
              {sortedTableData.slice(from, to).map(row => (
                <DataTable.Row
                  key={row.id}
                  onPress={() => navigation.navigate('TaskDetail', { taskId: row.id })}
                >
                  <DataTable.Cell style={{ flex: 2 }}>{row.title}</DataTable.Cell>
                  <DataTable.Cell>{row.status}</DataTable.Cell>
                  <DataTable.Cell>{row.priority}</DataTable.Cell>
                  <DataTable.Cell>{row.due_date}</DataTable.Cell>
                  <DataTable.Cell numeric>{row.focusMinutes}</DataTable.Cell>
                </DataTable.Row>
              ))}
              <DataTable.Pagination
                page={page}
                numberOfPages={Math.ceil(sortedTableData.length / ITEMS_PER_PAGE)}
                onPageChange={p => setPage(p)}
                label={`${from + 1}-${to} de ${sortedTableData.length}`}
                optionsPerPage={[ITEMS_PER_PAGE]}
                showFastPaginationControls
              />
            </DataTable>
          </ScrollView>
        )}
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
  headerSurface: {
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    padding: 16,
  },
  card: {
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: { fontWeight: '600', fontSize: 16 },
  divider: { marginVertical: 8 },
  barChartCentered: { marginVertical: 8, borderRadius: 12, alignSelf: 'center' },
  legendContainer: { marginTop: 8 },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  legendColor: { width: 12, height: 12, borderRadius: 6, marginRight: 8 },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  timeRangeSelector: { flexDirection: 'row' },
  chip: { marginHorizontal: 4 },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  centerText: {
    textAlign: 'center',
    marginTop: 8,
  },
  retryButton: {
    marginTop: 8,
  },
  rowContainer: {
    // para dos columnas en pantallas anchas
    flexDirection: 'column',
  },
});