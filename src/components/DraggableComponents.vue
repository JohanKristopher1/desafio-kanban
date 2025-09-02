<template>
  <v-row>
        <v-col>
          <v-btn prepend-icon="mdi-filter-variant" color="#7C3AED" width="160px" height="60px">Filtra</v-btn>
        </v-col>
        <v-col cols="11">       
          <v-text-field prepend-inner-icon="mdi-magnify" label="Busque por Titulo..." variant="solo-filled"  height="48px"></v-text-field>
        </v-col>
  </v-row>
  <v-row display="flex" justify="space-around" align="center">
      <v-col cols="4">
      <h3>A fazer</h3>
      <draggable class="list-group" :list="list1" group="people" @change="log" item-key="name">
        <template #item="{ element, index }">
            <div class="list-group-item">
                {{ element.name }} {{ index }}
            </div>
        </template>
      </draggable>
      </v-col>

    <v-col cols="4">
      <h3>Fazendo</h3>
      <draggable class="list-group" :list="list2" group="people" @change="log" item-key="name">
        <template #item="{ element, index }">
            <div class="list-group-item">
                {{ element.name }} {{ index }}
            </div>
        </template>
      </draggable>
    </v-col>

    <v-col cols="4">
      <h3>Feito</h3>
      <draggable class="list-group" :list="list3" group="people" @change="log" item-key="name">
        <template #item="{ element, index }">
            <div class="list-group-item">
                {{ element.name }} {{ index }}
            </div>
        </template>
      </draggable>
    </v-col>

    <rawDisplayer class="col-3" :value="list1" title="List 1" />

    <rawDisplayer class="col-3" :value="list2" title="List 2" />

    <rawDisplayer class="col-3" :value="list3" title="List 3" />
  </v-row>
</template>
<script lang="ts">
import draggable from "vuedraggable";
import tasksApiService from "@/services/tasks/tasks-api-service";
import { typeCard } from "@/types/card-types";

export default {
  name: "two-lists",
  display: "Two Lists",
  order: 1,
  components: {
    draggable
  },
  data() {
    return {
      tasks: [] as typeCard[],
      task: {} as typeCard
    };
  },
  async created() {
    await tasksApiService.getAll().then((lista: typeCard[]) => {
      this.tasks = lista;
      console.log(this.tasks);
    }).catch((error: typeCard) => {
      console.error(`Erro: ${error.message}`);
    }).finally(() => {
      console.log('Requisição finalizada');
    });
  },
  watch: {
    async tasks(novoValor) {
      console.log('Tasks atualizadas:', novoValor[0].id);

      const tarefas = await tasksApiService.getId(novoValor[0].id);
      this.task = tarefas;
    }
  }
} 
</script>