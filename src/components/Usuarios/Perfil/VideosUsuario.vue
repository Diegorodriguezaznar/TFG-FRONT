<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import type { VideoDTO } from '@/stores/dtos/VideoDTO';

// Props
const props = defineProps<{
  videos: VideoDTO[];
  usuarioNombre: string;
}>();

// Variables
const router = useRouter();
const mostrarTodos = ref(false);
const itemsPorDefecto = 5;

// Computed
const videosVisibles = computed(() => {
  if (mostrarTodos.value) {
    return props.videos;
  }
  return props.videos.slice(0, itemsPorDefecto);
});

const hayMasVideos = computed(() => {
  return props.videos.length > itemsPorDefecto;
});

// Métodos
const toggleMostrarTodos = () => {
  mostrarTodos.value = !mostrarTodos.value;
};

const verVideo = (video: VideoDTO) => {
  router.push({
    path: '/reproductor-video',
    query: { id: video.idVideo }
  });
};

const formatearFecha = (fecha: string) => {
  return new Date(fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const formatearDuracion = (duracion: string) => {
  // Si ya está en formato mm:ss, devolverlo tal como está
  if (duracion && duracion.includes(':')) {
    return duracion;
  }
  // Si es un número, convertirlo a mm:ss
  const segundos = parseInt(duracion) || 0;
  const mins = Math.floor(segundos / 60);
  const secs = segundos % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};
</script>

<template>
  <v-card class="VideosUsuario" elevation="2">
    <v-card-title class="VideosUsuario__Header">
      <div class="d-flex align-center">
        <v-icon color="red" size="large" class="mr-3">mdi-play-circle</v-icon>
        <div>
          <h2 class="text-h5 font-weight-bold">Videos Creados</h2>
          <p class="text-subtitle-2 text-grey mb-0">
            {{ props.videos.length }} video{{ props.videos.length !== 1 ? 's' : '' }} por {{ usuarioNombre }}
          </p>
        </div>
      </div>
    </v-card-title>
    
    <v-card-text class="VideosUsuario__Content">
      <!-- Sin videos -->
      <div v-if="props.videos.length === 0" class="VideosUsuario__Empty">
        <v-icon color="grey-lighten-2" size="64" class="mb-4">mdi-video-off</v-icon>
        <h3 class="text-h6 text-grey-darken-1 mb-2">No hay videos creados</h3>
        <p class="text-body-2 text-grey">Este usuario aún no ha subido ningún video</p>
      </div>
      
      <!-- Lista de videos -->
      <div v-else class="VideosUsuario__VideosGrid">
        <v-row>
          <v-col 
            v-for="video in videosVisibles" 
            :key="video.idVideo"
            cols="12" 
            sm="6" 
            md="4"
            class="VideosUsuario__VideoCol"
          >
            <v-card 
              class="VideosUsuario__Video" 
              elevation="1" 
              @click="verVideo(video)"
            >
              <!-- Thumbnail del video -->
              <div class="VideosUsuario__VideoThumbnail">
                <v-img 
                  :src="video.miniatura || `https://picsum.photos/seed/video${video.idVideo}/400/225`" 
                  height="180" 
                  cover
                  class="VideosUsuario__VideoImagen"
                >
                  <template v-slot:placeholder>
                    <v-row class="fill-height ma-0" align="center" justify="center">
                      <v-progress-circular indeterminate color="red"></v-progress-circular>
                    </v-row>
                  </template>
                </v-img>
                
                <!-- Duración del video -->
                <div v-if="video.duracion" class="VideosUsuario__VideoDuracion">
                  {{ formatearDuracion(video.duracion) }}
                </div>
                
                <!-- Play button overlay -->
                <div class="VideosUsuario__PlayOverlay">
                  <v-icon color="white" size="x-large">mdi-play</v-icon>
                </div>
              </div>
              
              <!-- Información del video -->
              <v-card-item class="VideosUsuario__VideoInfo">
                <div class="d-flex">
                  
                  <div class="flex-grow-1">
                    <v-card-title class="VideosUsuario__VideoTitulo">
                      {{ video.titulo }}
                    </v-card-title>
                    
                    <v-card-subtitle class="VideosUsuario__VideoMeta">
                      <div class="text-grey">{{ formatearFecha(video.fechaSubida) }}</div>
                    </v-card-subtitle>
                  </div>
                </div>
              </v-card-item>
              
              <!-- Chip de asignatura (solo si no es "General") -->
              <div v-if="video.asignatura && video.asignatura !== 'General'" class="VideosUsuario__VideoChip">
                <v-chip 
                  size="small" 
                  color="red" 
                  variant="elevated"
                >
                  {{ video.asignatura }}
                </v-chip>
              </div>
            </v-card>
          </v-col>
        </v-row>
        
        <!-- Botón para mostrar más/menos -->
        <div v-if="hayMasVideos" class="VideosUsuario__ToggleContainer">
          <v-btn 
            @click="toggleMostrarTodos"
            color="red"
            variant="outlined"
            size="large"
            block
          >
            <v-icon start>{{ mostrarTodos ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
            {{ mostrarTodos ? 'Mostrar menos' : `Mostrar todos (${props.videos.length})` }}
          </v-btn>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped lang="scss">
@import "@/assets/sass/components/Usuarios/Perfil/VideosUsuario.scss";
</style>