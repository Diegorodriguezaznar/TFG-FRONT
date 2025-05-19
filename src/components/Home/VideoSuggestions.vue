<script setup lang="ts">
// --------------------------- Imports ---------------------------
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';

// --------------------------- Props ---------------------------
const props = defineProps({
  videos: {
    type: Array,
    default: () => []
  }
});

// --------------------------- Variables ---------------------------
const videosConAutores = ref<any[]>([]);
const cargando = ref(false);

// --------------------------- Emits ---------------------------
const emit = defineEmits(['select-video']);

// --------------------------- Métodos ---------------------------
const selectVideo = (videoId) => {
  emit('select-video', videoId);
};

// Verificar si ya tenemos la información necesaria en los videos
const necesitaCargarInfoAutores = () => {
  // Si los videos ya tienen nombres de autor que no sean "Profesor", no necesitamos cargar más info
  return props.videos.some(video => 
    !video.autor || 
    video.autor === 'Profesor' || 
    (video.usuario?.nombre === 'Profesor' && video.idUsuario)
  );
};

// Obtener sólo los nombres de autores para optimizar
const cargarInfoAutores = async () => {
  // Si no es necesario cargar info adicional, simplemente usar los datos existentes
  if (!necesitaCargarInfoAutores()) {
    console.log('VideoSuggestions - No es necesario cargar información adicional de autores');
    videosConAutores.value = [...props.videos];
    return;
  }

  try {
    cargando.value = true;
    
    // Crear una copia de los videos para no modificar directamente los props
    const videosTemp = JSON.parse(JSON.stringify(props.videos));
    
    // Crear un mapa para almacenar los nombres de los usuarios
    const nombresUsuarios = new Map();
    
    // Obtener IDs únicos de usuarios que necesitan carga
    const idsUsuarios = [...new Set(
      videosTemp
        .filter(video => video.idUsuario && (!video.autor || video.autor === 'Profesor'))
        .map(video => video.idUsuario)
    )];
    
    if (idsUsuarios.length === 0) {
      // No hay IDs para cargar, usar los datos existentes
      videosConAutores.value = [...videosTemp];
      cargando.value = false;
      return;
    }
    
    console.log('VideoSuggestions - Cargando nombres para estos IDs:', idsUsuarios);
    
    // Cargar nombres individualmente - método simple pero funcional
    const promesas = idsUsuarios.map(async (idUsuario) => {
      try {
        const response = await axios.get(`http://localhost:5190/api/Usuario/${idUsuario}`);
        if (response.data && response.data.nombre) {
          nombresUsuarios.set(idUsuario, response.data.nombre);
        }
      } catch (e) {
        console.error(`Error al cargar información del usuario ${idUsuario}:`, e);
      }
    });
    
    // Esperar a que todas las promesas se resuelvan
    await Promise.allSettled(promesas);
    
    // Actualizar la información de cada video con los nombres de autor
    videosConAutores.value = videosTemp.map((video: any) => {
      // Obtener el nombre del autor
      let nombreAutor = video.autor;
      
      // Si el autor es "Profesor" o no existe, intentar obtenerlo
      if (!nombreAutor || nombreAutor === 'Profesor') {
        nombreAutor = nombresUsuarios.get(video.idUsuario) || video.usuario?.nombre || 'Usuario';
      }
      
      return {
        ...video,
        autor: nombreAutor
      };
    });
    
  } catch (error) {
    console.error('VideoSuggestions - Error al cargar información de autores:', error);
    // Si hay un error, usar los videos originales
    videosConAutores.value = [...props.videos];
  } finally {
    cargando.value = false;
  }
};

// --------------------------- Lifecycle Hooks ---------------------------
// Cargar la información de autores cuando el componente se monta
onMounted(async () => {
  if (props.videos.length > 0) {
    await cargarInfoAutores();
  }
});

// Observar cambios en los videos para recargar la información
watch(() => props.videos, async (newVideos) => {
  if (newVideos.length > 0) {
    await cargarInfoAutores();
  } else {
    videosConAutores.value = [];
  }
}, { deep: true });
</script>

<template>
  <div class="VideoSuggestions">
    <div v-if="videosConAutores.length === 0" class="text-center py-4">
      <v-icon color="grey" size="large">mdi-playlist-remove</v-icon>
      <p class="mt-2 text-body-2 text-grey">No hay videos sugeridos disponibles</p>
    </div>
    
    <div v-else class="d-flex overflow-x-auto pb-3 suggested-videos-row">
      <div 
        v-for="video in videosConAutores" 
        :key="video.idVideo" 
        class="VideoSuggestions__Item"
        @click="selectVideo(video.idVideo)"
      >
        <!-- Miniatura del video -->
        <div class="VideoSuggestions__Thumbnail">
          <v-img 
            :src="video.miniatura" 
            width="210"
            height="120"
            class="rounded"
            cover
          ></v-img>
          
          <!-- Duración -->
          <div v-if="video.duracion" class="VideoSuggestions__Duration">
            {{ video.duracion }}
          </div>
        </div>
        
        <!-- Información del video -->
        <div class="VideoSuggestions__Info">
          <div class="VideoSuggestions__Title">{{ video.titulo }}</div>
          
          <div class="VideoSuggestions__Channel">
            {{ video.autor }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.VideoSuggestions__Item {
  width: 210px;
  min-width: 210px;
  margin-right: 16px;
  cursor: pointer;
  transition: transform 0.2s;
  background-color: #0f3670;
  border: 1px solid #0812ff;
  border-radius: 8px;
  padding: 8px;
  overflow: hidden;
}

.VideoSuggestions__Item:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 8px rgba(8, 18, 255, 0.3);
}

.VideoSuggestions__Thumbnail {
  position: relative;
  margin-bottom: 8px;
  border-radius: 4px;
  overflow: hidden;
}

.VideoSuggestions__Duration {
  position: absolute;
  bottom: 4px;
  right: 4px;
  background-color: rgba(255, 158, 12, 0.7);
  color: white;
  padding: 1px 4px;
  border-radius: 2px;
  font-size: 12px;
}

.VideoSuggestions__Info {
  padding: 0 4px;
}

.VideoSuggestions__Title {
  font-weight: 500;
  font-size: 14px;
  line-height: 1.2;
  margin-bottom: 4px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  color: #ffffff;
}

.VideoSuggestions__Channel {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.suggested-videos-row {
  scrollbar-width: thin;
}

.suggested-videos-row::-webkit-scrollbar {
  height: 6px;
}

.suggested-videos-row::-webkit-scrollbar-thumb {
  background-color: #ff9e0c;
  border-radius: 3px;
}

@media (max-width: 600px) {
  .VideoSuggestions__Item {
    width: 180px;
    min-width: 180px;
  }
}
</style>