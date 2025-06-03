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
  } catch {
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
        const response = await axios.get(`http://34.198.50.70:5000/api/Usuario/${idUsuario}`);
        if (response.data?.nombre) {
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
    
  } catch {
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
  <div class="ListaVideos">
    <div class="ListaVideos__titulo">Videos</div>
    
    <div v-if="videosConAutores.length > 0" class="ListaVideos__grid">
      <div v-for="video in videosConAutores" :key="video.idVideo || video.id" class="ListaVideos__item">
        <div class="VideoCard" @click="verVideo(video)">
          <div class="VideoCard__imagen">
            <v-img :src="video.miniatura || video.thumbnail" height="180" cover>
              
              <v-btn
                v-if="video.idUsuario === usuarioLogeadoStore.usuarioActual?.idUsuario"
                class="VideoCard__eliminar"
                variant="elevated"
                color="error"
                size="x-small"
                icon
                @click.stop="eliminarVideo(video.idVideo || video.id)"
              >
                <v-icon size="16">mdi-delete</v-icon>
              </v-btn>
              
              <template v-slot:placeholder>
                <div class="VideoCard__placeholder">
                  <v-progress-circular indeterminate color="grey-lighten-4" size="24" />
                </div>
              </template>
            </v-img>

            <v-chip
              v-if="video.asignatura && video.asignatura !== 'General'"
              variant="elevated"
              size="small"
              class="VideoCard__etiqueta"
              color="red"
            >
              {{ video.asignatura }}
            </v-chip>
          </div>
          
          <div class="VideoCard__contenido">
            <div class="VideoCard__info">
              <v-avatar size="32" color="red" class="VideoCard__avatar">
                {{ video.autor ? video.autor.charAt(0).toUpperCase() : 'U' }}
              </v-avatar>

              <div class="VideoCard__detalles">
                <div class="VideoCard__titulo">
                  {{ video.titulo }}
                </div>

                <div class="VideoCard__meta">
                  <div class="VideoCard__autor">{{ video.autor }}</div>
                  <div class="VideoCard__fecha">{{ video.fecha }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else-if="cargando" class="ListaVideos__estado">
      <v-progress-circular indeterminate color="red" class="ListaVideos__spinner" />
      <div class="ListaVideos__estado-texto">Cargando videos...</div>
    </div>
    
    <div v-else class="ListaVideos__estado">
      <v-icon size="x-large" color="grey-lighten-2" class="ListaVideos__icono-vacio">mdi-video-off</v-icon>
      <div class="ListaVideos__estado-titulo">No se encontraron videos</div>
      <div class="ListaVideos__estado-texto">Prueba con otro término de búsqueda o filtro</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/sass/components/Home/ListaVideos";
</style>
