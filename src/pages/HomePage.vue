<template>
    <main>
      <v-row>
        <v-col>
          <defineComponent />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn prepend-icon="mdi-filter-variant" color="#7C3AED" size="large">Filtra</v-btn>
        </v-col>
        <v-col cols="11">       
          <v-text-field prepend-inner-icon="mdi-magnify" label="Busque por Titulo..." variant="solo-filled"></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <DraggableComponents />
        </v-col>
      </v-row>
    </main>
</template>
<script lang="ts">
import TasksApiService from '@/services/tasks/tasks-api-service';
import { defineComponent } from 'vue';
import DraggableComponents from '@/components/DraggableComponents.vue';


export default defineComponent({
    name: 'HomePage',
    components: {
        DraggableComponents,
        defineComponent
    },
    data() {
        return {
            tasks: [] as any[],
            task: { } as any
        };
    },
   async created() {
      await TasksApiService.getAll().then((lista: any[]) => {
        this.tasks = lista;   
        console.log(this.tasks);
      }).catch((error: any) => {
        console.error(`Erro: ${error.message}`);
      }).finally(() => {
        console.log('Requisição finalizada');
      });
    },
    watch: {
     async tasks(novoValor) {
        console.log('Tasks atualizadas:', novoValor[0].id);

        const tarefas =  await TasksApiService.getId(novoValor[9].id);
        this.task = tarefas;
      }
    }
})
</script>
<style scoped></style>