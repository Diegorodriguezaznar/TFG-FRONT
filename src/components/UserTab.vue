<script setup>
  //imports
  import { ref } from 'vue';
  import MisCursos from '@/components/MisCursos.vue';
  import MisArchivos from '@/components/MisArchivos.vue';

  const tab = ref("one");
</script>

<template>
    <v-card class="Usuario__Tab">
      <v-tabs v-model="tab" bg-color="primary">
        <v-tab value="one">Archivos</v-tab>
        <v-tab value="two">Cursos</v-tab>
        <v-tab value="three">Comentarios</v-tab>
      </v-tabs>
  
      <v-card-text>
        <v-tabs-window v-model="tab">
          <v-tabs-window-item value="one">
            <p>Tus Archivos</p>
            <MisArchivos />
          </v-tabs-window-item>
  
          <v-tabs-window-item value="two">
            <p>Tus Cursos</p>
            <MisCursos />
          </v-tabs-window-item>
  
          <v-tabs-window-item value="three">
            <p>PROXIMAMENTE...</p>
          </v-tabs-window-item>
        </v-tabs-window>
      </v-card-text>
    </v-card>
</template>
  

  
<style lang="scss" scoped>
@import "@/assets/sass/components/Mis/UserTab.scss";
</style>
  