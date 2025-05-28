<!-- src/components/Perfil/VideosUsuario.vue -->
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
                  <!-- Avatar pequeño -->
                  <v-avatar size="36" class="mr-3 mt-1">
                    <v-img :src="`https://picsum.photos/seed/user${video.idUsuario}/36/36`"></v-img>
                  </v-avatar>
                  
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

<style scoped>
.VideosUsuario {
  border-radius: 16px;
  border: 1px solid rgba(244, 67, 54, 0.2);
}

.VideosUsuario__Header {
  background: linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(255, 138, 128, 0.05) 100%);
  border-bottom: 1px solid rgba(244, 67, 54, 0.1);
  padding: 20px;
}

.VideosUsuario__Content {
  padding: 20px;
}

.VideosUsuario__VideosGrid {
  margin-top: 15px; 
}

.VideosUsuario__Empty {
  text-align: center;
  padding: 40px 20px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 12px;
  border: 2px dashed rgba(0, 0, 0, 0.1);
}

.VideosUsuario__VideoCol {
  animation: fadeInUp 0.6s ease-out;
  margin-bottom: 5px; /* Separación entre cards */
}

.VideosUsuario__Video {
  height: 100%;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  cursor: pointer;
  border: 1px solid rgba(244, 67, 54, 0.1);
  position: relative;
  overflow: hidden;
}

.VideosUsuario__Video:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(244, 67, 54, 0.2);
  border-color: rgba(244, 67, 54, 0.3);
}

.VideosUsuario__VideoThumbnail {
  position: relative;
  overflow: hidden;
}

.VideosUsuario__VideoImagen {
  border-radius: 12px 12px 0 0;
  transition: transform 0.3s ease;
}

.VideosUsuario__Video:hover .VideosUsuario__VideoImagen {
  transform: scale(1.05);
}

.VideosUsuario__VideoDuracion {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.VideosUsuario__PlayOverlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.VideosUsuario__Video:hover .VideosUsuario__PlayOverlay {
  opacity: 1;
}

.VideosUsuario__VideoInfo {
  padding: 12px;
}

.VideosUsuario__VideoTitulo {
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.3;
  color: #333;
  padding: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.VideosUsuario__VideoMeta {
  padding: 4px 0 0 0;
  font-size: 0.8rem;
}

.VideosUsuario__VideoChip {
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 2;
}

.VideosUsuario__ToggleContainer {
  margin-top: 24px;
  text-align: center;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 600px) {
  .VideosUsuario__Header {
    padding: 16px;
  }
  
  .VideosUsuario__Content {
    padding: 16px;
  }
  
  .VideosUsuario__Empty {
    padding: 32px 16px;
  }
}
</style>