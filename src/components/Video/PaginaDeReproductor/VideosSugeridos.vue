<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import type { VideoDTO } from '@/stores/dtos/VideoDTO';

const props = defineProps<{
  videos: VideoDTO[]
}>();

const emit = defineEmits<{
  (e: 'seleccionar-video', id: number): void
}>();

const seleccionarVideo = (id: number) => {
  emit('seleccionar-video', id);
};
</script>

<template>
  <div>
    <h3 class="text-subtitle-1 font-weight-bold mb-3 mt-5 ml-2">Sugerencias</h3>
    
    <div class="d-flex overflow-x-auto pb-3 fila-videos-sugeridos">
      <div 
        v-for="(video, index) in videos.slice(0, 4)" 
        :key="index" 
        class="tarjeta-video-sugerido mr-4" 
        @click="seleccionarVideo(video.idVideo)"
      >
        <v-img :src="video.miniatura" height="120" cover class="rounded"></v-img>
        <div class="text-body-2 font-weight-medium mt-2 titulo-video">{{ video.titulo }}</div>
        <div class="text-caption text-grey">{{ video.autor }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tarjeta-video-sugerido {
  width: 210px;
  min-width: 210px;
  cursor: pointer;
}

.fila-videos-sugeridos {
  scrollbar-width: thin;
}

.fila-videos-sugeridos::-webkit-scrollbar {
  height: 6px;
}

.fila-videos-sugeridos::-webkit-scrollbar-thumb {
  background-color: #c0c0c0;
  border-radius: 3px;
}

.titulo-video {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (max-width: 960px) {
  .tarjeta-video-sugerido {
    width: 180px;
    min-width: 180px;
  }
}
</style>