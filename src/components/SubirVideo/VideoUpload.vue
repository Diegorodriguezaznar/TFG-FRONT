<!-- VideoUpload.vue - Componente principal optimizado -->
<script setup lang="ts">
import { ref, computed, reactive, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import FileUploadStep from './steps/Paso1SubirVideo.vue';
import VideoDetailsStep from './steps/Paso2DetallesVideo.vue';
import SummaryStep from './steps/Paso3Resumen.vue';
import TimestampStep from './steps/PasoExtraSelectorMinutos.vue';
import VideoService from '@/services/VideoService';
import { useMarcadorVideoStore } from '@/stores/MarcadorVideo';

const emit = defineEmits(['upload-complete']);
const router = useRouter();
const route = useRoute();
const marcadorVideoStore = useMarcadorVideoStore();

// Estados principales
const currentStep = ref(0);
const isMarkersMode = ref(false);
const uploading = ref(false);
const uploadedVideoData = ref(null);

// Obtener idCurso de la ruta
const currentCourseId = computed(() => {
  console.log('=== ROUTE DEBUG ===');
  console.log('Full route object:', route);
  console.log('Route path:', route.path);
  console.log('Route params:', route.params);
  console.log('All param keys:', Object.keys(route.params));
  console.log('===================');
  
  // Intentar diferentes nombres de parámetro
  let id = null;
  
  if (route.params.idCurso) {
    id = Number(route.params.idCurso);
    console.log('Found idCurso:', id);
  } else if (route.params.id) {
    id = Number(route.params.id);
    console.log('Found id:', id);
  } else if (route.params.courseId) {
    id = Number(route.params.courseId);
    console.log('Found courseId:', id);
  } else {
    console.log('No course parameter found in route');
  }
  
  console.log('Final currentCourseId:', id);
  return id;
});

// Datos del video
const videoFile = ref(null);
const videoDetails = reactive({
  title: '',
  description: '',
  thumbnail: null,
  courseId: currentCourseId.value, // Incluir courseId desde el inicio
  subjectId: null
});
const timestamps = ref([]);

// Watch para mantener courseId actualizado
watch(currentCourseId, (newCourseId) => {
  videoDetails.courseId = newCourseId;
}, { immediate: true });

// Validar que existe idCurso en la ruta
onMounted(() => {
  console.log('VideoUpload mounted, currentCourseId:', currentCourseId.value);
  if (!currentCourseId.value) {
    console.error('No se encontró idCurso en la ruta');
    router.push('/cursos');
  }
});

// Validar que existe idCurso en la ruta
onMounted(() => {
  if (!currentCourseId.value) {
    console.error('No se encontró idCurso en la ruta');
    router.push('/cursos');
  }
});

// Diálogos
const showMarkerDialog = ref(false);
const showErrorDialog = ref(false);
const errorMessage = ref('');

// Pasos del flujo
const steps = computed(() => {
  if (isMarkersMode.value) {
    return [
      { title: 'Subir Video', completed: true },
      { title: 'Detalles', completed: true },
      { title: 'Finalizar', completed: true },
      { title: 'Marcadores', completed: false }
    ];
  }
  return [
    { title: 'Subir Video', completed: currentStep.value > 0 },
    { title: 'Detalles', completed: currentStep.value > 1 },
    { title: 'Finalizar', completed: currentStep.value > 2 }
  ];
});

const canProceed = computed(() => {
  switch (currentStep.value) {
    case 0: return videoFile.value !== null;
    case 1: return videoDetails.title.trim() !== '' && videoDetails.subjectId !== null;
    case 2: return true;
    default: return true;
  }
});

// Navegación entre pasos
const nextStep = () => {
  if (currentStep.value < 2 && canProceed.value) { // Máximo paso 2 (Finalizar)
    currentStep.value++;
  }
};

const prevStep = () => {
  if (currentStep.value > 0 && !isMarkersMode.value) { // No retroceder si estamos en marcadores
    currentStep.value--;
  }
};

// Handlers
const handleFileSelection = (file) => {
  videoFile.value = file;
};

const handleDetailsUpdate = (details) => {
  Object.assign(videoDetails, details);
  // AÑADIR: Incluir el courseId cuando se actualicen los detalles
  videoDetails.courseId = currentCourseId.value;
};

const handleTimestampsUpdate = (newTimestamps) => {
  timestamps.value = [...newTimestamps];
};

// Subida de video
const uploadVideo = async () => {
  try {
    uploading.value = true;
    
    console.log('Datos a enviar:', {
      videoFile: videoFile.value?.name,
      videoDetails: videoDetails,
      thumbnail: videoDetails.thumbnail?.name
    });
    
    const result = await VideoService.uploadCompleteVideo(
      videoFile.value,
      videoDetails,
      videoDetails.thumbnail,
      []
    );
    
    uploadedVideoData.value = result;
    emit('upload-complete', result);
    
    // Preguntar sobre marcadores
    setTimeout(() => {
      uploading.value = false;
      showMarkerDialog.value = true;
    }, 1000);
    
  } catch (error) {
    uploading.value = false;
    console.error('Error detallado:', error);
    errorMessage.value = error.message || 'Error al subir el video';
    showErrorDialog.value = true;
  }
};

// Manejo de marcadores
const handleMarkerDecision = (addMarkers) => {
  showMarkerDialog.value = false;
  
  if (addMarkers) {
    isMarkersMode.value = true;
    currentStep.value = 3; // Paso de marcadores
  } else {
    router.push(`/cursos`);
    resetForm();
  }
};

// Guardar marcadores
const saveTimestamps = async () => {
  if (!uploadedVideoData.value?.idVideo) {
    errorMessage.value = 'Error: Video no encontrado';
    showErrorDialog.value = true;
    return;
  }
  
  try {
    uploading.value = true;
    
    const marcadoresDTO = timestamps.value.map(t => 
      marcadorVideoStore.convertTimestampToMarcadorDTO(t, uploadedVideoData.value.idVideo)
    );
    
    await marcadorVideoStore.createMarcadoresEnLote(uploadedVideoData.value.idVideo, marcadoresDTO);
    
    router.push(`/cursos`);
    resetForm();
    
  } catch (error) {
    uploading.value = false;
    errorMessage.value = error.message || 'Error al guardar marcadores';
    showErrorDialog.value = true;
  }
};

const finishWithoutMarkers = () => {
  router.push(`/cursos`);
  resetForm();
};

const resetForm = () => {
  try {
    currentStep.value = 0;
    isMarkersMode.value = false;
    videoFile.value = null;
    videoDetails.title = '';
    videoDetails.description = '';
    videoDetails.thumbnail = null;
    videoDetails.subjectId = null;
    timestamps.value = [];
    uploadedVideoData.value = null;
  } catch (error) {
    console.warn('Error resetting form:', error);
  }
};
</script>

<template>
  <div class="video-upload">
    <!-- Header con pasos -->
    <div class="steps-header">
      <div 
        v-for="(step, index) in steps" 
        :key="index"
        class="step-item"
        :class="{ 
          'step-active': currentStep === index && !isMarkersMode, 
          'step-completed': step.completed,
          'step-markers': isMarkersMode && index === 3
        }"
      >
        <div class="step-number">
          <span v-if="step.completed">✓</span>
          <span v-else>{{ index + 1 }}</span>
        </div>
        <span class="step-title">{{ step.title }}</span>
      </div>
    </div>

    <!-- Contenido de pasos -->
    <div class="step-content">
      <!-- Paso 1: Subir archivo -->
      <FileUploadStep 
        v-if="currentStep === 0"
        :selected-file="videoFile"
        :uploading="uploading"
        @file-selected="handleFileSelection"
      />

      <!-- Paso 2: Detalles -->
      <VideoDetailsStep 
        v-if="currentStep === 1"
        :video-details="videoDetails"
        :id-curso="currentCourseId"
        @details-updated="handleDetailsUpdate"
      />

      <!-- Paso 3: Resumen y publicar -->
      <SummaryStep 
        v-if="currentStep === 2"
        :video-file="videoFile"
        :video-details="videoDetails"
        :uploading="uploading"
        @upload-video="uploadVideo"
      />

      <!-- Paso 4: Marcadores (solo en modo marcadores) -->
      <TimestampStep 
        v-if="currentStep === 3 && isMarkersMode"
        :video-file="videoFile"
        :timestamps="timestamps"
        @timestamps-updated="handleTimestampsUpdate"
      />
    </div>

    <!-- Acciones -->
    <div class="actions">
      <!-- Navegación normal (pasos 1, 2, 3) -->
      <template v-if="!isMarkersMode">
        <v-btn 
          v-if="currentStep > 0"
          variant="outlined" 
          @click="prevStep"
          :disabled="uploading"
        >
          Anterior
        </v-btn>
        
        <v-btn 
          v-if="currentStep < 2"
          color="primary" 
          @click="nextStep"
          :disabled="!canProceed || uploading"
        >
          Siguiente
        </v-btn>
        
        <!-- En el paso final (3), el botón "Publicar" está dentro del componente SummaryStep -->
      </template>

      <!-- Acciones para marcadores (paso 4) -->
      <template v-if="isMarkersMode && currentStep === 3">
        <v-btn 
          variant="outlined"
          @click="finishWithoutMarkers"
          :disabled="uploading"
        >
          Salir sin guardar
        </v-btn>
        
        <v-btn 
          color="success"
          @click="saveTimestamps"
          :disabled="uploading"
          :loading="uploading"
        >
          Guardar marcadores
        </v-btn>
      </template>
    </div>

    <!-- Diálogo para marcadores -->
    <v-dialog v-model="showMarkerDialog" max-width="400" persistent>
      <v-card>
        <v-card-title>¿Añadir marcadores?</v-card-title>
        <v-card-text>
          Los marcadores ayudan a navegar por secciones específicas del video.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="handleMarkerDecision(false)">No, gracias</v-btn>
          <v-btn color="primary" @click="handleMarkerDecision(true)">Sí, añadir</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo de error -->
    <v-dialog v-model="showErrorDialog" max-width="400">
      <v-card>
        <v-card-title>Error</v-card-title>
        <v-card-text>{{ errorMessage }}</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="showErrorDialog = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.video-upload {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
}

.steps-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 32px;
  position: relative;
}

.steps-header::before {
  content: '';
  position: absolute;
  top: 16px;
  left: 16px;
  right: 16px;
  height: 2px;
  background: #e0e0e0;
  z-index: 0;
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;
}

.step-number {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  font-weight: bold;
  color: #666;
}

.step-active .step-number {
  background: #FF9800;
  color: white;
}

.step-completed .step-number {
  background: #4CAF50;
  color: white;
}

.step-markers .step-number {
  background: #9C27B0;
  color: white;
}

.step-title {
  font-size: 14px;
  text-align: center;
  color: #666;
}

.step-active .step-title,
.step-completed .step-title,
.step-markers .step-title {
  color: #333;
  font-weight: 500;
}

.step-content {
  min-height: 400px;
  margin-bottom: 24px;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

@media (max-width: 600px) {
  .video-upload {
    padding: 16px;
  }
  
  .step-title {
    font-size: 12px;
  }
  
  .actions {
    flex-direction: column;
  }
}
</style>