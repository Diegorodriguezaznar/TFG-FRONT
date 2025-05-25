<script setup lang="ts">
// --------------------------- Imports ---------------------------
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useCursoStore } from '@/stores/Curso';
import { useVideoStore } from '@/stores/Video';
import { useUsuarioLogeadoStore } from '@/stores/UsuarioLogeado'; 
import Header from '@/components/Layout/Header.vue';
import Sidebar from '@/components/Layout/Sidebar.vue';
import Filtros from '@/components/Home/Filtros.vue';
import Sugerencias from '@/components/Video/Sugerencias.vue';
import ListaVideos from '@/components/Home/ListaVideos.vue';

// --------------------------- Route ---------------------------
const route = useRoute();

// --------------------------- Stores ---------------------------
const cursoStore = useCursoStore();
const videoStore = useVideoStore();
const usuarioLogeadoStore = useUsuarioLogeadoStore(); 

// --------------------------- Variables ---------------------------
const drawer = ref(false);
const searchQuery = ref('');
const filtroSeleccionado = ref('Todos'); // Comienza con 'Todos'
const loading = computed(() => videoStore.loading || cursoStore.loading);
const curso = computed(() => cursoStore.curso);
const mostrarModalAsignatura = ref(false);

// Verificar si estamos viendo videos de un curso específico
const cursoId = computed(() => {
  if (route.path.startsWith('/curso/')) {
    const id = Number(route.params.id);
    return isNaN(id) ? null : id;
  }
  return null;
});

// Verificar si el usuario actual es el creador del curso
const esCreadorCurso = computed(() => {
  if (!curso.value) return false;
  if (!usuarioLogeadoStore.usuarioActual) return false;
  
  const usuarioActualId = usuarioLogeadoStore.usuarioActual.idUsuario;
  return curso.value.idUsuario === usuarioActualId;
});

// Añadir esta computed property en tu sección de computed

// Verificar si el usuario puede subir videos (roles 1, 2, 3)
const puedeSubirVideo = computed(() => {
  if (!usuarioLogeadoStore.usuarioActual) return false;
  if (!cursoId.value) return false; // Solo mostrar si estamos en un curso específico
  
  const idRol = usuarioLogeadoStore.usuarioActual.idRol;
  return [1, 2, 3].includes(idRol);
});

// Generar imagen de fondo para el banner (placeholder)
const bannerImage = computed(() => {
  // Si hay un curso y tiene imagen, usar esa
  if (curso.value?.imagen) {
    return curso.value.imagen;
  }
  
  // De lo contrario, generar una imagen aleatoria basada en el ID del curso
  if (cursoId.value) {
    return `https://picsum.photos/seed/${cursoId.value}/1600/400`;
  }
  
  // Imagen por defecto para la página principal
  return 'https://picsum.photos/seed/home/1600/400';
});

// --------------------------- Cargar videos ---------------------------
const cargarVideos = async () => {
  try {
    if (cursoId.value) {
      // Cargar el curso específico y sus videos
      await cursoStore.fetchCursoById(cursoId.value);
      await videoStore.fetchVideosByCurso(cursoId.value);
    } else {
      // Cargar todos los videos
      await videoStore.fetchAllVideos();
    }
  } catch (error) {
    console.error("Error al cargar videos:", error);
  }
};


// Función para manejar la creación exitosa de una asignatura
const asignaturaCreada = async () => {
  // Recargar el curso para mostrar la nueva asignatura
  if (cursoId.value) {
    await cursoStore.fetchCursoById(cursoId.value);
    // Resetear el filtro a 'Todos'
    filtroSeleccionado.value = 'Todos';
  }
};

// --------------------------- Filtrar videos ---------------------------
const videosFiltrados = computed(() => {
  // Usamos los videos filtrados por curso o todos los videos según corresponda
  const videosBase = cursoId.value ? videoStore.videosFiltradosPorCurso : videoStore.videos;
  let resultado = videosBase;
  
  // Filtrar por término de búsqueda
  if (searchQuery.value) {
    resultado = resultado.filter(video => 
      video.titulo.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }
  
  // Filtrar por asignatura seleccionada (ahora usando idAsignatura)
  if (filtroSeleccionado.value !== 'Todos') {
    resultado = resultado.filter(video => 
      video.idAsignatura === filtroSeleccionado.value
    );
  }
  
  return resultado;
});

// --------------------------- Sugerencias de videos ---------------------------
const videosSugeridos = computed(() => {
  // Usamos los videos filtrados actuales para las sugerencias
  // Esto asegura que las sugerencias también respeten el filtro de asignatura
  if (videosFiltrados.value.length <= 4) {
    return videosFiltrados.value;
  }
  return videosFiltrados.value.slice(0, 4);
});

// --------------------------- Actualizar búsqueda ---------------------------
const actualizarBusqueda = (query: string) => {
  searchQuery.value = query;
};

// --------------------------- Actualizar filtro ---------------------------
const actualizarFiltro = (filtro: string | number) => {
  filtroSeleccionado.value = filtro;
};

// --------------------------- Observar cambios en la ruta ---------------------------
watch(() => route.params.id, () => {
  // Resetear el filtro cuando cambiamos de curso
  filtroSeleccionado.value = 'Todos';
  cargarVideos();
});

// --------------------------- Cargar datos al montar ---------------------------
onMounted(() => {
  // Asegurar que el usuario esté cargado desde localStorage si es necesario
  if (!usuarioLogeadoStore.usuarioActual) {
    usuarioLogeadoStore.cargarUsuarioDesdeStorage();
  }
    console.log('👀 Usuario desde localStorage:', JSON.stringify(JSON.parse(localStorage.getItem('usuario-logeado')), null, 2));

  cargarVideos();
});
</script>

<template>
  <v-app>
    <!-- --------------------------- Header --------------------------- -->
    <Header 
      @toggle-sidebar="drawer = !drawer" 
      @update-search="actualizarBusqueda"
    />
    
    <!-- --------------------------- Contenedor principal --------------------------- -->
    <v-main class="HomePage">
      <!-- --------------------------- Sidebar --------------------------- -->
      <Sidebar v-model="drawer" />
      
      <!-- --------------------------- Contenido principal --------------------------- -->
      <div>
        <!-- Banner del curso (solo si estamos viendo un curso específico) -->
        <div v-if="cursoId && curso" class="HomePage__Banner" :style="{ backgroundImage: `url(${bannerImage})` }">
          <div class="HomePage__BannerOverlay">
            <v-container class="HomePage__BannerContent">
              <v-breadcrumbs :items="[
                { title: 'Cursos', href: '/cursos' },
                { title: curso.nombre, disabled: true }
              ]" class="HomePage__Breadcrumbs px-0">
                <template v-slot:prepend>
                  <v-icon icon="mdi-book-open-variant" size="small" color="white"></v-icon>
                </template>
                <template v-slot:divider>
                  <v-icon icon="mdi-chevron-right" size="small" color="white"></v-icon>
                </template>
              </v-breadcrumbs>
              
              <h1 class="text-h3 font-weight-bold text-white mb-2">{{ curso.nombre }}</h1>
              <p v-if="curso.descripcion" class="text-h6 text-white mb-4 HomePage__Description">
                {{ curso.descripcion }}
              </p>
              
              <!-- Fragmento del template donde van los botones (línea ~125 aprox) -->
              <div class="d-flex align-center">
                <v-chip 
                  color="orange" 
                  variant="elevated" 
                  class="mr-2" 
                  size="large"
                >
                  <v-icon start icon="mdi-play-circle" class="mr-1"></v-icon>
                  {{ videosFiltrados.length }} videos
                </v-chip>
                
                <!-- Botón Subir Video (solo visible para usuarios con permisos) -->
                <v-btn 
                  v-if="puedeSubirVideo" 
                  color="success" 
                  variant="elevated" 
                  size="small" 
                  class="ml-2" 
                  :to="`/subir-video/${cursoId}`"
                >
                  <v-icon start icon="mdi-upload" class="mr-1"></v-icon>
                  Subir Video
                </v-btn>
                
                <!-- Botón para añadir asignatura (solo visible para el creador) -->
                <v-btn 
                  v-if="esCreadorCurso" 
                  color="primary" 
                  variant="elevated" 
                  size="small" 
                  class="ml-2" 
                  :to="`/curso/${cursoId}/asignaturas`"
                >
                  <v-icon start icon="mdi-book-plus" class="mr-1"></v-icon>
                  Añadir asignatura
                </v-btn>

              </div>
            </v-container>
          </div>
        </div>
        
        <v-container class="HomePage__Contenedor">
          <!-- Estado de carga -->
          <div v-if="loading" class="d-flex justify-center my-8">
            <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
          </div>
          
          <template v-else>
            <!-- --------------------------- Filtros por asignatura --------------------------- -->
            <Filtros 
              @filtro-seleccionado="actualizarFiltro" 
              :filtro-actual="filtroSeleccionado"
              :curso-id="cursoId"
            />
            
            <v-divider class="my-2"></v-divider>
            
            <!-- --------------------------- Sugerencias --------------------------- -->
            <Sugerencias :videos="videosSugeridos" />
            
            <v-divider class="my-4"></v-divider>
            
            <!-- --------------------------- Lista de videos --------------------------- -->
            <ListaVideos :videos="videosFiltrados" />
            
            <!-- Mensaje si no hay videos -->
            <v-alert
              v-if="videosFiltrados.length === 0"
              type="info"
              text="No se encontraron videos con los filtros actuales."
              class="mt-4"
            ></v-alert>
          </template>
        </v-container>
      </div>
    </v-main>

    <!-- Modal para añadir asignatura -->
    <AgregarAsignaturaModal
      :mostrar="mostrarModalAsignatura"
      :curso-id="cursoId || 0"
      @cerrar="mostrarModalAsignatura = false"
      @asignatura-creada="asignaturaCreada"
    />
  </v-app>
</template>

<style scoped>
/* Estilos sin cambios, se mantienen igual */
.HomePage {
  background-color: #f9f9f9;
  min-height: 100vh;
}

.HomePage__Contenedor {
  padding-top: 16px;
  max-width: 1800px;
}

.HomePage__Banner {
  position: relative;
  height: 300px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.HomePage__BannerOverlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 100%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.HomePage__BannerContent {
  padding-bottom: 32px;
}

.HomePage__Breadcrumbs {
  color: white !important;
}

.HomePage__Breadcrumbs :deep(.v-breadcrumbs-item--disabled) {
  opacity: 0.8;
  color: white !important;
}

.HomePage__Breadcrumbs :deep(.v-breadcrumbs-item) {
  color: white !important;
}

.HomePage__Description {
  max-width: 800px;
  text-shadow: 0 1px 3px rgba(0,0,0,0.3);
}

@media (max-width: 600px) {
  .HomePage__Banner {
    height: 220px;
  }
  
  .HomePage__BannerContent {
    padding-bottom: 16px;
  }
  
  .HomePage__Contenedor {
    padding: 8px;
  }
}
</style>