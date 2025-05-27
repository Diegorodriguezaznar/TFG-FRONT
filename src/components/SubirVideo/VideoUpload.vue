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

const currentStep = ref(0);
const isMarkersMode = ref(false);
const uploading = ref(false);
const uploadedVideoData = ref(null);

const currentCourseId = computed(() => {
  let id = null;
  
  if (route.params.idCurso) {
    id = Number(route.params.idCurso);
  } else if (route.params.id) {
    id = Number(route.params.id);
  } else if (route.params.courseId) {
    id = Number(route.params.courseId);
  }
  
  return id;
});

const videoFile = ref(null);
const videoDetails = reactive({
  title: '',
  description: '',
  thumbnail: null,
  courseId: currentCourseId.value,
  subjectId: null
});
const timestamps = ref([]);

const showMarkerDialog = ref(false);
const showErrorDialog = ref(false);
const errorMessage = ref('');

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

const nextStep = () => {
  if (currentStep.value < 2 && canProceed.value) {
    currentStep.value++;
  }
};

const prevStep = () => {
  if (currentStep.value > 0 && !isMarkersMode.value) {
    currentStep.value--;
  }
};

const handleFileSelection = (file) => {
  videoFile.value = file;
};

const handleDetailsUpdate = (details) => {
  Object.assign(videoDetails, details);
  videoDetails.courseId = currentCourseId.value;
};

const handleTimestampsUpdate = (newTimestamps) => {
  timestamps.value = [...newTimestamps];
};

const uploadVideo = async () => {
  try {
    uploading.value = true;
    
    const result = await VideoService.uploadCompleteVideo(
      videoFile.value,
      videoDetails,
      videoDetails.thumbnail,
      []
    );
    
    uploadedVideoData.value = result;
    emit('upload-complete', result);
    
    setTimeout(() => {
      uploading.value = false;
      showMarkerDialog.value = true;
    }, 1000);
    
  } catch (error) {
    uploading.value = false;
    errorMessage.value = error.message || 'Error al subir el video';
    showErrorDialog.value = true;
  }
};

const handleMarkerDecision = (addMarkers) => {
  showMarkerDialog.value = false;
  
  if (addMarkers) {
    isMarkersMode.value = true;
    currentStep.value = 3;
  } else {
    router.push(`/cursos`);
    resetForm();
  }
};

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

watch(currentCourseId, (newCourseId) => {
  videoDetails.courseId = newCourseId;
}, { immediate: true });

onMounted(() => {
  if (!currentCourseId.value) {
    router.push('/cursos');
  }
});
</script>

<template>
  <div class="VideoUpload">
    <div class="VideoUpload__header">
      <div 
        v-for="(step, index) in steps" 
        :key="index"
        class="VideoUpload__step"
        :class="{ 
          'VideoUpload__step--activo': currentStep === index && !isMarkersMode, 
          'VideoUpload__step--completado': step.completed,
          'VideoUpload__step--marcadores': isMarkersMode && index === 3
        }"
      >
        <div class="VideoUpload__numero">
          <span v-if="step.completed">✓</span>
          <span v-else>{{ index + 1 }}</span>
        </div>
        <span class="VideoUpload__titulo-paso">{{ step.title }}</span>
      </div>
    </div>

    <div class="VideoUpload__contenido">
      <FileUploadStep 
        v-if="currentStep === 0"
        :selected-file="videoFile"
        :uploading="uploading"
        @file-selected="handleFileSelection"
      />

      <VideoDetailsStep 
        v-if="currentStep === 1"
        :video-details="videoDetails"
        :id-curso="currentCourseId"
        @details-updated="handleDetailsUpdate"
      />

      <SummaryStep 
        v-if="currentStep === 2"
        :video-file="videoFile"
        :video-details="videoDetails"
        :uploading="uploading"
        @upload-video="uploadVideo"
      />

      <TimestampStep 
        v-if="currentStep === 3 && isMarkersMode"
        :video-file="videoFile"
        :timestamps="timestamps"
        @timestamps-updated="handleTimestampsUpdate"
      />
    </div>

    <div class="VideoUpload__acciones">
      <template v-if="!isMarkersMode">
        <v-btn 
          v-if="currentStep > 0"
          variant="outlined" 
          @click="prevStep"
          :disabled="uploading"
          class="VideoUpload__boton"
        >
          Anterior
        </v-btn>
        
        <v-btn 
          v-if="currentStep < 2"
          color="primary" 
          @click="nextStep"
          :disabled="!canProceed || uploading"
          class="VideoUpload__boton"
        >
          Siguiente
        </v-btn>
      </template>

      <template v-if="isMarkersMode && currentStep === 3">
        <v-btn 
          variant="outlined"
          @click="finishWithoutMarkers"
          :disabled="uploading"
          class="VideoUpload__boton"
        >
          Salir sin guardar
        </v-btn>
        
        <v-btn 
          color="success"
          @click="saveTimestamps"
          :disabled="uploading"
          :loading="uploading"
          class="VideoUpload__boton"
        >
          Guardar marcadores
        </v-btn>
      </template>
    </div>

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

<style lang="scss" scoped>
@import "@/assets/sass/components/SubirVideo/VideoUpload";
</style>