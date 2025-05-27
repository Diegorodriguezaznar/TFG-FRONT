<script setup lang="ts">
import { defineProps, computed } from 'vue';
import type { VideoDTO } from '@/stores/dtos/VideoDTO';
import UserAvatar from '@/components/UserAvatar.vue';

const props = defineProps<{
  video: VideoDTO
}>();

// Función para obtener rol basado en el nombre del autor
const obtenerRolAutor = computed(() => {
  const autor = props.video?.autor?.toLowerCase() || '';
  if (autor.includes('profe') || autor.includes('profesor')) {
    return 2; // Profesor
  } else if (autor.includes('admin') || autor.includes('director')) {
    return 3; // Administrador
  }
  return 1; // Estudiante por defecto
});

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
      <!-- Avatar personalizado del autor -->
      <UserAvatar
        :nombre="video.autor || 'Usuario'"
        :id-rol="obtenerRolAutor"
        :size="50"
        class="mr-3"
      />
      <div>
        <h3 class="text-h6 mb-0">{{ video.autor }}</h3>
        <div class="text-subtitle-2 text-grey">{{ video.asignatura }}</div>
      </div>
    </div>
    
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