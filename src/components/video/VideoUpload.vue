<!-- 
VideoUpload.vue - Componente principal corregido con paths adecuados 
-->
<template>
    <div class="video-upload-container">
      <div class="stepper-header">
        <div 
          v-for="(step, index) in steps" 
          :key="index" 
          class="step" 
          :class="{ 'active': currentStep === index, 'completed': currentStep > index }"
        >
          <div class="step-number">
            <span v-if="currentStep > index">✓</span>
            <span v-else>{{ index + 1 }}</span>
          </div>
          <div class="step-title">{{ step.title }}</div>
          <div class="step-connector" v-if="index < steps.length - 1"></div>
        </div>
      </div>
  
      <div class="stepper-content">
        <!-- Step 1: Upload Video File -->
        <div v-if="currentStep === 0" class="step-content">
          <file-upload-step 
            @file-selected="handleFileSelection" 
            :selectedFile="videoFile" 
            :uploading="uploading"
            :uploadProgress="uploadProgress"
          />
        </div>
  
        <!-- Step 2: Video Details -->
        <div v-if="currentStep === 1" class="step-content">
          <video-details-step 
            @details-updated="handleDetailsUpdate" 
            :videoDetails="videoDetails" 
          />
        </div>
  
        <!-- Step 3: Timestamp Markers -->
        <div v-if="currentStep === 2" class="step-content">
          <timestamp-step 
            @timestamps-updated="handleTimestampsUpdate" 
            :videoFile="videoFile" 
            :timestamps="timestamps" 
          />
        </div>
  
        <!-- Step 4: Summary and Finalize -->
        <div v-if="currentStep === 3" class="step-content">
          <summary-step 
            :videoFile="videoFile" 
            :videoDetails="videoDetails" 
            :timestamps="timestamps" 
            :uploading="uploading"
            :uploadProgress="uploadProgress"
            @upload-video="uploadVideo"
          />
        </div>
      </div>
  
      <div class="stepper-actions">
        <button 
          v-if="currentStep > 0" 
          class="btn btn-secondary" 
          @click="prevStep"
          :disabled="uploading"
        >
          Anterior
        </button>
        <button 
          v-if="currentStep < steps.length - 1" 
          class="btn btn-primary" 
          @click="nextStep"
          :disabled="!canProceed || uploading"
        >
          Siguiente
        </button>
      </div>
    </div>
  </template>
  
  <script>
  // Importación correcta de los componentes
  import FileUploadStep from './steps/FileUploadStep.vue';
  import VideoDetailsStep from './steps/VideoDetailsStep.vue';
  import TimestampStep from './steps/TimestampStep.vue';
  import SummaryStep from './steps/SummaryStep.vue';
  // Importación del servicio
  import VideoService from '../../services/VideoService.js';
  
  export default {
    name: 'VideoUpload',
    components: {
      FileUploadStep,
      VideoDetailsStep,
      TimestampStep,
      SummaryStep
    },
    data() {
      return {
        currentStep: 0,
        steps: [
          { title: 'Subir Video', completed: false },
          { title: 'Detalles', completed: false },
          { title: 'Marcadores', completed: false },
          { title: 'Finalizar', completed: false }
        ],
        videoFile: null,
        videoDetails: {
          title: '',
          description: '',
          thumbnail: null
        },
        timestamps: [],
        uploading: false,
        uploadProgress: 0
      };
    },
    computed: {
      canProceed() {
        switch (this.currentStep) {
          case 0:
            return this.videoFile !== null;
          case 1:
            return this.videoDetails.title.trim() !== '' && this.videoDetails.thumbnail !== null;
          case 2:
            return true; // Timestamps are optional
          default:
            return true;
        }
      }
    },
    methods: {
      nextStep() {
        if (this.currentStep < this.steps.length - 1 && this.canProceed) {
          this.steps[this.currentStep].completed = true;
          this.currentStep++;
        }
      },
      prevStep() {
        if (this.currentStep > 0) {
          this.currentStep--;
        }
      },
      handleFileSelection(file) {
        this.videoFile = file;
      },
      handleDetailsUpdate(details) {
        this.videoDetails = { ...details };
      },
      handleTimestampsUpdate(newTimestamps) {
        this.timestamps = [...newTimestamps];
      },
      async uploadVideo() {
        try {
          this.uploading = true;
          this.uploadProgress = 0;
          
          // Usar el servicio para subir el video
          const result = await VideoService.uploadCompleteVideo(
            this.videoFile,
            this.videoDetails,
            this.videoDetails.thumbnail,
            this.timestamps,
            (progress) => {
              this.uploadProgress = progress;
            }
          );
          
          this.uploadProgress = 100;
          this.$emit('upload-complete', result);
          
          // Reset form after a delay
          setTimeout(() => {
            this.uploading = false;
            this.resetForm();
          }, 1000);
          
        } catch (error) {
          console.error('Error uploading video:', error);
          this.uploading = false;
          // Show error notification
          alert('Ha ocurrido un error al subir el video. Por favor, inténtalo de nuevo.');
        }
      },
      resetForm() {
        this.currentStep = 0;
        this.videoFile = null;
        this.videoDetails = {
          title: '',
          description: '',
          thumbnail: null
        };
        this.timestamps = [];
        this.steps.forEach(step => step.completed = false);
      }
    }
  };
  </script>
  
  <style scoped>
  .video-upload-container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 2rem;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .stepper-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 2rem;
  }
  
  .step {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    flex: 1;
  }
  
  .step-number {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: #e0e0e0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    margin-bottom: 8px;
    transition: all 0.3s ease;
  }
  
  .step.active .step-number {
    background-color: #4285f4;
    color: white;
  }
  
  .step.completed .step-number {
    background-color: #34a853;
    color: white;
  }
  
  .step-title {
    font-size: 14px;
    color: #5f6368;
    text-align: center;
  }
  
  .step.active .step-title,
  .step.completed .step-title {
    color: #202124;
    font-weight: 500;
  }
  
  .step-connector {
    position: absolute;
    top: 18px;
    right: -50%;
    width: 100%;
    height: 2px;
    background-color: #e0e0e0;
    z-index: -1;
  }
  
  .step.completed .step-connector {
    background-color: #34a853;
  }
  
  .stepper-content {
    min-height: 400px;
    margin-bottom: 2rem;
  }
  
  .stepper-actions {
    display: flex;
    justify-content: space-between;
  }
  
  .btn {
    padding: 10px 24px;
    border: none;
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .btn-primary {
    background-color: #4285f4;
    color: white;
  }
  
  .btn-primary:hover {
    background-color: #3367d6;
  }
  
  .btn-primary:disabled {
    background-color: #c5d0e6;
    cursor: not-allowed;
  }
  
  .btn-secondary {
    background-color: #f1f3f4;
    color: #5f6368;
  }
  
  .btn-secondary:hover {
    background-color: #e8eaed;
  }
  
  .btn-secondary:disabled {
    color: #9aa0a6;
    cursor: not-allowed;
  }
  
  .step-content {
    animation: fadeIn 0.3s ease;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  </style>