<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { useMarcadorVideoStore } from '@/stores/MarcadorVideo';

const props = defineProps({
  video: {
    type: Object,
    required: true
  }
});

const videoRef = ref<HTMLVideoElement | null>(null);
const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const volume = ref(1);
const isMuted = ref(false);
const isFullscreen = ref(false);
const showControls = ref(true);
const hideControlsTimeout = ref<number | null>(null);
const progress = ref(0);
const dragging = ref(false);
const marcadorVideoStore = useMarcadorVideoStore();
const marcadores = ref([]);
const loading = ref(true);

const formattedCurrentTime = computed(() => formatTime(currentTime.value));
const formattedDuration = computed(() => formatTime(duration.value));

const videoMarcadores = computed(() => {
  return marcadores.value.sort((a, b) => a.minutoImportante - b.minutoImportante);
});

function formatTime(seconds: number): string {
  if (isNaN(seconds) || !isFinite(seconds)) return '00:00';
  
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function togglePlay(): void {
  if (!videoRef.value) return;
  
  if (videoRef.value.paused) {
    videoRef.value.play();
    isPlaying.value = true;
  } else {
    videoRef.value.pause();
    isPlaying.value = false;
  }
}

function handleTimeUpdate(): void {
  if (!videoRef.value) return;
  
  currentTime.value = videoRef.value.currentTime;
  progress.value = (currentTime.value / duration.value) * 100 || 0;
}

function handleProgressClick(event: MouseEvent): void {
  if (!videoRef.value) return;
  
  const progressBar = event.currentTarget as HTMLElement;
  const pos = (event.offsetX / progressBar.offsetWidth);
  videoRef.value.currentTime = pos * duration.value;
}

function startDrag(): void {
  dragging.value = true;
}

function endDrag(): void {
  dragging.value = false;
}

function handleDrag(event: MouseEvent): void {
  if (!dragging.value || !videoRef.value) return;
  
  const progressBar = event.currentTarget as HTMLElement;
  const pos = Math.max(0, Math.min(1, event.offsetX / progressBar.offsetWidth));
  progress.value = pos * 100;
  videoRef.value.currentTime = pos * duration.value;
}

function setVolume(value: number): void {
  if (!videoRef.value) return;
  
  volume.value = value;
  videoRef.value.volume = value;
  isMuted.value = value === 0;
}

function toggleMute(): void {
  if (!videoRef.value) return;
  
  isMuted.value = !isMuted.value;
  videoRef.value.muted = isMuted.value;
}

function toggleFullscreen(): void {
  if (!videoRef.value) return;
  
  if (!document.fullscreenElement) {
    videoRef.value.requestFullscreen().then(() => {
      isFullscreen.value = true;
    });
  } else {
    document.exitFullscreen();
    isFullscreen.value = false;
  }
}

function startHideControlsTimer(): void {
  if (hideControlsTimeout.value) {
    clearTimeout(hideControlsTimeout.value);
  }
  
  hideControlsTimeout.value = window.setTimeout(() => {
    if (isPlaying.value) {
      showControls.value = false;
    }
  }, 3000);
}

function stopHideControlsTimer(): void {
  if (hideControlsTimeout.value) {
    clearTimeout(hideControlsTimeout.value);
    hideControlsTimeout.value = null;
  }
  showControls.value = true;
}

function handleLoadedMetadata(): void {
  if (!videoRef.value) return;
  
  duration.value = videoRef.value.duration;
}

function seekToTime(time: number): void {
  if (!videoRef.value) return;
  
  videoRef.value.currentTime = time;
  if (videoRef.value.paused) {
    videoRef.value.play();
    isPlaying.value = true;
  }
}

async function loadMarcadores(): Promise<void> {
  if (!props.video?.idVideo) return;
  
  loading.value = true;
  
  try {
    marcadores.value = await marcadorVideoStore.fetchMarcadoresByVideoId(props.video.idVideo);
  } catch (err) {
    console.error('Error al cargar marcadores:', err);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadMarcadores();
  
  document.addEventListener('fullscreenchange', () => {
    isFullscreen.value = !!document.fullscreenElement;
  });
});

watch(() => props.video.idVideo, () => {
  loadMarcadores();
});
</script>

<template>
  <div 
    class="VideoPlayer" 
    @mousemove="startHideControlsTimer" 
    @mouseleave="stopHideControlsTimer"
  >
    <div class="VideoPlayer__container">
      <video 
        ref="videoRef"
        :src="video.url" 
        class="VideoPlayer__video"
        preload="metadata"
        @click="togglePlay"
        @timeupdate="handleTimeUpdate"
        @loadedmetadata="handleLoadedMetadata"
        @play="isPlaying = true"
        @pause="isPlaying = false"
        @ended="isPlaying = false"
      />
      
      <div v-if="!isPlaying" class="VideoPlayer__play-button" @click="togglePlay">
        <v-icon icon="mdi-play" size="x-large" color="white" />
      </div>
      
      <div 
        class="VideoPlayer__controls" 
        :class="{ 'VideoPlayer__controls--visible': showControls || !isPlaying }"
      >
        <div 
          class="VideoPlayer__progress" 
          @click="handleProgressClick"
          @mousedown="startDrag"
          @mouseup="endDrag"
          @mousemove="handleDrag"
          @mouseleave="endDrag"
        >
          <div class="VideoPlayer__progress-bar" :style="{ width: `${progress}%` }" />
          
          <div 
            v-for="(marcador, index) in videoMarcadores" 
            :key="index"
            class="VideoPlayer__marker"
            :style="{ left: `${(marcador.minutoImportante / duration) * 100}%` }"
            :title="marcador.titulo || `Marcador ${index + 1}`"
          />
        </div>
        
        <div class="VideoPlayer__buttons">
          <v-btn icon variant="text" size="small" @click="togglePlay" color="white">
            <v-icon>{{ isPlaying ? 'mdi-pause' : 'mdi-play' }}</v-icon>
          </v-btn>
          
          <div class="VideoPlayer__volume">
            <v-btn icon variant="text" size="small" @click="toggleMute" color="white">
              <v-icon>{{ isMuted ? 'mdi-volume-mute' : 'mdi-volume-high' }}</v-icon>
            </v-btn>
            
            <v-slider
              v-model="volume"
              density="compact"
              color="white"
              class="VideoPlayer__volume-slider"
              :max="1"
              :step="0.1"
              hide-details
              @update:model-value="setVolume"
            />
          </div>
          
          <div class="VideoPlayer__time">
            {{ formattedCurrentTime }} / {{ formattedDuration }}
          </div>
          
          <v-spacer />
          
          <v-btn icon variant="text" size="small" @click="toggleFullscreen" color="white">
            <v-icon>{{ isFullscreen ? 'mdi-fullscreen-exit' : 'mdi-fullscreen' }}</v-icon>
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/sass/components/Video/VideoPlayer";
</style>