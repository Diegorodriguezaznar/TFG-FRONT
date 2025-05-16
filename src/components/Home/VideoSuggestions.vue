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
    <div v-if="videos.length === 0" class="text-center py-4">
      <v-icon color="grey" size="large">mdi-playlist-remove</v-icon>
      <p class="mt-2 text-body-2 text-grey">No hay videos sugeridos disponibles</p>
    </div>
    
    <div v-else class="d-flex overflow-x-auto pb-3 suggested-videos-row">
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
            width="210"
            height="120"
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
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.VideoSuggestions__Item {
  width: 210px;
  min-width: 210px;
  margin-right: 16px;
  cursor: pointer;
  transition: transform 0.2s;
  background-color: #0f3670;
  border: 1px solid #0812ff;
  border-radius: 8px;
  padding: 8px;
  overflow: hidden;
}

.VideoSuggestions__Item:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 8px rgba(8, 18, 255, 0.3);
}

.VideoSuggestions__Thumbnail {
  position: relative;
  margin-bottom: 8px;
  border-radius: 4px;
  overflow: hidden;
}

.VideoSuggestions__Duration {
  position: absolute;
  bottom: 4px;
  right: 4px;
  background-color: rgba(255, 158, 12, 0.7);
  color: white;
  padding: 1px 4px;
  border-radius: 2px;
  font-size: 12px;
}

.VideoSuggestions__Info {
  padding: 0 4px;
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
  color: #ffffff;
}

.VideoSuggestions__Channel {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.suggested-videos-row {
  scrollbar-width: thin;
}

.suggested-videos-row::-webkit-scrollbar {
  height: 6px;
}

.suggested-videos-row::-webkit-scrollbar-thumb {
  background-color: #ff9e0c;
  border-radius: 3px;
}

@media (max-width: 600px) {
  .VideoSuggestions__Item {
    width: 180px;
    min-width: 180px;
  }
}
</style>