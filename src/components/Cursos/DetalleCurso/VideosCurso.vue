<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import type { VideoDTO } from '@/stores/dtos/VideoDTO';

// Props
const props = defineProps<{
  videos: VideoDTO[];
  cursoNombre: string;
  cursoId: number;
}>();

// Variables
const router = useRouter();
const mostrarTodos = ref(false);
const itemsPorDefecto = 6;

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
  if (duracion && duracion.includes(':')) {
    return duracion;
  }
  const segundos = parseInt(duracion) || 0;
  const mins = Math.floor(segundos / 60);
  const secs = segundos % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};
</script>

<template>
  <v-card class="VideosCurso" elevation="2">
    <v-card-title class="VideosCurso__Header">
      <div class="d-flex align-center">
        <v-icon color="red" size="large" class="mr-3">mdi-play-circle</v-icon>
        <div>
          <h2 class="text-h5 font-weight-bold">Videos del Curso</h2>
          <p class="text-subtitle-2 text-grey mb-0">
            {{ props.videos.length }} video{{ props.videos.length !== 1 ? 's' : '' }} en {{ cursoNombre }}
          </p>
        </div>
      </div>
    </v-card-title>
    
    <v-card-text class="VideosCurso__Content">
      <!-- Sin videos -->
      <div v-if="props.videos.length === 0" class="VideosCurso__Empty">
        <v-icon color="grey-lighten-2" size="64" class="mb-4">mdi-video-off</v-icon>
        <h3 class="text-h6 text-grey-darken-1 mb-2">No hay videos en este curso</h3>
        <p class="text-body-2 text-grey">Los videos aparecerán aquí cuando se añadan al curso</p>
      </div>
      
      <!-- Lista de videos -->
      <div v-else class="VideosCurso__VideosGrid">
        <v-row>
          <v-col 
            v-for="video in videosVisibles" 
            :key="video.idVideo"
            cols="12" 
            sm="6" 
            md="4"
            class="VideosCurso__VideoCol"
          >
            <v-card 
              class="VideosCurso__Video" 
              elevation="1" 
              @click="verVideo(video)"
            >
              <!-- Thumbnail del video -->
              <div class="VideosCurso__VideoThumbnail">
                <v-img 
                  :src="video.miniatura || `https://picsum.photos/seed/video${video.idVideo}/400/225`" 
                  height="180" 
                  cover
                  class="VideosCurso__VideoImagen"
                >
                  <template v-slot:placeholder>
                    <v-row class="fill-height ma-0" align="center" justify="center">
                      <v-progress-circular indeterminate color="red"></v-progress-circular>
                    </v-row>
                  </template>
                </v-img>
                
                <!-- Duración del video -->
                <div v-if="video.duracion" class="VideosCurso__VideoDuracion">
                  {{ formatearDuracion(video.duracion) }}
                </div>
                
                <!-- Play button overlay -->
                <div class="VideosCurso__PlayOverlay">
                  <v-icon color="white" size="x-large">mdi-play</v-icon>
                </div>
              </div>
              
              <!-- Información del video -->
              <v-card-item class="VideosCurso__VideoInfo">
                <v-card-title class="VideosCurso__VideoTitulo">
                  {{ video.titulo }}
                </v-card-title>
                
                <v-card-subtitle class="VideosCurso__VideoMeta">
                  <div class="text-grey">{{ formatearFecha(video.fechaSubida) }}</div>
                  <div v-if="video.autor" class="text-grey">Por {{ video.autor }}</div>
                </v-card-subtitle>
                
                <!-- Chip de asignatura -->
                <div v-if="video.asignatura && video.asignatura !== 'General'" class="VideosCurso__VideoChip mt-2">
                  <v-chip 
                    size="small" 
                    color="red" 
                    variant="elevated"
                  >
                    {{ video.asignatura }}
                  </v-chip>
                </div>
              </v-card-item>
            </v-card>
          </v-col>
        </v-row>
        
        <!-- Botón para mostrar más/menos -->
        <div v-if="hayMasVideos" class="VideosCurso__ToggleContainer">
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
.VideosCurso {
  border-radius: 16px;
  border: 1px solid rgba(244, 67, 54, 0.2);
  margin-bottom: 24px;
}

.VideosCurso__Header {
  background: linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(255, 138, 128, 0.05) 100%);
  border-bottom: 1px solid rgba(244, 67, 54, 0.1);
  padding: 20px;
}

.VideosCurso__Content {
  padding: 20px;
}

.VideosCurso__VideosGrid {
  margin-top: 15px; 
}

.VideosCurso__Empty {
  text-align: center;
  padding: 40px 20px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 12px;
  border: 2px dashed rgba(0, 0, 0, 0.1);
}

.VideosCurso__VideoCol {
  animation: fadeInUp 0.6s ease-out;
  margin-bottom: 5px;
}

.VideosCurso__Video {
  height: 100%;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  cursor: pointer;
  border: 1px solid rgba(244, 67, 54, 0.1);
  position: relative;
  overflow: hidden;
}

.VideosCurso__Video:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(244, 67, 54, 0.2);
  border-color: rgba(244, 67, 54, 0.3);
}

.VideosCurso__VideoThumbnail {
  position: relative;
  overflow: hidden;
}

.VideosCurso__VideoImagen {
  border-radius: 12px 12px 0 0;
  transition: transform 0.3s ease;
}

.VideosCurso__Video:hover .VideosCurso__VideoImagen {
  transform: scale(1.05);
}

.VideosCurso__VideoDuracion {
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

.VideosCurso__PlayOverlay {
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

.VideosCurso__Video:hover .VideosCurso__PlayOverlay {
  opacity: 1;
}

.VideosCurso__VideoInfo {
  padding: 12px;
}

.VideosCurso__VideoTitulo {
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

.VideosCurso__VideoMeta {
  padding: 4px 0 0 0;
  font-size: 0.8rem;
}

.VideosCurso__ToggleContainer {
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
  .VideosCurso__Header {
    padding: 16px;
  }
  
  .VideosCurso__Content {
    padding: 16px;
  }
  
  .VideosCurso__Empty {
    padding: 32px 16px;
  }
}
</style>