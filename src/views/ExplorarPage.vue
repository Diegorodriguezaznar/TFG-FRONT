<!-- src/views/ExplorarPage.vue - Versión Modular -->
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useVideoStore } from '@/stores/Video';
import { useAsignaturaStore } from '@/stores/Asignaturas';
import { useUsuarioLogeadoStore } from '@/stores/UsuarioLogeado';
import HeaderVideos from '@/components/Layout/HeaderVideos.vue';
import Sidebar from '@/components/Layout/Sidebar.vue';
import ExplorarHeader from '@/components/Video/Explorar/ExplorarHeader.vue';
import FiltrosSection from '@/components/Video/Explorar/FiltrosSection.vue';
import VideosGrid from '@/components/Video/Explorar/VideosGrid.vue';
import VideosList from '@/components/Video/Explorar/VideosList.vue';
import EstadoCarga from '@/components/Video/Explorar/EstadoCarga.vue';
import EstadoVacio from '@/components/Video/Explorar/EstadoVacio.vue';

// Stores
const videoStore = useVideoStore();
const asignaturaStore = useAsignaturaStore();
const usuarioLogeadoStore = useUsuarioLogeadoStore();

// Variables reactivas principales
const drawer = ref(false);
const searchQuery = ref('');
const loading = ref(true);
const vista = ref<'grid' | 'list'>('grid');

// Estados de filtros
const filtros = ref({
  asignatura: 'Todos',
  duracion: 'Todas',
  fechaPublicacion: 'Todas',
  ordenarPor: 'Más Recientes',
  soloFavoritos: false
});

// Función para obtener minutos de duración
const obtenerMinutosDuracion = (duracion: string): number => {
  if (!duracion || duracion === '00:00') return 0;
  const partes = duracion.split(':');
  if (partes.length === 2) {
    const minutos = parseInt(partes[0]) || 0;
    const segundos = parseInt(partes[1]) || 0;
    return minutos + (segundos / 60);
  }
  return 0;
};

// Función para obtener días desde publicación
const obtenerDiasDesdePublicacion = (fechaSubida: string): number => {
  if (!fechaSubida) return 0;
  const fechaPublicacion = new Date(fechaSubida);
  const fechaActual = new Date();
  const diferenciaTiempo = fechaActual.getTime() - fechaPublicacion.getTime();
  return Math.ceil(diferenciaTiempo / (1000 * 3600 * 24));
};

// Videos filtrados (lógica principal)
const videosFiltrados = computed(() => {
  let videos = [...videoStore.videos];

  // Filtro por búsqueda
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    videos = videos.filter(video => 
      video.titulo.toLowerCase().includes(query) ||
      video.descripcion.toLowerCase().includes(query) ||
      video.autor.toLowerCase().includes(query) ||
      video.asignatura.toLowerCase().includes(query)
    );
  }

  // Filtro por asignatura
  if (filtros.value.asignatura !== 'Todos') {
    videos = videos.filter(video => 
      video.idAsignatura === filtros.value.asignatura
    );
  }

  // Filtro por duración
  if (filtros.value.duracion !== 'Todas') {
    videos = videos.filter(video => {
      const minutos = obtenerMinutosDuracion(video.duracion);
      switch (filtros.value.duracion) {
        case 'Corto': return minutos < 5;
        case 'Medio': return minutos >= 5 && minutos <= 15;
        case 'Largo': return minutos > 15;
        default: return true;
      }
    });
  }

  // Filtro por fecha de publicación
  if (filtros.value.fechaPublicacion !== 'Todas') {
    videos = videos.filter(video => {
      const dias = obtenerDiasDesdePublicacion(video.fechaSubida);
      switch (filtros.value.fechaPublicacion) {
        case 'Hoy': return dias <= 1;
        case 'Semana': return dias <= 7;
        case 'Mes': return dias <= 30;
        case 'Año': return dias <= 365;
        default: return true;
      }
    });
  }

  // Ordenamiento
  switch (filtros.value.ordenarPor) {
    case 'Más Recientes':
      videos.sort((a, b) => new Date(b.fechaSubida).getTime() - new Date(a.fechaSubida).getTime());
      break;
    case 'Más Antiguos':
      videos.sort((a, b) => new Date(a.fechaSubida).getTime() - new Date(b.fechaSubida).getTime());
      break;
    case 'Más Likes':
      videos.sort((a, b) => (b.contadorLikes || 0) - (a.contadorLikes || 0));
      break;
    case 'Menos Likes':
      videos.sort((a, b) => (a.contadorLikes || 0) - (b.contadorLikes || 0));
      break;
    case 'Duración Ascendente':
      videos.sort((a, b) => obtenerMinutosDuracion(a.duracion) - obtenerMinutosDuracion(b.duracion));
      break;
    case 'Duración Descendente':
      videos.sort((a, b) => obtenerMinutosDuracion(b.duracion) - obtenerMinutosDuracion(a.duracion));
      break;
    case 'Alfabético':
      videos.sort((a, b) => a.titulo.localeCompare(b.titulo));
      break;
    case 'Alfabético Inverso':
      videos.sort((a, b) => b.titulo.localeCompare(a.titulo));
      break;
  }

  return videos;
});

// Métodos de eventos
const toggleSidebar = () => {
  drawer.value = !drawer.value;
};

const updateSearch = (query: string) => {
  searchQuery.value = query;
};

const actualizarFiltro = (campo: string, valor: any) => {
  if (campo === 'reset') {
    filtros.value = {
      asignatura: 'Todos',
      duracion: 'Todas',
      fechaPublicacion: 'Todas',
      ordenarPor: 'Más Recientes',
      soloFavoritos: false
    };
    searchQuery.value = '';
  } else {
    filtros.value[campo] = valor;
  }
};

const cambiarVista = (nuevaVista: 'grid' | 'list') => {
  vista.value = nuevaVista;
};

const limpiarFiltros = () => {
  actualizarFiltro('reset', true);
};

// Carga inicial de datos
const cargarDatos = async () => {
  loading.value = true;
  try {
    await Promise.all([
      videoStore.fetchAllVideos(),
      asignaturaStore.fetchAllAsignaturas()
    ]);
  } catch (error) {
    console.error('Error al cargar datos:', error);
  } finally {
    loading.value = false;
  }
};

// Lifecycle
onMounted(() => {
  cargarDatos();
});
</script>

<template>
  <v-app>
    <HeaderVideos @toggle-sidebar="toggleSidebar" @update-search="updateSearch" />
    
    <v-main>
      <Sidebar v-model="drawer" />
      
      <v-container fluid class="ExplorarPage">
        <!-- Header principal -->
        <ExplorarHeader 
          :vista="vista"
          @cambiar-vista="cambiarVista"
          @limpiar-filtros="limpiarFiltros"
        />
        
        <!-- Sección de filtros -->
        <FiltrosSection
          :asignaturas="asignaturaStore.asignaturas"
          :filtros="filtros"
          @actualizar-filtro="actualizarFiltro"
          class="mb-6"
        />
        
        <!-- Estado de carga -->
        <EstadoCarga v-if="loading" />
        
        <!-- Sin resultados -->
        <EstadoVacio 
          v-else-if="videosFiltrados.length === 0"
          :tiene-busqueda="!!searchQuery"
          @limpiar-filtros="limpiarFiltros"
        />
        
        <!-- Contenido de videos -->
        <div v-else class="ExplorarPage__Content">
          <!-- Vista de grilla -->
          <VideosGrid 
            v-if="vista === 'grid'"
            :videos="videosFiltrados"
          />
          
          <!-- Vista de lista -->
          <VideosList 
            v-else
            :videos="videosFiltrados"
          />
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.ExplorarPage {
  background: linear-gradient(135deg, rgba(244, 67, 54, 0.05) 0%, #ffffff 50%, rgba(255, 138, 128, 0.03) 100%);
  min-height: 100vh;
  padding-top: 0 !important; 
}

.ExplorarPage__Content {
  animation: fadeIn 0.6s ease-in-out;
}

@keyframes fadeIn {
  from { 
    opacity: 0; 
    transform: translateY(20px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}

/* Responsive */
@media (max-width: 600px) {
  .ExplorarPage {
    padding: 16px;
  }
}
</style>