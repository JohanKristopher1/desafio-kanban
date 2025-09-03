<template>
  <v-row>
        <v-col>
          <v-btn prepend-icon="mdi-filter-variant" color="#7C3AED" style="width: 160px; height: 60px;">Filtra</v-btn>
        </v-col>
        <v-col cols="11">       
          <v-text-field prepend-inner-icon="mdi-magnify" label="Busque por Titulo..." variant="solo-filled"  height="48px"></v-text-field>
        </v-col>
  </v-row>
  <v-row display="flex" justify="space-around" align="center">
      <v-col cols="4"
      v-for="(col, index) in colum"
      :key="index"
      >
      <h2>{{ col.name }}</h2>
      <draggable  v-model="col.items" group="tasks" item-key="id">
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
  name: "two-lists",
  display: "Two Lists",
  order: 1,
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