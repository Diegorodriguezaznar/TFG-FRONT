<script setup lang="ts">
import { defineProps } from 'vue';
import type { VideoDTO } from '@/stores/dtos/VideoDTO';

const props = defineProps<{
  video: VideoDTO
}>();

// Función para obtener color según asignatura
const getColorForAsignatura = (asignatura: string): string => {
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
};
</script>

<template>
  <div class="tarjeta-canal">
    <div class="d-flex align-center mb-3">
      <v-avatar size="50" class="mr-3" :color="getColorForAsignatura(video.asignatura)">
        <template v-if="video.avatarUrl">
          <v-img :src="video.avatarUrl" :alt="`Avatar de ${video.autor}`"></v-img>
        </template>
        <template v-else>
          <span class="text-h5 text-white">{{ video.autor ? video.autor.charAt(0).toUpperCase() : 'U' }}</span>
        </template>
      </v-avatar>
      <div>
        <h3 class="text-h6 mb-0">{{ video.autor }}</h3>
        <div class="text-subtitle-2 text-grey">{{ video.asignatura }}</div>
      </div>
    </div>
    
    <v-btn color="orange" block>Seguir</v-btn>
    <div class="text-caption text-center mt-1">{{ video.vistas }} suscriptores</div>
    
    <h3 class="text-h6 font-weight-bold mt-4">{{ video.titulo }}</h3>
    <p class="text-body-2">
      {{ video.descripcion && video.descripcion.length > 100 
        ? video.descripcion.substring(0, 100) + '...' 
        : video.descripcion }}
    </p>
  </div>
</template>

<style scoped>
.tarjeta-canal {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
}
</style>