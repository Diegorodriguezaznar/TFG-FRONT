<script setup lang="ts">
// --------------------------- Imports ---------------------------
import { ref, computed, reactive, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import FileUploadStep from './steps/Paso1SubirVideo.vue';
import VideoDetailsStep from './steps/Paso2DetallesVideo.vue';
import TimestampStep from './steps/PasoExtraSelectorMinutos.vue';
import SummaryStep from './steps/Paso3Resumen.vue';
import ErrorDialog from '../ErrorDialog.vue';
import VideoService from '@/services/VideoService';
import { useMarcadorVideoStore } from '@/stores/MarcadorVideo';

// --------------------------- Variables ---------------------------
const emit = defineEmits(['upload-complete']);
const router = useRouter();
const marcadorVideoStore = useMarcadorVideoStore();

const currentStep = ref(0);
const steps = ref([
  { title: 'Subir Video', completed: false },
  { title: 'Detalles', completed: false },
  { title: 'Finalizar', completed: false }
]);

const videoFile = ref(null);
const videoDetails = reactive({
  title: '',
  description: '',
  thumbnail: null,
  courseId: null,
  subjectId: null
});
const timestamps = ref([]);
const uploading = ref(false);
const uploadComplete = ref(false);
const uploadedVideoData = ref(null);

// Diálogo para preguntar sobre marcadores
const showMarkerDialog = ref(false);

// Error dialog properties
const showErrorDialog = ref(false);
const errorDialogTitle = ref('Error');
const errorDialogMessage = ref('');
const errorDialogDetails = ref('');

// --------------------------- Computed ---------------------------
const canProceed = computed(() => {
  switch (currentStep.value) {
    case 0:
      return videoFile.value !== null;
    case 1:
      return videoDetails.title.trim() !== '';
    default:
      return true;
  }
});

// --------------------------- Métodos ---------------------------
const nextStep = () => {
  if (currentStep.value < steps.value.length - 1 && canProceed.value) {
    steps.value[currentStep.value].completed = true;
    currentStep.value++;
  }
};

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--;
  }
};

const handleFileSelection = (file) => {
  videoFile.value = file;
};

const handleDetailsUpdate = (details) => {
  videoDetails.title = details.title;
  videoDetails.description = details.description;
  videoDetails.thumbnail = details.thumbnail;
  // Asegurarse de capturar también los IDs de curso y asignatura
  videoDetails.courseId = details.courseId;
  videoDetails.subjectId = details.subjectId;
};

const handleTimestampsUpdate = (newTimestamps) => {
  timestamps.value = [...newTimestamps];
};

const resetForm = () => {
  currentStep.value = 0;
  videoFile.value = null;
  videoDetails.title = '';
  videoDetails.description = '';
  videoDetails.thumbnail = null;
  timestamps.value = [];
  steps.value.forEach(step => step.completed = false);
  uploadComplete.value = false;
  uploadedVideoData.value = null;
};

// Error handling methods
const showError = (error) => {
  errorDialogTitle.value = 'Error al Publicar Video';
  
  // Main error message
  if (error.message) {
    errorDialogMessage.value = error.message;
  } else {
    errorDialogMessage.value = 'Ha ocurrido un error al intentar publicar el video. Por favor, inténtalo de nuevo más tarde.';
  }
  
  // Detailed error information
  let details = '';
  
  if (error.response) {
    // Server response error
    details = `Status: ${error.response.status}\n`;
    details += `Status Text: ${error.response.statusText}\n\n`;
    
    if (error.response.data) {
      if (typeof error.response.data === 'string') {
        details += `Response Data: ${error.response.data}`;
      } else {
        details += `Response Data: ${JSON.stringify(error.response.data, null, 2)}`;
      }
    }
  } else if (error.request) {
    // Request error (no response received)
    details = 'No se recibió respuesta del servidor. Verifica tu conexión a internet.';
  } else {
    // Error in setting up the request
    details = error.stack || error.toString();
  }
  
  errorDialogDetails.value = details;
  showErrorDialog.value = true;
};

const showSuccessMessage = (title, message, isVideoUploaded = false) => {
  errorDialogTitle.value = title;
  errorDialogMessage.value = message;
  errorDialogDetails.value = '';
  showErrorDialog.value = true;
  
  // Si es el mensaje de éxito por subir el video, mostrar el diálogo para preguntar sobre marcadores
  if (isVideoUploaded) {
    nextTick(() => {
      showErrorDialog.value = false;
      showMarkerDialog.value = true;
    });
  }
};

// Upload video method - Modificado para el nuevo flujo
const uploadVideo = async () => {
  try {
    uploading.value = true;
    
    console.log('Iniciando proceso de subida...');
    console.log('Archivo de video:', videoFile.value?.name);
    console.log('Miniatura:', videoDetails.thumbnail?.name || 'Sin miniatura');
    
    // Use the service to upload the video (simplified)
    // Ahora no incluimos los timestamps en la subida inicial
    const result = await VideoService.uploadCompleteVideo(
      videoFile.value,
      videoDetails,
      videoDetails.thumbnail,
      [] // Sin marcadores inicialmente
    );
    
    console.log('Subida completada correctamente:', result);
    
    uploadedVideoData.value = result;
    uploadComplete.value = true;
    emit('upload-complete', result);
    
    // Ahora mostramos un mensaje de éxito que llevará al diálogo de marcadores
    setTimeout(() => {
      uploading.value = false;
      showSuccessMessage(
        'Video publicado con éxito', 
        'Tu video ha sido subido correctamente y está disponible para su visualización.',
        true // Indicar que es un mensaje de video subido
      );
    }, 1000);
    
  } catch (error) {
    console.error('Error completo al subir el video:', error);
    uploading.value = false;
    
    // Show detailed error dialog
    showError(error);
  }
};

// Método para gestionar la decisión de añadir marcadores
const handleMarkerDecision = async (addMarkers) => {
  showMarkerDialog.value = false;
  
  if (addMarkers) {
    // Ir al componente de marcadores de tiempo
    console.log('Redirigiendo al editor de marcadores...');
    // Añadir un paso extra para marcadores y mostrar ese paso
    steps.value = [
      { title: 'Subir Video', completed: true },
      { title: 'Detalles', completed: true },
      { title: 'Marcadores', completed: false },
      { title: 'Finalizar', completed: false }
    ];
    currentStep.value = 2; // Ir al paso de marcadores (índice 2)
  } else {
    // No se añadirán marcadores, redirigir a home
    console.log('Redirigiendo a home...');
    router.push('/cursos');
    resetForm();
  }
};

// Method to handle step navigation from child components
const handleGoToStep = (stepIndex) => {
  if (stepIndex >= 0 && stepIndex < steps.value.length) {
    currentStep.value = stepIndex;
  }
};

// Método para guardar marcadores después de subirlos
const saveTimestamps = async () => {
  if (!uploadedVideoData.value || !uploadedVideoData.value.idVideo) {
    showError({ message: 'No se pudo guardar los marcadores porque el video no se ha subido correctamente.' });
    return;
  }
  
  try {
    uploading.value = true;
    
    // Convertir timestamps al formato MarcadorVideoDTO
    const marcadoresDTO = timestamps.value.map(t => 
      marcadorVideoStore.convertTimestampToMarcadorDTO(t, uploadedVideoData.value.idVideo)
    );
    
    // Guardar marcadores usando el store
    await marcadorVideoStore.createMarcadoresEnLote(uploadedVideoData.value.idVideo, marcadoresDTO);
    
    // Finalizar proceso
    uploading.value = false;
    showSuccessMessage(
      'Marcadores guardados', 
      'Los marcadores de tiempo han sido guardados correctamente.'
    );
    
    // Redirigir a home después de un tiempo
    setTimeout(() => {
      router.push('/cursos');
      resetForm();
    }, 2000);
    
  } catch (error) {
    uploading.value = false;
    showError(error);
  }
};
</script>

<template>
  <div class="VideoUpload">
    <!-- Stepper Header -->
    <div class="VideoUpload__StepperHeader">
      <div 
        v-for="(step, index) in steps" 
        :key="index" 
        class="VideoUpload__Step" 
        :class="{ 
          'VideoUpload__Step--active': currentStep === index, 
          'VideoUpload__Step--completed': currentStep > index 
        }"
      >
        <div class="VideoUpload__StepNumber">
          <span v-if="currentStep > index">✓</span>
          <span v-else>{{ index + 1 }}</span>
        </div>
        <div class="VideoUpload__StepTitle">{{ step.title }}</div>
        <div 
          class="VideoUpload__StepConnector" 
          v-if="index < steps.length - 1"
        ></div>
      </div>
    </div>

    <!-- Stepper Content -->
    <div class="VideoUpload__Content">
      <!-- Step 1: Upload Video File -->
      <div v-if="currentStep === 0" class="VideoUpload__StepContent">
        <file-upload-step 
          @file-selected="handleFileSelection" 
          :selectedFile="videoFile" 
          :uploading="uploading"
        />
      </div>

      <!-- Step 2: Video Details -->
      <div v-if="currentStep === 1" class="VideoUpload__StepContent">
        <video-details-step 
          @details-updated="handleDetailsUpdate" 
          :videoDetails="videoDetails" 
        />
      </div>

      <!-- Step 3: Timestamp Markers (solo se muestra si está activo) -->
      <div v-if="currentStep === 2 && steps.length === 4" class="VideoUpload__StepContent">
        <timestamp-step 
          @timestamps-updated="handleTimestampsUpdate" 
          :videoFile="videoFile" 
          :timestamps="timestamps" 
        />
      </div>

      <!-- Step 3/4: Summary and Finalize -->
      <div v-if="(currentStep === 2 && steps.length === 3) || (currentStep === 3 && steps.length === 4)" class="VideoUpload__StepContent">
        <summary-step 
          :videoFile="videoFile" 
          :videoDetails="videoDetails" 
          :timestamps="timestamps" 
          :uploading="uploading"
          @upload-video="uploadVideo"
          @go-to-step="handleGoToStep"
        />
      </div>
    </div>

    <!-- Stepper Actions -->
    <div class="VideoUpload__Actions">
      <v-btn
        v-if="currentStep > 0"
        variant="outlined"
        color="secondary"
        @click="prevStep"
        :disabled="uploading"
        class="mr-2"
      >
        Anterior
      </v-btn>
      
      <!-- Botón de Siguiente - Visible según el paso actual -->
      <v-btn
        v-if="currentStep < steps.length - 1"
        variant="elevated"
        color="primary"
        @click="nextStep"
        :disabled="!canProceed || uploading"
      >
        Siguiente
      </v-btn>
      
      <!-- Botón para guardar marcadores si estamos en el paso de marcadores -->
      <v-btn
        v-if="currentStep === 2 && steps.length === 4"
        variant="elevated"
        color="success"
        @click="saveTimestamps"
        :disabled="uploading"
      >
        Guardar marcadores
      </v-btn>
    </div>
    
    <!-- Diálogo de preguntar sobre marcadores -->
    <v-dialog
      v-model="showMarkerDialog"
      persistent
      max-width="500"
    >
      <v-card>
        <v-card-title class="text-h5 pa-4">
          Añadir marcadores de tiempo
        </v-card-title>
        
        <v-card-text class="pa-4">
          <p>¿Quieres añadir marcadores para minutos importantes a tu video?</p>
          <p class="text-body-2 text-grey mt-2">
            Los marcadores ayudan a los espectadores a navegar por secciones específicas de tu video.
          </p>
        </v-card-text>
        
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn
            variant="outlined"
            color="grey"
            @click="handleMarkerDecision(false)"
          >
            No, gracias
          </v-btn>
          <v-btn
            variant="elevated"
            color="primary"
            @click="handleMarkerDecision(true)"
            class="ml-2"
          >
            Sí, añadir marcadores
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
    <!-- Global Error Dialog -->
    <ErrorDialog
      :show="showErrorDialog"
      :title="errorDialogTitle"
      :message="errorDialogMessage"
      :details="errorDialogDetails"
      @close="showErrorDialog = false"
    />
  </div>
</template>

<style scoped>
.VideoUpload {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 24px;
}

.VideoUpload__StepperHeader {
  display: flex;
  justify-content: space-between;
  margin-bottom: 32px;
  position: relative;
}

.VideoUpload__Step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  flex: 1;
}

.VideoUpload__StepNumber {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  font-weight: bold;
}

.VideoUpload__Step--active .VideoUpload__StepNumber {
  background-color: #FF9800;
  color: white;
}

.VideoUpload__Step--completed .VideoUpload__StepNumber {
  background-color: #4CAF50;
  color: white;
}

.VideoUpload__StepTitle {
  font-size: 14px;
  text-align: center;
}

.VideoUpload__StepConnector {
  position: absolute;
  top: 16px;
  right: -50%;
  width: 100%;
  height: 2px;
  background-color: #e0e0e0;
  z-index: -1;
}

.VideoUpload__Step--completed .VideoUpload__StepConnector {
  background-color: #4CAF50;
}

.VideoUpload__Content {
  min-height: 300px;
  margin-bottom: 24px;
}

.VideoUpload__StepContent {
  animation: fadeIn 0.3s ease-in-out;
}

.VideoUpload__Actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@media (max-width: 600px) {
  .VideoUpload {
    padding: 16px;
  }
  
  .VideoUpload__StepTitle {
    font-size: 12px;
  }
  
  .VideoUpload__StepNumber {
    width: 28px;
    height: 28px;
  }
}
</style>