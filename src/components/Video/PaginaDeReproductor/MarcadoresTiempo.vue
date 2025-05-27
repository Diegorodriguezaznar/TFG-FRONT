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
  <div v-if="marcadores.length > 0" class="MarcadoresVideo">
    <h4 class="MarcadoresVideo__titulo">
      <v-icon size="small" class="MarcadoresVideo__icono">mdi-bookmark-outline</v-icon>
      Marcadores de tiempo
    </h4>
    
    <div 
      v-for="(marcador, index) in marcadores" 
      :key="index"
      class="MarcadoresVideo__item"
      @click="seekToTime(marcador.minutoImportante)"
    >
      <span class="MarcadoresVideo__tiempo">{{ formatTime(marcador.minutoImportante) }}</span>
      <span class="MarcadoresVideo__texto">{{ marcador.titulo || `Marcador ${index + 1}` }}</span>
    </div>
  </div>
  
  <div v-else-if="!loadingMarcadores" class="MarcadoresVideo">
    <div class="MarcadoresVideo__vacio">
      <v-icon size="large" class="MarcadoresVideo__icono-vacio">mdi-bookmark-off-outline</v-icon>
      <p class="MarcadoresVideo__texto-vacio">No hay marcadores disponibles para este video</p>
    </div>
  </div>
  
  <div v-else class="MarcadoresVideo">
    <div class="MarcadoresVideo__loading">
      <v-progress-circular indeterminate size="24" color="grey" class="MarcadoresVideo__spinner" />
      <p class="MarcadoresVideo__texto-loading">Cargando marcadores...</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/sass/components/Video/MarcadoresTiempo";
</style>