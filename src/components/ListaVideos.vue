<script setup lang="ts">
// --------------------------- Imports ---------------------------
import { useRouter } from 'vue-router';

// --------------------------- Router ---------------------------
const router = useRouter();

// --------------------------- Props ---------------------------
const props = defineProps({
  videos: {
    type: Array,
    default: () => []
  }
});

// --------------------------- Métodos ---------------------------
// Navegar a la página de reproducción del video
const verVideo = (video: any) => {
  router.push({
    path: '/reproductor-video',
    query: { id: video.idVideo }
  });
};

// --------------------------- Colores para asignaturas ---------------------------
function getColorForAsignatura(asignatura: string): string {
  const colores: Record<string, string> = {
    'Mates': 'blue',
    'Lengua': 'deep-purple',
    'Historia': 'brown',
    'Física': 'indigo',
    'Química': 'green',
    'Biología': 'teal',
    'Inglés': 'red',
    'Arte': 'pink',
    'Informática': 'orange',
    'Música': 'cyan'
  };
  
  return colores[asignatura] || 'grey';
}
</script>

<template>
  <div class="ListaVideos">
    <div class="text-h6 font-weight-bold mb-4">Videos</div>
    
    <v-row v-if="videos.length > 0">
      <v-col v-for="video in videos" :key="video.idVideo || video.id" cols="12" sm="6" md="4" lg="3">
        <v-card class="ListaVideos__Card" elevation="1" rounded="lg" @click="verVideo(video)">
          <v-img :src="video.miniatura || video.thumbnail" height="180" cover>
            <!-- Duración (se podría agregar en un caso real) -->
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular indeterminate color="grey-lighten-4"></v-progress-circular>
              </v-row>
            </template>
          </v-img>
          
          <v-card-item>
            <v-row no-gutters>
              <v-col cols="auto" class="mr-3">
                <v-avatar size="36">
                  <v-img src="https://picsum.photos/50/50"></v-img>
                </v-avatar>
              </v-col>
              
              <v-col>
                <v-card-title class="text-subtitle-1 font-weight-bold px-0 py-0">
                  {{ video.titulo }}
                </v-card-title>
                
                <v-card-subtitle class="px-0 py-1">
                  <div class="text-body-2">{{ video.autor }}</div>
                  <div class="d-flex text-caption text-grey">
                    <span>{{ video.vistas }} visualizaciones</span>
                    <v-icon size="small" class="mx-1">mdi-circle-small</v-icon>
                    <span>{{ video.fecha }}</span>
                  </div>
                </v-card-subtitle>
              </v-col>
            </v-row>
          </v-card-item>
          
          <!-- Etiqueta de asignatura -->
          <v-chip
            variant="elevated"
            size="small"
            class="ListaVideos__Etiqueta"
            :color="getColorForAsignatura(video.asignatura)"
          >
            {{ video.asignatura }}
          </v-chip>
        </v-card>
      </v-col>
    </v-row>
    
    <!-- Estado vacío -->
    <v-row v-else>
      <v-col cols="12" class="text-center py-8">
        <v-icon size="x-large" color="grey-lighten-2" class="mb-4">mdi-video-off</v-icon>
        <div class="text-h6 text-grey">No se encontraron videos</div>
        <div class="text-body-2 text-grey">Prueba con otro término de búsqueda o filtro</div>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>
.ListaVideos__Card {
  position: relative;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  margin-bottom: 16px;
}

.ListaVideos__Card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) !important;
}

.ListaVideos__Etiqueta {
  position: absolute;
  top: 8px;
  right: 8px;
}
</style>