let tasks = [
    { id: "1", title: "Completar informe semanal", completed: false },
    { id: "2", title: "Revisar correos pendientes", completed: false },
    { id: "3", title: "Preparar presentación", completed: false },
  ];
  
  const tasksModel = {
    getAllTasks: () => {
      return tasks;
    },
    toggleTask: (id) => {
      tasks = tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      );
      return tasks;
    },
    addNewTask: (title) => {
      const newTask = { id: Date.now().toString(), title, completed: false };
      tasks = [...tasks, newTask];
      return tasks;
    },
  };
  
  export default tasksModel;  