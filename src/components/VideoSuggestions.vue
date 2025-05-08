<script setup lang="ts">
// --------------------------- Props ---------------------------
const props = defineProps({
  videos: {
    type: Array,
    default: () => []
  }
});

// --------------------------- Emits ---------------------------
const emit = defineEmits(['select-video']);

// --------------------------- Métodos ---------------------------
const selectVideo = (videoId) => {
  emit('select-video', videoId);
};
</script>

<template>
  <div class="VideoSuggestions">
    <h3 class="text-subtitle-1 font-weight-bold mb-4">Videos sugeridos</h3>
    
    <div v-if="videos.length === 0" class="text-center py-4">
      <v-icon color="grey" size="large">mdi-playlist-remove</v-icon>
      <p class="mt-2 text-body-2 text-grey">No hay videos sugeridos disponibles</p>
    </div>
    
    <div v-else>
      <div 
        v-for="video in videos" 
        :key="video.idVideo" 
        class="VideoSuggestions__Item"
        @click="selectVideo(video.idVideo)"
      >
        <!-- Miniatura del video -->
        <div class="VideoSuggestions__Thumbnail">
          <v-img 
            :src="video.miniatura" 
            :aspect-ratio="16/9"
            class="rounded"
            cover
          ></v-img>
          
          <!-- Duración -->
          <div v-if="video.duracion" class="VideoSuggestions__Duration">
            {{ video.duracion }}
          </div>
        </div>
        
        <!-- Información del video -->
        <div class="VideoSuggestions__Info">
          <div class="VideoSuggestions__Title">{{ video.titulo }}</div>
          
          <div class="VideoSuggestions__Channel">
            {{ video.autor }}
          </div>
          
          <div class="VideoSuggestions__Stats">
            <span>{{ video.vistas }} visualizaciones</span>
            <span class="mx-1">•</span>
            <span>{{ video.fecha }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.VideoSuggestions__Item {
  display: flex;
  margin-bottom: 12px;
  cursor: pointer;
  transition: background-color 0.2s;
  border-radius: 8px;
  padding: 4px;
}

.VideoSuggestions__Item:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.VideoSuggestions__Thumbnail {
  flex: 0 0 168px;
  margin-right: 12px;
  position: relative;
}

.VideoSuggestions__Duration {
  position: absolute;
  bottom: 4px;
  right: 4px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 1px 4px;
  border-radius: 2px;
  font-size: 12px;
}

.VideoSuggestions__Info {
  flex: 1;
  min-width: 0;
}

.VideoSuggestions__Title {
  font-weight: 500;
  font-size: 14px;
  line-height: 1.2;
  margin-bottom: 4px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.VideoSuggestions__Channel {
  font-size: 12px;
  color: #606060;
  margin-bottom: 2px;
}

.VideoSuggestions__Stats {
  font-size: 12px;
  color: #606060;
}

@media (max-width: 600px) {
  .VideoSuggestions__Thumbnail {
    flex: 0 0 120px;
  }
}
</style>