<template>
    <main>
        <v-col>
          <DraggableComponents />
        </v-col>
    </main>
</template>
<script lang="ts">
import TasksApiService from '@/services/tasks/tasks-api-service';
import { defineComponent } from 'vue';
import DraggableComponents from '@/components/DraggableComponents.vue';
import { typeCard } from '@/types/card-types';



export default defineComponent({
    name: 'HomePage',
    components: {
        DraggableComponents,
    },
    data() {
        return {
            tasks: [] as typeCard[],
            task: { } as typeCard
        };
    },
   async created() {
      await TasksApiService.getAll().then((lista: typeCard[]) => {
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

        const tarefas =  await TasksApiService.getId(novoValor[0].id);
        this.task = tarefas;
      }
    }
})
</script>
<style scoped></style>