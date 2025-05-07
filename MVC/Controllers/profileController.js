// src/Controllers/profileController.js
import profileModel from "../Models/profileModel";
import taskController from "./taskController";

const profileController = {
  /**
   * Carga el perfil junto con progreso de tareas:
   * - Trae perfil
   * - Trae tareas del usuario
   * - Calcula totales por estado y porcentaje
   */
  loadProfileWithProgress: async (setProfile, setLoading, setError) => {
    setLoading(true);
    try {
      // 1. Perfil
      const res = await profileModel.getProfile();
      if (!res.success) throw new Error(res.message);
      const profileData = res.data;
      const userId = profileData.user_id;

      // 2. Tareas del usuario
      const tasks = await taskController.getTasksByUserId(userId);

      // 3. Cálculo igual que en TasksView
      const total      = tasks.length;
      const pending    = tasks.filter(t => t.status === "Pendiente").length;
      const inProgress = tasks.filter(t => t.status === "En progreso").length;
      const completed  = tasks.filter(t => t.status === "Completada").length;
      const pct        = total ? completed / total : 0;

      // 4. Setear estado
      setProfile({
        ...profileData,
        totalTasks: total,
        pendingTasks: pending,
        inProgressTasks: inProgress,
        completedTasks: completed,
        progressPct: pct,
      });
    } catch (err) {
      console.warn("Error loadProfileWithProgress:", err);
      setError(err.message || "Error cargando perfil y progreso");
    } finally {
      setLoading(false);
    }
  },

  /**
   * Guarda cambios en email y/o contraseña.
   */
  saveProfile: async (email, password, setLoading, setError, onSuccess) => {
    setLoading(true);
    const result = await profileModel.updateProfile(email, password);
    setLoading(false);

    if (result.success) {
      onSuccess(result.data);
    } else {
      setError(result.message);
    }
  },
};

export default profileController;