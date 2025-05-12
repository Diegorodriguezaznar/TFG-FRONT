<script setup>
// --------------------------- Imports ---------------------------
import { ref, onMounted } from 'vue';

// --------------------------- Variables ---------------------------
const misVideos = ref([
  {
    id: 1,
    titulo: 'Introducción a las ecuaciones',
    asignatura: 'Mates',
    thumbnail: 'https://picsum.photos/id/10/300/200',
    autor: 'Profesor García',
    vistas: '10K',
    fecha: 'Hace 2 días'
  },
  {
    id: 2,
    titulo: 'Análisis de "Don Quijote"',
    asignatura: 'Lengua',
    thumbnail: 'https://picsum.photos/id/20/300/200',
    autor: 'Profesora Martínez',
    vistas: '5.2K',
    fecha: 'Hace 1 semana'
  },
  {
    id: 3,
    titulo: 'La Segunda Guerra Mundial',
    asignatura: 'Historia',
    thumbnail: 'https://picsum.photos/id/30/300/200',
    autor: 'Profesor López',
    vistas: '8.7K',
    fecha: 'Hace 3 días'
  }
]);

// --------------------------- Métodos ---------------------------
const getColor = (asignatura) => {
  const colores = {
    'Mates': 'blue',
    'Lengua': 'deep-purple',
    'Historia': 'brown',
    'Física': 'indigo',
    'Química': 'green',
    'Biología': 'teal',
    'Inglés': 'red',
    'Arte': 'pink'
  };
  
  return colores[asignatura] || 'grey';
};
</script>

<template>
  <div class="MisVideos">
    <v-row>
      <v-col v-for="video in misVideos" :key="video.id" cols="12" sm="6" md="4">
        <v-card class="MisVideos__Card" elevation="1" rounded="lg">
          <v-img :src="video.thumbnail" height="180" cover>
            <!-- Etiqueta de asignatura -->
            <v-chip
              variant="elevated"
              size="small"
              class="MisVideos__Etiqueta"
              :color="getColor(video.asignatura)"
            >
              {{ video.asignatura }}
            </v-chip>
          </v-img>
          
          <v-card-item>
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
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>
.MisVideos__Card {
  position: relative;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  margin-bottom: 16px;
}

.MisVideos__Card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) !important;
}

.MisVideos__Etiqueta {
  position: absolute;
  top: 8px;
  right: 8px;
}
</style>