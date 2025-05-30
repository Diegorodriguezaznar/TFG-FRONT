<!-- src/components/Explorar/VideosGrid.vue -->
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
  <div class="VideosGrid">
    <v-row class="VideosGrid__Row">
      <v-col
        v-for="(video, index) in videos"
        :key="video.idVideo"
        cols="12"
        sm="6"
        md="4"
        lg="3"
        xl="2"
        class="VideosGrid__Col"
        :style="{ 'animation-delay': `${index * 0.05}s` }"
      >
        <VideoCard 
          :video="video" 
          vista="grid"
          @click="verVideo(video)"
        />
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>
.VideosGrid {
  padding: 16px 0;
}

.VideosGrid__Row {
  margin: 0 -8px;
}

.VideosGrid__Col {
  padding: 8px;
  opacity: 0;
  animation: fadeInUp 0.6s ease-out forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive gaps */
@media (max-width: 600px) {
  .VideosGrid {
    padding: 8px 0;
  }
  
  .VideosGrid__Row {
    margin: 0 -4px;
  }
  
  .VideosGrid__Col {
    padding: 4px;
  }
}
</style>