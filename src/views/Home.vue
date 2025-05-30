<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useCursoStore } from '@/stores/Curso';
import { useVideoStore } from '@/stores/Video';
import { useQuizStore } from '@/stores/Quiz';
import { useUsuarioLogeadoStore } from '@/stores/UsuarioLogeado'; 
import HeaderCursos from '@/components/Layout/HeaderCursos.vue';
import Sidebar from '@/components/Layout/Sidebar.vue';
import BotonQuizes from '@/components/Video/Home/BotonQuizes.vue';
// 🆕 Importar los nuevos componentes
import VideosCurso from '@/components/Cursos/DetalleCurso/VideosCurso.vue';
import QuizzesCurso from '@/components/Cursos/DetalleCurso/QuizzesCurso.vue';
// 🆕 Importar el modal de información del quiz
import QuizInfoModal from '@/components/Quizz/QuizInfoModal.vue';

const route = useRoute();
const cursoStore = useCursoStore();
const videoStore = useVideoStore();
const quizStore = useQuizStore(); // 🆕 Añadir store de quizzes
const usuarioLogeadoStore = useUsuarioLogeadoStore(); 

const drawer = ref(false);
const searchQuery = ref('');
const filtroSeleccionado = ref('Todos');
const paginaActual = ref(1);
const loading = computed(() => videoStore.loading || cursoStore.loading);
const curso = computed(() => cursoStore.curso);

// 🆕 Variables para videos y quizzes del curso
const videosCurso = ref([]);
const quizzesCurso = ref([]);
const loadingVideos = ref(false);
const loadingQuizzes = ref(false);

// 🆕 Variables para el modal de quiz
const showQuizModal = ref(false);
const selectedQuizId = ref(null);

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

// 🆕 Cargar videos específicos del curso para la sección
const cargarVideosCurso = async () => {
  if (!cursoId.value) return;
  
  loadingVideos.value = true;
  try {
    // Obtener todos los videos del curso
    await videoStore.fetchAllVideos();
    videosCurso.value = videoStore.videos.filter(video => 
      video.idCurso === cursoId.value
    ).sort((a, b) => new Date(b.fechaSubida).getTime() - new Date(a.fechaSubida).getTime());
  } catch (error) {
    console.error('Error al cargar videos del curso:', error);
    videosCurso.value = [];
  } finally {
    loadingVideos.value = false;
  }
};

// 🆕 Cargar quizzes específicos del curso para la sección
const cargarQuizzesCurso = async () => {
  if (!cursoId.value) return;
  
  loadingQuizzes.value = true;
  try {
    // Obtener todos los quizzes del curso
    await quizStore.fetchQuizzesByCurso(cursoId.value);
    quizzesCurso.value = quizStore.quizzes.sort((a, b) => 
      new Date(b.fechaCreacion || new Date()).getTime() - new Date(a.fechaCreacion || new Date()).getTime()
    );
  } catch (error) {
    console.error('Error al cargar quizzes del curso:', error);
    quizzesCurso.value = [];
  } finally {
    loadingQuizzes.value = false;
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

// 🆕 Función para mostrar el modal de información del quiz
const mostrarInfoQuiz = (quizId: number) => {
  selectedQuizId.value = quizId;
  showQuizModal.value = true;
};

// 🆕 Función para cerrar el modal
const cerrarModalQuiz = () => {
  showQuizModal.value = false;
  selectedQuizId.value = null;
};

watch(() => route.params.id, () => {
  filtroSeleccionado.value = 'Todos';
  paginaActual.value = 1;
  cargarVideos();
  // 🆕 Recargar videos y quizzes del curso cuando cambie el ID
  cargarVideosCurso();
  cargarQuizzesCurso();
});

onMounted(() => {
  if (!usuarioLogeadoStore.usuarioActual) {
    usuarioLogeadoStore.cargarUsuarioDesdeStorage();
  }
  cargarVideos();
  // 🆕 Cargar videos y quizzes del curso al montar
  cargarVideosCurso();
  cargarQuizzesCurso();
});
</script>

<template>
  <v-app>
    <HeaderCursos @toggle-sidebar="drawer = !drawer" @update-search="actualizarBusqueda" />
    
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
                <v-btn 
                  v-if="puedeSubirVideo" 
                  color="warning" 
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
            <!-- 🆕 NUEVAS SECCIONES: Videos y Quizzes del Curso -->
            <div v-if="cursoId && curso" class="HomePage__CursoSections">
              <!-- Sección de Videos del Curso -->
              <VideosCurso 
                v-if="!loadingVideos"
                :videos="videosCurso"
                :curso-nombre="curso.nombre"
                :curso-id="cursoId"
                class="mb-6"
              />
              
              <!-- Sección de Quizzes del Curso -->
              <QuizzesCurso 
                v-if="!loadingQuizzes"
                :quizzes="quizzesCurso"
                :curso-nombre="curso.nombre"
                :curso-id="cursoId"
                class="mb-6"
                @mostrar-info-quiz="mostrarInfoQuiz"
              />
            </div>
          </template>
        </v-container>
      </div>
    </v-main>

    <BotonQuizes :curso-id="cursoId" />
    
    <!-- 🆕 Modal de información del quiz -->
    <QuizInfoModal
      v-model="showQuizModal"
      :quiz-id="selectedQuizId"
      @quiz-deleted="cargarQuizzesCurso"
      @quiz-updated="cargarQuizzesCurso"
    />
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

.HomePage__CursoSections {
  margin-top: 24px;
}

@media (max-width: 600px) {
  .HomePage__CursoSections {
    margin-top: 16px;
  }
}
</style>