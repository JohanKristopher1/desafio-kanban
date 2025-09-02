<template>
    <header>
        <h2 v-if="!isEditing" @click="isEditing = true">{{ title }} <v-icon @click="isEditing = true" icon="mdi-pencil"></v-icon></h2>
        <input v-else v-model="title" @keydown.enter="isEditing = false" @blur="isEditing = false" autofocus class="title-input" type="text" />
        
    </header>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'HeaderComponents',
    data () {
       return {
        title: "Meu Kanban",
        isEditing: false
       }
    }
})
</script>
<style scoped>
h2 {
    cursor: pointer;
    display: inline-block;
    font-weight: 500;
    font-size: 3rem;
}
.title-input {
    font-size: 3rem;
    font-weight: 500;
    border: none;
    border-bottom: 2px solid #ccc;
    outline: none;
    width: auto;
    min-width: 200px;
}
.v-icon {
    cursor: pointer;
    font-size: 2.5rem;
    vertical-align: middle;
    margin-left: 10px;
}
</style>