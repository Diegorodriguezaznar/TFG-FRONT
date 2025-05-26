<script setup lang="ts">
// --------------------------- Imports ---------------------------
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useVideoStore } from '@/stores/Video';
import { useUsuarioLogeadoStore } from '@/stores/UsuarioLogeado';

// --------------------------- Router ---------------------------
const router = useRouter();
const videoStore = useVideoStore();
const usuarioLogeadoStore = useUsuarioLogeadoStore();

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
const errorCarga = ref(false);

// --------------------------- Métodos ---------------------------
// Navegar a la página de reproducción del video
const verVideo = (video: any) => {
  router.push({
    path: '/reproductor-video',
    query: { id: video.idVideo }
  });
};

// Formatear fecha en formato legible
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
    return fechaStr; // Devolver la fecha original si hay error
  }
};

// Verificar si ya tenemos la información necesaria en los videos
const necesitaCargarInfoAutores = () => {
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
    console.log('ListaVideos - No es necesario cargar información adicional de autores');
    videosConAutores.value = [...props.videos];
    return;
  }

  try {
    cargando.value = true;
    errorCarga.value = false;
    
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
      videosConAutores.value = videosTemp.map(video => ({
        ...video,
        fecha: video.fechaSubida ? formatearFecha(video.fechaSubida) : (video.fecha || '')
      }));
      cargando.value = false;
      return;
    }
    
    console.log('ListaVideos - Cargando nombres para estos IDs:', idsUsuarios);
    
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
      
      // Formatear fecha
      const fechaFormateada = video.fechaSubida ? formatearFecha(video.fechaSubida) : (video.fecha || '');
      
      return {
        ...video,
        autor: nombreAutor,
        fecha: fechaFormateada
      };
    });
    
  } catch (error) {
    console.error('ListaVideos - Error al cargar información de autores:', error);
    errorCarga.value = true;
    // Si hay un error, usar los videos originales
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

// --------------------------- Colores para asignaturas ---------------------------
function getColorForAsignatura(asignatura: string): string {
  const colores: Record<string, string> = {
    'Mates': 'blue',
    'Lengua': 'deep-purple',
    'Historia': 'brown',
    'Física': 'indigo',
    'Química': 'green',
    'Biología': 'teal',
    'Inglés': 'red',
    'Arte': 'pink',
    'Informática': 'orange',
    'Música': 'cyan'
  };
  
  return colores[asignatura] || 'grey';
}

// --------------------------- Onmounted y watch ---------------------------
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
  <div class="ListaVideos">
    <div class="text-h6 font-weight-bold mb-4">Videos</div>
    
    <v-row v-if="videosConAutores.length > 0">
      <v-col v-for="video in videosConAutores" :key="video.idVideo || video.id" cols="12" sm="6" md="4" lg="3">
        <v-card class="ListaVideos__Card" elevation="1" rounded="lg" @click="verVideo(video)">
          <v-img :src="video.miniatura || video.thumbnail" height="180" cover>
            <!-- Duración -->
            <div class="ListaVideos__Duracion">
              {{ video.duracion || '00:00' }}
            </div>
            
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular indeterminate color="grey-lighten-4"></v-progress-circular>
              </v-row>
            </template>
          </v-img>
          
         <v-card-item>
            <v-row no-gutters>
              <v-col cols="auto" class="mr-3">
                <v-avatar size="36" :color="getColorForAsignatura(video.asignatura)">
                  {{ video.autor ? video.autor.charAt(0).toUpperCase() : 'U' }}
                </v-avatar>
              </v-col>

              <v-col>
                <v-card-title class="text-subtitle-1 font-weight-bold px-0 py-0" @click="verVideo(video)">
                  {{ video.titulo }}
                </v-card-title>

                <v-card-subtitle class="px-0 py-1">
                  <div class="text-body-2">{{ video.autor }}</div>
                  <div class="text-caption text-grey">
                    {{ video.fecha }}
                  </div>
                </v-card-subtitle>
              </v-col>
            </v-row>

            <!-- Botón Eliminar (solo si es del usuario logeado) -->
            <v-btn
              v-if="video.idUsuario === usuarioLogeadoStore.usuarioActual?.idUsuario"
              class="ma-2"
              variant="text"
              color="error"
              size="small"
              @click.stop="eliminarVideo(video.idVideo || video.id)"
            >
              Eliminar
            </v-btn>
          </v-card-item>

          
          <!-- Etiqueta de asignatura -->
          <v-chip
            v-if="video.asignatura && video.asignatura !== 'General'"
            variant="elevated"
            size="small"
            class="ListaVideos__Etiqueta"
            :color="getColorForAsignatura(video.asignatura)"
          >
            {{ video.asignatura }}
          </v-chip>
        </v-card>
      </v-col>
    </v-row>
    
    <!-- Estado de carga -->
    <v-row v-else-if="cargando">
      <v-col cols="12" class="text-center py-8">
        <v-progress-circular indeterminate color="primary" class="mb-4"></v-progress-circular>
        <div class="text-body-2 text-grey">Cargando videos...</div>
      </v-col>
    </v-row>
    
    <!-- Estado vacío -->
    <v-row v-else>
      <v-col cols="12" class="text-center py-8">
        <v-icon size="x-large" color="grey-lighten-2" class="mb-4">mdi-video-off</v-icon>
        <div class="text-h6 text-grey">No se encontraron videos</div>
        <div class="text-body-2 text-grey">Prueba con otro término de búsqueda o filtro</div>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>
.ListaVideos__Card {
  position: relative;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  margin-bottom: 16px;
}

.ListaVideos__Card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) !important;
}

.ListaVideos__Etiqueta {
  position: absolute;
  top: 8px;
  right: 8px;
}

.ListaVideos__Duracion {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 2px 4px;
  border-radius: 2px;
  font-size: 12px;
  font-weight: 500;
}
</style>