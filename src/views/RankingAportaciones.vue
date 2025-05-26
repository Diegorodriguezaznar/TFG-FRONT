<script setup lang="ts">
// --------------------------- Imports ---------------------------
import { ref } from 'vue'
import Header from '@/components/Layout/Header.vue'
import Sidebar from '@/components/Layout/Sidebar.vue'
import GraficoUsuariosVideos from '@/components/GraficoUsuariosVideos.vue'

// --------------------------- Variables ---------------------------
const drawer = ref(false)
</script>

<template>
  <v-app>
    <!-- --------------------------- Header --------------------------- -->
    <Header @toggle-sidebar="drawer = !drawer" />

    <!-- --------------------------- Contenido principal --------------------------- -->
    <v-main class="RankingPage">
      <!-- --------------------------- Sidebar --------------------------- -->
      <Sidebar v-model="drawer" />

      <!-- --------------------------- Contenedor de estadísticas --------------------------- -->
      <v-container class="RankingPage__Contenedor">
        <h1 class="text-h4 font-weight-bold mb-6">Ranking de Aportaciones</h1>
        <p class="mb-6">Usuarios con más vídeos subidos a la plataforma</p>

        <GraficoUsuariosVideos />
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.RankingPage {
  background-color: #f9f9f9;
  min-height: 100vh;
}

.RankingPage__Contenedor {
  padding-top: 16px;
  max-width: 1000px;
}

@media (max-width: 600px) {
  .RankingPage__Contenedor {
    padding: 8px;
  }
}
</style>
