<template>
  <v-row>
        <v-col>
          <v-btn prepend-icon="mdi-filter-variant" color="#7C3AED" style="width: 160px; height: 60px;">Filtra</v-btn>
        </v-col>
        <v-col cols="11">       
          <v-text-field prepend-inner-icon="mdi-magnify" label="Busque por Titulo..." variant="solo-filled"  height="48px"></v-text-field>
        </v-col>
  </v-row>
  <v-row display="flex" justify-space-between class="board">
      <v-col class="column"
      v-for="(col, index) in colum"
      :key="index"
      >
      <h2>{{ col.name }}</h2>
      <draggable  v-model="col.items" group="tasks" item-key="id" class="list">
        <template #item="{ element }">
          <div class="task">
            {{ element.title }}
          </div>
        </template>
      </draggable>
      </v-col>
  </v-row>
</template>

<script lang="ts">
import draggable from "vuedraggable";
import tasksApiService from "@/services/tasks/tasks-api-service";
import { typeCard } from "@/types/card-types";
import { defineComponent } from "vue";

export default defineComponent({
  components: {
    draggable
  },
  data() {
    return {
      colum: [] as any[],
      tasks: [] as typeCard[],
      task: {} as typeCard
    };
  },
  async created() {
    this.colum = [
      { name: "A fazer", items: [] },
      { name: "Fazendo", items: [] },
      { name: "Feito", items: [] }
    ];
    await tasksApiService.getAll().then((lista: typeCard[]) => {
      this.tasks = lista;
      this.colum[0].items = this.tasks.filter((task:typeCard) => task.status === 'todo');
      this.colum[1].items = this.tasks.filter((task:typeCard) => task.status === 'doing');
      this.colum[2].items = this.tasks.filter((task:typeCard) => task.status === 'done');
    }).catch((error: any) => {
      console.error(`Erro: ${error.message}`);
    }).finally(() => {
      console.log('Requisição finalizada');
    });
  },
 })    
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
  background: #F3F4F6;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 8px;
  margin: 8px;
  cursor: grab;
  box-shadow: #ddd 0px 1px 3px 0px, #ddd 0px 1px 2px 0px;
  text-align: center;
}


</style>