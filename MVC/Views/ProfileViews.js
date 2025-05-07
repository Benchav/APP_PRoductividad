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
  useTheme,
  Divider,
  Chip,
  ProgressBar,
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import profileController from "../Controllers/profileController";
import authController from "../Controllers/authController";

const ProfileView = ({ navigation }) => {
  const { colors } = useTheme();
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
      <SafeAreaView style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Avatar.Icon
            size={80}
            icon="account"
            style={{ backgroundColor: colors.primaryContainer }}
          />
          <Text variant="titleLarge" style={[styles.userName, { color: colors.onBackground }]}>
            {profile.email.split("@")[0]}
          </Text>
          <Chip icon="shield-check" style={styles.verifiedChip}>
            Cuenta verificada
          </Chip>
        </View>

        {/* Info de cuenta */}
        <Surface style={[styles.section, { backgroundColor: colors.surface }]} elevation={1}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="account-details" size={24} color={colors.primary} />
            <Text variant="titleMedium" style={[styles.sectionTitle, { color: colors.onSurface }]}>
              Información de la cuenta
            </Text>
          </View>
          <Divider style={{ marginVertical: 12 }} />
          <View style={styles.infoRow}>
            <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant }}>
              Correo electrónico:
            </Text>
            <Text variant="bodyLarge" style={{ color: colors.onSurface }}>
              {profile.email}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant }}>
              Seguridad:
            </Text>
            <View style={styles.securityRow}>
              <Text variant="bodyLarge" style={{ color: colors.onSurface }}>
                {showPassword ? profile.password : "••••••••"}
              </Text>
              <View style={styles.iconGroup}>
                <IconButton
                  icon={showPassword ? "eye-off" : "eye"}
                  size={20}
                  onPress={() => setShowPassword(!showPassword)}
                  iconColor={colors.primary}
                />
                <IconButton
                  icon="pencil"
                  size={20}
                  onPress={() => setModalVisible(true)}
                  iconColor={colors.primary}
                />
              </View>
            </View>
          </View>
        </Surface>

        {/* Progreso de tareas */}
        <Surface style={[styles.section, { backgroundColor: colors.surface }]} elevation={1}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="progress-clock" size={24} color={colors.primary} />
            <Text variant="titleMedium" style={[styles.sectionTitle, { color: colors.onSurface }]}>
              Progreso de tareas
            </Text>
          </View>
          <Divider style={{ marginVertical: 12 }} />
          <ProgressBar
            progress={profile.progressPct}
            color={colors.primary}
            style={{ height: 8, borderRadius: 4 }}
          />
          <Text variant="bodySmall" style={{ marginTop: 8, color: colors.onSurfaceVariant }}>
            Has completado {Math.round(profile.progressPct * 100)}% de tus tareas
          </Text>
          <View style={styles.statsRow}>
            <Chip icon="check-circle" style={styles.chip} selectedColor={colors.onSurface}>
              Completadas {profile.completedTasks}
            </Chip>
            <Chip icon="progress-clock" style={styles.chip} selectedColor={colors.onSurface}>
              En progreso {profile.inProgressTasks}
            </Chip>
            <Chip icon="clock-alert" style={styles.chip} selectedColor={colors.onSurface}>
              Pendientes {profile.pendingTasks}
            </Chip>
          </View>
        </Surface>
      </ScrollView>

      {/* Logout */}
      <Button
        mode="contained-tonal"
        icon="logout"
        style={[styles.logoutButton, { backgroundColor: colors.errorContainer }]}
        labelStyle={{ color: colors.onErrorContainer }}
        onPress={handleLogout}
      >
        Cerrar sesión
      </Button>

      {/* Modal Cambiar Contraseña */}
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={[styles.modal, { backgroundColor: colors.background }]}
        >
          <View style={styles.modalContent}>
            <Text variant="titleMedium" style={[styles.modalTitle, { color: colors.onBackground }]}>
              Cambiar contraseña
            </Text>
            {error && (
              <Text variant="bodySmall" style={[styles.error, { color: colors.error }]}>
                <MaterialCommunityIcons name="alert-circle" size={14} /> {error}
              </Text>
            )}
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
              outlineColor={colors.outline}
              activeOutlineColor={colors.primary}
            />
            <View style={styles.modalActions}>
              <Button mode="outlined" onPress={() => setModalVisible(false)} style={styles.modalButton}>
                Cancelar
              </Button>
              <Button mode="contained" onPress={handleSavePassword} loading={saving} style={styles.modalButton}>
                {saving ? "Guardando..." : "Guardar cambios"}
              </Button>
            </View>
          </View>
        </Modal>
      </Portal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  scrollContent: { padding: 16, gap: 20, paddingBottom: 100 },
  header: { alignItems: "center", gap: 12, marginVertical: 24 },
  userName: { fontWeight: "600", letterSpacing: 0.25 },
  verifiedChip: { marginTop: 8 },
  section: { borderRadius: 16, padding: 16, gap: 12 },
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  sectionTitle: { fontWeight: "500" },
  infoRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 8 },
  securityRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  iconGroup: { flexDirection: "row", marginLeft: 8 },
  statsRow: { flexDirection: "row", justifyContent: "space-around", marginTop: 12 },
  chip: { flex: 1, marginHorizontal: 4 },
  logoutButton: { position: "absolute", bottom: 24, left: 16, right: 16, borderRadius: 12 },
  modal: { margin: 24, borderRadius: 16 },
  modalContent: { padding: 24, gap: 16 },
  modalTitle: { fontWeight: "600", textAlign: "center" },
  input: { backgroundColor: "transparent" },
  error: { textAlign: "center", flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 4 },
  modalActions: { flexDirection: "row", gap: 12, marginTop: 16 },
  modalButton: { flex: 1 },
});

export default ProfileView;