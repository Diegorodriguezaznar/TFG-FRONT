<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useVideoStore } from '@/stores/Video';
import { useUsuarioLogeadoStore } from '@/stores/UsuarioLogeado';

const router = useRouter();
const videoStore = useVideoStore();
const usuarioLogeadoStore = useUsuarioLogeadoStore();

const props = defineProps({
  videos: {
    type: Array,
    default: () => []
  }
});

const videosConAutores = ref<any[]>([]);
const cargando = ref(false);
const errorCarga = ref(false);

const verVideo = (video: any) => {
  router.push({
    path: '/reproductor-video',
    query: { id: video.idVideo }
  });
};

const formatearFecha = (fechaStr: string) => {
  if (!fechaStr) return '';
  
  try {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    return fechaStr;
  }
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
    errorCarga.value = false;
    
    const videosTemp = JSON.parse(JSON.stringify(props.videos));
    const nombresUsuarios = new Map();
    
    const idsUsuarios = [...new Set(
      videosTemp
        .filter(video => video.idUsuario && (!video.autor || video.autor === 'Profesor'))
        .map(video => video.idUsuario)
    )];
    
    if (idsUsuarios.length === 0) {
      videosConAutores.value = videosTemp.map(video => ({
        ...video,
        fecha: video.fechaSubida ? formatearFecha(video.fechaSubida) : (video.fecha || '')
      }));
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
      
      const fechaFormateada = video.fechaSubida ? formatearFecha(video.fechaSubida) : (video.fecha || '');
      
      return {
        ...video,
        autor: nombreAutor,
        fecha: fechaFormateada
      };
    });
    
  } catch (error) {
    console.error('Error al cargar información de autores:', error);
    errorCarga.value = true;
    videosConAutores.value = [...props.videos];
  } finally {
    cargando.value = false;
  }
};

const eliminarVideo = async (idVideo: number) => {
  const exito = await videoStore.eliminarVideoPropio(idVideo);
  if (exito) {
    videosConAutores.value = videosConAutores.value.filter(
      v => v.idVideo !== idVideo && v.id !== idVideo
    );
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
  <div class="lista-videos">
    <div class="lista-videos__titulo">Videos</div>
    
    <div v-if="videosConAutores.length > 0" class="lista-videos__grid">
      <div v-for="video in videosConAutores" :key="video.idVideo || video.id" class="lista-videos__item">
        <div class="video-card" @click="verVideo(video)">
          <div class="video-card__imagen">
            <v-img :src="video.miniatura || video.thumbnail" height="180" cover>
              <div class="video-card__duracion">
                {{ video.duracion || '00:00' }}
              </div>
              
              <v-btn
                v-if="video.idUsuario === usuarioLogeadoStore.usuarioActual?.idUsuario"
                class="video-card__eliminar"
                variant="elevated"
                color="error"
                size="x-small"
                icon
                @click.stop="eliminarVideo(video.idVideo || video.id)"
              >
                <v-icon size="16">mdi-delete</v-icon>
              </v-btn>
              
              <template v-slot:placeholder>
                <div class="video-card__placeholder">
                  <v-progress-circular indeterminate color="grey-lighten-4" size="24"></v-progress-circular>
                </div>
              </template>
            </v-img>

            <v-chip
              v-if="video.asignatura && video.asignatura !== 'General'"
              variant="elevated"
              size="small"
              class="video-card__etiqueta"
              color="orange"
            >
              {{ video.asignatura }}
            </v-chip>
          </div>
          
          <div class="video-card__contenido">
            <div class="video-card__info">
              <v-avatar size="32" color="orange" class="video-card__avatar">
                {{ video.autor ? video.autor.charAt(0).toUpperCase() : 'U' }}
              </v-avatar>

              <div class="video-card__detalles">
                <div class="video-card__titulo">
                  {{ video.titulo }}
                </div>

                <div class="video-card__meta">
                  <div class="video-card__autor">{{ video.autor }}</div>
                  <div class="video-card__fecha">{{ video.fecha }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else-if="cargando" class="lista-videos__estado">
      <v-progress-circular indeterminate color="orange" class="mb-4"></v-progress-circular>
      <div class="lista-videos__estado-texto">Cargando videos...</div>
    </div>
    
    <div v-else class="lista-videos__estado">
      <v-icon size="x-large" color="grey-lighten-2" class="mb-4">mdi-video-off</v-icon>
      <div class="lista-videos__estado-titulo">No se encontraron videos</div>
      <div class="lista-videos__estado-texto">Prueba con otro término de búsqueda o filtro</div>
    </div>
  </div>
</template>

<style scoped>
.lista-videos {
  padding: 1rem;
}

.lista-videos__titulo {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #333;
}

.lista-videos__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 640px) {
  .lista-videos__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .lista-videos__grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1280px) {
  .lista-videos__grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.video-card {
  background: white;
  border-radius: 12px;
  border: 2px solid #FF9800;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  height: 280px;
  display: flex;
  flex-direction: column;
}

.video-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(255, 152, 0, 0.15);
  border-color: #F57C00;
}

.video-card__imagen {
  position: relative;
  flex-shrink: 0;
}

.video-card__duracion {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 6px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.video-card__eliminar {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.video-card__etiqueta {
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 5;
}

.video-card__placeholder {
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.video-card__contenido {
  padding: 12px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.video-card__info {
  display: flex;
  gap: 12px;
  height: 100%;
}

.video-card__avatar {
  flex-shrink: 0;
  align-self: flex-start;
}

.video-card__detalles {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.video-card__titulo {
  font-size: 0.95rem;
  font-weight: 600;
  color: #333;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 8px;
}

.video-card__meta {
  margin-top: auto;
}

.video-card__autor {
  font-size: 0.875rem;
  color: #666;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.video-card__fecha {
  font-size: 0.75rem;
  color: #999;
  margin-top: 2px;
}

.lista-videos__estado {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 1rem;
  text-align: center;
}

.lista-videos__estado-titulo {
  font-size: 1.25rem;
  font-weight: 600;
  color: #666;
  margin-bottom: 0.5rem;
}

.lista-videos__estado-texto {
  font-size: 0.875rem;
  color: #999;
}
</style>