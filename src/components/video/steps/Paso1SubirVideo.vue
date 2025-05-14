<script setup lang="ts">
// Imports y props esenciales
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';


const props = defineProps({
  selectedFile: {
    type: Object,
    default: null
  },
  uploading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['file-selected']);

// Variables para el funcionamiento básico
const isDragging = ref(false);
const videoUrl = ref<string | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

// Métodos esenciales
const triggerFileInput = () => {
  if (!props.selectedFile && !props.uploading && fileInput.value) {
    fileInput.value.click();
  }
};

const handleFileInput = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  
  if (file && file.type.startsWith('video/')) {
    emit('file-selected', file);
  } else if (file) {
    alert('Por favor, selecciona un archivo de video válido.');
  }
};

const handleFileDrop = (event: DragEvent) => {
  isDragging.value = false;
  const file = event.dataTransfer?.files[0];
  
  if (file && file.type.startsWith('video/')) {
    emit('file-selected', file);
  } else if (file) {
    alert('Por favor, arrastra un archivo de video válido.');
  }
};

const removeFile = () => {
  emit('file-selected', null);
  clearVideoUrl();
};

const createVideoPreview = (file: File) => {
  clearVideoUrl();
  videoUrl.value = URL.createObjectURL(file);
};

const clearVideoUrl = () => {
  if (videoUrl.value) {
    URL.revokeObjectURL(videoUrl.value);
    videoUrl.value = null;
  }
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Watchers y lifecycle hooks
watch(() => props.selectedFile, (newFile) => {
  if (newFile) createVideoPreview(newFile);
  else clearVideoUrl();
});

onMounted(() => {
  if (props.selectedFile) createVideoPreview(props.selectedFile);
});

onBeforeUnmount(() => {
  clearVideoUrl();
});
</script>

<template>
  <v-sheet class="pa-4 rounded">
    <h2 class="text-h5 mb-2">Sube tu video</h2>
    <p class="text-subtitle-1 mb-6">Comienza a compartir tu contenido</p>

    <v-card class="mx-auto mb-6" elevation="2" max-width="800">
      <!-- Área para arrastrar o seleccionar archivo -->
      <v-hover v-if="!selectedFile && !uploading">
        <template v-slot:default="{ isHovering }">
          <v-sheet
            :color="isHovering || isDragging ? 'primary-lighten-5' : 'grey-lighten-4'"
            class="d-flex flex-column align-center justify-center pa-6 rounded upload-drop-zone"
            min-height="250"
            style="cursor: pointer; border: 2px dashed #ccc; transition: all 0.3s ease;"
            :style="{ borderColor: isDragging ? '#FF9800' : '#ccc' }"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="handleFileDrop"
            @click="triggerFileInput"
          >
            <input 
              type="file" 
              ref="fileInput" 
              class="d-none" 
              accept="video/*" 
              @change="handleFileInput"
            >
            
            <v-icon color="primary" icon="mdi-cloud-upload" size="64" class="mb-4"></v-icon>
            <div class="text-h6 text-center mb-1">Arrastra tu video aquí</div>
            <div class="text-subtitle-1 text-center mb-3">o haz clic para seleccionar</div>
            <v-chip variant="outlined" color="grey" class="text-caption">
              MP4, MOV, AVI, WMV
            </v-chip>
          </v-sheet>
        </template>
      </v-hover>

      <!-- Video seleccionado -->
      <template v-else-if="selectedFile && !uploading">
        <v-card-title>Video seleccionado</v-card-title>
        <v-divider></v-divider>
        
        <v-card-text class="pa-4">
          <!-- Vista previa del video -->
          <div v-if="videoUrl" class="mb-4 video-container">
            <video 
              :src="videoUrl" 
              controls
              style="max-height: 350px; width: 100%; border-radius: 8px;"
            ></video>
          </div>
          
          <!-- Información del archivo -->
          <div class="d-flex align-center">
            <v-icon icon="mdi-file-video" size="large" color="primary" class="me-3"></v-icon>
            
            <div class="flex-grow-1">
              <div class="text-h6">{{ selectedFile.name }}</div>
              <div class="text-body-2 text-grey">
                {{ formatFileSize(selectedFile.size) }}
              </div>
            </div>
            
            <v-btn icon="mdi-close" variant="text" color="error" @click="removeFile"></v-btn>
          </div>
        </v-card-text>
      </template>

      <!-- Estado de carga -->
      <template v-if="uploading">
        <v-card-text class="text-center pa-6">
          <v-progress-circular indeterminate color="primary" size="64" class="mb-4"></v-progress-circular>
          <div class="text-h6">Subiendo video...</div>
        </v-card-text>
      </template>
    </v-card>

    <!-- Requisitos (simplificados) -->
    <v-card class="mx-auto" max-width="800" variant="outlined">
      <v-card-text>
        <div class="d-flex align-center mb-2">
          <v-icon icon="mdi-information-outline" class="me-2"></v-icon>
          <span class="font-weight-bold">Requisitos:</span>
        </div>
        <div class="ml-8">
          <div><v-icon size="small" color="success" icon="mdi-check-circle" class="me-2"></v-icon>Tamaño máximo: 2GB</div>
          <div><v-icon size="small" color="success" icon="mdi-check-circle" class="me-2"></v-icon>Duración máxima: 60 minutos</div>
          <div><v-icon size="small" color="success" icon="mdi-check-circle" class="me-2"></v-icon>Resolución recomendada: 1080p</div>
        </div>
      </v-card-text>
    </v-card>
  </v-sheet>
</template>

<style scoped>

.video-container {
  background-color: black;
  border-radius: 8px;
  overflow: hidden;
}

.upload-drop-zone:hover {
  background-color: rgba(255, 152, 0, 0.05);
  border-color: #FF9800;
}

@media (max-width: 600px) {
  .upload-drop-zone {
    min-height: 180px;
  }
}
</style>