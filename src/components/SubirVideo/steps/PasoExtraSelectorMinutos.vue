<!-- TimestampStep.vue - Paso de marcadores optimizado -->
<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  videoFile: { type: Object, default: null },
  timestamps: { type: Array, default: () => [] }
});

const emit = defineEmits(['timestamps-updated']);

const videoUrl = ref(null);
const currentTime = ref(0);
const localTimestamps = ref([]);
const isAddingTimestamp = ref(false);
const newTimestamp = ref({ id: '', time: 0, title: '' });

const videoPlayer = ref(null);
const timestampTitleInput = ref(null);

const formatTime = (seconds) => {
  if (isNaN(seconds)) return '00:00';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const createVideoUrl = (file) => {
  clearVideoUrl();
  videoUrl.value = URL.createObjectURL(file);
};

const clearVideoUrl = () => {
  if (videoUrl.value) {
    URL.revokeObjectURL(videoUrl.value);
    videoUrl.value = null;
  }
  currentTime.value = 0;
};

const handleTimeUpdate = () => {
  if (videoPlayer.value) {
    currentTime.value = videoPlayer.value.currentTime;
  }
};

const captureCurrentTime = () => {
  if (!videoUrl.value || isAddingTimestamp.value) return;
  
  // Pausar video
  if (videoPlayer.value) {
    videoPlayer.value.pause();
  }
  
  isAddingTimestamp.value = true;
  newTimestamp.value = {
    id: generateId(),
    time: currentTime.value,
    title: ''
  };
  
  // Focus en el input
  setTimeout(() => {
    if (timestampTitleInput.value) {
      timestampTitleInput.value.focus();
    }
  }, 100);
};

const saveTimestamp = () => {
  if (!newTimestamp.value.title.trim()) return;
  
  localTimestamps.value.push({ ...newTimestamp.value });
  localTimestamps.value.sort((a, b) => a.time - b.time);
  
  emit('timestamps-updated', [...localTimestamps.value]);
  cancelAddTimestamp();
};

const cancelAddTimestamp = () => {
  isAddingTimestamp.value = false;
  newTimestamp.value = { id: '', time: 0, title: '' };
};

const deleteTimestamp = (index) => {
  if (confirm('¿Eliminar este marcador?')) {
    localTimestamps.value.splice(index, 1);
    emit('timestamps-updated', [...localTimestamps.value]);
  }
};

const seekToTime = (time) => {
  if (videoPlayer.value && videoUrl.value) {
    videoPlayer.value.currentTime = time;
    videoPlayer.value.play();
  }
};

const generateId = () => {
  return 'timestamp-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
};

// Watchers
watch(() => props.videoFile, (newFile) => {
  if (newFile) {
    createVideoUrl(newFile);
  } else {
    clearVideoUrl();
  }
}, { immediate: true });

watch(() => props.timestamps, (newTimestamps) => {
  localTimestamps.value = [...newTimestamps].map(timestamp => ({
    ...timestamp,
    id: timestamp.id || generateId()
  })).sort((a, b) => a.time - b.time);
}, { immediate: true });

onMounted(() => {
  if (props.videoFile) {
    createVideoUrl(props.videoFile);
  }
});

onBeforeUnmount(() => {
  clearVideoUrl();
});
</script>

<template>
  <div>
    <h2 class="text-h5 mb-2">Marcadores de tiempo</h2>
    <p class="text-subtitle-1 mb-4">Añade marcadores para facilitar la navegación</p>

    <!-- Reproductor de video -->
    <v-card class="mb-4">
      <v-card-text>
        <video 
          v-if="videoUrl" 
          ref="videoPlayer" 
          :src="videoUrl" 
          controls
          style="width: 100%; max-height: 400px; border-radius: 8px;"
          @timeupdate="handleTimeUpdate"
        />
        
        <div v-else class="video-placeholder">
          <v-icon size="64" class="mb-2">mdi-video-off</v-icon>
          <span>No hay video disponible</span>
        </div>
      </v-card-text>
    </v-card>

    <!-- Controles de marcadores -->
    <v-card class="mb-4">
      <v-card-text>
        <div class="d-flex justify-space-between align-center mb-4">
          <h3>Marcadores</h3>
          <v-btn 
            color="primary"
            @click="captureCurrentTime" 
            :disabled="!videoUrl || isAddingTimestamp"
          >
            <v-icon class="me-2">mdi-plus</v-icon>
            Añadir en {{ formatTime(currentTime) }}
          </v-btn>
        </div>

        <!-- Formulario para nuevo marcador -->
        <v-card v-if="isAddingTimestamp" variant="outlined" class="mb-4">
          <v-card-text>
            <div class="d-flex justify-space-between align-center mb-3">
              <h4>Marcador en {{ formatTime(newTimestamp.time) }}</h4>
              <v-btn 
                icon="mdi-close" 
                size="small" 
                variant="text" 
                @click="cancelAddTimestamp"
              />
            </div>
            
            <v-text-field
              ref="timestampTitleInput"
              v-model="newTimestamp.title" 
              label="Título del marcador" 
              variant="outlined"
              placeholder="Ej: Introducción, Desarrollo, Conclusión"
              maxlength="100"
              class="mb-3"
            />
            
            <div class="d-flex gap-2">
              <v-btn 
                variant="outlined" 
                @click="cancelAddTimestamp"
              >
                Cancelar
              </v-btn>
              <v-btn 
                color="primary"
                @click="saveTimestamp" 
                :disabled="!newTimestamp.title.trim()"
              >
                Guardar
              </v-btn>
            </div>
          </v-card-text>
        </v-card>

        <!-- Lista de marcadores -->
        <div v-if="localTimestamps.length === 0" class="text-center py-6">
          <v-icon size="48" color="grey" class="mb-2">mdi-bookmark-outline</v-icon>
          <p class="text-grey">Aún no hay marcadores</p>
          <p class="text-caption text-grey">Los marcadores ayudan a navegar por el video</p>
        </div>

        <div v-else>
          <div 
            v-for="(timestamp, index) in localTimestamps" 
            :key="timestamp.id" 
            class="timestamp-item"
          >
            <div class="timestamp-time" @click="seekToTime(timestamp.time)">
              {{ formatTime(timestamp.time) }}
            </div>
            <div class="timestamp-title">{{ timestamp.title }}</div>
            <v-btn 
              icon="mdi-delete" 
              size="small" 
              color="error" 
              variant="text"
              @click="deleteTimestamp(index)"
            />
          </div>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<style scoped>
.video-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  background-color: #f5f5f5;
  border-radius: 8px;
  color: #666;
}

.timestamp-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 8px;
  transition: all 0.2s ease;
}

.timestamp-item:hover {
  background-color: #f5f5f5;
}

.timestamp-time {
  min-width: 80px;
  font-weight: bold;
  color: #FF9800;
  cursor: pointer;
  margin-right: 16px;
}

.timestamp-time:hover {
  text-decoration: underline;
}

.timestamp-title {
  flex-grow: 1;
  font-weight: 500;
}
</style>