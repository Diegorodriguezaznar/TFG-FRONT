<!-- 
FileUploadStep.vue - Componente para el primer paso: subir archivo de video 
-->
<template>
    <div class="file-upload-step">
      <h2>Sube tu video</h2>
      <p class="subtitle">Comienza a compartir tu contenido subiendo un archivo de video</p>
  
      <div 
        class="upload-area" 
        :class="{ 'has-file': selectedFile, 'dragging': isDragging, 'uploading': uploading }"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="handleFileDrop"
        @click="triggerFileInput"
      >
        <input 
          type="file" 
          ref="fileInput" 
          class="file-input" 
          accept="video/*" 
          @change="handleFileInput"
        >
        
        <div v-if="!selectedFile && !uploading" class="upload-placeholder">
          <div class="upload-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 7V17M7 12H17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
          <div class="upload-text">
            <div class="primary-text">Arrastra y suelta tu video aquí</div>
            <div class="secondary-text">o haz clic para seleccionar un archivo</div>
          </div>
          <div class="file-types">Formatos aceptados: MP4, MOV, AVI, WMV, etc.</div>
        </div>
  
        <div v-else-if="selectedFile && !uploading" class="file-preview">
          <video 
            v-if="videoUrl" 
            class="video-preview" 
            :src="videoUrl" 
            controls
          ></video>
          
          <div class="file-info">
            <div class="file-name">{{ selectedFile.name }}</div>
            <div class="file-size">{{ formatFileSize(selectedFile.size) }}</div>
            <div class="file-type">{{ selectedFile.type }}</div>
          </div>
          
          <button class="remove-file-btn" @click.stop="removeFile">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
  
        <div v-if="uploading" class="upload-progress">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: uploadProgress + '%' }"></div>
          </div>
          <div class="progress-text">{{ uploadProgress }}% completado</div>
        </div>
      </div>
  
      <div class="upload-requirements">
        <h3>Requisitos:</h3>
        <ul>
          <li>Solo se aceptan archivos de video</li>
          <li>Tamaño máximo: 2GB</li>
          <li>Duración máxima: 60 minutos</li>
          <li>Resolución recomendada: 1080p o superior</li>
        </ul>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'FileUploadStep',
    props: {
      selectedFile: {
        type: Object,
        default: null
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
        isDragging: false,
        videoUrl: null
      };
    },
    watch: {
      selectedFile(newFile) {
        if (newFile) {
          this.createVideoPreview(newFile);
        } else {
          this.videoUrl = null;
        }
      }
    },
    mounted() {
      if (this.selectedFile) {
        this.createVideoPreview(this.selectedFile);
      }
    },
    methods: {
      triggerFileInput() {
        if (!this.selectedFile && !this.uploading) {
          this.$refs.fileInput.click();
        }
      },
      handleFileInput(event) {
        const file = event.target.files[0];
        if (file && this.isValidVideoFile(file)) {
          this.$emit('file-selected', file);
        } else if (file) {
          alert('Por favor, selecciona un archivo de video válido.');
        }
      },
      handleFileDrop(event) {
        this.isDragging = false;
        const file = event.dataTransfer.files[0];
        
        if (file && this.isValidVideoFile(file)) {
          this.$emit('file-selected', file);
        } else if (file) {
          alert('Por favor, arrastra un archivo de video válido.');
        }
      },
      isValidVideoFile(file) {
        // Check if the file is a video
        return file.type.startsWith('video/');
      },
      removeFile(event) {
        event.stopPropagation();
        this.$emit('file-selected', null);
        if (this.videoUrl) {
          URL.revokeObjectURL(this.videoUrl);
          this.videoUrl = null;
        }
      },
      createVideoPreview(file) {
        // Clean up previous URL if it exists
        if (this.videoUrl) {
          URL.revokeObjectURL(this.videoUrl);
        }
        
        // Create a new URL for video preview
        this.videoUrl = URL.createObjectURL(file);
      },
      formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
      }
    },
    beforeUnmount() {
      // Clean up any object URLs to prevent memory leaks
      if (this.videoUrl) {
        URL.revokeObjectURL(this.videoUrl);
      }
    }
  };
  </script>
  
  <style scoped>
  .video-details-step {
    width: 100%;
  }
  
  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #202124;
  }
  
  h3 {
    font-size: 1.1rem;
    font-weight: 500;
    margin-bottom: 0.75rem;
    color: #202124;
  }
  
  .subtitle {
    color: #5f6368;
    margin-bottom: 2rem;
  }
  
  .form-container {
    display: grid;
    grid-template-columns: 1fr 1.5fr;
    gap: 2rem;
  }
  
  .preview-and-thumbnail {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
  
  .video-preview-container, .thumbnail-upload {
    background-color: #f8f9fa;
    border-radius: 8px;
    padding: 1.5rem;
    border: 1px solid #dadce0;
  }
  
  .video-preview-placeholder {
    aspect-ratio: 16/9;
    background-color: #e0e0e0;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  
  .empty-preview {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #5f6368;
  }
  
  .thumbnail-preview {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .thumbnail-drop-area {
    border: 2px dashed #dadce0;
    border-radius: 8px;
    padding: 1.5rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s ease;
    background-color: #f8f9fa;
    position: relative;
    height: 180px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.5rem;
  }
  
  .thumbnail-drop-area:hover {
    border-color: #4285f4;
    background-color: rgba(66, 133, 244, 0.04);
  }
  
  .thumbnail-drop-area.dragging {
    border-color: #4285f4;
    background-color: rgba(66, 133, 244, 0.08);
  }
  
  .thumbnail-drop-area.has-thumbnail {
    border-style: solid;
    border-color: #34a853;
    background-color: rgba(52, 168, 83, 0.04);
  }
  
  .file-input {
    display: none;
  }
  
  .upload-icon {
    color: #5f6368;
    margin-bottom: 0.75rem;
  }
  
  .upload-text {
    color: #202124;
    font-weight: 500;
  }
  
  .secondary-text {
    font-size: 0.9rem;
    font-weight: normal;
    color: #5f6368;
    margin-top: 0.25rem;
  }
  
  .thumbnail-preview-container {
    position: relative;
    width: 100%;
    height: 100%;
  }
  
  .thumbnail-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 4px;
  }
  
  .remove-thumbnail-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    background-color: rgba(0, 0, 0, 0.6);
    color: white;
    border: none;
    border-radius: 50%;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .remove-thumbnail-btn:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }
  
  .thumbnail-requirements {
    font-size: 0.8rem;
    color: #5f6368;
    text-align: center;
  }
  
  .form-fields {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .form-group {
    position: relative;
  }
  
  .form-label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #202124;
  }
  
  .required {
    color: #ea4335;
  }
  
  .form-input, .form-textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #dadce0;
    border-radius: 4px;
    font-size: 1rem;
    transition: border-color 0.2s ease;
  }
  
  .form-input:focus, .form-textarea:focus {
    border-color: #4285f4;
    outline: none;
  }
  
  .form-textarea {
    resize: vertical;
    min-height: 120px;
  }
  
  .character-count {
    position: absolute;
    right: 0;
    margin-top: 0.25rem;
    font-size: 0.8rem;
    color: #5f6368;
  }
  
  .limit-near {
    color: #ea4335;
  }
  
  @media (max-width: 768px) {
    .form-container {
      grid-template-columns: 1fr;
    }
  }
  </style>
