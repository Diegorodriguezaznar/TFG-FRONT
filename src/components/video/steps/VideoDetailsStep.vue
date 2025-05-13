<!-- 
VideoDetailsStep.vue - Componente para el segundo paso: detalles del video 
-->
<template>
    <div class="video-details-step">
      <h2>Detalles del video</h2>
      <p class="subtitle">Añade información sobre tu video para ayudar a los espectadores a encontrarlo</p>
  
      <div class="form-container">
        <div class="preview-and-thumbnail">
          <div class="video-preview-container">
            <h3>Vista previa</h3>
            <div class="video-preview-placeholder">
              <img v-if="thumbnailPreview" :src="thumbnailPreview" alt="Vista previa de miniatura" class="thumbnail-preview">
              <div v-else class="empty-preview">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 9.5L9 14.5M9 9.5L15 14.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="1.5"/>
                </svg>
                <span>No hay miniatura seleccionada</span>
              </div>
            </div>
          </div>
  
          <div class="thumbnail-upload">
            <h3>Miniatura</h3>
            <div 
              class="thumbnail-drop-area" 
              :class="{ 'has-thumbnail': details.thumbnail, 'dragging': isDragging }"
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="handleThumbnailDrop"
              @click="triggerThumbnailInput"
            >
              <input 
                type="file" 
                ref="thumbnailInput" 
                class="file-input" 
                accept="image/*" 
                @change="handleThumbnailInput"
              >
              
              <div v-if="!details.thumbnail" class="thumbnail-placeholder">
                <div class="upload-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 16L8.586 11.414C8.96106 11.0391 9.46967 10.8284 10 10.8284C10.5303 10.8284 11.0389 11.0391 11.414 11.414L16 16M14 14L15.586 12.414C15.9611 12.0391 16.4697 11.8284 17 11.8284C17.5303 11.8284 18.0389 12.0391 18.414 12.414L20 14M14 8H14.01M6 20H18C19.1046 20 20 19.1046 20 18V6C20 4.89543 19.1046 4 18 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <div class="upload-text">
                  <div>Subir miniatura</div>
                  <div class="secondary-text">Arrastra una imagen o haz clic para seleccionar</div>
                </div>
              </div>
  
              <div v-else class="thumbnail-preview-container">
                <img :src="thumbnailPreview" alt="Miniatura" class="thumbnail-img">
                <button class="remove-thumbnail-btn" @click.stop="removeThumbnail">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </button>
              </div>
            </div>
            <div class="thumbnail-requirements">
              Imagen JPG, PNG o GIF (recomendado: 1280x720, máx. 2MB)
            </div>
          </div>
        </div>
  
        <div class="form-fields">
          <div class="form-group">
            <label for="title" class="form-label">Título <span class="required">*</span></label>
            <input 
              type="text" 
              id="title" 
              v-model="details.title" 
              class="form-input" 
              maxlength="100" 
              placeholder="Añade un título descriptivo"
              @input="emitUpdate"
            >
            <div class="character-count" :class="{ 'limit-near': details.title.length > 80 }">
              {{ details.title.length }}/100
            </div>
          </div>
  
          <div class="form-group">
            <label for="description" class="form-label">Descripción</label>
            <textarea 
              id="description" 
              v-model="details.description" 
              class="form-textarea" 
              maxlength="5000" 
              placeholder="Cuéntale a los espectadores sobre tu video"
              rows="6"
              @input="emitUpdate"
            ></textarea>
            <div class="character-count" :class="{ 'limit-near': details.description.length > 4800 }">
              {{ details.description.length }}/5000
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'VideoDetailsStep',
    props: {
      videoDetails: {
        type: Object,
        default: () => ({
          title: '',
          description: '',
          thumbnail: null
        })
      }
    },
    data() {
      return {
        details: {
          title: this.videoDetails.title || '',
          description: this.videoDetails.description || '',
          thumbnail: this.videoDetails.thumbnail || null
        },
        thumbnailPreview: null,
        isDragging: false
      };
    },
    watch: {
      videoDetails: {
        handler(newDetails) {
          this.details = { ...newDetails };
          if (newDetails.thumbnail) {
            this.createThumbnailPreview(newDetails.thumbnail);
          } else {
            this.thumbnailPreview = null;
          }
        },
        deep: true
      }
    },
    mounted() {
      if (this.details.thumbnail) {
        this.createThumbnailPreview(this.details.thumbnail);
      }
    },
    methods: {
      triggerThumbnailInput() {
        this.$refs.thumbnailInput.click();
      },
      handleThumbnailInput(event) {
        const file = event.target.files[0];
        if (file && this.isValidImageFile(file)) {
          this.updateThumbnail(file);
        } else if (file) {
          alert('Por favor, selecciona una imagen válida para la miniatura.');
        }
      },
      handleThumbnailDrop(event) {
        this.isDragging = false;
        const file = event.dataTransfer.files[0];
        
        if (file && this.isValidImageFile(file)) {
          this.updateThumbnail(file);
        } else if (file) {
          alert('Por favor, arrastra una imagen válida para la miniatura.');
        }
      },
      isValidImageFile(file) {
        return file.type.startsWith('image/');
      },
      updateThumbnail(file) {
        // Update thumbnail
        this.details.thumbnail = file;
        this.createThumbnailPreview(file);
        this.emitUpdate();
      },
      removeThumbnail(event) {
        event.stopPropagation();
        this.details.thumbnail = null;
        
        if (this.thumbnailPreview) {
          URL.revokeObjectURL(this.thumbnailPreview);
          this.thumbnailPreview = null;
        }
        
        this.emitUpdate();
      },
      createThumbnailPreview(file) {
        // Clean up previous URL if it exists
        if (this.thumbnailPreview) {
          URL.revokeObjectURL(this.thumbnailPreview);
        }
        
        // Create a new URL for thumbnail preview
        this.thumbnailPreview = URL.createObjectURL(file);
      },
      emitUpdate() {
        this.$emit('details-updated', { ...this.details });
      }
    },
    beforeUnmount() {
      // Clean up any object URLs to prevent memory leaks
      if (this.thumbnailPreview) {
        URL.revokeObjectURL(this.thumbnailPreview);
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