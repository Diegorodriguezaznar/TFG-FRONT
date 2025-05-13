<!-- 
SummaryStep.vue - Componente para el cuarto paso: resumen y finalización 
-->
<template>
    <div class="summary-step">
      <h2>Resumen del video</h2>
      <p class="subtitle">Revisa los detalles de tu video antes de publicarlo</p>
  
      <div v-if="!videoFile" class="no-video-warning">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 9V14M12 21.41H5.94C2.47 21.41 1.02 18.93 2.7 15.9L5.82 10.28L8.76 5.01C10.54 1.79 13.46 1.79 15.24 5.01L18.18 10.29L21.3 15.9C22.98 18.93 21.52 21.41 18.06 21.41H12Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M11.995 17H12.004" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <p>No se ha seleccionado ningún video. Por favor, regresa al primer paso y sube un archivo de video.</p>
        <button class="btn-primary" @click="goToFirstStep">Ir al paso 1</button>
      </div>
  
      <div v-else class="summary-container">
        <div class="summary-header">
          <div class="video-thumbnail">
            <img 
              v-if="videoDetails.thumbnail && thumbnailUrl" 
              :src="thumbnailUrl" 
              alt="Miniatura del video" 
              class="thumbnail-preview"
            >
            <div v-else class="placeholder-thumbnail">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M9.1001 12V10.5C9.1001 8.5 10.6001 7.6 12.4001 8.7L13.7001 9.4L15.0001 10.1C16.8001 11.2 16.8001 12.9 15.0001 14L13.7001 14.7L12.4001 15.4C10.6001 16.4 9.1001 15.5 9.1001 13.6V12Z" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <p>No se ha seleccionado una miniatura</p>
            </div>
          </div>
  
          <div class="video-meta">
            <h3 class="video-title">{{ videoDetails.title || 'Sin título' }}</h3>
            <p class="video-info">
              <span class="video-filename">{{ videoFile.name }}</span> | 
              <span class="video-size">{{ formatFileSize(videoFile.size) }}</span>
            </p>
            <div class="video-description">
              <p v-if="videoDetails.description">{{ videoDetails.description }}</p>
              <p v-else class="empty-value">Sin descripción</p>
            </div>
          </div>
        </div>
  
        <div class="summary-section timestamps-summary">
          <h4 class="section-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2C17.52 2 22 6.48 22 12Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M15.71 15.18L12.61 13.33C12.07 13.01 11.63 12.24 11.63 11.61V7.51001" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Marcadores de tiempo
          </h4>
          
          <div v-if="timestamps.length === 0" class="empty-section">
            <p>No se han agregado marcadores de tiempo</p>
          </div>
          
          <div v-else class="timestamps-list">
            <div v-for="(timestamp, index) in timestamps" :key="timestamp.id" class="timestamp-item">
              <div class="timestamp-time">{{ formatTime(timestamp.time) }}</div>
              <div class="timestamp-title">{{ timestamp.title }}</div>
            </div>
          </div>
        </div>
  
        <div class="upload-section">
          <button 
            class="btn-upload" 
            @click="handleUpload" 
            :disabled="uploading || !isReadyToUpload"
          >
            <svg v-if="!uploading" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 17V11L7 13M9 11L11 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M22 10V15C22 20 20 22 15 22H9C4 22 2 20 2 15V9C2 4 4 2 9 2H14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M22 10H18C15 10 14 9 14 6V2L22 10Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span v-if="!uploading">Publicar video</span>
            <span v-else>Publicando... {{ uploadProgress }}%</span>
          </button>
          
          <div v-if="uploading" class="upload-progress">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: uploadProgress + '%' }"></div>
            </div>
          </div>
  
          <p class="upload-note">
            Al hacer clic en "Publicar video", tu contenido se subirá y estará disponible para su visualización.
          </p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'SummaryStep',
    props: {
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
      },
      uploadProgress: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        thumbnailUrl: null
      };
    },
    computed: {
      isReadyToUpload() {
        return (
          this.videoFile &&
          this.videoDetails.title &&
          this.videoDetails.title.trim() !== ''
        );
      }
    },
    watch: {
      'videoDetails.thumbnail': {
        handler(newThumbnail) {
          if (newThumbnail) {
            this.createThumbnailPreview(newThumbnail);
          } else {
            this.clearThumbnailUrl();
          }
        },
        immediate: true
      }
    },
    methods: {
      createThumbnailPreview(file) {
        this.clearThumbnailUrl();
        this.thumbnailUrl = URL.createObjectURL(file);
      },
      clearThumbnailUrl() {
        if (this.thumbnailUrl) {
          URL.revokeObjectURL(this.thumbnailUrl);
          this.thumbnailUrl = null;
        }
      },
      formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
      },
      formatTime(seconds) {
        if (isNaN(seconds)) return '00:00';
        
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        
        if (hours > 0) {
          return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        } else {
          return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
      },
      handleUpload() {
        if (this.isReadyToUpload && !this.uploading) {
          this.$emit('upload-video');
        }
      },
      goToFirstStep() {
        this.$parent.currentStep = 0;
      }
    },
    beforeUnmount() {
      this.clearThumbnailUrl();
    }
  };
  </script>
  
  <style scoped>
  .summary-step {
    width: 100%;
  }
  
  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #202124;
  }
  
  h3 {
    font-size: 1.2rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
    color: #202124;
  }
  
  h4 {
    font-size: 1.1rem;
    font-weight: 500;
    margin-bottom: 0.75rem;
    color: #202124;
    display: flex;
    align-items: center;
  }
  
  h4 svg {
    margin-right: 0.5rem;
  }
  
  .subtitle {
    color: #5f6368;
    margin-bottom: 2rem;
  }
  
  .no-video-warning {
    text-align: center;
    padding: 3rem;
    background-color: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #dadce0;
    color: #5f6368;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .no-video-warning svg {
    margin-bottom: 1rem;
    color: #ea4335;
  }
  
  .btn-primary {
    background-color: #4285f4;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
    margin-top: 1rem;
    transition: background-color 0.2s ease;
  }
  
  .btn-primary:hover {
    background-color: #3367d6;
  }
  
  .summary-container {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
  
  .summary-header {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 2rem;
    padding: 1.5rem;
    background-color: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #dadce0;
  }
  
  .video-thumbnail {
    aspect-ratio: 16/9;
    overflow: hidden;
    border-radius: 8px;
    background-color: #e0e0e0;
  }
  
  .thumbnail-preview {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .placeholder-thumbnail {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #5f6368;
    text-align: center;
    padding: 1rem;
  }
  
  .video-meta {
    display: flex;
    flex-direction: column;
  }
  
  .video-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin-top: 0;
    margin-bottom: 0.5rem;
  }
  
  .video-info {
    color: #5f6368;
    font-size: 0.9rem;
    margin-bottom: 1rem;
  }
  
  .video-description {
    background-color: white;
    border-radius: 4px;
    padding: 1rem;
    border: 1px solid #dadce0;
    flex: 1;
    overflow-y: auto;
    max-height: 150px;
  }
  
  .empty-value {
    color: #9aa0a6;
    font-style: italic;
  }
  
  .summary-section {
    padding: 1.5rem;
    background-color: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #dadce0;
  }
  
  .section-title {
    margin-top: 0;
  }
  
  .empty-section {
    text-align: center;
    color: #5f6368;
    padding: 1.5rem 0;
  }
  
  .timestamps-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    max-height: 200px;
    overflow-y: auto;
  }
  
  .timestamp-item {
    display: flex;
    align-items: center;
    padding: 0.75rem;
    background-color: white;
    border-radius: 4px;
    border: 1px solid #dadce0;
  }
  
  .timestamp-time {
    min-width: 70px;
    font-family: monospace;
    color: #4285f4;
    font-weight: 500;
    margin-right: 1rem;
  }
  
  .timestamp-title {
    flex: 1;
  }
  
  .upload-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
    background-color: white;
    border-radius: 8px;
    border: 1px solid #dadce0;
    text-align: center;
  }
  
  .btn-upload {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    background-color: #34a853;
    color: white;
    border: none;
    padding: 1rem 2rem;
    border-radius: 4px;
    font-weight: 500;
    font-size: 1.1rem;
    cursor: pointer;
    transition: background-color 0.2s ease;
    min-width: 200px;
  }
  
  .btn-upload:hover {
    background-color: #2d9249;
  }
  
  .btn-upload:disabled {
    background-color: #a8d5b9;
    cursor: not-allowed;
  }
  
  .upload-progress {
    width: 100%;
    max-width: 400px;
    margin-top: 1.5rem;
  }
  
  .progress-bar {
    width: 100%;
    height: 8px;
    background-color: #e0e0e0;
    border-radius: 4px;
    overflow: hidden;
  }
  
  .progress-fill {
    height: 100%;
    background-color: #34a853;
    transition: width 0.3s ease;
  }
  
  .upload-note {
    margin-top: 1.5rem;
    color: #5f6368;
    font-size: 0.9rem;
    max-width: 500px;
  }
  
  @media (max-width: 768px) {
    .summary-header {
      grid-template-columns: 1fr;
    }
    
    .video-thumbnail {
      max-width: 100%;
      margin: 0 auto;
    }
  }
  </style>