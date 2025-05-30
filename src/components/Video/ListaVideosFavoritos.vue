<script setup lang="ts">
// --------------------------- Imports ---------------------------
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useFavoritoStore } from '@/stores/Favorito';
import { useUsuarioLogeadoStore } from '@/stores/UsuarioLogeado';

// --------------------------- Router y Stores ---------------------------
const router = useRouter();
const favoritoStore = useFavoritoStore();
const usuarioLogeadoStore = useUsuarioLogeadoStore();

// --------------------------- Variables ---------------------------
const cargando = ref(false);

// --------------------------- Computed ---------------------------
const favoritos = computed(() => favoritoStore.favoritos);

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
    return fechaStr;
  }
};

// Quitar de favoritos
const quitarDeFavoritos = async (idVideo: number) => {
  try {
    await favoritoStore.toggleFavorito(idVideo);
  } catch (error) {
    console.error('Error al quitar de favoritos:', error);
  }
};

// Recargar favoritos
const recargarFavoritos = async () => {
  cargando.value = true;
  try {
    await favoritoStore.cargarFavoritos();
  } catch (error) {
    console.error('Error al cargar favoritos:', error);
  } finally {
    cargando.value = false;
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

// --------------------------- Onmounted ---------------------------
onMounted(async () => {
  if (!usuarioLogeadoStore.estaAutenticado) {
    router.push('/login');
    return;
  }
  
  await recargarFavoritos();
});
</script>

<template>
  <div class="ListaVideosFavoritos">
    <!-- Header -->
    <div class="d-flex justify-space-between align-center mb-4">
      <div>
        <div class="text-h5 font-weight-bold d-flex align-center">
          <v-icon size="28" color="pink" class="mr-2">mdi-heart</v-icon>
          Mis Videos Favoritos
        </div>
        <div class="text-body-2 text-grey mt-1">
          {{ favoritos.length }} video{{ favoritos.length !== 1 ? 's' : '' }} favorito{{ favoritos.length !== 1 ? 's' : '' }}
        </div>
      </div>
      
      <v-btn
        @click="recargarFavoritos"
        :loading="cargando"
        variant="outlined"
        color="primary"
        prepend-icon="mdi-refresh"
      >
        Actualizar
      </v-btn>
    </div>
    
    <!-- Lista de videos -->
    <v-row v-if="favoritos.length > 0">
      <v-col v-for="video in favoritos" :key="video.idVideo" cols="12" sm="6" md="4" lg="3">
        <v-card class="ListaVideosFavoritos__Card" elevation="1" rounded="lg" @click="verVideo(video)">
          <v-img :src="video.miniatura || `https://picsum.photos/seed/${video.idVideo}/400/225`" height="180" cover>
            
            <!-- Botón de favorito -->
            <v-btn
              icon
              size="small"
              color="yellow-darken-2"
              class="ListaVideosFavoritos__FavoritoBtn"
              @click.stop="quitarDeFavoritos(video.idVideo)"
            >
              <v-icon>mdi-heart</v-icon>
            </v-btn>
            
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
                    {{ formatearFecha(video.fechaSubida) }}
                  </div>
                </v-card-subtitle>
              </v-col>
            </v-row>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>
    
    <!-- Estado de carga -->
    <v-row v-else-if="cargando">
      <v-col cols="12" class="text-center py-8">
        <v-progress-circular indeterminate color="primary" class="mb-4"></v-progress-circular>
        <div class="text-body-2 text-grey">Cargando videos favoritos...</div>
      </v-col>
    </v-row>
    
    <!-- Estado vacío -->
    <v-row v-else>
      <v-col cols="12" class="text-center py-8">
        <v-icon size="80" color="grey-lighten-2" class="mb-4">mdi-star-outline</v-icon>
        <div class="text-h6 text-grey">No tienes videos favoritos</div>
        <div class="text-body-2 text-grey mb-4">Explora videos y marca tus favoritos con ⭐</div>
        <v-btn 
          @click="router.push('/videos')" 
          color="primary" 
          prepend-icon="mdi-compass"
        >
          Explorar Videos
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>
.ListaVideosFavoritos__Card {
  position: relative;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  margin-bottom: 16px;
}

.ListaVideosFavoritos__Card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) !important;
}

.ListaVideosFavoritos__Etiqueta {
  position: absolute;
  top: 8px;
  right: 8px;
}

.ListaVideosFavoritos__Duracion {
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

.ListaVideosFavoritos__FavoritoBtn {
  position: absolute;
  top: 8px;
  left: 8px;
  background: rgba(255, 255, 255, 0.9) !important;
}
</style>