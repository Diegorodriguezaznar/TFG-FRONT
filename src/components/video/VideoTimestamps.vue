<!-- 
VideoTimestamps.vue - Componente para mostrar los marcadores de tiempo en la página de reproducción
-->
<template>
    <div class="video-timestamps">
      <div class="timestamps-header">
        <h3 class="timestamps-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2C17.52 2 22 6.48 22 12Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M15.71 15.18L12.61 13.33C12.07 13.01 11.63 12.24 11.63 11.61V7.51001" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Marcadores de tiempo
        </h3>
      </div>
  
      <div v-if="!timestamps || timestamps.length === 0" class="no-timestamps">
        <p>No hay marcadores de tiempo disponibles</p>
      </div>
  
      <div v-else class="timestamps-list">
        <div 
          v-for="(timestamp, index) in timestamps" 
          :key="index"
          class="timestamp-item"
          :class="{ 'active': isCurrentTimestamp(timestamp) }"
          @click="seekToTime(timestamp.time)"
        >
          <div class="timestamp-time">{{ formatTime(timestamp.time) }}</div>
          <div class="timestamp-title">{{ timestamp.title }}</div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'VideoTimestamps',
    props: {
      timestamps: {
        type: Array,
        default: () => []
      },
      currentTime: {
        type: Number,
        default: 0
      }
    },
    methods: {
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
      seekToTime(time) {
        this.$emit('seek', time);
      },
      isCurrentTimestamp(timestamp) {
        // Encuentra el timestamp activo basado en el tiempo actual
        if (this.timestamps.length === 0) return false;
        
        // Si es el último timestamp y estamos después de él
        if (timestamp === this.timestamps[this.timestamps.length - 1]) {
          return this.currentTime >= timestamp.time;
        }
        
        // Encuentra el índice del timestamp actual
        const index = this.timestamps.findIndex(t => t === timestamp);
        const nextTimestamp = this.timestamps[index + 1];
        
        // Está activo si el tiempo actual está entre este timestamp y el siguiente
        return this.currentTime >= timestamp.time && 
               (nextTimestamp ? this.currentTime < nextTimestamp.time : true);
      }
    }
  };
  </script>
  
  <style scoped>
  .video-timestamps {
    width: 100%;
    border: 1px solid #dadce0;
    border-radius: 8px;
    background-color: white;
    overflow: hidden;
  }
  
  .timestamps-header {
    padding: 1rem;
    border-bottom: 1px solid #dadce0;
    background-color: #f8f9fa;
  }
  
  .timestamps-title {
    margin: 0;
    font-size: 1.1rem;
    color: #202124;
    font-weight: 500;
    display: flex;
    align-items: center;
  }
  
  .timestamps-title svg {
    margin-right: 0.5rem;
    color: #4285f4;
  }
  
  .no-timestamps {
    padding: 2rem;
    text-align: center;
    color: #5f6368;
  }
  
  .timestamps-list {
    max-height: 400px;
    overflow-y: auto;
  }
  
  .timestamp-item {
    display: flex;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #f1f3f4;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .timestamp-item:last-child {
    border-bottom: none;
  }
  
  .timestamp-item:hover {
    background-color: #f1f3f4;
  }
  
  .timestamp-item.active {
    background-color: #e8f0fe;
    border-left: 3px solid #4285f4;
  }
  
  .timestamp-time {
    font-family: monospace;
    color: #4285f4;
    font-weight: 500;
    margin-right: 1rem;
    min-width: 56px;
  }
  
  .timestamp-title {
    flex: 1;
    color: #202124;
    word-break: break-word;
  }
  
  @media (max-width: 768px) {
    .timestamps-list {
      max-height: 250px;
    }
  }
  </style>