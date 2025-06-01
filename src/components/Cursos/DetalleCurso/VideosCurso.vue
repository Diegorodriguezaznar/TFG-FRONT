<template>
  <v-card class="videos-curso" elevation="2">
    <v-card-title class="videos-curso__header">
      <div class="d-flex align-center">
        <v-icon color="red" size="large" class="mr-3">mdi-play-circle</v-icon>
        <div>
          <h2 class="videos-curso__title">Videos del Curso</h2>
          <p class="videos-curso__subtitle">
            {{ props.videos.length }} video{{ props.videos.length !== 1 ? 's' : '' }} en {{ cursoNombre }}
          </p>
        </div>
      </div>
    </v-card-title>
    
    <v-card-text class="videos-curso__content">
      <div v-if="props.videos.length === 0" class="videos-curso__empty">
        <v-icon color="grey-lighten-2" size="64" class="mb-4">mdi-video-off</v-icon>
        <h3 class="videos-curso__empty-title">No hay videos en este curso</h3>
        <p class="videos-curso__empty-text">Los videos aparecerán aquí cuando se añadan al curso</p>
      </div>
      
      <div v-else class="videos-curso__grid">
        <v-row>
          <v-col 
            v-for="video in videosVisibles" 
            :key="video.idVideo"
            cols="12" 
            sm="6" 
            md="4"
            class="videos-curso__col"
          >
            <v-card 
              class="videos-curso__video" 
              elevation="1" 
              @click="verVideo(video)"
            >
              <div class="videos-curso__thumbnail">
                <v-img 
                  :src="video.miniatura || `https://picsum.photos/seed/video${video.idVideo}/400/225`" 
                  height="180" 
                  cover
                  class="videos-curso__imagen"
                >
                  <template v-slot:placeholder>
                    <v-row class="fill-height ma-0" align="center" justify="center">
                      <v-progress-circular indeterminate color="red"></v-progress-circular>
                    </v-row>
                  </template>
                </v-img>
                
                <div v-if="video.duracion" class="videos-curso__duracion">
                  {{ formatearDuracion(video.duracion) }}
                </div>
                
                <div class="videos-curso__play-overlay">
                  <v-icon color="white" size="x-large">mdi-play</v-icon>
                </div>
              </div>
              
              <v-card-item class="videos-curso__info">
                <v-card-title class="videos-curso__video-titulo">
                  {{ video.titulo }}
                </v-card-title>
                
                <v-card-subtitle class="videos-curso__meta">
                  <div class="videos-curso__fecha">{{ formatearFecha(video.fechaSubida) }}</div>
                  <div v-if="video.autor" class="videos-curso__autor">Por {{ video.autor }}</div>
                </v-card-subtitle>
                
                <div v-if="video.asignatura && video.asignatura !== 'General'" class="videos-curso__chip mt-2">
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
        
        <div v-if="hayMasVideos" class="videos-curso__toggle">
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

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import type { VideoDTO } from '@/stores/dtos/VideoDTO';

const props = defineProps<{
  videos: VideoDTO[];
  cursoNombre: string;
  cursoId: number;
}>();

const router = useRouter();
const mostrarTodos = ref(false);
const itemsPorDefecto = 6;

const videosVisibles = computed(() => {
  if (mostrarTodos.value) {
    return props.videos;
  }
  return props.videos.slice(0, itemsPorDefecto);
});

const hayMasVideos = computed(() => {
  return props.videos.length > itemsPorDefecto;
});

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

<style lang="scss" scoped>
@import "@/assets/sass/components/Cursos/VideosCurso";
</style>