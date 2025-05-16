<script setup lang="ts">
// --------------------------- Imports ---------------------------
import { ref, onMounted, watch, computed } from 'vue';
import { useMarcadorVideoStore } from '@/stores/MarcadorVideo';

// --------------------------- Props ---------------------------
const props = defineProps({
  video: {
    type: Object,
    required: true
  }
});

// --------------------------- Variables ---------------------------
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
const error = ref('');

// --------------------------- Computed Properties ---------------------------
const formattedCurrentTime = computed(() => formatTime(currentTime.value));
const formattedDuration = computed(() => formatTime(duration.value));

// Filtramos los marcadores para el video actual
const videoMarcadores = computed(() => {
  return marcadores.value.sort((a, b) => a.minutoImportante - b.minutoImportante);
});

// --------------------------- Methods ---------------------------
// Formatear tiempo en segundos a formato mm:ss
function formatTime(seconds: number): string {
  if (isNaN(seconds) || !isFinite(seconds)) return '00:00';
  
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Reproducir/pausar video
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

// Actualizar el tiempo actual durante la reproducción
function handleTimeUpdate(): void {
  if (!videoRef.value) return;
  
  currentTime.value = videoRef.value.currentTime;
  progress.value = (currentTime.value / duration.value) * 100 || 0;
}

// Ajustar el progreso al hacer clic en la barra
function handleProgressClick(event: MouseEvent): void {
  if (!videoRef.value) return;
  
  const progressBar = event.currentTarget as HTMLElement;
  const pos = (event.offsetX / progressBar.offsetWidth);
  videoRef.value.currentTime = pos * duration.value;
}

// Iniciar arrastre en la barra de progreso
function startDrag(): void {
  dragging.value = true;
}

// Finalizar arrastre en la barra de progreso
function endDrag(): void {
  dragging.value = false;
}

// Actualizar progreso durante el arrastre
function handleDrag(event: MouseEvent): void {
  if (!dragging.value || !videoRef.value) return;
  
  const progressBar = event.currentTarget as HTMLElement;
  const pos = Math.max(0, Math.min(1, event.offsetX / progressBar.offsetWidth));
  progress.value = pos * 100;
  videoRef.value.currentTime = pos * duration.value;
}

// Establecer volumen
function setVolume(value: number): void {
  if (!videoRef.value) return;
  
  volume.value = value;
  videoRef.value.volume = value;
  isMuted.value = value === 0;
}

// Silenciar/Activar sonido
function toggleMute(): void {
  if (!videoRef.value) return;
  
  isMuted.value = !isMuted.value;
  videoRef.value.muted = isMuted.value;
}

// Pantalla completa
function toggleFullscreen(): void {
  if (!videoRef.value) return;
  
  if (!document.fullscreenElement) {
    videoRef.value.requestFullscreen().then(() => {
      isFullscreen.value = true;
    }).catch(err => {
      console.error(`Error al intentar pantalla completa: ${err.message}`);
    });
  } else {
    document.exitFullscreen();
    isFullscreen.value = false;
  }
}

// Mostrar/ocultar controles
function toggleControls(): void {
  showControls.value = !showControls.value;
}

// Iniciar temporizador para ocultar controles
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

// Detener temporizador para ocultar controles
function stopHideControlsTimer(): void {
  if (hideControlsTimeout.value) {
    clearTimeout(hideControlsTimeout.value);
    hideControlsTimeout.value = null;
  }
  showControls.value = true;
}

// Cargar metadatos del video
function handleLoadedMetadata(): void {
  if (!videoRef.value) return;
  
  duration.value = videoRef.value.duration;
}

// Ir a un tiempo específico (para marcadores)
function seekToTime(time: number): void {
  if (!videoRef.value) return;
  
  videoRef.value.currentTime = time;
  // Si el video estaba pausado, iniciarlo
  if (videoRef.value.paused) {
    videoRef.value.play();
    isPlaying.value = true;
  }
}

// Cargar marcadores del video actual
async function loadMarcadores(): Promise<void> {
  if (!props.video || !props.video.idVideo) return;
  
  loading.value = true;
  error.value = '';
  
  try {
    marcadores.value = await marcadorVideoStore.fetchMarcadoresByVideoId(props.video.idVideo);
  } catch (err: any) {
    error.value = err.message || 'Error al cargar los marcadores';
    console.error('Error al cargar marcadores:', err);
  } finally {
    loading.value = false;
  }
}

// --------------------------- Lifecycle Hooks ---------------------------
onMounted(() => {
  // Cargar marcadores cuando el componente se monta
  loadMarcadores();
  
  // Agregar listener para cancelar pantalla completa
  document.addEventListener('fullscreenchange', () => {
    isFullscreen.value = !!document.fullscreenElement;
  });
});

// Observar cambios en el video para recargar marcadores
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
    <!-- Contenedor del reproductor de video -->
    <div class="VideoPlayer__Container">
      <!-- Video real -->
      <video 
        ref="videoRef"
        :src="video.url" 
        class="VideoPlayer__Video"
        preload="metadata"
        @click="togglePlay"
        @timeupdate="handleTimeUpdate"
        @loadedmetadata="handleLoadedMetadata"
        @play="isPlaying = true"
        @pause="isPlaying = false"
        @ended="isPlaying = false"
      ></video>
      
      <!-- Botón de reproducción grande en el centro -->
      <div v-if="!isPlaying" class="VideoPlayer__PlayButton" @click="togglePlay">
        <v-icon icon="mdi-play" size="x-large" color="white"></v-icon>
      </div>
      
      <!-- Controles del reproductor -->
      <div 
        class="VideoPlayer__Controls" 
        :class="{ 'VideoPlayer__Controls--visible': showControls || !isPlaying }"
      >
        <!-- Barra de progreso -->
        <div 
          class="VideoPlayer__Progress" 
          @click="handleProgressClick"
          @mousedown="startDrag"
          @mouseup="endDrag"
          @mousemove="handleDrag"
          @mouseleave="endDrag"
        >
          <div class="VideoPlayer__ProgressBar" :style="{ width: `${progress}%` }"></div>
          
          <!-- Marcadores en la barra de progreso -->
          <div 
            v-for="(marcador, index) in videoMarcadores" 
            :key="index"
            class="VideoPlayer__Marker"
            :style="{ left: `${(marcador.minutoImportante / duration) * 100}%` }"
            :title="marcador.titulo || `Marcador ${index + 1}`"
          ></div>
        </div>
        
        <!-- Botones de control -->
        <div class="VideoPlayer__Buttons">
          <!-- Play/Pause -->
          <v-btn icon variant="text" size="small" @click="togglePlay" color="white">
            <v-icon>{{ isPlaying ? 'mdi-pause' : 'mdi-play' }}</v-icon>
          </v-btn>
          
          <!-- Volumen -->
          <div class="VideoPlayer__VolumeContainer">
            <v-btn icon variant="text" size="small" @click="toggleMute" color="white">
              <v-icon>{{ isMuted ? 'mdi-volume-mute' : 'mdi-volume-high' }}</v-icon>
            </v-btn>
            
            <v-slider
              v-model="volume"
              density="compact"
              color="white"
              class="VideoPlayer__VolumeSlider"
              :max="1"
              :step="0.1"
              hide-details
              @update:model-value="setVolume"
            ></v-slider>
          </div>
          
          <!-- Tiempo actual / Duración -->
          <div class="VideoPlayer__Time">
            {{ formattedCurrentTime }} / {{ formattedDuration }}
          </div>
          
          <v-spacer></v-spacer>
          
          <!-- Pantalla completa -->
          <v-btn icon variant="text" size="small" @click="toggleFullscreen" color="white">
            <v-icon>{{ isFullscreen ? 'mdi-fullscreen-exit' : 'mdi-fullscreen' }}</v-icon>
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.VideoPlayer {
  margin-bottom: 16px;
  position: relative;
}

.VideoPlayer__Container {
  position: relative;
  width: 100%;
  background-color: black;
  border-radius: 8px;
  overflow: hidden;
  aspect-ratio: 16 / 9;
}

.VideoPlayer__Video {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.VideoPlayer__PlayButton {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 5;
}

.VideoPlayer__Controls {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  padding: 8px 16px;
  opacity: 0;
  transition: opacity 0.3s;
  z-index: 10;
}

.VideoPlayer__Controls--visible {
  opacity: 1;
}

.VideoPlayer__Progress {
  height: 6px;
  background-color: rgba(255, 255, 255, 0.3);
  margin-bottom: 8px;
  border-radius: 3px;
  cursor: pointer;
  position: relative;
}

.VideoPlayer__ProgressBar {
  height: 100%;
  background-color: #FF9800;
  border-radius: 3px;
  position: relative;
}

.VideoPlayer__Marker {
  position: absolute;
  width: 4px;
  height: 10px;
  background-color: #FFFFFF;
  bottom: 0;
  border-radius: 2px 2px 0 0;
  transform: translateX(-50%);
  z-index: 2;
}

.VideoPlayer__Buttons {
  display: flex;
  align-items: center;
  color: white;
}

.VideoPlayer__VolumeContainer {
  display: flex;
  align-items: center;
  margin-left: 8px;
}

.VideoPlayer__VolumeSlider {
  width: 80px;
  margin-left: 8px;
}

.VideoPlayer__Time {
  margin-left: 16px;
  font-size: 12px;
  color: white;
}

@media (max-width: 600px) {
  .VideoPlayer__VolumeSlider {
    display: none;
  }
  
  .VideoPlayer__Time {
    margin-left: 8px;
    font-size: 11px;
  }
}
</style>