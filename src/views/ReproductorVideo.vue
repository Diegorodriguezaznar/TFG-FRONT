<script setup lang="ts">
// --------------------------- Imports ---------------------------
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useVideoStore } from '@/stores/Video';
import { useMarcadorVideoStore } from '@/stores/MarcadorVideo';
import ReproductorVideo from '@/components/Video/VideoPlayer.vue'; 
import ComentariosVideo from '@/components/Video/VideoComments.vue';
import InfoCanal from '@/components/Video/PaginaDeReproductor/InfoCanal.vue';
import MarcadoresTiempo from '@/components/Video/PaginaDeReproductor/MarcadoresTiempo.vue';
import ReportarVideo from '@/components/Video/PaginaDeReproductor/ReportarVideo.vue';
import VideosSugeridos from '@/components/Video/PaginaDeReproductor/VideosSugeridos.vue';
import CargandoVideo from '@/components/Video/PaginaDeReproductor/CargaVideo.vue';
import Cabecera from '@/components/Layout/Header.vue';
import BarraLateral from '@/components/Layout/Sidebar.vue';
import type { VideoDTO } from '@/stores/dtos/VideoDTO';
import type { MarcadorVideoDTO } from '@/stores/dtos/MarcadorVideoDTO';
import { useFavoritoStore } from '@/stores/Favorito'
import { useUsuarioLogeadoStore } from '@/stores/UsuarioLogeado'


// --------------------------- Route ---------------------------
const route = useRoute();
const router = useRouter();

// --------------------------- Store ---------------------------
const videoStore = useVideoStore();
const marcadorVideoStore = useMarcadorVideoStore();
const favoritoStore = useFavoritoStore()
const usuarioLogeadoStore = useUsuarioLogeadoStore()


// --------------------------- Variables ---------------------------
const sidebarOpen = ref(true);
const searchQuery = ref('');
const loading = ref(true);
const error = ref('');
const marcadores = ref<MarcadorVideoDTO[]>([]);
const loadingMarcadores = ref(false);

// Inicializar currentVideo con valores por defecto para evitar errores durante la carga
const currentVideo = ref<VideoDTO>({
  idVideo: 0,
  titulo: 'Cargando...',
  descripcion: 'Cargando descripción...',
  url: '',
  miniatura: 'https://picsum.photos/seed/loading/300/200',
  fechaSubida: '',
  idAsignatura: 0,
  asignatura: 'Cargando...',
  idUsuario: 0,
  autor: 'Cargando...',
  idCurso: 0,
  vistas: '0',
  fecha: 'Cargando...',
  duracion: '00:00' 
});

// Lista de videos sugeridos
const suggestedVideos = ref<VideoDTO[]>([]);

// ID del video desde la URL
const videoId = computed(() => {
  return route.query.id ? Number(route.query.id) : 1; // Default a 1 para evitar problemas
});

// Computed para verificar si es favorito
const esFavorito = computed(() => {
  const resultado = favoritoStore.esFavorito(currentVideo.value.idVideo)
  return resultado
})

// --------------------------- Métodos ---------------------------
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};

const updateSearch = (query: string) => {
  searchQuery.value = query;
};

// SOLUCIÓN DEFINITIVA: Usar el router de Vue en lugar de window.location
const handleVideoSelect = (videoId: number) => {
  router.push({ 
    path: '/reproductor-video', 
    query: { id: videoId.toString() } 
  });
};

// Ir a un tiempo específico del video
const seekToTime = (time: number) => {
  const videoElement = document.querySelector('video');
  if (videoElement) {
    videoElement.currentTime = time;
    // Si el video estaba pausado, iniciarlo
    if (videoElement.paused) {
      videoElement.play();
    }
  }
};

// --------------------------- Cargar datos ---------------------------
// Cargar el video actual
const loadCurrentVideo = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    const video = await videoStore.fetchVideoById(videoId.value);
    if (video) {
      currentVideo.value = video;
      // Si no tiene duración, asignar un valor por defecto
      if (!currentVideo.value.duracion) {
        currentVideo.value.duracion = '00:00';
      }
      console.log('Video cargado:', currentVideo.value.idVideo)
    } else {
      error.value = 'No se encontró el video solicitado';
    }
  } catch (err: any) {
    error.value = err.message || 'Error al cargar el video';
    console.error('Error al cargar el video:', err);
  } finally {
    loading.value = false;
  }
};

// Cargar marcadores del video
const loadMarcadores = async () => {
  if (!videoId.value) return;
  
  loadingMarcadores.value = true;
  
  try {
    marcadores.value = await marcadorVideoStore.fetchMarcadoresByVideoId(videoId.value);
  } catch (err: any) {
    console.error('Error al cargar marcadores:', err);
  } finally {
    loadingMarcadores.value = false;
  }
};

// Favoritos mejorado
const toggleFavorito = async () => {
  console.log('=== INICIANDO TOGGLE FAVORITO ===')
  
  // Verificar estado del usuario antes del toggle
  console.log('Usuario antes del toggle:', usuarioLogeadoStore.usuario)
  console.log('¿Está autenticado?:', usuarioLogeadoStore.estaAutenticado)
  
  // Si no hay usuario, intentar cargarlo con el método disponible
  if (!usuarioLogeadoStore.usuario?.idUsuario) {
    console.log('Intentando cargar usuario...')
    if (typeof usuarioLogeadoStore.cargarUsuario === 'function') {
      await usuarioLogeadoStore.cargarUsuario()
    } else if (typeof usuarioLogeadoStore.inicializar === 'function') {
      await usuarioLogeadoStore.inicializar()
    } else if (typeof usuarioLogeadoStore.verificarAutenticacion === 'function') {
      await usuarioLogeadoStore.verificarAutenticacion()
    }
  }
  
  await favoritoStore.toggleFavorito(currentVideo.value.idVideo)
  console.log('=== FIN TOGGLE FAVORITO ===')
}

// Cargar videos sugeridos
const loadSuggestedVideos = async () => {
  try {
    const videos = await videoStore.fetchAllVideos();
    // Filtrar para excluir el video actual y limitar a 8 videos
    suggestedVideos.value = videos
      .filter(v => v.idVideo !== videoId.value)
      .slice(0, 8);
  } catch (err: any) {
    console.error('Error al cargar videos sugeridos:', err);
  }
};

// --------------------------- Ciclo de vida ---------------------------
onMounted(async () => {
  console.log('=== INICIANDO COMPONENTE ===')
  
  // Cargar usuario primero (verificar qué método existe)
  if (typeof usuarioLogeadoStore.cargarUsuario === 'function') {
    await usuarioLogeadoStore.cargarUsuario()
  } else if (typeof usuarioLogeadoStore.inicializar === 'function') {
    await usuarioLogeadoStore.inicializar()
  } else if (typeof usuarioLogeadoStore.verificarAutenticacion === 'function') {
    await usuarioLogeadoStore.verificarAutenticacion()
  }
  
  console.log('Usuario cargado:', usuarioLogeadoStore.usuario)
  
  await loadCurrentVideo();
  await loadMarcadores();
  await loadSuggestedVideos();
  await favoritoStore.cargarFavoritos();
  
  console.log('=== COMPONENTE CARGADO ===')
});

// SOLUCIÓN: Mejorar el watcher para evitar recargas innecesarias
watch(() => route.query.id, async (newId, oldId) => {
  if (newId !== oldId) {
    console.log('Cambiando de video:', oldId, '->', newId)
    await loadCurrentVideo();
    await loadMarcadores();
    await loadSuggestedVideos();
  }
});
</script>

<template>
  <v-app>
    <!-- Cabecera -->
    <Cabecera @toggle-sidebar="toggleSidebar" @update-search="updateSearch" />
    
    <!-- Barra lateral -->
    <BarraLateral v-model="sidebarOpen" />
    
    <!-- Contenido principal -->
    <v-main>
      <!-- Componente de carga o error -->
      <CargandoVideo v-if="loading || error" :error="error" />
      
      <v-container v-else fluid class="pa-0 pa-sm-4">
        <v-row>
          <!-- Columna izquierda con el reproductor de video -->
          <v-col cols="12" md="8">
            <ReproductorVideo :video="currentVideo" />
            <div class="d-flex justify-start mt-2">
              <v-btn
                icon
                @click="toggleFavorito"
                :class="esFavorito ? 'bg-yellow-darken-2' : 'bg-grey-lighten-1'"
                :disabled="!usuarioLogeadoStore.usuario?.idUsuario"
              >
                <v-icon size="32">
                  {{ esFavorito ? 'mdi-star' : 'mdi-star-outline' }}
                </v-icon>
              </v-btn>
              
              <!-- Info de debug temporal -->
              <div class="ml-2 d-flex flex-column justify-center">
                <small class="text-grey">
                  Video: {{ currentVideo.idVideo }} | 
                  Usuario: {{ usuarioLogeadoStore.usuario?.idUsuario || 'No logueado' }}
                </small>
                <small class="text-grey">
                  Favorito: {{ esFavorito ? 'Sí' : 'No' }} | 
                  Total: {{ favoritoStore.favoritos.length }}
                </small>
              </div>
            </div>
          </v-col>
          
          <!-- Columna derecha con información del profesor -->
          <v-col cols="12" md="4">
            <div class="tarjeta-canal">
              <!-- Información del canal -->
              <InfoCanal :video="currentVideo" />
              
              <!-- Marcadores de tiempo -->
              <MarcadoresTiempo 
                :marcadores="marcadores" 
                :loading-marcadores="loadingMarcadores" 
                @seek="seekToTime" 
              />
              
              <!-- Botón para reportar video -->
              <ReportarVideo :id-video="currentVideo.idVideo" />
            </div>
          </v-col>
        </v-row>
        
        <!-- Videos sugeridos -->
        <VideosSugeridos 
          :videos="suggestedVideos" 
          @seleccionar-video="handleVideoSelect" 
        />
        
        <!-- Comentarios -->
        <v-row>
          <v-col cols="12">
            <ComentariosVideo :video-id="videoId" />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>