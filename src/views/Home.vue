<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useCursoStore } from '@/stores/Curso';
import { useVideoStore } from '@/stores/Video';
import { useUsuarioLogeadoStore } from '@/stores/UsuarioLogeado'; 
import Header from '@/components/Layout/Header.vue';
import Sidebar from '@/components/Layout/Sidebar.vue';
import Filtros from '@/components/Home/Filtros.vue';
import ListaVideos from '@/components/Home/ListaVideos.vue';
import BotonQuizes from '@/components/Home/BotonQuizes.vue';

const route = useRoute();
const cursoStore = useCursoStore();
const videoStore = useVideoStore();
const usuarioLogeadoStore = useUsuarioLogeadoStore(); 

const drawer = ref(false);
const searchQuery = ref('');
const filtroSeleccionado = ref('Todos');
const paginaActual = ref(1);
const loading = computed(() => videoStore.loading || cursoStore.loading);
const curso = computed(() => cursoStore.curso);
const mostrarModalAsignatura = ref(false);

const cursoId = computed(() => {
  if (route.path.startsWith('/curso/')) {
    const id = Number(route.params.id);
    return isNaN(id) ? null : id;
  }
  return null;
});

const esCreadorCurso = computed(() => {
  if (!curso.value) return false;
  if (!usuarioLogeadoStore.usuarioActual) return false;
  
  const usuarioActualId = usuarioLogeadoStore.usuarioActual.idUsuario;
  return curso.value.idUsuario === usuarioActualId;
});

const puedeSubirVideo = computed(() => {
  if (!usuarioLogeadoStore.usuarioActual) return false;
  if (!cursoId.value) return false;
  
  const idRol = usuarioLogeadoStore.usuarioActual.idRol;
  return [1, 2, 3].includes(idRol);
});

const bannerImage = computed(() => {
  if (curso.value?.imagen) {
    return curso.value.imagen;
  }
  
  if (cursoId.value) {
    return `https://picsum.photos/seed/${cursoId.value}/1600/400`;
  }
  
  return 'https://picsum.photos/seed/home/1600/400';
});

const videosData = computed(() => {
  return cursoId.value ? videoStore.videosCursoPaged : videoStore.videosPaged;
});

const videosFiltrados = computed(() => {
  if (!videosData.value) return [];
  
  let resultado = videosData.value.items;
  
  if (searchQuery.value) {
    resultado = resultado.filter(video => 
      video.titulo.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }
  
  if (filtroSeleccionado.value !== 'Todos') {
    resultado = resultado.filter(video => 
      video.idAsignatura === filtroSeleccionado.value
    );
  }
  
  return resultado;
});

const totalPaginas = computed(() => videosData.value?.totalPages || 1);
const hayPaginaAnterior = computed(() => videosData.value?.hasPreviousPage || false);
const hayPaginaSiguiente = computed(() => videosData.value?.hasNextPage || false);

const cargarVideos = async () => {
  try {
    if (cursoId.value) {
      await cursoStore.fetchCursoById(cursoId.value);
      await videoStore.fetchVideosByCursoPaged(cursoId.value, { page: paginaActual.value, pageSize: 20 });
    } else {
      await videoStore.fetchAllVideosPaged({ page: paginaActual.value, pageSize: 20 });
    }
  } catch (error) {
    // Error manejado por los stores
  }
};

const cambiarPagina = async (nuevaPagina: number) => {
  if (nuevaPagina < 1 || nuevaPagina > totalPaginas.value) return;
  
  paginaActual.value = nuevaPagina;
  await cargarVideos();
};

const paginaAnterior = async () => {
  if (hayPaginaAnterior.value) {
    await cambiarPagina(paginaActual.value - 1);
  }
};

const paginaSiguiente = async () => {
  if (hayPaginaSiguiente.value) {
    await cambiarPagina(paginaActual.value + 1);
  }
};

const asignaturaCreada = async () => {
  if (cursoId.value) {
    await cursoStore.fetchCursoById(cursoId.value);
    filtroSeleccionado.value = 'Todos';
    paginaActual.value = 1;
    await cargarVideos();
  }
};

const actualizarBusqueda = (query: string) => {
  searchQuery.value = query;
};

const actualizarFiltro = (filtro: string | number) => {
  filtroSeleccionado.value = filtro;
};

watch(() => route.params.id, () => {
  filtroSeleccionado.value = 'Todos';
  paginaActual.value = 1;
  cargarVideos();
});

onMounted(() => {
  if (!usuarioLogeadoStore.usuarioActual) {
    usuarioLogeadoStore.cargarUsuarioDesdeStorage();
  }
  cargarVideos();
});
</script>

<template>
  <v-app>
    <Header 
      @toggle-sidebar="drawer = !drawer" 
      @update-search="actualizarBusqueda"
    />
    
    <v-main class="HomePage">
      <Sidebar v-model="drawer" />
      
      <div>
        <div v-if="cursoId && curso" class="HomePage__Banner" :style="{ backgroundImage: `url(${bannerImage})` }">
          <div class="HomePage__BannerOverlay">
            <v-container class="HomePage__BannerContent">
              <v-breadcrumbs :items="[
                { title: 'Cursos', href: '/cursos' },
                { title: curso.nombre, disabled: true }
              ]" class="HomePage__Breadcrumbs">
                <template v-slot:prepend>
                  <v-icon icon="mdi-book-open-variant" size="small" color="white"></v-icon>
                </template>
                <template v-slot:divider>
                  <v-icon icon="mdi-chevron-right" size="small" color="white"></v-icon>
                </template>
              </v-breadcrumbs>
              
              <h1 class="HomePage__Title">{{ curso.nombre }}</h1>
              <p v-if="curso.descripcion" class="HomePage__Description">
                {{ curso.descripcion }}
              </p>
              
              <div class="HomePage__Actions">
                <v-chip 
                  color="orange" 
                  variant="elevated" 
                  class="HomePage__VideoCount"
                  size="large"
                >
                  <v-icon start icon="mdi-play-circle"></v-icon>
                  {{ videosData?.totalCount || 0 }} videos
                </v-chip>
                
                <v-btn 
                  v-if="puedeSubirVideo" 
                  color="success" 
                  variant="elevated" 
                  size="small" 
                  class="HomePage__UploadButton" 
                  :to="`/subir-video/${cursoId}`"
                >
                  <v-icon start icon="mdi-upload"></v-icon>
                  Subir Video
                </v-btn>
                
                <v-btn 
                  v-if="esCreadorCurso" 
                  color="primary" 
                  variant="elevated" 
                  size="small" 
                  class="HomePage__AddSubjectButton" 
                  :to="`/curso/${cursoId}/asignaturas`"
                >
                  <v-icon start icon="mdi-book-plus"></v-icon>
                  Añadir asignatura
                </v-btn>
              </div>
            </v-container>
          </div>
        </div>
        
        <v-container class="HomePage__Container">
          <div v-if="loading" class="HomePage__Loading">
            <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
          </div>
          
          <template v-else>
            <Filtros 
              @filtro-seleccionado="actualizarFiltro" 
              :filtro-actual="filtroSeleccionado"
              :curso-id="cursoId"
            />
            
            <v-divider class="HomePage__Divider"></v-divider>
            
            <ListaVideos :videos="videosFiltrados" />
            
            <v-alert
              v-if="videosFiltrados.length === 0"
              type="info"
              text="No se encontraron videos con los filtros actuales."
              class="HomePage__NoVideos"
            ></v-alert>

            <!-- Paginación -->
            <div v-if="totalPaginas > 1" class="HomePage__Pagination">
              <v-btn 
                icon="mdi-chevron-left"
                :disabled="!hayPaginaAnterior"
                @click="paginaAnterior"
                variant="text"
                size="small"
              ></v-btn>
              
              <span class="HomePage__PageInfo">
                {{ paginaActual }} / {{ totalPaginas }}
              </span>
              
              <v-btn 
                icon="mdi-chevron-right"
                :disabled="!hayPaginaSiguiente"
                @click="paginaSiguiente"
                variant="text"
                size="small"
              ></v-btn>
            </div>
          </template>
        </v-container>
      </div>
    </v-main>

    <AgregarAsignaturaModal
      :mostrar="mostrarModalAsignatura"
      :curso-id="cursoId || 0"
      @cerrar="mostrarModalAsignatura = false"
      @asignatura-creada="asignaturaCreada"
    />

    <BotonQuizes :curso-id="cursoId" />
  </v-app>
</template>

<style lang="scss" scoped>
@import "@/assets/sass/pages/Home";

.HomePage__Pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 32px;
  padding: 16px 0;
}

.HomePage__PageInfo {
  font-size: 16px;
  font-weight: 500;
  color: rgba(var(--v-theme-on-surface), 0.87);
  min-width: 60px;
  text-align: center;
}
</style>