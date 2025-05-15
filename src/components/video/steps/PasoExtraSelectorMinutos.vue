<!-- 
TimestampStep.vue - Componente corregido para el marcador de minutos
-->
<template>
    <div class="timestamp-step">
      <h2>Marcadores de tiempo</h2>
      <p class="subtitle">Añade marcadores para que los espectadores puedan navegar fácilmente por tu video</p>
  
      <div class="timestamp-container">
        <div class="video-player-container">
          <video 
            v-if="videoUrl" 
            ref="videoPlayer" 
            class="video-player" 
            :src="videoUrl" 
            controls
            @timeupdate="handleTimeUpdate"
          ></video>
          <div v-else class="video-placeholder">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M9.1001 12V10.5C9.1001 8.5 10.6001 7.6 12.4001 8.7L13.7001 9.4L15.0001 10.1C16.8001 11.2 16.8001 12.9 15.0001 14L13.7001 14.7L12.4001 15.4C10.6001 16.4 9.1001 15.5 9.1001 13.6V12Z" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>No hay video seleccionado</span>
          </div>
  
          <div class="current-time">
            <span>Tiempo actual: {{ formatTime(currentTime) }}</span>
            <button 
              class="capture-time-btn" 
              @click="captureCurrentTime"
              :disabled="!videoUrl || isAddingTimestamp"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 8V16M8 12H16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2"/>
              </svg>
              <span>Capturar este momento</span>
            </button>
          </div>
        </div>
  
        <div class="timestamp-editor">
          <div class="timestamp-header">
            <h3>Marcadores de tiempo</h3>
            <div class="timestamp-actions">
              <button 
                class="add-timestamp-btn" 
                @click="captureCurrentTime" 
                :disabled="!videoUrl || isAddingTimestamp"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 8V16M8 12H16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2"/>
                </svg>
                <span>Añadir marcador en {{ formatTime(currentTime) }}</span>
              </button>
            </div>
          </div>
  
          <div v-if="isAddingTimestamp" class="timestamp-form">
            <div class="timestamp-form-header">
              <div class="timestamp-time">{{ formatTime(newTimestamp.time) }}</div>
              <button class="close-form-btn" @click="cancelAddTimestamp">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </button>
            </div>
            <div class="form-group">
              <input 
                type="text" 
                v-model="newTimestamp.title" 
                class="form-input" 
                placeholder="Título del marcador" 
                maxlength="100"
                ref="timestampTitleInput"
              >
            </div>
            <div class="form-actions">
              <button class="btn-cancel" @click="cancelAddTimestamp">Cancelar</button>
              <button 
                class="btn-save" 
                @click="saveTimestamp" 
                :disabled="!newTimestamp.title.trim()"
              >
                Guardar
              </button>
            </div>
          </div>
  
          <div class="timestamps-list" :class="{ 'form-active': isAddingTimestamp }">
            <div v-if="localTimestamps.length === 0" class="no-timestamps">
              <p>Aún no has añadido ningún marcador de tiempo</p>
              <p class="small-text">Los marcadores ayudan a los espectadores a navegar por secciones específicas de tu video</p>
            </div>
  
            <div v-else>
              <div 
                v-for="(timestamp, index) in localTimestamps" 
                :key="timestamp.id" 
                class="timestamp-item"
              >
                <div class="drag-handle">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 6H16M8 12H16M8 18H16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </div>
                <div class="timestamp-time" @click="seekToTime(timestamp.time)">
                  {{ formatTime(timestamp.time) }}
                </div>
                <div class="timestamp-title">{{ timestamp.title }}</div>
                <div class="timestamp-item-actions">
                  <button class="edit-btn" @click="editTimestamp(timestamp, index)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11 4H4C2.89543 4 2 4.89543 2 6V20C2 21.1046 2.89543 22 4 22H18C19.1046 22 20 21.1046 20 20V13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M18.5 2.5C19.3284 1.67157 20.6716 1.67157 21.5 2.5C22.3284 3.32843 22.3284 4.67157 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                  <button class="delete-btn" @click="deleteTimestamp(index)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 7L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1378 21H7.86224C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 7M10 11V17M14 11V17M15 7V4C15 3.44772 14.5523 3 14 3H10C9.44772 3 9 3.44772 9 4V7M4 7H20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'TimestampStep',
    props: {
      videoFile: {
        type: Object,
        default: null
      },
      timestamps: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        videoUrl: null,
        currentTime: 0,
        localTimestamps: [],
        isAddingTimestamp: false,
        editingIndex: -1,
        newTimestamp: {
          id: '',
          time: 0,
          title: ''
        }
      };
    },
    watch: {
      videoFile: {
        handler(newFile) {
          if (newFile) {
            this.createVideoUrl(newFile);
          } else {
            this.clearVideoUrl();
          }
        },
        immediate: true
      },
      timestamps: {
        handler(newTimestamps) {
          this.localTimestamps = [...newTimestamps].map(timestamp => ({
            ...timestamp,
            id: timestamp.id || this.generateId()
          })).sort((a, b) => a.time - b.time);
        },
        immediate: true
      }
    },
    mounted() {
      // Inicializar el reproductor de video si hay un archivo
      if (this.videoFile) {
        this.createVideoUrl(this.videoFile);
      }
      
      // Inicializar los timestamps locales
      if (this.timestamps && this.timestamps.length > 0) {
        this.localTimestamps = [...this.timestamps].map(timestamp => ({
          ...timestamp,
          id: timestamp.id || this.generateId()
        })).sort((a, b) => a.time - b.time);
      }
      
      // Registrar el evento de actualización de tiempo
      window.addEventListener('keydown', this.handleKeyPress);
    },
    beforeUnmount() {
      this.clearVideoUrl();
      window.removeEventListener('keydown', this.handleKeyPress);
    },
    methods: {
      createVideoUrl(file) {
        // Clean up previous URL if it exists
        this.clearVideoUrl();
        
        // Create a new URL for video preview
        this.videoUrl = URL.createObjectURL(file);
      },
      clearVideoUrl() {
        if (this.videoUrl) {
          URL.revokeObjectURL(this.videoUrl);
          this.videoUrl = null;
        }
        this.currentTime = 0;
      },
      handleTimeUpdate(event) {
        // Actualizar el tiempo actual desde el elemento video
        if (this.$refs.videoPlayer) {
          this.currentTime = this.$refs.videoPlayer.currentTime;
        }
      },
      handleKeyPress(event) {
        // Permitir añadir marcadores con la tecla 'M'
        if (event.key === 'm' && this.videoUrl && !this.isAddingTimestamp) {
          this.captureCurrentTime();
        }
      },
      formatTime(seconds) {
        if (isNaN(seconds)) return '00:00';
        
        seconds = Math.floor(seconds);
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        
        if (hours > 0) {
          return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        } else {
          return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
      },
      captureCurrentTime() {
        // Solo permitir crear un timestamp si hay un video y no estamos ya añadiendo uno
        if (!this.videoUrl || this.isAddingTimestamp) return;
        
        // Pausar el video para facilitar la entrada de datos
        if (this.$refs.videoPlayer) {
          this.$refs.videoPlayer.pause();
        }
        
        // Establecer el modo de añadir timestamp
        this.isAddingTimestamp = true;
        this.editingIndex = -1;
        
        // Crear un nuevo timestamp con el tiempo actual
        this.newTimestamp = {
          id: this.generateId(),
          time: this.currentTime,
          title: ''
        };
        
        // Enfocar el campo de entrada después de renderizar
        this.$nextTick(() => {
          if (this.$refs.timestampTitleInput) {
            this.$refs.timestampTitleInput.focus();
          }
        });
      },
      cancelAddTimestamp() {
        this.isAddingTimestamp = false;
        this.editingIndex = -1;
        this.newTimestamp = {
          id: '',
          time: 0,
          title: ''
        };
      },
      saveTimestamp() {
        // Validar que hay un título
        if (!this.newTimestamp.title.trim()) return;
        
        // Crear un clon para evitar referencias
        const timestampToSave = { ...this.newTimestamp };
        
        if (this.editingIndex >= 0) {
          // Actualizar timestamp existente
          this.localTimestamps[this.editingIndex] = timestampToSave;
        } else {
          // Añadir nuevo timestamp
          this.localTimestamps.push(timestampToSave);
        }
        
        // Ordenar timestamps por tiempo
        this.localTimestamps.sort((a, b) => a.time - b.time);
        
        // Emitir evento con timestamps actualizados
        this.$emit('timestamps-updated', [...this.localTimestamps]);
        
        // Reiniciar el formulario
        this.cancelAddTimestamp();
        
        console.log('Timestamps guardados:', this.localTimestamps);
      },
      editTimestamp(timestamp, index) {
        this.isAddingTimestamp = true;
        this.editingIndex = index;
        
        // Clonar el timestamp para editarlo
        this.newTimestamp = { ...timestamp };
        
        // Enfocar el campo de título
        this.$nextTick(() => {
          if (this.$refs.timestampTitleInput) {
            this.$refs.timestampTitleInput.focus();
          }
        });
      },
      deleteTimestamp(index) {
        if (confirm('¿Estás seguro de que deseas eliminar este marcador de tiempo?')) {
          // Eliminar el timestamp del array
          this.localTimestamps.splice(index, 1);
          
          // Emitir evento con timestamps actualizados
          this.$emit('timestamps-updated', [...this.localTimestamps]);
        }
      },
      seekToTime(time) {
        // Ir al tiempo indicado en el reproductor
        if (this.$refs.videoPlayer && this.videoUrl) {
          this.$refs.videoPlayer.currentTime = time;
          this.$refs.videoPlayer.play();
        }
      },
      generateId() {
        return 'timestamp-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
      }
    }
  };
  </script>
  
  <style scoped>
     @import "@/assets/sass/video/TimestampStep.scss";
  </style>