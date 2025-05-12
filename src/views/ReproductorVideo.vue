<script setup lang="ts">
// --------------------------- Imports ---------------------------
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useVideoStore } from '@/stores/Video';
import VideoPlayer from '@/components/VideoPlayer.vue';
import VideoInfo from '@/components/VideoInfo.vue';
import VideoSuggestions from '@/components/VideoSuggestions.vue';
import VideoComments from '@/components/VideoComments.vue';
import Header from '@/components/Header.vue';
import Sidebar from '@/components/Sidebar.vue';
import type { VideoDTO } from '@/stores/dtos/VideoDTO';

// --------------------------- Route ---------------------------
const route = useRoute();

// --------------------------- Store ---------------------------
const videoStore = useVideoStore();

// --------------------------- Variables ---------------------------
const sidebarOpen = ref(true);
const searchQuery = ref('');
const loading = ref(true);
const error = ref('');

// Inicializar currentVideo con valores por defecto para evitar errores durante la carga
const currentVideo = ref<VideoDTO>({
  idVideo: 0,
  titulo: 'Cargando...',
  descripcion: 'Cargando descripción...',
  url: '',
  miniatura: 'https://picsum.photos/seed/loading/300/200',
  fechaSubida: '',
  idAsignatura: 0,
  asignatura: 'Cargando...',
  idUsuario: 0,
  autor: 'Cargando...',
  idCurso: 0,
  vistas: '0',
  fecha: 'Cargando...',
  duracion: '00:00' 
});

// Lista de videos sugeridos
const suggestedVideos = ref<VideoDTO[]>([]);

// ID del video desde la URL
const videoId = computed(() => {
  return route.query.id ? Number(route.query.id) : 1; // Default a 1 para evitar problemas
});

// --------------------------- Métodos ---------------------------
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};

const updateSearch = (query: string) => {
  searchQuery.value = query;
};

const handleVideoSelect = (videoId: number) => {
  // Utilizamos el router para navegar al nuevo video
  window.location.href = `/reproductor-video?id=${videoId}`;
};

// Cargar el video actual
const loadCurrentVideo = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    const video = await videoStore.fetchVideoById(videoId.value);
    if (video) {
      currentVideo.value = video;
      // Si no tiene duración, asignar un valor por defecto
      if (!currentVideo.value.duracion) {
        currentVideo.value.duracion = '00:00';
      }
    } else {
      error.value = 'No se encontró el video solicitado';
    }
  } catch (err: any) {
    error.value = err.message || 'Error al cargar el video';
    console.error('Error al cargar el video:', err);
  } finally {
    loading.value = false;
  }
};

// Cargar videos sugeridos
const loadSuggestedVideos = async () => {
  try {
    const videos = await videoStore.fetchAllVideos();
    // Filtrar para excluir el video actual y limitar a 8 videos
    suggestedVideos.value = videos
      .filter(v => v.idVideo !== videoId.value)
      .slice(0, 8);
  } catch (err: any) {
    console.error('Error al cargar videos sugeridos:', err);
  }
};

// --------------------------- Cargar datos iniciales ---------------------------
onMounted(async () => {
  await loadCurrentVideo();
  await loadSuggestedVideos();
});
</script>

<template>
  <v-app>
    <!-- Header -->
    <Header @toggle-sidebar="toggleSidebar" @update-search="updateSearch" />
    
    <!-- Sidebar -->
    <Sidebar v-model="sidebarOpen" />
    
    <!-- Contenido principal -->
    <v-main :class="{ 'ml-240': sidebarOpen, 'ml-80': !sidebarOpen }">
      <div v-if="loading" class="d-flex justify-center align-center" style="height: 50vh;">
        <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      </div>
      
      <div v-else-if="error" class="d-flex justify-center align-center flex-column" style="height: 50vh;">
        <v-icon color="error" size="64" class="mb-4">mdi-alert-circle</v-icon>
        <h2 class="text-h5 text-center mb-2">No se pudo cargar el video</h2>
        <p class="text-body-1 text-center">{{ error }}</p>
        <v-btn color="primary" class="mt-4" to="/cursos">
          Volver a cursos
        </v-btn>
      </div>
      
      <v-container v-else fluid class="pa-0 pa-sm-4">
        <v-row>
          <v-col cols="12" md="8" lg="9">
            <VideoPlayer :video="currentVideo" />
            
            <VideoInfo :video="currentVideo" />
            
            <VideoComments :video-id="videoId" />
          </v-col>
          
          <!-- Columna de videos sugeridos -->
          <v-col cols="12" md="4" lg="3">
            <VideoSuggestions 
              :videos="suggestedVideos" 
              @select-video="handleVideoSelect" 
            />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.ml-240 {
  margin-left: 240px;
}

.ml-80 {
  margin-left: 80px;
}

@media (max-width: 960px) {
  .ml-240,
  .ml-80 {
    margin-left: 0;
  }
}
</style>