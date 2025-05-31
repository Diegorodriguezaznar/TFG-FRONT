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
    <div v-if="favoritos.length > 0" class="lista-videos-favoritos__grid">
      <div v-for="video in favoritos" :key="video.idVideo" class="lista-videos-favoritos__item">
        <div class="video-card" @click="verVideo(video)">
          <div class="video-card__imagen">
            <v-img :src="video.miniatura || `https://picsum.photos/seed/${video.idVideo}/400/225`" height="200" cover>
              
              <!-- Título en chip rojo -->
              <v-chip
                variant="elevated"
                size="small"
                class="video-card__titulo"
                color="pink"
              >
                {{ video.titulo }}
              </v-chip>
              
              <!-- Botón de favorito -->
              <v-btn
                icon
                size="small"
                color="white-darken-2"
                class="video-card__favorito"
                @click.stop="quitarDeFavoritos(video.idVideo)"
              >
                <v-icon color="pink">mdi-heart</v-icon>
              </v-btn>
              
              <template v-slot:placeholder>
                <div class="video-card__placeholder">
                  <v-progress-circular indeterminate color="grey-lighten-4"></v-progress-circular>
                </div>
              </template>
            </v-img>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Estado de carga -->
    <div v-else-if="cargando" class="lista-videos-favoritos__estado">
      <v-progress-circular indeterminate color="primary" class="lista-videos-favoritos__spinner"></v-progress-circular>
      <div class="lista-videos-favoritos__mensaje">Cargando videos favoritos...</div>
    </div>
    
    <!-- Estado vacío -->
    <div v-else class="lista-videos-favoritos__estado">
      <v-icon size="80" color="grey-lighten-2" class="lista-videos-favoritos__icono">mdi-star-outline</v-icon>
      <div class="lista-videos-favoritos__titulo-vacio">No tienes videos favoritos</div>
      <div class="lista-videos-favoritos__mensaje">Explora videos y marca tus favoritos </div>
      <v-btn 
        @click="router.push('/videos')" 
        color="primary" 
        prepend-icon="mdi-compass"
        class="lista-videos-favoritos__boton"
      >
        Explorar Videos
      </v-btn>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/sass/components/Video/VideosFavoritos.scss";
</style>