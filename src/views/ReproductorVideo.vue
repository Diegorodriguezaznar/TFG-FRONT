<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useVideoStore } from '@/stores/Video';
import { useMarcadorVideoStore } from '@/stores/MarcadorVideo';
import { useFavoritoStore } from '@/stores/Favorito';
import { useUsuarioLogeadoStore } from '@/stores/UsuarioLogeado';
import ReproductorVideo from '@/components/Video/VideoPlayer.vue'; 
import ComentariosVideo from '@/components/Video/VideoComments.vue';
import InfoCanal from '@/components/Video/PaginaDeReproductor/InfoCanal.vue';
import MarcadoresTiempo from '@/components/Video/PaginaDeReproductor/MarcadoresTiempo.vue';
import ReportarVideo from '@/components/Video/PaginaDeReproductor/ReportarVideo.vue';
import CargandoVideo from '@/components/Video/PaginaDeReproductor/CargaVideo.vue';
import BarraLateral from '@/components/Layout/Sidebar.vue';
import type { VideoDTO } from '@/stores/dtos/VideoDTO';
import type { MarcadorVideoDTO } from '@/stores/dtos/MarcadorVideoDTO';
import HeaderVideos from '@/components/Layout/HeaderVideos.vue';

const route = useRoute();
const router = useRouter();

const videoStore = useVideoStore();
const marcadorVideoStore = useMarcadorVideoStore();
const favoritoStore = useFavoritoStore();
const usuarioLogeadoStore = useUsuarioLogeadoStore();

const sidebarOpen = ref(true);
const searchQuery = ref('');
const loading = ref(true);
const error = ref('');
const marcadores = ref<MarcadorVideoDTO[]>([]);
const loadingMarcadores = ref(false);
const loadingFavorito = ref(false);

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
  duracion: '00:00',
  contadorLikes: 0
});

const videoId = computed(() => {
  return route.query.id ? Number(route.query.id) : 1;
});

const esFavorito = computed(() => {
  if (!currentVideo.value.idVideo) return false;
  return favoritoStore.esFavorito(currentVideo.value.idVideo);
});

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};

const updateSearch = (query: string) => {
  searchQuery.value = query;
};

const handleVideoSelect = (videoId: number) => {
  router.push({ 
    path: '/reproductor-video', 
    query: { id: videoId.toString() } 
  });
};

const seekToTime = (time: number) => {
  const videoElement = document.querySelector('video');
  if (videoElement) {
    videoElement.currentTime = time;
    if (videoElement.paused) {
      videoElement.play();
    }
  }
};

const loadCurrentVideo = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    const video = await videoStore.fetchVideoById(videoId.value);
    if (video) {
      currentVideo.value = video;
      if (!currentVideo.value.duracion) {
        currentVideo.value.duracion = '00:00';
      }
      if (currentVideo.value.contadorLikes === undefined) {
        currentVideo.value.contadorLikes = 0;
      }
    } else {
      error.value = 'No se encontró el video solicitado';
    }
  } catch (err: any) {
    error.value = err.message || 'Error al cargar el video';
  } finally {
    loading.value = false;
  }
};

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

const toggleFavorito = async () => {
  if (!usuarioLogeadoStore.estaAutenticado) {
    alert('Debes iniciar sesión para marcar favoritos');
    return;
  }
  
  if (!currentVideo.value.idVideo) return;
  
  loadingFavorito.value = true;
  
  try {
    const resultado = await favoritoStore.toggleFavorito(currentVideo.value.idVideo);
    
    if (resultado) {
      currentVideo.value.contadorLikes = (currentVideo.value.contadorLikes || 0) + 1;
    } else {
      currentVideo.value.contadorLikes = Math.max(0, (currentVideo.value.contadorLikes || 1) - 1);
    }
    
  } catch (error: any) {
    alert('Error: ' + error.message);
  } finally {
    loadingFavorito.value = false;
  }
};

onMounted(async () => {
  await usuarioLogeadoStore.cargarUsuarioDesdeStorage();
  await loadCurrentVideo();
  await loadMarcadores();
  
  if (usuarioLogeadoStore.estaAutenticado && usuarioLogeadoStore.usuarioActual?.idUsuario) {
    await favoritoStore.cargarFavoritos();
  }
});

watch(() => route.query.id, async (newId, oldId) => {
  if (newId !== oldId) {
    await loadCurrentVideo();
    await loadMarcadores();
  }
});
</script>

<template>
  <v-app>
    <HeaderVideos @toggle-sidebar="toggleSidebar" @update-search="updateSearch" />
    <BarraLateral v-model="sidebarOpen" />
    
    <v-main>
      <CargandoVideo v-if="loading || error" :error="error" />
      
      <v-container v-else fluid class="pa-0 pa-sm-4">
        <v-row>
          <v-col cols="12" md="8">
            <ReproductorVideo :video="currentVideo" />
            
            <div class="d-flex justify-start mt-4">
              <div class="d-flex flex-column align-center">
                <v-btn
                  class="ma-1 favorite-btn"
                  :class="{ 'favorite-active': esFavorito }"
                  variant="elevated"
                  :color="esFavorito ? 'pink' : 'grey-lighten-2'"
                  :loading="loadingFavorito"
                  :disabled="!usuarioLogeadoStore.estaAutenticado || loadingFavorito"
                  @click="toggleFavorito"
                  size="large"
                >
                  <v-icon size="28">
                    {{ esFavorito ? 'mdi-heart' : 'mdi-heart-outline' }}
                  </v-icon>
                </v-btn>

                <span class="text-caption text-grey-darken-1 mt-1">
                  {{ currentVideo.contadorLikes || 0 }} me gusta
                </span>
              </div>
            </div>

            <div v-if="!usuarioLogeadoStore.estaAutenticado" class="mt-3">
              <v-alert type="info" variant="tonal" class="text-body-2">
                <v-icon start>mdi-information</v-icon>
                Inicia sesión para marcar videos como favoritos
              </v-alert>
            </div>
          </v-col>
          
          <v-col cols="12" md="4">
            <div class="tarjeta-canal">
              <InfoCanal :video="currentVideo" />
              <MarcadoresTiempo 
                :marcadores="marcadores" 
                :loading-marcadores="loadingMarcadores" 
                @seek="seekToTime" 
              />
              <ReportarVideo :id-video="currentVideo.idVideo" />
            </div>
          </v-col>
        </v-row>
        
        <v-row>
          <v-col cols="12">
            <ComentariosVideo :video-id="videoId" />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.favorite-btn {
  transition: all 0.3s ease;
}

.favorite-btn.favorite-active {
  transform: scale(1.1);
}

.favorite-btn:hover {
  transform: scale(1.05);
}

.favorite-btn:disabled {
  opacity: 0.6;
}
</style>