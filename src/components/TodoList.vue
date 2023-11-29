<script setup>
import { ref } from 'vue';
import { useTasksStore } from "../store/tasks";

const tasksStore = useTasksStore();
let task = tasksStore.tasks;
const newTaskText = ref('');
const newTaskPriority = ref('Medium');
const newTaskCategory = ref('General');

const columns = ref([
  { name: 'À faire', tasks: [] },
  { name: 'En cours', tasks: [] },
  { name: 'Terminé', tasks: [] },
]);

const addTask = () => {
  if (newTaskText.value.trim() !== '') {
    const newTask = {
      id: tasksStore.tasks.length + 1,
      text: newTaskText.value,
      priority: newTaskPriority.value,
      category: newTaskCategory.value,
    };

    // Ajouter la nouvelle tâche à la colonne "À faire" par défaut
    columns.value[0].tasks.push(newTask);

    tasksStore.addTask(newTask);
    newTaskText.value = '';
    newTaskPriority.value = 'Medium';
    newTaskCategory.value = 'General';
  }
};

const onDragStart = (columnIndex, taskIndex) => {
  // Enregistrez les indices de la colonne et de la tâche pendant le début du glisser
  event.dataTransfer.setData('columnIndex', columnIndex);
  event.dataTransfer.setData('taskIndex', taskIndex);
};

const onDrop = (toColumnIndex) => {
  // Récupérez les indices de la colonne et de la tâche pendant le glisser
  const fromColumnIndex = event.dataTransfer.getData('columnIndex');
  const taskIndex = event.dataTransfer.getData('taskIndex');

  // Déplacez la tâche de la colonne source à la colonne de destination
  const task = columns.value[fromColumnIndex].tasks.splice(taskIndex, 1)[0];
  columns.value[toColumnIndex].tasks.push(task);
};
const removeTask = (event, columnIndex, taskIndex) => {
  // Empêcher le clic de se propager à d'autres éléments
  event.stopPropagation();

  // Supprimer la tâche de la colonne
  columns.value[columnIndex].tasks.splice(taskIndex, 1);
};
</script>

<template>
  <div class="app-container">
    <div class="kanban-container">
      <h1>Kanban Board</h1>

      <div v-for="(column, columnIndex) in columns" :key="columnIndex" class="kanban-column" @dragover.prevent @drop="onDrop(columnIndex)">
        <h2>{{ column.name }}</h2>
        <ul>
          <li v-for="(task, taskIndex) in column.tasks" :key="taskIndex" draggable="true" @dragstart="onDragStart(columnIndex, taskIndex)">
            {{ task.text }} - {{ task.category }}
            <button @click="($event) => removeTask($event, columnIndex, taskIndex)">Supprimer</button>
          </li>
        </ul>
      </div>
    </div>

    <form @submit.prevent="addTask" class="task-form">
      <label for="newTask">Nouvelle tâche: </label>
      <input type="text" id="newTask" v-model="newTaskText" />

      <label for="priority">Priorité:</label>
      <select id="priority" v-model="newTaskPriority">
        <option value="High">Haute</option>
        <option value="Medium">Moyenne</option>
        <option value="Low">Basse</option>
      </select>

      <label for="category">Catégorie:</label>
      <input type="text" id="category" v-model="newTaskCategory" />

      <button type="submit">Ajouter</button>
    </form>
  </div>
</template>

<style src="../style.css" scoped></style>
