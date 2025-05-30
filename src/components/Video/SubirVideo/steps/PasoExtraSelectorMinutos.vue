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
  
  if (videoPlayer.value) {
    videoPlayer.value.pause();
  }
  
  isAddingTimestamp.value = true;
  newTimestamp.value = {
    id: generateId(),
    time: currentTime.value,
    title: ''
  };
  
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
  <div class="TimestampStep">
    <div class="TimestampStep__header">
      <h2 class="TimestampStep__titulo">Marcadores de tiempo</h2>
      <p class="TimestampStep__subtitulo">Añade marcadores para facilitar la navegación</p>
    </div>

    <v-card class="TimestampStep__video-card">
      <v-card-text class="TimestampStep__video-contenido">
        <video 
          v-if="videoUrl" 
          ref="videoPlayer" 
          :src="videoUrl" 
          controls
          class="TimestampStep__video"
          @timeupdate="handleTimeUpdate"
        />
        
        <div v-else class="TimestampStep__video-placeholder">
          <v-icon size="64" class="TimestampStep__icono-placeholder">mdi-video-off</v-icon>
          <span class="TimestampStep__texto-placeholder">No hay video disponible</span>
        </div>
      </v-card-text>
    </v-card>

    <v-card class="TimestampStep__marcadores-card">
      <v-card-text class="TimestampStep__marcadores-contenido">
        <div class="TimestampStep__marcadores-header">
          <h3 class="TimestampStep__marcadores-titulo">Marcadores</h3>
          <v-btn 
            color="primary"
            @click="captureCurrentTime" 
            :disabled="!videoUrl || isAddingTimestamp"
            class="TimestampStep__boton-añadir"
          >
            <v-icon class="TimestampStep__icono-añadir">mdi-plus</v-icon>
            Añadir en {{ formatTime(currentTime) }}
          </v-btn>
        </div>

        <v-card v-if="isAddingTimestamp" variant="outlined" class="TimestampStep__nuevo-marcador">
          <v-card-text class="TimestampStep__nuevo-contenido">
            <div class="TimestampStep__nuevo-header">
              <h4 class="TimestampStep__nuevo-titulo">Marcador en {{ formatTime(newTimestamp.time) }}</h4>
              <v-btn 
                icon="mdi-close" 
                size="small" 
                variant="text" 
                @click="cancelAddTimestamp"
                class="TimestampStep__boton-cerrar"
              />
            </div>
            
            <v-text-field
              ref="timestampTitleInput"
              v-model="newTimestamp.title" 
              label="Título del marcador" 
              variant="outlined"
              placeholder="Ej: Introducción, Desarrollo, Conclusión"
              maxlength="100"
              class="TimestampStep__input-titulo"
            />
            
            <div class="TimestampStep__nuevo-acciones">
              <v-btn 
                variant="outlined" 
                @click="cancelAddTimestamp"
                class="TimestampStep__boton-cancelar"
              >
                Cancelar
              </v-btn>
              <v-btn 
                color="primary"
                @click="saveTimestamp" 
                :disabled="!newTimestamp.title.trim()"
                class="TimestampStep__boton-guardar"
              >
                Guardar
              </v-btn>
            </div>
          </v-card-text>
        </v-card>

        <div v-if="localTimestamps.length === 0" class="TimestampStep__vacio">
          <v-icon size="48" color="grey" class="TimestampStep__icono-vacio">mdi-bookmark-outline</v-icon>
          <p class="TimestampStep__texto-vacio">Aún no hay marcadores</p>
          <p class="TimestampStep__descripcion-vacio">Los marcadores ayudan a navegar por el video</p>
        </div>

        <div v-else class="TimestampStep__lista">
          <div 
            v-for="(timestamp, index) in localTimestamps" 
            :key="timestamp.id" 
            class="TimestampStep__item"
          >
            <div class="TimestampStep__tiempo" @click="seekToTime(timestamp.time)">
              {{ formatTime(timestamp.time) }}
            </div>
            <div class="TimestampStep__nombre">{{ timestamp.title }}</div>
            <v-btn 
              icon="mdi-delete" 
              size="small" 
              color="error" 
              variant="text"
              @click="deleteTimestamp(index)"
              class="TimestampStep__boton-eliminar"
            />
          </div>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/sass/components/SubirVideo/steps/pasoExtraSelectorMinutos";
</style>