<script setup>
  //imports
  import { ref } from 'vue';
  import MisVideos from '@/components/MisVideos.vue';

  const tab = ref("one");
</script>

<template>
    <v-card class="Usuario__Tab">
      <v-tabs v-model="tab" bg-color="primary">
        <v-tab value="one">Videos</v-tab>
        <v-tab value="three">Comentarios</v-tab>
      </v-tabs>
  
      <v-card-text>
        <v-tabs-window v-model="tab">
          <v-tabs-window-item value="one">
            <p>Tus Videos</p>
            <MisVideos />
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