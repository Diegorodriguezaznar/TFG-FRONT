<script setup lang="ts">
// --------------------------- Imports ---------------------------
import { computed } from 'vue';

// --------------------------- Props y Emits ---------------------------
const props = defineProps({
  timestamps: {
    type: Array,
    default: () => []
  },
  currentTime: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['seek']);

// --------------------------- Métodos ---------------------------
const formatTime = (seconds) => {
  if (isNaN(seconds)) return '00:00';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  } else {
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
};

const seekToTime = (time) => {
  emit('seek', time);
};

const isCurrentTimestamp = (timestamp) => {
  // Encuentra el timestamp activo basado en el tiempo actual
  if (props.timestamps.length === 0) return false;
  
  // Si es el último timestamp y estamos después de él
  if (timestamp === props.timestamps[props.timestamps.length - 1]) {
    return props.currentTime >= timestamp.time;
  }
  
  // Encuentra el índice del timestamp actual
  const index = props.timestamps.findIndex(t => t === timestamp);
  const nextTimestamp = props.timestamps[index + 1];
  
  // Está activo si el tiempo actual está entre este timestamp y el siguiente
  return props.currentTime >= timestamp.time && 
         (nextTimestamp ? props.currentTime < nextTimestamp.time : true);
};
</script>

<template>
  <div class="VideoTimestamps">
    <div class="VideoTimestamps__Header">
      <h3 class="VideoTimestamps__Title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2C17.52 2 22 6.48 22 12Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M15.71 15.18L12.61 13.33C12.07 13.01 11.63 12.24 11.63 11.61V7.51001" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Marcadores de tiempo
      </h3>
    </div>

    <div v-if="!timestamps || timestamps.length === 0" class="VideoTimestamps__Empty">
      <p>No hay marcadores de tiempo disponibles</p>
    </div>

    <div v-else class="VideoTimestamps__List">
      <div 
        v-for="(timestamp, index) in timestamps" 
        :key="index"
        class="VideoTimestamps__Item"
        :class="{ 'VideoTimestamps__Item--active': isCurrentTimestamp(timestamp) }"
        @click="seekToTime(timestamp.time)"
      >
        <div class="VideoTimestamps__Time">{{ formatTime(timestamp.time) }}</div>
        <div class="VideoTimestamps__ItemTitle">{{ timestamp.title }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  @import "@/assets/sass/video/VideoTimeStamps.scss";


.VideoTimestamps {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.05);
  padding: 16px;
  margin-bottom: 20px;
}

.VideoTimestamps__Header {
  margin-bottom: 16px;
}

.VideoTimestamps__Title {
  display: flex;
  align-items: center;
  font-size: 16px;
  color: #333;
  margin: 0;
}

.VideoTimestamps__Title svg {
  margin-right: 8px;
}

.VideoTimestamps__Empty {
  text-align: center;
  padding: 16px;
  color: #888;
  font-style: italic;
}

.VideoTimestamps__List {
  max-height: 300px;
  overflow-y: auto;
}

.VideoTimestamps__Item {
  display: flex;
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-left: 3px solid transparent;
}

.VideoTimestamps__Item:hover {
  background-color: #f5f5f5;
}

.VideoTimestamps__Item--active {
  background-color: rgba(255, 152, 0, 0.1);
  border-left: 3px solid #FF9800;
}

.VideoTimestamps__Time {
  min-width: 70px;
  font-weight: bold;
  color: #FF9800;
}

.VideoTimestamps__ItemTitle {
  font-weight: 500;
  flex-grow: 1;
}

/* Estilizar la barra de desplazamiento */
.VideoTimestamps__List::-webkit-scrollbar {
  width: 6px;
}

.VideoTimestamps__List::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.VideoTimestamps__List::-webkit-scrollbar-thumb {
  background: #ddd;
  border-radius: 10px;
}

.VideoTimestamps__List::-webkit-scrollbar-thumb:hover {
  background: #ccc;
}

@media (max-width: 600px) {
  .VideoTimestamps {
    padding: 12px;
  }
  
  .VideoTimestamps__Item {
    padding: 8px;
  }
  
  .VideoTimestamps__Time {
    min-width: 60px;
    font-size: 14px;
  }
  
  .VideoTimestamps__ItemTitle {
    font-size: 14px;
  }
}
</style>