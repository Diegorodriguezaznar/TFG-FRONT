<!-- SummaryStep.vue - Paso 3 optimizado -->
<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount } from 'vue';

const props = defineProps({
  videoFile: { type: Object, default: null },
  videoDetails: { type: Object, default: () => ({}) },
  uploading: { type: Boolean, default: false }
});

const emit = defineEmits(['upload-video']);

const thumbnailUrl = ref(null);

const isReadyToUpload = computed(() => 
  props.videoFile && props.videoDetails.title?.trim()
);

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const handleUpload = () => {
  if (isReadyToUpload.value && !props.uploading) {
    emit('upload-video');
  }
};

const updateThumbnailPreview = (file) => {
  if (thumbnailUrl.value) URL.revokeObjectURL(thumbnailUrl.value);
  thumbnailUrl.value = file ? URL.createObjectURL(file) : null;
};

watch(() => props.videoDetails.thumbnail, updateThumbnailPreview, { immediate: true });

onBeforeUnmount(() => {
  if (thumbnailUrl.value) URL.revokeObjectURL(thumbnailUrl.value);
});
</script>

<template>
  <div>
    <h2 class="text-h5 mb-4">Resumen del video</h2>
    
    <v-card class="mb-4">
      <v-card-text>
        <!-- Vista previa del contenido -->
        <v-row class="mb-4">
          <v-col cols="12" sm="4" md="3">
            <v-img
              v-if="videoDetails.thumbnail && thumbnailUrl" 
              :src="thumbnailUrl" 
              height="120"
              cover
              class="rounded"
            />
            
            <div v-else class="thumbnail-placeholder">
              <v-icon size="32" class="mb-2">mdi-video-outline</v-icon>
              <span class="text-caption">Sin miniatura</span>
            </div>
          </v-col>
          
          <v-col cols="12" sm="8" md="9">
            <h3 class="text-h6 mb-2">{{ videoDetails.title || 'Sin título' }}</h3>
            <p class="text-body-2 text-grey mb-2">
              {{ videoFile?.name }} | {{ videoFile ? formatFileSize(videoFile.size) : '' }}
            </p>
            <p class="text-body-2">
              {{ videoDetails.description || 'Sin descripción' }}
            </p>
          </v-col>
        </v-row>
        
        <v-divider class="mb-4" />
        
        <!-- Botón de publicación -->
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
            <v-icon v-if="!uploading" class="me-2">mdi-cloud-upload</v-icon>
            {{ uploading ? 'Publicando video...' : 'Publicar video' }}
          </v-btn>
          
          <p class="text-caption text-grey">
            Al publicar, tu video estará disponible para los estudiantes
          </p>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<style scoped>
.thumbnail-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 120px;
  background-color: #f5f5f5;
  border-radius: 8px;
  color: #666;
}
</style>