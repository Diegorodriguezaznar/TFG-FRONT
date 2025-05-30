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
  <div class="SummaryStep">
    <h2 class="SummaryStep__titulo">Resumen del video</h2>
    
    <v-card class="SummaryStep__card">
      <v-card-text class="SummaryStep__contenido">
        <div class="SummaryStep__vista-previa">
          <div class="SummaryStep__miniatura">
            <v-img
              v-if="videoDetails.thumbnail && thumbnailUrl" 
              :src="thumbnailUrl" 
              height="120"
              cover
              class="SummaryStep__imagen"
            />
            
            <div v-else class="SummaryStep__placeholder">
              <v-icon size="32" class="SummaryStep__icono-placeholder">mdi-video-outline</v-icon>
              <span class="SummaryStep__texto-placeholder">Sin miniatura</span>
            </div>
          </div>
          
          <div class="SummaryStep__detalles">
            <h3 class="SummaryStep__titulo-video">{{ videoDetails.title || 'Sin título' }}</h3>
            <p class="SummaryStep__info-archivo">
              {{ videoFile?.name }} | {{ videoFile ? formatFileSize(videoFile.size) : '' }}
            </p>
            <p class="SummaryStep__descripcion">
              {{ videoDetails.description || 'Sin descripción' }}
            </p>
          </div>
        </div>
        
        <div class="SummaryStep__divider" />
        
        <div class="SummaryStep__acciones">
          <v-btn 
            color="primary" 
            size="large"
            block
            class="SummaryStep__boton" 
            @click="handleUpload" 
            :disabled="!isReadyToUpload || uploading"
            :loading="uploading"
          >
            <v-icon v-if="!uploading" class="SummaryStep__icono-boton">mdi-cloud-upload</v-icon>
            {{ uploading ? 'Publicando video...' : 'Publicar video' }}
          </v-btn>
          
          <p class="SummaryStep__nota">
            Al publicar, tu video estará disponible para los estudiantes
          </p>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/sass/components/SubirVideo/steps/paso3Resumen";
</style>