<script setup lang="ts">
import { computed } from 'vue';

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
  if (props.timestamps.length === 0) return false;
  
  if (timestamp === props.timestamps[props.timestamps.length - 1]) {
    return props.currentTime >= timestamp.time;
  }
  
  const index = props.timestamps.findIndex(t => t === timestamp);
  const nextTimestamp = props.timestamps[index + 1];
  
  return props.currentTime >= timestamp.time && 
         (nextTimestamp ? props.currentTime < nextTimestamp.time : true);
};
</script>

<template>
  <div class="VideoTimestamps">
    <div class="VideoTimestamps__header">
      <h3 class="VideoTimestamps__titulo">
        <svg class="VideoTimestamps__icono" width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2C17.52 2 22 6.48 22 12Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M15.71 15.18L12.61 13.33C12.07 13.01 11.63 12.24 11.63 11.61V7.51001" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Marcadores de tiempo
      </h3>
    </div>

    <div v-if="!timestamps?.length" class="VideoTimestamps__vacio">
      <p class="VideoTimestamps__texto-vacio">No hay marcadores de tiempo disponibles</p>
    </div>

    <div v-else class="VideoTimestamps__lista">
      <div 
        v-for="(timestamp, index) in timestamps" 
        :key="index"
        class="VideoTimestamps__item"
        :class="{ 'VideoTimestamps__item--activo': isCurrentTimestamp(timestamp) }"
        @click="seekToTime(timestamp.time)"
      >
        <div class="VideoTimestamps__tiempo">{{ formatTime(timestamp.time) }}</div>
        <div class="VideoTimestamps__nombre">{{ timestamp.title }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/sass/components/SubirVideo/VideoTimestamps";
</style>