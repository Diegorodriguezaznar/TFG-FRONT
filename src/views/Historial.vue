<script setup lang="ts">
// --------------------------- Imports ---------------------------
import { ref, onMounted } from 'vue';
import Header from '@/components/Header.vue';
import Sidebar from '@/components/Sidebar.vue';
import HistorialVideos from '@/components/HistorialVideos.vue';

// --------------------------- Variables ---------------------------
const drawer = ref(false);
const searchQuery = ref('');

// --------------------------- Historial de Videos ---------------------------
const historialVideos = ref([
  // Sección: Ayer
  {
    fecha: 'Ayer',
    videos: [
      {
        id: 1,
        titulo: 'Terraria - Update 1.4.5 Official Trailer',
        canal: 'sockrteez',
        vistas: '378K visualizaciones',
        thumbnail: 'https://picsum.photos/id/237/300/200',
        duracion: '1:51',
        descripcion: 'Available Now!! On Steam! Dig, fight, explore, build! Nothing is impossible in this action-packed adventure game.',
        logo: 'https://picsum.photos/id/231/40/40'
      }
    ]
  },
  // Sección: 19 mar
  {
    fecha: '19 mar',
    videos: [
      {
        id: 2,
        titulo: 'S3 Static Web',
        canal: 'Profe Santos Cloud',
        vistas: '701 visualizaciones',
        thumbnail: 'https://picsum.photos/id/24/300/200',
        duracion: '8:07',
        descripcion: 'GitHub https://github.com/santos-pardos/Hands-On-Lab-in-AWS/tree/main/Storage/S3',
        logo: 'https://picsum.photos/id/232/40/40'
      }
    ]
  },
  // Sección: 27 feb
  {
    fecha: '27 feb',
    videos: [
      {
        id: 3,
        titulo: 'Cavani erra contra alianza lima #futbol #argentina #bocajuniors',
        canal: 'los primero de mayo',
        vistas: '38K visualizaciones',
        thumbnail: 'https://picsum.photos/id/25/300/200',
        duracion: '0:45',
        descripcion: 'Boca vs alianza lima',
        logo: 'https://picsum.photos/id/233/40/40',
        etiqueta: 'SHORTS'
      },
      {
        id: 4,
        titulo: 'DAVOO XENEIZE OPINA DE BOCA 2 (4) ALIANZA LIMA 1 (5) - FASE 2 (VUELTA) - COPA LIBERTADORES 2025',
        canal: 'Davoo Xeneize',
        vistas: '1.4M de visualizaciones',
        thumbnail: 'https://picsum.photos/id/26/300/200',
        duracion: '50:55',
        descripcion: 'KICK: https://kick.com/davooxeneize INSTAGRAM: https://www.instagram.com/davooxeneize',
        logo: 'https://picsum.photos/id/234/40/40'
      },
      {
        id: 5,
        titulo: '(Relator Destruido Daniel Mollo) Boca 2 - Alianza Lima 1 Copa Libertadores. Penales (4-5)',
        canal: 'Tolondroque',
        vistas: '510K visualizaciones',
        thumbnail: 'https://picsum.photos/id/27/300/200',
        duracion: '15:30',
        descripcion: 'Relato emocionante de la derrota de Boca por penales',
        logo: 'https://picsum.photos/id/235/40/40'
      }
    ]
  }
]);

// --------------------------- Actualizar búsqueda ---------------------------
const actualizarBusqueda = (query) => {
  searchQuery.value = query;
};

// --------------------------- Eliminar video ---------------------------
const eliminarVideo = (seccionIndex, videoIndex) => {
  // Eliminar el video del arreglo
  historialVideos.value[seccionIndex].videos.splice(videoIndex, 1);
  
  // Si la sección queda vacía, eliminarla también
  if (historialVideos.value[seccionIndex].videos.length === 0) {
    historialVideos.value.splice(seccionIndex, 1);
  }
};
</script>

<template>
  <v-app>
    <!-- --------------------------- Header --------------------------- -->
    <Header 
      @toggle-sidebar="drawer = !drawer" 
      @update-search="actualizarBusqueda"
    />
    
    <!-- --------------------------- Contenedor principal --------------------------- -->
    <v-main class="HistorialPage">
      <!-- --------------------------- Sidebar --------------------------- -->
      <Sidebar v-model="drawer" />
      
      <!-- --------------------------- Contenido principal --------------------------- -->
      <v-container class="HistorialPage__Contenedor">
        <h1 class="text-h4 font-weight-bold mb-6">Historial de reproducciones</h1>
        
        <HistorialVideos 
          :historial="historialVideos" 
          :search-query="searchQuery"
          @eliminar-video="eliminarVideo"
        />
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.HistorialPage {
  background-color: #f9f9f9;
  min-height: 100vh;
}

.HistorialPage__Contenedor {
  padding-top: 16px;
  max-width: 1200px;
}

@media (max-width: 600px) {
  .HistorialPage__Contenedor {
    padding: 8px;
  }
}
</style>