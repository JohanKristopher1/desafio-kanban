<template>
    <main>
      <v-row>
        <v-col>
          <defineComponent />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-fild prepend-icon="mdi-search" label="Busque por Titulo..."></v-text-fild>
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
        DraggableComponents
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