<script setup lang="ts">
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

const isDragging = ref(false);
const videoUrl = ref<string | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

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
  <div class="FileUploadStep">
    <div class="FileUploadStep__header">
      <h2 class="FileUploadStep__titulo">Sube tu video</h2>
      <p class="FileUploadStep__subtitulo">Comienza a compartir tu contenido</p>
    </div>

    <v-card class="FileUploadStep__card" elevation="2">
      <v-hover v-if="!selectedFile && !uploading">
        <template v-slot:default="{ isHovering }">
          <div
            :class="[
              'FileUploadStep__drop-zone',
              { 'FileUploadStep__drop-zone--hover': isHovering || isDragging }
            ]"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="handleFileDrop"
            @click="triggerFileInput"
          >
            <input 
              type="file" 
              ref="fileInput" 
              class="FileUploadStep__input" 
              accept="video/*" 
              @change="handleFileInput"
            >
            
            <v-icon color="primary" icon="mdi-cloud-upload" size="64" class="FileUploadStep__icono" />
            <div class="FileUploadStep__texto-principal">Arrastra tu video aquí</div>
            <div class="FileUploadStep__texto-secundario">o haz clic para seleccionar</div>
            <v-chip variant="outlined" color="grey" class="FileUploadStep__formatos">
              MP4, MOV, AVI, WMV
            </v-chip>
          </div>
        </template>
      </v-hover>

      <template v-else-if="selectedFile && !uploading">
        <v-card-title class="FileUploadStep__titulo-card">Video seleccionado</v-card-title>
        <v-divider />
        
        <v-card-text class="FileUploadStep__contenido">
          <div v-if="videoUrl" class="FileUploadStep__video-container">
            <video 
              :src="videoUrl" 
              controls
              class="FileUploadStep__video"
            />
          </div>
          
          <div class="FileUploadStep__info">
            <v-icon icon="mdi-file-video" size="large" color="primary" class="FileUploadStep__icono-archivo" />
            
            <div class="FileUploadStep__detalles">
              <div class="FileUploadStep__nombre">{{ selectedFile.name }}</div>
              <div class="FileUploadStep__tamaño">{{ formatFileSize(selectedFile.size) }}</div>
            </div>
            
            <v-btn icon="mdi-close" variant="text" color="error" @click="removeFile" class="FileUploadStep__eliminar" />
          </div>
        </v-card-text>
      </template>

      <template v-if="uploading">
        <v-card-text class="FileUploadStep__cargando">
          <v-progress-circular indeterminate color="primary" size="64" class="FileUploadStep__spinner" />
          <div class="FileUploadStep__texto-carga">Subiendo video...</div>
        </v-card-text>
      </template>
    </v-card>

    <v-card class="FileUploadStep__requisitos" variant="outlined">
      <v-card-text>
        <div class="FileUploadStep__requisitos-header">
          <v-icon icon="mdi-information-outline" class="FileUploadStep__icono-info" />
          <span class="FileUploadStep__requisitos-titulo">Requisitos:</span>
        </div>
        <div class="FileUploadStep__requisitos-lista">
          <div class="FileUploadStep__requisito">
            <v-icon size="small" color="success" icon="mdi-check-circle" class="FileUploadStep__check" />
            Tamaño máximo: 2GB
          </div>
          <div class="FileUploadStep__requisito">
            <v-icon size="small" color="success" icon="mdi-check-circle" class="FileUploadStep__check" />
            Duración máxima: 60 minutos
          </div>
          <div class="FileUploadStep__requisito">
            <v-icon size="small" color="success" icon="mdi-check-circle" class="FileUploadStep__check" />
            Resolución recomendada: 1080p
          </div>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/sass/components/SubirVideo/steps/paso1SubirVideo";
</style>