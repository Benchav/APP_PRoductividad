let tasks = [
  { id: "1", title: "Completar informe semanal", description: "Enviar antes del viernes", priority: "Media", status: "Pendiente", dueDate: null, tags: [], completed: false },
  { id: "2", title: "Revisar correos pendientes", description: "Responder correos importantes", priority: "Alta", status: "En progreso", dueDate: null, tags: [], completed: false },
];

const tasksModel = {
  getAllTasks: () => tasks,
  addNewTask: ({ title, description, priority, status, dueDate, tags }) => {
    const newTask = {
      id: Date.now().toString(),
      title,
      description,
      priority,
      status,
      dueDate,
      tags,
      completed: status === 'Completada'
    };
    tasks = [newTask, ...tasks];
    return tasks;
  },
  toggleTask: id => {
    tasks = tasks.map(task =>
      task.id === id
        ? { ...task, completed: !task.completed, status: !task.completed ? 'Completada' : 'Pendiente' }
        : task
    );
    return tasks;
  },
  deleteTask: id => {
    tasks = tasks.filter(task => task.id !== id);
    return tasks;
  }
};

export default tasksModel;