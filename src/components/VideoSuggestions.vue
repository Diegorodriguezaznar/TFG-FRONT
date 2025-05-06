<script setup>
// --------------------------- Props ---------------------------
const props = defineProps({
  videos: {
    type: Array,
    required: true
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
    <h2 class="text-h6 font-weight-medium mb-3">Videos sugeridos</h2>
    
    <div class="VideoSuggestions__List">
      <v-card
        v-for="video in videos"
        :key="video.id"
        @click="selectVideo(video.id)"
        variant="flat"
        class="VideoSuggestions__Item mb-3"
        hover
      >
        <!-- Miniatura con duración -->
        <div class="VideoSuggestions__Thumbnail">
          <v-img
            :src="video.thumbnail"
            aspect-ratio="16/9"
            cover
            class="VideoSuggestions__Image"
          ></v-img>
          <div class="VideoSuggestions__Duration">{{ video.duration }}</div>
        </div>
        
        <!-- Información del video -->
        <div class="d-flex mt-2">
          <!-- Avatar del canal -->
          <v-avatar size="36" class="mr-2">
            <v-img :src="video.avatar" alt="Avatar del canal"></v-img>
          </v-avatar>
          
          <!-- Título y detalles -->
          <div>
            <div class="VideoSuggestions__Title font-weight-medium">
              {{ video.title }}
            </div>
            <div class="VideoSuggestions__Channel text-caption text-grey">
              {{ video.channel }}
            </div>
            <div class="VideoSuggestions__Stats text-caption text-grey">
              {{ video.views }} visualizaciones • {{ video.publishedDate }}
            </div>
          </div>
        </div>
      </v-card>
    </div>
  </div>
</template>

<style scoped>
.VideoSuggestions {
  padding: 0 16px;
}

.VideoSuggestions__Item {
  cursor: pointer;
  transition: transform 0.2s;
}

.VideoSuggestions__Item:hover {
  transform: translateY(-2px);
}

.VideoSuggestions__Thumbnail {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
}

.VideoSuggestions__Image {
  transition: all 0.3s;
}

.VideoSuggestions__Item:hover .VideoSuggestions__Image {
  transform: scale(1.05);
}

.VideoSuggestions__Duration {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 1px 4px;
  border-radius: 2px;
  font-size: 12px;
}

.VideoSuggestions__Title {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 14px;
  line-height: 1.2;
}

@media (max-width: 959px) {
  .VideoSuggestions__List {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 16px;
  }
  
  .VideoSuggestions__Item {
    margin-bottom: 0 !important;
  }
}
</style>