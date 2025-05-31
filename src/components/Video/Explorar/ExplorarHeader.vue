<!-- src/components/Explorar/ExplorarHeader.vue -->
<script setup lang="ts">
const props = defineProps<{
  vista: 'grid' | 'list';
}>();

const emit = defineEmits<{
  'cambiar-vista': [vista: 'grid' | 'list'];
  'limpiar-filtros': [];
}>();

const cambiarVista = (nuevaVista: 'grid' | 'list') => {
  emit('cambiar-vista', nuevaVista);
};

</script>

<template>
  <div class="ExplorarHeader">
    <div class="d-flex align-center justify-space-between flex-wrap mb-4">
      <div class="ExplorarHeader__Info">
        <h1 class="ExplorarHeader__Title">
          <!-- Logo chuli de videos como en Home pero adaptado -->
          <div class="ExplorarHeader__VideoLogo">
            <div class="ExplorarHeader__VideoIcon">
              <v-icon color="white" size="28">mdi-play</v-icon>
            </div>
          </div>
          Biblioteca de Videos
        </h1>
        <p class="ExplorarHeader__Subtitle">
          Sumérgete en nuestra extensa colección de videos educativos creados por profesores expertos
        </p>
      </div>
      
      <!-- Controles de vista -->
      <div class="ExplorarHeader__Controls">
        <v-btn-toggle 
          :model-value="vista"
          @update:model-value="cambiarVista"
          density="compact"
          variant="outlined"
          mandatory
          color="red"
          class="mr-2"
        >
          <v-btn value="grid" icon="mdi-view-grid">
            <v-icon>mdi-view-grid</v-icon>
            <v-tooltip activator="parent" location="bottom">
              Vista de grilla
            </v-tooltip>
          </v-btn>
          <v-btn value="list" icon="mdi-view-list">
            <v-icon>mdi-view-list</v-icon>
            <v-tooltip activator="parent" location="bottom">
              Vista de lista
            </v-tooltip>
          </v-btn>
        </v-btn-toggle>
        
      </div>
    </div>
  </div>
</template>

<style scoped>
.ExplorarHeader {
  margin-bottom: 32px;
}

.ExplorarHeader__Title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  background: linear-gradient(90deg, #F44336 0%, #FF8A80 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Logo chuli de videos */
.ExplorarHeader__VideoLogo {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #F44336 0%, #FF5722 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  box-shadow: 0 4px 15px rgba(244, 67, 54, 0.3);
  position: relative;
  overflow: hidden;
}

.ExplorarHeader__VideoLogo::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, rgba(255,255,255,0.2), transparent);
  transform: rotate(45deg);
  animation: shine 3s infinite;
}

.ExplorarHeader__VideoIcon {
  position: relative;
  z-index: 2;
}

@keyframes shine {
  0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
  50% { transform: translateX(100%) translateY(100%) rotate(45deg); }
  100% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
}

.ExplorarHeader__Subtitle {
  color: #666;
  font-size: 1.1rem;
  margin: 0;
}

.ExplorarHeader__Controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Responsive */
@media (max-width: 768px) {
  .ExplorarHeader__Title {
    font-size: 2rem;
  }
  
  .ExplorarHeader__Controls {
    width: 100%;
    justify-content: space-between;
    margin-top: 16px;
  }
}

@media (max-width: 600px) {
  .ExplorarHeader__Title {
    font-size: 1.75rem;
  }
  
  .ExplorarHeader__Controls {
    flex-direction: column;
    gap: 12px;
  }
  
  .ExplorarHeader__Controls .v-btn {
    width: 100%;
  }
}
</style>