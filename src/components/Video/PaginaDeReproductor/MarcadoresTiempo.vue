<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import type { MarcadorVideoDTO } from '@/stores/dtos/MarcadorVideoDTO';

const props = defineProps<{
  marcadores: MarcadorVideoDTO[],
  loadingMarcadores: boolean
}>();

const emit = defineEmits<{
  (e: 'seek', time: number): void
}>();

// Formatear tiempo en segundos a formato mm:ss
const formatTime = (seconds: number): string => {
  if (isNaN(seconds) || !isFinite(seconds)) return '00:00';
  
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const seekToTime = (time: number) => {
  emit('seek', time);
};
</script>

<template>
  <!-- Secciones del video con marcas de tiempo -->
  <div v-if="marcadores.length > 0" class="secciones-video mt-4">
    <h4 class="text-subtitle-2 mb-2">
      <v-icon size="small" class="mr-1">mdi-bookmark-outline</v-icon>
      Marcadores de tiempo
    </h4>
    
    <div 
      v-for="(marcador, index) in marcadores" 
      :key="index"
      class="item-seccion d-flex align-center py-1"
      @click="seekToTime(marcador.minutoImportante)"
    >
      <span class="marca-tiempo">{{ formatTime(marcador.minutoImportante) }}</span>
      <span class="ml-2">{{ marcador.titulo || `Marcador ${index + 1}` }}</span>
    </div>
  </div>
  
  <!-- Mensaje cuando no hay marcadores -->
  <div v-else-if="!loadingMarcadores" class="secciones-video mt-4">
    <div class="text-center py-3 text-grey-darken-1">
      <v-icon size="large" class="mb-2 text-grey">mdi-bookmark-off-outline</v-icon>
      <p>No hay marcadores disponibles para este video</p>
    </div>
  </div>
  
  <!-- Cargando marcadores -->
  <div v-else class="secciones-video mt-4">
    <div class="text-center py-3">
      <v-progress-circular indeterminate size="24" color="grey" class="mb-2"></v-progress-circular>
      <p class="text-grey-darken-1">Cargando marcadores...</p>
    </div>
  </div>
</template>

<style scoped>
.marca-tiempo {
  background-color: #f0f0f0;
  border-radius: 4px;
  padding: 2px 6px;
  font-size: 12px;
  color: #666;
}

.item-seccion {
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.item-seccion:hover {
  background-color: #f5f5f5;
}
</style>