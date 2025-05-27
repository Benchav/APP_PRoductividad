// src/Views/ProfileView.js
import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  ScrollView,
  Alert,
  StyleSheet,
  Platform,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import {
  Text,
  TextInput,
  Button,
  Avatar,
  IconButton,
  Modal,
  Portal,
  ActivityIndicator,
  Surface,
  Divider,
  Chip,
  ProgressBar,
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import profileController from "../Controllers/profileController";
import authController from "../Controllers/authController";

// Compartir paleta con TasksView
const palette = {
  background: '#FFFFFF',        
  surface: '#FFFFFF',           
  primary: '#5DADE2',           
  primaryContainer: '#87CEEB',  
  outline: '#7F8C8D',          
  onSurface: '#000000',        
  error: 'red',                 
  onPrimary: '#FFFFFF',         
};

export default function ProfileView({ navigation }) {
  const [profile, setProfile] = useState({
    email: "",
    password: "",
    totalTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0,
    progressPct: 0,
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    profileController.loadProfileWithProgress(
      setProfile,
      setLoading,
      setError
    );
  }, []);

  const handleLogout = () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Estás seguro de que quieres salir de tu cuenta?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Salir", onPress: () => authController.handleLogout(navigation) },
      ]
    );
  };

  const handleSavePassword = () => {
    if (!newPassword || newPassword.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }
    setError("");
    profileController.saveProfile(
      profile.email,
      newPassword,
      setSaving,
      setError,
      (updated) => {
        setProfile(updated);
        setModalVisible(false);
        Alert.alert("Éxito", "Contraseña actualizada correctamente");
      }
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.center, { backgroundColor: palette.background }]}> 
        <ActivityIndicator size="large" color={palette.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: palette.background }]}>      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Avatar.Icon
            size={80}
            icon="account"
            style={{ backgroundColor: palette.primaryContainer }}
          />
          <Text style={[styles.userName, { color: palette.onSurface }]}>  
            {profile.email.split("@")[0]}
          </Text>
          <Chip 
            icon="shield-check" 
            style={[styles.verifiedChip, { backgroundColor: palette.primaryContainer }]} 
            textStyle={{ color: palette.onPrimary }}
          >
            Cuenta verificada
          </Chip>
        </View>

        {/* Info de cuenta */}
        <Surface style={[styles.section, { backgroundColor: palette.surface }]} elevation={2}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="account-details" size={24} color={palette.primary} />
            <Text style={[styles.sectionTitle, { color: palette.onSurface }]}>Información de la cuenta</Text>
          </View>
          <Divider style={{ backgroundColor: palette.outline, marginVertical: 12 }} />
          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: palette.onSurface }]}>Correo electrónico:</Text>
            <Text style={[styles.value, { color: palette.onSurface }]}>{profile.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: palette.onSurface }]}>Seguridad:</Text>
            <View style={styles.securityRow}>
              <Text style={[styles.value, { color: palette.onSurface }]}>  
                {showPassword ? profile.password : "••••••••"}
              </Text>
              <IconButton
                icon={showPassword ? "eye-off" : "eye"}
                size={20}
                onPress={() => setShowPassword(!showPassword)}
                iconColor={palette.primary}
              />
              <IconButton
                icon="pencil"
                size={20}
                onPress={() => setModalVisible(true)}
                iconColor={palette.primary}
              />
            </View>
          </View>
        </Surface>

        {/* Progreso de tareas */}
        <Surface style={[styles.section, { backgroundColor: palette.surface }]} elevation={2}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="progress-clock" size={24} color={palette.primary} />
            <Text style={[styles.sectionTitle, { color: palette.onSurface }]}>Progreso de tareas</Text>
          </View>
          <Divider style={{ backgroundColor: palette.outline, marginVertical: 12 }} />
          <ProgressBar
            progress={profile.progressPct}
            color={palette.primary}
            style={styles.progressBar}
          />
          <Text style={[styles.smallText, { color: palette.onSurface }]}>  
            Has completado {Math.round(profile.progressPct * 100)}% de tus tareas
          </Text>
          <View style={styles.statsRow}>
            <Chip
              icon="check-circle"
              style={[styles.chip, { backgroundColor: palette.primaryContainer }]}
              textStyle={{ color: palette.onPrimary }}
            >
              Completadas {profile.completedTasks}
            </Chip>
            <Chip
              icon="progress-clock"
              style={[styles.chip, { backgroundColor: palette.primaryContainer }]}
              textStyle={{ color: palette.onPrimary }}
            >
              En progreso {profile.inProgressTasks}
            </Chip>
            <Chip
              icon="clock-alert"
              style={[styles.chip, { backgroundColor: palette.primaryContainer }]}
              textStyle={{ color: palette.onPrimary }}
            >
              Pendientes {profile.pendingTasks}
            </Chip>
          </View>
        </Surface>
      </ScrollView>

      {/* Logout */}
      <TouchableOpacity onPress={handleLogout} style={[styles.logoutButton, { backgroundColor: palette.primary }]}> 
        <View style={styles.logoutContent}>
          <MaterialCommunityIcons name="logout" size={20} color={palette.onPrimary} />
          <Text style={[styles.logoutText, { color: palette.onPrimary }]}>Cerrar sesión</Text>
        </View>
      </TouchableOpacity>

      {/* Modal Cambiar Contraseña */}
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={[styles.modal, { backgroundColor: palette.surface }]}
        >
          <View style={styles.modalContent}>
            <Text style={[styles.modalTitle, { color: palette.onSurface }]}>Cambiar contraseña</Text>
            {error ? (
              <Text style={[styles.errorText, { color: palette.error }]}>⚠️ {error}</Text>
            ) : null}
            <TextInput
              label="Nueva contraseña"
              value={newPassword}
              onChangeText={setNewPassword}
              mode="outlined"
              secureTextEntry={!showNewPassword}
              right={
                <TextInput.Icon
                  icon={showNewPassword ? "eye-off" : "eye"}
                  onPress={() => setShowNewPassword(!showNewPassword)}
                />
              }
              style={styles.input}
              outlineColor={palette.outline}
              activeOutlineColor={palette.primary}
            />
            <View style={styles.modalActions}>
              <Button mode="outlined" onPress={() => setModalVisible(false)} style={{ borderColor: palette.outline }} labelStyle={{ color: palette.onSurface }}>
                Cancelar
              </Button>
              <Button mode="contained" onPress={handleSavePassword} loading={saving} style={{ backgroundColor: palette.primary }} labelStyle={{ color: palette.onPrimary }}>
                Guardar cambios
              </Button>
            </View>
          </View>
        </Modal>
      </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  scrollContent: { padding: 16, paddingBottom: 100, gap: 20 },
  header: { alignItems: "center", gap: 12, marginVertical: 24 },
  userName: { fontSize: 20, fontWeight: "600", color: palette.onSurface },
  verifiedChip: { marginTop: 8 },
  section: { marginBottom: 20, borderRadius: 12, padding: 16, gap: 12 },
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  sectionTitle: { fontSize: 16, fontWeight: "500" },
  label: { fontSize: 14 },
  value: { fontSize: 14, fontWeight: "600" },
  infoRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 8 },
  securityRow: { flexDirection: "row", alignItems: "center" },
  statsRow: { flexDirection: "row", justifyContent: "space-around", marginTop: 12 },
  chip: { flex: 1, marginHorizontal: 4 },
  progressBar: { height: 8, borderRadius: 4 },
  smallText: { marginTop: 8, fontSize: 12 },
  logoutButton: { position: "absolute", bottom: 24, left: 16, right: 16, borderRadius: 12, paddingVertical: 12 },
  logoutContent: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8 },
  logoutText: { fontSize: 16, fontWeight: "600" },
  modal: { margin: 20, borderRadius: 12, padding: 20 },
  modalContent: { gap: 16 },
  modalTitle: { fontSize: 18, fontWeight: "600", textAlign: "center" },
  input: { backgroundColor: "transparent", marginBottom: 16 },
  errorText: { textAlign: "center" },
  modalActions: { flexDirection: "row", justifyContent: "flex-end", gap: 12, marginTop: 16 },
});