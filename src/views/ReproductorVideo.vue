<script setup lang="ts">
// --------------------------- Imports ---------------------------
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useVideoStore } from '@/stores/Video';
import { useMarcadorVideoStore } from '@/stores/MarcadorVideo';
import VideoPlayer from '@/components/Video/VideoPlayer.vue';
import VideoInfo from '@/components/Video/VideoInfo.vue';
import VideoComments from '@/components/Video/VideoComments.vue';
import Header from '@/components/Layout/Header.vue';
import Sidebar from '@/components/Layout/Sidebar.vue';
import type { VideoDTO } from '@/stores/dtos/VideoDTO';
import type { MarcadorVideoDTO } from '@/stores/dtos/MarcadorVideoDTO';

// --------------------------- Route ---------------------------
const route = useRoute();

// --------------------------- Store ---------------------------
const videoStore = useVideoStore();
const marcadorVideoStore = useMarcadorVideoStore();

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

// --------------------------- Métodos ---------------------------
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};

const updateSearch = (query: string) => {
  searchQuery.value = query;
};

const handleVideoSelect = (videoId: number) => {
  // Utilizamos el router para navegar al nuevo video
  window.location.href = `/reproductor-video?id=${videoId}`;
};

// Formatear tiempo en segundos a formato mm:ss
const formatTime = (seconds: number): string => {
  if (isNaN(seconds) || !isFinite(seconds)) return '00:00';
  
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

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
    console.log('Marcadores cargados:', marcadores.value);
  } catch (err: any) {
    console.error('Error al cargar marcadores:', err);
  } finally {
    loadingMarcadores.value = false;
  }
};

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

// --------------------------- Cargar datos iniciales ---------------------------
onMounted(async () => {
  await loadCurrentVideo();
  await loadMarcadores();
  await loadSuggestedVideos();
});

// Observar cambios en el ID del video para recargar los datos
watch(() => route.query.id, async () => {
  await loadCurrentVideo();
  await loadMarcadores();
  await loadSuggestedVideos();
});

/// --------------------------- Reportar video ---------------------------
import { useReporteStore } from '@/stores/Reporte'
import type { ReporteDTO } from '@/stores/dtos/ReporteDTO'

const reporteStore = useReporteStore()
const dialogReportar = ref(false)
const motivoSeleccionado = ref('Contenido engañoso')
const motivos = [
  'Contenido engañoso',
  'Violación de privacidad',
  'Contenido explícito',
  'Acoso o bullying',
  'Spam',
  'Otro'
]
const idUsuario = 1 // ← sustituye esto si tienes auth

const enviarReporte = async () => {
  const nuevoReporte: ReporteDTO = {
    idVideo: currentVideo.value.idVideo,
    idUsuario,
    motivo: motivoSeleccionado.value
  }
  await reporteStore.crearReporte(nuevoReporte)
  dialogReportar.value = false
}

</script>

<template>
  <v-app>
    <!-- Header -->
    <Header @toggle-sidebar="toggleSidebar" @update-search="updateSearch" />
    
    <!-- Sidebar con posición absoluta -->
    <Sidebar v-model="sidebarOpen" />
    
    <!-- Contenido principal sin márgenes dependientes del sidebar -->
    <v-main>
      <div v-if="loading" class="d-flex justify-center align-center" style="height: 50vh;">
        <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      </div>
      
      <div v-else-if="error" class="d-flex justify-center align-center flex-column" style="height: 50vh;">
        <v-icon color="error" size="64" class="mb-4">mdi-alert-circle</v-icon>
        <h2 class="text-h5 text-center mb-2">No se pudo cargar el video</h2>
        <p class="text-body-1 text-center">{{ error }}</p>
        <v-btn color="primary" class="mt-4" to="/cursos">
          Volver a cursos
        </v-btn>
      </div>
      
      <v-container v-else fluid class="pa-0 pa-sm-4">
        <v-row>
          <!-- Columna izquierda con el reproductor de video -->
          <v-col cols="12" md="8">
            <VideoPlayer :video="currentVideo" />
          </v-col>
          
          <!-- Columna derecha con información del profesor -->
          <v-col cols="12" md="4">
            <div class="channel-card">
              <div class="d-flex align-center mb-3">
                <v-avatar size="50" class="mr-3">
                  <v-img src="https://picsum.photos/seed/profesor/50/50" alt="Avatar del profesor"></v-img>
                </v-avatar>
                <div>
                  <h3 class="text-h6 mb-0">{{ currentVideo.autor }}</h3>
                  <div class="text-subtitle-2 text-grey">{{ currentVideo.asignatura }}</div>
                </div>
              </div>
              
              <v-btn color="orange" block>Seguir</v-btn>
              <div class="text-caption text-center mt-1">{{ currentVideo.vistas }} suscriptores</div>
              
              <h3 class="text-h6 font-weight-bold mt-4">{{ currentVideo.titulo }}</h3>
              <p class="text-body-2">
                {{ currentVideo.descripcion && currentVideo.descripcion.length > 100 
                   ? currentVideo.descripcion.substring(0, 100) + '...' 
                   : currentVideo.descripcion }}
              </p>
              
              <!-- Secciones del video con marcas de tiempo desde la base de datos -->
              <div v-if="marcadores.length > 0" class="video-sections mt-4">
                <h4 class="text-subtitle-2 mb-2">
                  <v-icon size="small" class="mr-1">mdi-bookmark-outline</v-icon>
                  Marcadores de tiempo
                </h4>
                
                <div 
                  v-for="(marcador, index) in marcadores" 
                  :key="index"
                  class="section-item d-flex align-center py-1"
                  @click="seekToTime(marcador.minutoImportante)"
                >
                  <span class="time-mark">{{ formatTime(marcador.minutoImportante) }}</span>
                  <span class="ml-2">{{ marcador.titulo || `Marcador ${index + 1}` }}</span>
                </div>
                
                <div v-if="marcadores.length === 0 && !loadingMarcadores" class="text-center py-2 text-grey">
                  No hay marcadores para este video
                </div>
                
                <div v-if="loadingMarcadores" class="text-center py-2">
                  <v-progress-circular indeterminate size="20" color="grey" class="mr-2"></v-progress-circular>
                  Cargando marcadores...
                </div>
              </div>
              
              <!-- Mensaje cuando no hay marcadores -->
              <div v-else-if="!loadingMarcadores" class="video-sections mt-4">
                <div class="text-center py-3 text-grey-darken-1">
                  <v-icon size="large" class="mb-2 text-grey">mdi-bookmark-off-outline</v-icon>
                  <p>No hay marcadores disponibles para este video</p>
                </div>
              </div>
              
              <!-- Cargando marcadores -->
              <div v-else class="video-sections mt-4">
                <div class="text-center py-3">
                  <v-progress-circular indeterminate size="24" color="grey" class="mb-2"></v-progress-circular>
                  <p class="text-grey-darken-1">Cargando marcadores...</p>
                </div>
              </div>

              <v-btn
                class="mt-4"
                color="warning"
                variant="outlined"
                prepend-icon="mdi-flag"
                block
                @click="dialogReportar = true"
              >
                Reportar vídeo
              </v-btn>

              <v-dialog v-model="dialogReportar" max-width="500px">
                <v-card>
                  <v-card-title>Reportar este vídeo</v-card-title>
                  <v-card-text>
                    <v-radio-group v-model="motivoSeleccionado">
                      <v-radio
                        v-for="motivo in motivos"
                        :key="motivo"
                        :label="motivo"
                        :value="motivo"
                      />
                    </v-radio-group>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer />
                    <v-btn text @click="dialogReportar = false">Cancelar</v-btn>
                    <v-btn color="error" @click="enviarReporte">Enviar</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>

            </div>
          </v-col>
        </v-row>
        
        <h3 class="text-subtitle-1 font-weight-bold mb-3 mt-5 ml-2">Sugerencias</h3>
        
        <!-- Fila de videos sugeridos -->
        <v-row>
          <v-col cols="12">
            <div class="d-flex overflow-x-auto pb-3 suggested-videos-row">
              <div v-for="(video, index) in suggestedVideos.slice(0, 4)" :key="index" 
                   class="suggested-video-card mr-4" @click="handleVideoSelect(video.idVideo)">
                <v-img :src="video.miniatura" height="120" cover class="rounded"></v-img>
                <div class="text-body-2 font-weight-medium mt-2 video-title">{{ video.titulo }}</div>
                <div class="text-caption text-grey">{{ video.autor }}</div>
              </div>
            </div>
          </v-col>
        </v-row>
        
        <!-- Comentarios -->
        <v-row>
          <v-col cols="12">
            <VideoComments :video-id="videoId" />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
/* Elimina las clases ml-240 y ml-80 que ya no son necesarias */

.channel-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
}

.time-mark {
  background-color: #f0f0f0;
  border-radius: 4px;
  padding: 2px 6px;
  font-size: 12px;
  color: #666;
}

.section-item {
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.section-item:hover {
  background-color: #f5f5f5;
}

.suggested-video-card {
  width: 210px;
  min-width: 210px;
  cursor: pointer;
}

.suggested-videos-row {
  scrollbar-width: thin;
}

.suggested-videos-row::-webkit-scrollbar {
  height: 6px;
}

.suggested-videos-row::-webkit-scrollbar-thumb {
  background-color: #c0c0c0;
  border-radius: 3px;
}

.video-title {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (max-width: 960px) {
  .suggested-video-card {
    width: 180px;
    min-width: 180px;
  }
}
</style>