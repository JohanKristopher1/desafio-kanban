<template>
  <v-row>
    <v-col>
      <v-btn prepend-icon="mdi-filter-variant" color="#7C3AED" style="width: 160px; height: 60px;">
        Filtrar
      </v-btn>
    </v-col>
    <v-col cols="10">
      <v-text-field
        prepend-inner-icon="mdi-magnify"
        label="Busque por Título..."
        variant="solo-filled"
        height="48px"
      ></v-text-field>
    </v-col>
  </v-row>

  <v-row display="flex" justify-space-between class="board">
    <v-col
      class="column"
      v-for="(col, colIndex) in colum"
      :key="colIndex"
    >
      <h2>{{ col.name }}</h2>
      <draggable v-model="col.items" group="tasks" item-key="id" class="list">
        <template #item="{ element, index }">
          <div class="task">
            {{ element.title }}

            <v-icon
              icon="mdi-delete"
              size="large"
              class="delete-button"
              @click="deleteTask(colIndex, index)"
            />
          </div>
        </template>
      </draggable>
    </v-col>
  </v-row>

  <!-- Snackbar -->
  <v-snackbar v-model="snackbar.show" :timeout="3000" :color="snackbar.color">
    {{ snackbar.text }}
  </v-snackbar>
</template>

<script lang="ts">
import draggable from "vuedraggable";
import tasksApiService from "@/services/tasks/tasks-api-service";
import { typeCard } from "@/types/card-types";
import { defineComponent } from "vue";

export default defineComponent({
  components: { draggable },
  data() {
    return {
      colum: [] as any[],
      tasks: [] as typeCard[],
      snackbar: {
        show: false,
        text: "",
        color: "success",
      },
    };
  },
  async created() {
    this.colum = [
      { name: "A fazer", items: [] },
      { name: "Fazendo", items: [] },
      { name: "Feito", items: [] },
    ];

    try {
      const lista: typeCard[] = await tasksApiService.getAll();
      this.tasks = lista;
      this.colum[0].items = this.tasks.filter((task) => task.status === "todo");
      this.colum[1].items = this.tasks.filter((task) => task.status === "doing");
      this.colum[2].items = this.tasks.filter((task) => task.status === "done");
    } catch (error: any) {
      console.error(`Erro: ${error.message}`);
    } finally {
      console.log("Requisição finalizada");
    }
  },
  methods: {
    deleteTask(colIndex: number, taskIndex: number) {
      const removed = this.colum[colIndex].items.splice(taskIndex, 1)[0];
      this.snackbar.text = `Card "${removed.title}" deletado com sucesso!`;
      this.snackbar.color = "success";
      this.snackbar.show = true;
    },
  },
});
</script>

<style scoped>
.column {
  flex: 1;
  background: #FFFFFF;
}

.list {
  min-height: 200px;
  border-radius: 10px;
}

.task {
  width: 350px;
  height: 150px;
  background: #FFFFFF;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 8px;
  margin: 8px;
  cursor: grab;
  box-shadow: #EAE2FD 0px 1px 3px 0px, #EAE2FD 0px 1px 2px 0px;
  text-align: center;
}


</style>