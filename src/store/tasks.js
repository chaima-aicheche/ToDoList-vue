
import { defineStore } from 'pinia';

export const useTasksStore = defineStore({
  id: 'tasks',
  state: () => ({
    tasks: [],
  }),
  actions: {
    addTask(task) {
      this.tasks.push(task);
    },
  },
});
