// Views/TasksView.js
import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Platform,
  StatusBar,
} from 'react-native';
import {
  Text,
  Card,
  ProgressBar,
  FAB,
  useTheme,
} from 'react-native-paper';
import tasksController from '../Controllers/taskController';
import TaskItem from '../../Components/TaskItem';
import TaskForm from '../../Components/TaskForm';

const BACKGROUND_URL =
  'https://www.todofondos.net/wp-content/uploads/1080x1920-Top-15-fondo-de-pantalla-minimalista-para-iPhone-y-iPad-576x1024.jpg';
const TODAY = () => {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, '0')}-${String(
    d.getMonth() + 1
  ).padStart(2, '0')}-${d.getFullYear()}`;
};

export default function TasksView() {
  const { colors } = useTheme();
  const [tasks, setTasks] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('Todas');
  const [formVisible, setFormVisible] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => { load(); }, []);
  useEffect(() => { apply(tasks, search, filter); }, [tasks, search, filter]);

  const load = async () => {
    const all = await tasksController.getTasks();
    setTasks(all || []);
  };
  const apply = (all, txt, st) => {
    let list = all;
    if (txt) list = list.filter(t => t.title.toLowerCase().includes(txt.toLowerCase()));
    if (st !== 'Todas') list = list.filter(t => t.status === st);
    setFiltered(list);
  };

  const open = t => { setEditing(t); setFormVisible(true); };
  const close = () => { setEditing(null); setFormVisible(false); };
  const save = async data => {
    const payload = { ...data, fecha: editing ? editing.fecha : TODAY() };
    if (editing) await tasksController.updateTask(editing.id, payload);
    else await tasksController.createTask(payload);
    close(); load();
  };

  const del = id => Alert.alert('Eliminar','¿Seguro?',[
    { text:'Cancelar', style:'cancel' },
    { text:'Eliminar', style:'destructive', onPress: async()=>{ await tasksController.deleteTask(id); load(); } }
  ]);
  const toggle = async id => { await tasksController.toggleTask(id); load(); };

  const total = tasks.length;
  const pend = tasks.filter(t=>t.status==='Pendiente').length;
  const prog = tasks.filter(t=>t.status==='En progreso').length;
  const comp = tasks.filter(t=>t.status==='Completada').length;
  const pct = total ? comp/total : 0;

  return (
    <ImageBackground source={{ uri: BACKGROUND_URL }} style={styles.bg}>
      <View style={[styles.overlay, { backgroundColor: colors.background }]}>
        <View style={styles.safeSpacer}/>

        <TextInput
          placeholder="Buscar tareas..."
          placeholderTextColor={colors.outline}
          value={search}
          onChangeText={setSearch}
          style={[styles.search, { backgroundColor: colors.surface, borderColor: colors.outline }]}
        />

        <View style={styles.filterRow}>
          {['Todas','Pendiente','En progreso','Completada'].map(s=>(
            <TouchableOpacity
              key={s}
              style={[
                styles.filterBtn,
                { 
                  borderColor: colors.outline,
                  backgroundColor: filter===s ? colors.primaryContainer : colors.surface 
                }
              ]}
              onPress={()=>setFilter(s)}
            >
              <Text style={{ color: filter===s ? colors.primary : colors.onSurface, fontSize:12 }}>
                {s}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Card style={[styles.statsCard, { backgroundColor: colors.surface }]} elevation={2}>
          <View style={styles.statsRow}>
            {[
              { label:'Total', value:total },
              { label:'Pend', value:pend },
              { label:'Prog', value:prog },
              { label:'Comp', value:comp },
            ].map(({label,value})=>(
              <View key={label} style={styles.statsCol}>
                <Text style={[styles.statValue, { color: colors.onSurface }]}>{value}</Text>
                <Text style={[styles.statLabel, { color: colors.outline }]}>{label}</Text>
              </View>
            ))}
          </View>
          <ProgressBar progress={pct} color={colors.primary} style={[styles.bar, { backgroundColor: colors.outline }]} />
        </Card>

        <ScrollView contentContainerStyle={styles.list}>
          {filtered.map(t=>(
            <TouchableOpacity key={t.id} onPress={()=>open(t)}>
              <TaskItem task={t} onToggle={toggle} onDelete={del}/>
            </TouchableOpacity>
          ))}
          {!filtered.length && <Text style={[styles.empty, { color: colors.outline }]}>No hay tareas</Text>}
        </ScrollView>

        <TaskForm visible={formVisible} onDismiss={close} onSubmit={save} initialValues={editing}/>
        <FAB
          icon="plus"
          label="Nueva tarea"
          style={[styles.fab, { backgroundColor: colors.primary }]}
          color={colors.onPrimary}
          onPress={() => open(null)}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex:1 },
  overlay: { flex:1 },
  safeSpacer: { height: Platform.OS==='android'?StatusBar.currentHeight:20 },

  search: {
    marginHorizontal:12,
    borderRadius:8,
    paddingHorizontal:12,
    height:40,
    marginBottom:8,
    borderWidth:1,
  },

  filterRow: {
    flexDirection:'row',
    justifyContent:'space-around',
    marginHorizontal:12,
    marginBottom:12,
  },
  filterBtn: {
    paddingHorizontal:10,
    paddingVertical:6,
    borderRadius:20,
    borderWidth:1,
  },

  statsCard: {
    marginHorizontal:12,
    borderRadius:12,
    padding:12,
    marginBottom:12,
  },
  statsRow: {
    flexDirection:'row',
    justifyContent:'space-between',
    marginBottom:6,
  },
  statsCol: {
    alignItems:'center', flex:1
  },
  statValue: {
    fontSize:16, fontWeight:'600'
  },
  statLabel: {
    fontSize:12
  },
  bar: {
    height:6, borderRadius:4
  },

  list: {
    paddingHorizontal:8, paddingBottom:100
  },
  empty: {
    textAlign:'center', marginTop:20
  },

  fab: {
    position:'absolute',
    right:24,
    bottom:30,
  },
});