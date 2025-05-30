<!-- src/components/Explorar/VideosList.vue -->
<script setup lang="ts">
import { useRouter } from 'vue-router';
import type { VideoDTO } from '@/stores/dtos/VideoDTO';
import VideoCard from './VideoCard.vue';

const props = defineProps<{
  videos: VideoDTO[];
}>();

const router = useRouter();

const verVideo = (video: VideoDTO) => {
  router.push({
    path: '/reproductor-video',
    query: { id: video.idVideo }
  });
};
</script>

<template>
  <div class="VideosList">
    <v-card class="VideosList__Container" elevation="2">
      <v-card-text class="VideosList__Content">
        <div 
          v-for="(video, index) in videos" 
          :key="video.idVideo"
          class="VideosList__Item"
          :style="{ 'animation-delay': `${index * 0.05}s` }"
        >
          <VideoCard 
            :video="video" 
            vista="list"
            @click="verVideo(video)"
          />
          
          <!-- Divider (no en el último elemento) -->
          <v-divider 
            v-if="index < videos.length - 1"
            class="VideosList__Divider"
            color="red"
            opacity="0.1"
          ></v-divider>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<style scoped>
.VideosList {
  padding: 16px 0;
}

.VideosList__Container {
  border-radius: 16px;
  border: 1px solid rgba(244, 67, 54, 0.1);
  background: linear-gradient(135deg, rgba(244, 67, 54, 0.01) 0%, #ffffff 100%);
}

.VideosList__Content {
  padding: 16px;
}

.VideosList__Item {
  opacity: 0;
  animation: slideInLeft 0.6s ease-out forwards;
}

.VideosList__Divider {
  margin: 16px 0;
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Responsive */
@media (max-width: 600px) {
  .VideosList {
    padding: 8px 0;
  }
  
  .VideosList__Content {
    padding: 12px;
  }
  
  .VideosList__Divider {
    margin: 12px 0;
  }
}
</style>