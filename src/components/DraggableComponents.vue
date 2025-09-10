<template>
  <v-row>
    <v-col>
      <v-btn prepend-icon="mdi-filter-variant" color="#7C3AED" style="width: 160px; height: 60px;" @click="filterTasks">
        Filtrar
      </v-btn>
    </v-col>
    <v-col cols="10">
      <v-text-field
        v-model="searchTerm"
        prepend-inner-icon="mdi-magnify"
        label="Busque por Título..."
        variant="solo-filled"
        height="48px"
        @keyup.enter="filterTasks"
      ></v-text-field>
    </v-col>
  </v-row>

  <v-row display="flex" justify-space-between class="board">
    <v-col
      class="column"
      v-for="(col, colIndex) in colum"
      :key="colIndex"
    >
      <div class="d-flex align-center justify-space-between">
        <h2>{{ col.name }}</h2>
        <v-btn
          v-if="col.name === 'A fazer'"
          icon
          color="primary"
          @click="dialog = true"
          style="border-radius: 5px;"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </div>
      <draggable v-model="col.items" group="tasks" item-key="id" class="list" @end="onDragEnd">
        <template #item="{ element, index }">
          <div class="task">
            <h3>{{ element.title }}</h3>
            <p>{{ element.description }}</p>
            <v-chip v-for="value in element.labels" :key="value" color="#E2D6FF" variant="flat" class="pa-2">{{ value }}</v-chip>
            <v-icon
              icon="mdi-delete"
              size="20"
              class="delete-button"
              @click="deleteTask(colIndex, index)"
            />
          </div>
        </template>
      </draggable>
    </v-col>
  </v-row>

  <v-dialog v-model="dialog" style="width: 690px; height: 350px;">
    <v-card>
      <v-card-title class="text-h6">Criar Atividade</v-card-title>
      <v-card-text>
        <v-text-field v-model="newTask.title" label="Título" variant="outlined" required />
        <v-textarea v-model="newTask.description" label="Descrição" variant="outlined" rows="3" />
        <v-combobox v-model="newTask.labels" :items="[]" label="Labels" variant="outlined" multiple chips tags />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="#CAB3FF" variant="tonal" @click="dialog = false">Cancelar</v-btn>
        <v-btn color="#7C3AED" variant="tonal" @click="creatTask">Salvar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-snackbar v-model="snackbar.show" :timeout="3000" :color="snackbar.color" location="top end">
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
      dialog: false,
      searchTerm: "",
      newTask: {
        title: "",
        description: "",
        labels: [],
        status: "todo",
      },
      filteredTasks: [] as typeCard[],
      colum: [] as any[],
      tasks: [] as typeCard[],
      task: {} as typeCard,
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

    await this.getListTasks();
  },
  methods: {
    filterTasks() {
      if (!this.searchTerm) {
        this.filteredTasks = this.tasks;
      } else {
        const search = this.searchTerm.toLowerCase();
        this.filteredTasks = this.tasks.filter((t) => t.title.toLowerCase().includes(search));
      }
      this.colum[0].items = this.filteredTasks.filter((task) => task.status === "todo");
      this.colum[1].items = this.filteredTasks.filter((task) => task.status === "doing");
      this.colum[2].items = this.filteredTasks.filter((task) => task.status === "done");
    },

    async creatTask() {
      try {
        const createdTask = await tasksApiService.post(this.newTask);
        this.colum[0].items.push(createdTask);
        this.tasks.push(createdTask);

        this.dialog = false;
        this.newTask = { title: "", description: "", labels: [], status: "todo" };

        this.snackbar.text = `Card "${createdTask.title}" criado com sucesso!`;
        this.snackbar.color = "success";
        this.snackbar.show = true;
        await this.getListTasks();
      } catch (error: any) {
        console.error(error);
        this.snackbar.text = `Erro ao criar o card: ${error.message}`;
        this.snackbar.color = "error";
        this.snackbar.show = true;
      }
    },

    async deleteTask(colIndex: number, taskIndex: number) {
      const column = this.colum[colIndex];
      if (!column) return;

      const removed = column.items[taskIndex];
      if (!removed) return;

      try {
        await tasksApiService.delete(removed.id);
        column.items.splice(taskIndex, 1);

        this.snackbar.text = `Card "${removed.title}" deletado com sucesso!`;
        this.snackbar.color = "success";
        await this.getListTasks();
      } catch (error: any) {
        console.error(error);
        this.snackbar.text = `Erro ao deletar o card: ${error.message}`;
        this.snackbar.color = "error";
      } finally {
        this.snackbar.show = true;
      }
    },

    async getListTasks() {
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
    async onDragEnd(evt: any) {
      const { item, to } = evt;

      const cardId = item.__vue__?.element?.id; 
      if (!cardId) return;

      const targetColumnName = this.colum.find(col => col.items === this.$refs[to.dataset.ref])?.name;

      const statusMap: Record<string, string> = {
        "A fazer": "todo",
        "Fazendo": "doing",
        "Feito": "done",
      };

      const newStatus = statusMap[targetColumnName || ""] || "todo";

      try {
        const card = this.tasks.find(t => t.id === cardId);
        if (!card) return;
        card.status = newStatus;
        await tasksApiService.patch(card);

        this.snackbar.text = `Status do card "${card.title}" atualizado para "${newStatus}"`;
        this.snackbar.color = "success";
      } catch (error: any) {
        console.error(error);
        this.snackbar.text = `Erro ao atualizar o status do card: ${error.message}`;
        this.snackbar.color = "error";
      } finally {
        this.snackbar.show = true;
      }
    }
  }    
});
</script>

<style scoped>
.task-card {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 16px;
  margin-bottom: 16px;
  position: relative;
}

.task-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
}

.task-description {
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
}

.task-labels {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.column {
  flex: 1;
  background: #FFFFFF;
}

.list {
  min-height: 200px;
  border-radius: 10px;
}

.task {
  position: relative;
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

.delete-button {
  position: absolute;
  bottom: 8px;
  right: 8px;
  color: #7C7C8A;
  cursor: pointer;
  transition: color 0.2s;
}

.delete-button:hover {
  color: #ef4444;
}

</style>