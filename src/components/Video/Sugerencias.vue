<script setup lang="ts">
// --------------------------- Imports ---------------------------
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import UserAvatar from '@/components/Common/UserAvatar.vue';

// --------------------------- Router ---------------------------
const router = useRouter();

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

// --------------------------- Métodos ---------------------------
const verVideo = (video) => {
  router.push({
    path: '/reproductor-video',
    query: { id: video.idVideo || video.id }
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

// Función para obtener rol simulado basado en el nombre del autor
const obtenerRolAutor = (autorNombre: string) => {
  if (!autorNombre) return 1;
  
  const nombre = autorNombre.toLowerCase();
  if (nombre.includes('profe') || nombre.includes('profesor')) {
    return 2; // Profesor
  } else if (nombre.includes('admin') || nombre.includes('director')) {
    return 3; // Administrador
  }
  return 1; // Estudiante por defecto
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
    console.log('Sugerencias - No es necesario cargar información adicional de autores');
    
    // Formatear fechas aunque no necesitemos cargar autores
    videosConAutores.value = props.videos.map(video => ({
      ...video,
      fecha: video.fechaSubida ? formatearFecha(video.fechaSubida) : (video.fecha || ''),
      rolAutor: obtenerRolAutor(video.autor || video.usuario?.nombre || 'Usuario')
    }));
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
      // No hay IDs para cargar, usar los datos existentes con fechas formateadas
      videosConAutores.value = videosTemp.map(video => ({
        ...video,
        fecha: video.fechaSubida ? formatearFecha(video.fechaSubida) : (video.fecha || ''),
        rolAutor: obtenerRolAutor(video.autor || video.usuario?.nombre || 'Usuario')
      }));
      cargando.value = false;
      return;
    }
    
    console.log('Sugerencias - Cargando nombres para estos IDs:', idsUsuarios);
    
    // Cargar nombres individualmente - método simple pero funcional
    const promesas = idsUsuarios.map(async (idUsuario) => {
      try {
        const response = await axios.get(`http://localhost:5190/api/Usuario/${idUsuario}`);
        if (response.data && response.data.nombre) {
          nombresUsuarios.set(idUsuario, {
            nombre: response.data.nombre,
            idRol: response.data.idRol || 1
          });
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
      let rolAutor = 1;
      
      // Si el autor es "Profesor" o no existe, intentar obtenerlo
      if (!nombreAutor || nombreAutor === 'Profesor') {
        const usuarioInfo = nombresUsuarios.get(video.idUsuario);
        if (usuarioInfo) {
          nombreAutor = usuarioInfo.nombre;
          rolAutor = usuarioInfo.idRol;
        } else {
          nombreAutor = video.usuario?.nombre || 'Usuario';
          rolAutor = obtenerRolAutor(nombreAutor);
        }
      } else {
        rolAutor = obtenerRolAutor(nombreAutor);
      }
      
      // Formatear fecha
      const fechaFormateada = video.fechaSubida ? formatearFecha(video.fechaSubida) : (video.fecha || '');
      
      return {
        ...video,
        autor: nombreAutor,
        fecha: fechaFormateada,
        rolAutor: rolAutor
      };
    });
    
  } catch (error) {
    console.error('Sugerencias - Error al cargar información de autores:', error);
    // Si hay un error, usar los videos originales
    videosConAutores.value = props.videos.map(video => ({
      ...video,
      rolAutor: obtenerRolAutor(video.autor || 'Usuario')
    }));
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
  <div class="Sugerencias">
    <div class="text-h6 font-weight-bold mb-3">Sugerencias</div>
    
    <v-row v-if="videosConAutores.length > 0">
      <v-col v-for="video in videosConAutores" :key="video.idVideo || video.id" cols="12" sm="6" md="3">
        <v-card class="Sugerencias__Card" elevation="0" rounded="lg" @click="verVideo(video)">
          <v-img :src="video.miniatura || video.thumbnail" height="140" cover class="Sugerencias__Imagen">
            <!-- Duración -->
            <div v-if="video.duracion" class="Sugerencias__Duracion">
              {{ video.duracion }}
            </div>
          </v-img>
          
          <v-card-item>
            <v-card-title class="text-subtitle-1 font-weight-bold pa-0">
              {{ video.titulo }}
            </v-card-title>
            
            <v-card-subtitle class="pa-0 pt-1">
              <!-- Canal con avatar personalizado -->
              <div class="d-flex align-center mt-2">
                <UserAvatar
                  :nombre="video.autor"
                  :id-rol="video.rolAutor || 1"
                  :size="24"
                  class="mr-2"
                />
                <div>
                  <div class="text-body-2">{{ video.autor }}</div>
                  <div class="text-caption text-grey">
                    {{ video.fecha }}
                  </div>
                </div>
              </div>
            </v-card-subtitle>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>
    
    <!-- Estado de carga -->
    <v-row v-else-if="cargando">
      <v-col cols="12" class="text-center py-4">
        <v-progress-circular indeterminate color="primary" size="24" class="mr-2"></v-progress-circular>
        <span class="text-body-2">Cargando sugerencias...</span>
      </v-col>
    </v-row>
    
    <!-- Estado vacío -->
    <v-row v-else>
      <v-col cols="12" class="text-center py-4">
        <v-icon color="grey-lighten-1" size="large">mdi-playlist-remove</v-icon>
        <p class="text-body-2 text-grey mt-2">No hay sugerencias disponibles</p>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>
.Sugerencias {
  margin-bottom: 16px;
}

.Sugerencias__Card {
  transition: transform 0.2s;
  cursor: pointer;
}

.Sugerencias__Card:hover {
  transform: translateY(-4px);
}

.Sugerencias__Imagen {
  border-radius: 12px;
  position: relative;
}

.Sugerencias__Duracion {
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