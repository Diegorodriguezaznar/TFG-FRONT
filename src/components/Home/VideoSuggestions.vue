<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';

const props = defineProps({
  videos: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['select-video']);

const videosConAutores = ref<any[]>([]);
const cargando = ref(false);

const selectVideo = (videoId) => {
  emit('select-video', videoId);
};

const necesitaCargarInfoAutores = () => {
  return props.videos.some(video => 
    !video.autor || 
    video.autor === 'Profesor' || 
    (video.usuario?.nombre === 'Profesor' && video.idUsuario)
  );
};

const cargarInfoAutores = async () => {
  if (!necesitaCargarInfoAutores()) {
    videosConAutores.value = [...props.videos];
    return;
  }

  try {
    cargando.value = true;
    
    const videosTemp = JSON.parse(JSON.stringify(props.videos));
    const nombresUsuarios = new Map();
    
    const idsUsuarios = [...new Set(
      videosTemp
        .filter(video => video.idUsuario && (!video.autor || video.autor === 'Profesor'))
        .map(video => video.idUsuario)
    )];
    
    if (idsUsuarios.length === 0) {
      videosConAutores.value = [...videosTemp];
      cargando.value = false;
      return;
    }
    
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
    
    await Promise.allSettled(promesas);
    
    videosConAutores.value = videosTemp.map((video: any) => {
      let nombreAutor = video.autor;
      
      if (!nombreAutor || nombreAutor === 'Profesor') {
        nombreAutor = nombresUsuarios.get(video.idUsuario) || video.usuario?.nombre || 'Usuario';
      }
      
      return {
        ...video,
        autor: nombreAutor
      };
    });
    
  } catch (error) {
    console.error('Error al cargar información de autores:', error);
    videosConAutores.value = [...props.videos];
  } finally {
    cargando.value = false;
  }
};

onMounted(async () => {
  if (props.videos.length > 0) {
    await cargarInfoAutores();
  }
});

watch(() => props.videos, async (newVideos) => {
  if (newVideos.length > 0) {
    await cargarInfoAutores();
  } else {
    videosConAutores.value = [];
  }
}, { deep: true });
</script>

<template>
  <div class="video-suggestions">
    <div v-if="videosConAutores.length === 0" class="video-suggestions__empty">
      <v-icon color="grey" size="large">mdi-playlist-remove</v-icon>
      <p class="video-suggestions__empty-text">No hay videos sugeridos disponibles</p>
    </div>
    
    <div v-else class="video-suggestions__scroll">
      <div 
        v-for="video in videosConAutores" 
        :key="video.idVideo" 
        class="video-suggestions__item"
        @click="selectVideo(video.idVideo)"
      >
        <div class="video-suggestions__thumbnail">
          <v-img 
            :src="video.miniatura" 
            width="210"
            height="120"
            class="rounded"
            cover
          ></v-img>
          
          <div v-if="video.duracion" class="video-suggestions__duration">
            {{ video.duracion }}
          </div>
        </div>
        
        <div class="video-suggestions__info">
          <div class="video-suggestions__title">{{ video.titulo }}</div>
          <div class="video-suggestions__channel">{{ video.autor }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.video-suggestions {
  width: 100%;
}

.video-suggestions__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
}

.video-suggestions__empty-text {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #666;
}

.video-suggestions__scroll {
  display: flex;
  overflow-x: auto;
  padding-bottom: 0.75rem;
  gap: 1rem;
  scrollbar-width: thin;
}

.video-suggestions__scroll::-webkit-scrollbar {
  height: 6px;
}

.video-suggestions__scroll::-webkit-scrollbar-thumb {
  background-color: #FF9800;
  border-radius: 3px;
}

.video-suggestions__item {
  width: 210px;
  min-width: 210px;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: white;
  border: 2px solid #FF9800;
  border-radius: 12px;
  padding: 12px;
  overflow: hidden;
}

.video-suggestions__item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(255, 152, 0, 0.15);
  border-color: #F57C00;
}

.video-suggestions__thumbnail {
  position: relative;
  margin-bottom: 8px;
  border-radius: 8px;
  overflow: hidden;
}

.video-suggestions__duration {
  position: absolute;
  bottom: 6px;
  right: 6px;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 6px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.video-suggestions__info {
  padding: 0 4px;
}

.video-suggestions__title {
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 1.3;
  margin-bottom: 6px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  color: #333;
}

.video-suggestions__channel {
  font-size: 0.75rem;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 640px) {
  .video-suggestions__item {
    width: 180px;
    min-width: 180px;
    padding: 10px;
  }
  
  .video-suggestions__scroll {
    gap: 0.75rem;
  }
}
</style>