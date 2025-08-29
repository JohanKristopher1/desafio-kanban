<template>
    <main>
      <defineComponent />
    </main>
</template>
<script lang="ts">
import TasksApiService from '@/services/tasks/tasks-api-service';
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'HomePage',
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