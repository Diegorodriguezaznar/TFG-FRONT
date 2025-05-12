<script setup lang="ts">
// --------------------------- Imports ---------------------------
import { computed } from 'vue';

// --------------------------- Props y Emits ---------------------------
const props = defineProps({
  historial: {
    type: Array,
    default: () => []
  },
  searchQuery: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['eliminar-video']);

// --------------------------- Filtrar historial por búsqueda ---------------------------
const historialFiltrado = computed(() => {
  if (!props.searchQuery.trim()) {
    return props.historial;
  }
  
  const query = props.searchQuery.toLowerCase();
  
  // Crear un nuevo array con las secciones filtradas
  return props.historial
    .map(seccion => {
      // Filtrar videos dentro de cada sección
      const videosSeccion = seccion.videos.filter(video => 
        video.titulo.toLowerCase().includes(query) || 
        video.canal.toLowerCase().includes(query) ||
        video.descripcion.toLowerCase().includes(query)
      );
      
      // Solo devolver secciones con videos
      if (videosSeccion.length > 0) {
        return {
          ...seccion,
          videos: videosSeccion
        };
      }
      return null;
    })
    .filter(seccion => seccion !== null); // Eliminar secciones vacías
});

// --------------------------- Métodos ---------------------------
const eliminarVideo = (seccionIndex, videoIndex) => {
  emit('eliminar-video', seccionIndex, videoIndex);
};
</script>

<template>
  <div class="HistorialVideos">
    <div v-if="historialFiltrado.length === 0" class="HistorialVideos__Vacio">
      <v-icon size="64" icon="mdi-history" color="grey-lighten-1" class="mb-4"></v-icon>
      <h3 class="text-h5 text-grey-darken-1">No se encontraron videos en tu historial</h3>
      <p class="text-body-1 text-grey" v-if="searchQuery">Prueba con otro término de búsqueda</p>
    </div>
    
    <div v-else>
      <!-- Sección por fecha -->
      <div 
        v-for="(seccion, seccionIndex) in historialFiltrado" 
        :key="seccion.fecha" 
        class="HistorialVideos__Seccion mb-8"
      >
        <h2 class="text-h6 font-weight-medium mb-4">{{ seccion.fecha }}</h2>
        
        <!-- Lista de videos por fecha -->
        <div 
          v-for="(video, videoIndex) in seccion.videos" 
          :key="video.id"
          class="HistorialVideos__Video"
        >
          <!-- Miniatura con duración -->
          <div class="HistorialVideos__Thumbnail">
            <v-img
              :src="video.thumbnail"
              :aspect-ratio="16/9"
              cover
              class="rounded-lg"
              height="120"
            >
              <!-- Etiqueta de duración -->
              <div class="HistorialVideos__Duracion">
                <span>{{ video.duracion }}</span>
              </div>
              
              <!-- Etiqueta adicional (si existe) -->
              <div v-if="video.etiqueta" class="HistorialVideos__Etiqueta">
                {{ video.etiqueta }}
              </div>
            </v-img>
          </div>
          
          <!-- Información del video -->
          <div class="HistorialVideos__Info">
            <div class="d-flex align-start">
              <div class="flex-grow-1">
                <div class="HistorialVideos__Titulo">
                  {{ video.titulo }}
                </div>
                
                <div class="HistorialVideos__Detalles">
                  <span class="mr-1">{{ video.canal }}</span>
                  <span class="text-grey-darken-1">•</span>
                  <span class="mx-1 text-grey-darken-1">{{ video.vistas }}</span>
                </div>
                
                <div class="HistorialVideos__Descripcion text-grey-darken-1">
                  {{ video.descripcion }}
                </div>
              </div>
              
              <!-- Botones de acción -->
              <div class="HistorialVideos__Acciones">
                <v-menu>
                  
                </v-menu>
                <v-btn icon="mdi-close" variant="text" density="comfortable" class="d-none d-sm-flex"
                  @click="eliminarVideo(seccionIndex, videoIndex)"
                ></v-btn>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.HistorialVideos__Vacio {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 0;
  text-align: center;
}

.HistorialVideos__Video {
  display: flex;
  margin-bottom: 16px;
  position: relative;
}

.HistorialVideos__Thumbnail {
  min-width: 240px;
  max-width: 240px;
  margin-right: 16px;
  position: relative;
}

.HistorialVideos__Duracion {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  font-size: 12px;
  padding: 1px 4px;
  border-radius: 2px;
}

.HistorialVideos__Etiqueta {
  position: absolute;
  bottom: 8px;
  left: 8px;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  font-size: 12px;
  padding: 1px 4px;
  border-radius: 2px;
  font-weight: bold;
}

.HistorialVideos__Info {
  flex: 1;
  min-width: 0;
  padding-right: 8px;
}

.HistorialVideos__Titulo {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 4px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.HistorialVideos__Detalles {
  font-size: 14px;
  margin-bottom: 4px;
  color: #606060;
}

.HistorialVideos__Descripcion {
  font-size: 12px;
  color: #606060;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.HistorialVideos__Acciones {
  display: flex;
  align-items: flex-start;
}

@media (max-width: 600px) {
  .HistorialVideos__Video {
    flex-direction: column;
  }
  
  .HistorialVideos__Thumbnail {
    min-width: 100%;
    max-width: 100%;
    margin-right: 0;
    margin-bottom: 8px;
  }
  
  .HistorialVideos__Info {
    width: 100%;
  }
}
</style>