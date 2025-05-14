<script setup lang="ts">
// Imports esenciales
import { ref, computed, watch, onBeforeUnmount } from 'vue';
import ErrorDialog from '@/components/ErrorDialog.vue';

// Props básicos
const props = defineProps({
  videoFile: {
    type: Object,
    default: null
  },
  videoDetails: {
    type: Object,
    default: () => ({
      title: '',
      description: '',
      thumbnail: null
    })
  },
  timestamps: {
    type: Array,
    default: () => []
  },
  uploading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['upload-video', 'go-to-step']);

// Variables principales
const thumbnailUrl = ref(null);
const showErrorDialog = ref(false);
const errorDialogTitle = ref('Error');
const errorDialogMessage = ref('');
const errorDialogDetails = ref('');

// Computed properties
const isReadyToUpload = computed(() => 
  props.videoFile && props.videoDetails.title?.trim()
);

// Funciones simplificadas
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

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

const handleUpload = () => {
  if (isReadyToUpload.value && !props.uploading) {
    try {
      emit('upload-video');
    } catch (error) {
      showUploadError(error);
    }
  }
};

const goToFirstStep = () => emit('go-to-step', 0);

// Gestión de miniatura
const updateThumbnailPreview = (file) => {
  if (thumbnailUrl.value) URL.revokeObjectURL(thumbnailUrl.value);
  thumbnailUrl.value = file ? URL.createObjectURL(file) : null;
};

// Gestión de errores simplificada
const showUploadError = (error) => {
  errorDialogTitle.value = 'Error al Publicar Video';
  errorDialogMessage.value = error.message || 'Ha ocurrido un error al intentar publicar el video.';
  
  let details = '';
  if (error.response) {
    details = `Status: ${error.response.status}\n`;
    details += error.response.data ? 
      (typeof error.response.data === 'string' ? 
        `Data: ${error.response.data}` : 
        `Data: ${JSON.stringify(error.response.data, null, 2)}`) : '';
  } else if (error.request) {
    details = 'No se recibió respuesta del servidor.';
  } else {
    details = error.stack || error.toString();
  }
  
  errorDialogDetails.value = details;
  showErrorDialog.value = true;
};

// Observar cambios en miniatura
watch(() => props.videoDetails.thumbnail, updateThumbnailPreview, { immediate: true });

// Limpieza
onBeforeUnmount(() => {
  if (thumbnailUrl.value) URL.revokeObjectURL(thumbnailUrl.value);
});
</script>

<template>
  <v-card class="mb-4">
    <v-card-title>
      <h2 class="text-h5">Resumen del video</h2>
    </v-card-title>
    
    <v-card-text>
      <!-- Sin video seleccionado -->
      <div v-if="!videoFile" class="no-video-message text-center py-6">
        <v-icon icon="mdi-alert-circle" size="64" color="warning" class="mb-4"></v-icon>
        <p class="mb-4">No se ha seleccionado ningún video. Por favor, regresa al primer paso.</p>
        <v-btn color="primary" @click="goToFirstStep">
          Ir al paso 1
        </v-btn>
      </div>

      <!-- Contenido con video -->
      <div v-else>
        <!-- Encabezado con miniatura y metadatos -->
        <v-row class="mb-4">
          <v-col cols="12" sm="4" md="3">
            <div class="thumbnail-container">
              <v-img
                v-if="videoDetails.thumbnail && thumbnailUrl" 
                :src="thumbnailUrl" 
                cover
                height="120"
                class="rounded"
              ></v-img>
              
              <v-sheet
                v-else
                color="grey-lighten-3"
                height="120"
                class="d-flex flex-column align-center justify-center rounded"
              >
                <v-icon icon="mdi-video-outline" size="32" class="mb-2"></v-icon>
                <span class="text-caption">Sin miniatura</span>
              </v-sheet>
            </div>
          </v-col>
          
          <v-col cols="12" sm="8" md="9">
            <h3 class="text-h6 mb-1">{{ videoDetails.title || 'Sin título' }}</h3>
            <p class="text-body-2 text-grey mb-2">
              {{ videoFile.name }} | {{ formatFileSize(videoFile.size) }}
            </p>
            <div class="text-body-2">
              <p v-if="videoDetails.description">{{ videoDetails.description }}</p>
              <p v-else class="text-grey font-italic">Sin descripción</p>
            </div>
          </v-col>
        </v-row>
        
        <!-- Marcadores de tiempo -->
        <v-divider class="mb-4"></v-divider>
        
        <div class="mb-4">
          <div class="d-flex align-center mb-2">
            <v-icon icon="mdi-clock-outline" class="me-2" size="small"></v-icon>
            <h4 class="text-subtitle-1 font-weight-medium">Marcadores de tiempo</h4>
          </div>
          
          <div v-if="timestamps.length === 0" class="text-center py-3 bg-grey-lighten-4 rounded">
            <span class="text-grey">No se han agregado marcadores de tiempo</span>
          </div>
          
          <v-list v-else density="compact" class="bg-grey-lighten-5 rounded">
            <v-list-item
              v-for="(timestamp, index) in timestamps.slice(0, 4)" 
              :key="index"
              :title="timestamp.title"
              :prepend-icon="'mdi-bookmark-outline'"
            >
              <template v-slot:prepend>
                <span class="text-orange font-weight-medium">{{ formatTime(timestamp.time) }}</span>
              </template>
            </v-list-item>
            
            <v-list-item v-if="timestamps.length > 4" class="text-center">
              <span class="text-grey">y {{ timestamps.length - 4 }} más...</span>
            </v-list-item>
          </v-list>
        </div>
        
        <!-- Botón de publicación -->
        <v-divider class="mb-4"></v-divider>
        
        <div class="text-center">
          <v-btn 
            color="primary" 
            size="large"
            block
            class="mb-2" 
            @click="handleUpload" 
            :disabled="!isReadyToUpload || uploading"
            :loading="uploading"
          >
            <v-icon icon="mdi-cloud-upload" class="me-2" v-if="!uploading"></v-icon>
            {{ uploading ? 'Publicando video...' : 'Publicar video' }}
          </v-btn>
          
          <div class="text-caption text-grey">
            Al hacer clic en "Publicar video", tu contenido se subirá y estará disponible.
          </div>
        </div>
      </div>
    </v-card-text>
    
    <!-- Diálogo de error -->
    <ErrorDialog
      :show="showErrorDialog"
      :title="errorDialogTitle"
      :message="errorDialogMessage"
      :details="errorDialogDetails"
      @close="showErrorDialog = false"
    />
  </v-card>
</template>

<style scoped>
.no-video-message {
  background-color: #f9f9f9;
  border-radius: 8px;
  border: 1px dashed #ccc;
}

.thumbnail-container {
  overflow: hidden;
  border-radius: 8px;
}

/* Estilo para elementos que requieren énfasis */
:deep(.v-list-item__prepend) {
  margin-right: 12px;
}
</style>