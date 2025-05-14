<script setup lang="ts">
// --------------------------- Imports ---------------------------
import { ref, computed, reactive } from 'vue';
import FileUploadStep from './steps/Paso1SubirVideo.vue';
import VideoDetailsStep from './steps/Paso2DetallesVideo.vue';
import TimestampStep from './steps/Paso3SelectorMinutos.vue';
import SummaryStep from './steps/Paso4Resumen.vue';
import ErrorDialog from '../ErrorDialog.vue';
import VideoService from '@/services/VideoService';

// --------------------------- Variables ---------------------------
const emit = defineEmits(['upload-complete']);

const currentStep = ref(0);
const steps = ref([
  { title: 'Subir Video', completed: false },
  { title: 'Detalles', completed: false },
  { title: 'Marcadores', completed: false },
  { title: 'Finalizar', completed: false }
]);

const videoFile = ref(null);
const videoDetails = reactive({
  title: '',
  description: '',
  thumbnail: null
});
const timestamps = ref([]);
const uploading = ref(false);

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
    case 2:
      return true; // Timestamps are optional
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

const showSuccessMessage = (title, message) => {
  errorDialogTitle.value = title;
  errorDialogMessage.value = message;
  errorDialogDetails.value = '';
  showErrorDialog.value = true;
};

// Upload video method - Simplified without progress tracking
const uploadVideo = async () => {
  try {
    uploading.value = true;
    
    console.log('Iniciando proceso de subida...');
    console.log('Archivo de video:', videoFile.value?.name);
    console.log('Miniatura:', videoDetails.thumbnail?.name || 'Sin miniatura');
    
    // Use the service to upload the video (simplified)
    const result = await VideoService.uploadCompleteVideo(
      videoFile.value,
      videoDetails,
      videoDetails.thumbnail,
      timestamps.value
    );
    
    console.log('Subida completada correctamente:', result);
    
    emit('upload-complete', result);
    
    // Reset form after a delay
    setTimeout(() => {
      uploading.value = false;
      resetForm();
      
      // Show success message
      showSuccessMessage('Video publicado con éxito', 
        'Tu video ha sido subido y está disponible para su visualización.');
    }, 1000);
    
  } catch (error) {
    console.error('Error completo al subir el video:', error);
    uploading.value = false;
    
    // Show detailed error dialog
    showError(error);
  }
};

// Method to handle step navigation from child components
const handleGoToStep = (stepIndex) => {
  if (stepIndex >= 0 && stepIndex < steps.value.length) {
    currentStep.value = stepIndex;
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

      <!-- Step 3: Timestamp Markers -->
      <div v-if="currentStep === 2" class="VideoUpload__StepContent">
        <timestamp-step 
          @timestamps-updated="handleTimestampsUpdate" 
          :videoFile="videoFile" 
          :timestamps="timestamps" 
        />
      </div>

      <!-- Step 4: Summary and Finalize -->
      <div v-if="currentStep === 3" class="VideoUpload__StepContent">
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
      <v-btn
        v-if="currentStep < steps.length - 1"
        variant="elevated"
        color="primary"
        @click="nextStep"
        :disabled="!canProceed || uploading"
      >
        Siguiente
      </v-btn>
    </div>
    
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