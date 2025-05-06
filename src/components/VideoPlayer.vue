<script setup>
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
        src="https://picsum.photos/seed/videoplayer/1280/720" 
        class="VideoPlayer__Placeholder"
        alt="Video placeholder"
      />
      
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
          
          <span class="VideoPlayer__Time">{{ props.video.duration }}</span>
          
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
        {{ props.video.duration }}
      </div>
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
</style>