<script setup lang="ts">
// --------------------------- Props ---------------------------
const props = defineProps({
  video: {
    type: Object,
    required: true
  }
});
</script>

<template>
  <div class="VideoPlayer">
    <!-- Reproductor de video (simulado) -->
    <div class="VideoPlayer__Container">
      <img 
        :src="video.miniatura || 'https://picsum.photos/seed/videoplayer/1280/720'" 
        class="VideoPlayer__Placeholder"
        alt="Video placeholder"
      />
      
      <!-- Icono de reproducción en el centro -->
      <div class="VideoPlayer__PlayButton">
        <v-icon icon="mdi-play" size="x-large" color="white"></v-icon>
      </div>
      
      <!-- Overlay con controles simulados -->
      <div class="VideoPlayer__Controls">
        <div class="VideoPlayer__Progress">
          <div class="VideoPlayer__ProgressBar"></div>
        </div>
        
        <div class="VideoPlayer__Buttons">
          <v-btn icon variant="plain" size="small">
            <v-icon>mdi-play</v-icon>
          </v-btn>
          
          <v-btn icon variant="plain" size="small" class="ml-2">
            <v-icon>mdi-volume-high</v-icon>
          </v-btn>
          
          <span class="VideoPlayer__Time">{{ props.video.duracion }}</span>
          
          <v-spacer></v-spacer>
          
          <v-btn icon variant="plain" size="small">
            <v-icon>mdi-cog</v-icon>
          </v-btn>
          
          <v-btn icon variant="plain" size="small" class="ml-2">
            <v-icon>mdi-fullscreen</v-icon>
          </v-btn>
        </div>
      </div>
      
      <!-- Duración del video -->
      <div class="VideoPlayer__Duration">
        {{ props.video.duracion }}
      </div>
      
      <!-- Barra de progreso roja -->
      <div class="VideoPlayer__ProgressBarRed"></div>
    </div>
  </div>
</template>

<style scoped>
.VideoPlayer {
  margin-bottom: 16px;
  position: relative;
}

.VideoPlayer__Container {
  position: relative;
  width: 100%;
  background-color: black;
  border-radius: 8px;
  overflow: hidden;
  aspect-ratio: 16 / 9;
}

.VideoPlayer__Placeholder {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.VideoPlayer__PlayButton {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.VideoPlayer__Controls {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  padding: 8px 16px;
  opacity: 0;
  transition: opacity 0.3s;
}

.VideoPlayer__Container:hover .VideoPlayer__Controls {
  opacity: 1;
}

.VideoPlayer__Progress {
  height: 4px;
  background-color: rgba(255, 255, 255, 0.3);
  margin-bottom: 8px;
  border-radius: 2px;
  cursor: pointer;
}

.VideoPlayer__ProgressBar {
  height: 100%;
  width: 35%;
  background-color: #FF0000;
  border-radius: 2px;
}

.VideoPlayer__Buttons {
  display: flex;
  align-items: center;
  color: white;
}

.VideoPlayer__Time {
  margin-left: 8px;
  font-size: 12px;
}

.VideoPlayer__Duration {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 1px 4px;
  border-radius: 2px;
  font-size: 12px;
}

.VideoPlayer__ProgressBarRed {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background-color: #FF0000;
}
</style>