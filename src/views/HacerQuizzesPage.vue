<!-- src/views/HacerQuizzesPage.vue - Con el estilo de tu app -->
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useQuizStore } from '@/stores/Quiz';
import { useUsuarioLogeadoStore } from '@/stores/UsuarioLogeado';
import Header from '@/components/Layout/Header.vue';
import Sidebar from '@/components/Layout/Sidebar.vue';
import QuizInfoModal from '@/components/Quizz/QuizInfoModal.vue';
import type { QuizCompletaDTO } from '@/stores/dtos/QuizCompletaDTO';

// Stores y router
const quizStore = useQuizStore();
const usuarioStore = useUsuarioLogeadoStore();
const router = useRouter();
const route = useRoute();

// Variables reactivas
const drawer = ref(false);
const searchQuery = ref('');
const loading = ref(true);
const selectedFilter = ref('Todos');

// Variables del modal
const showQuizModal = ref(false);
const selectedQuizId = ref<number | null>(null);

// Detectar filtro por curso desde query params
const cursoFiltro = computed(() => {
  const cursoParam = route.query.curso;
  return cursoParam ? Number(cursoParam) : null;
});

// Filtros disponibles
const filters = ['Todos', 'Más Recientes', 'Más Populares'];

// Computed
const usuarioActual = computed(() => usuarioStore.usuarioActual);
const puedeCrearQuiz = computed(() => {
  const rol = usuarioActual.value?.idRol;
  return rol === 2 || rol === 3;
});

const quizzesFiltrados = computed(() => {
  let result = quizStore.quizzes;
  
  // Filtrar por búsqueda
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(quiz => 
      quiz.nombre.toLowerCase().includes(query) ||
      quiz.descripcion.toLowerCase().includes(query) ||
      quiz.nombreUsuario.toLowerCase().includes(query)
    );
  }
  
  // Filtrar por categoría
  switch (selectedFilter.value) {
    case 'Mis Quizzes':
      result = result.filter(quiz => quiz.idUsuario === usuarioActual.value?.idUsuario);
      break;
    case 'Más Recientes':
      result = [...result].sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime());
      break;
    case 'Más Populares':
      result = [...result].sort((a, b) => b.totalPreguntas - a.totalPreguntas);
      break;
  }
  
  return result;
});

// Métodos
const toggleSidebar = () => {
  drawer.value = !drawer.value;
};

const updateSearch = (query: string) => {
  searchQuery.value = query;
};

const abrirModalQuiz = (quiz: QuizCompletaDTO) => {
  selectedQuizId.value = quiz.idQuiz;
  showQuizModal.value = true;
};

const realizarQuizDirecto = (quiz: QuizCompletaDTO) => {
  router.push(`/quiz/${quiz.idQuiz}`);
};

const crearQuiz = () => {
  if (cursoFiltro.value) {
    router.push(`/admin/crear-quiz?curso=${cursoFiltro.value}`);
  } else {
    router.push('/admin/crear-quiz');
  }
};

const cargarQuizzes = async () => {
  loading.value = true;
  try {
    if (cursoFiltro.value) {
      await quizStore.fetchQuizzesByCurso(cursoFiltro.value);
    } else {
      await quizStore.fetchAllQuizzes();
    }
  } catch (error) {
    console.error('Error al cargar quizzes:', error);
  } finally {
    loading.value = false;
  }
};

const handleQuizDeleted = () => {
  cargarQuizzes();
};

const cerrarModal = () => {
  showQuizModal.value = false;
  selectedQuizId.value = null;
};

// Lifecycle
onMounted(() => {
  cargarQuizzes();
});
</script>

<template>
  <v-app>
    <Header @toggle-sidebar="toggleSidebar" @update-search="updateSearch" />
    
    <v-main>
      <Sidebar v-model="drawer" />
      
      <v-container class="pa-6">
        <!-- Header -->
        <div class="mb-6">
          <div class="d-flex align-center justify-space-between mb-4">
            <div>
              <h1 class="text-h4 font-weight-bold mb-2">
                {{ cursoFiltro ? `Quizzes del Curso ${cursoFiltro}` : '🎯 Quizzes' }}
              </h1>
              <p class="text-body-1 text-grey-darken-1">
                {{ cursoFiltro ? `Quizzes específicos del curso ${cursoFiltro}` : 'Pon a prueba tus conocimientos' }}
              </p>
            </div>
            
            <v-btn
              v-if="puedeCrearQuiz"
              @click="crearQuiz"
              color="orange"
              size="large"
              rounded="xl"
              elevation="2"
              class="text-white font-weight-bold"
            >
              <v-icon start>mdi-plus</v-icon>
              Crear Quiz
            </v-btn>
          </div>
          
          <!-- Filtros -->
          <v-chip-group v-model="selectedFilter" selected-class="text-white" mandatory>
            <v-chip
              v-for="filter in filters"
              :key="filter"
              :value="filter"
              color="orange"
              variant="elevated"
              rounded="xl"
              class="mr-2"
            >
              {{ filter }}
            </v-chip>
          </v-chip-group>
        </div>
        
        <!-- Estado de carga -->
        <div v-if="loading" class="text-center py-12">
          <v-progress-circular 
            indeterminate 
            color="orange" 
            size="48" 
            width="4"
            class="mb-4"
          ></v-progress-circular>
          <p class="text-h6 text-grey-darken-1">Cargando quizzes...</p>
        </div>
        
        <!-- Sin resultados -->
        <div v-else-if="quizzesFiltrados.length === 0" class="text-center py-12">
          <v-icon size="80" class="mb-4 text-grey-lighten-1">mdi-quiz</v-icon>
          <h3 class="text-h5 mb-4">
            {{ searchQuery ? 'No se encontraron quizzes' : 'No hay quizzes disponibles' }}
          </h3>
          <p class="text-body-1 text-grey-darken-1 mb-6">
            {{ searchQuery ? 'Intenta con otros términos' : 'Sé el primero en crear uno' }}
          </p>
          <v-btn
            v-if="puedeCrearQuiz && !searchQuery"
            @click="crearQuiz"
            color="orange"
            size="large"
            rounded="xl"
            class="text-white"
          >
            <v-icon start>mdi-plus</v-icon>
            Crear Quiz
          </v-btn>
        </div>
        
        <!-- Grid de quizzes -->
        <v-row v-else>
          <v-col
            v-for="quiz in quizzesFiltrados"
            :key="quiz.idQuiz"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-card 
              class="quiz-card h-100" 
              rounded="xl"
              elevation="0"
              border
            >
              <!-- Header con gradiente -->
              <div class="quiz-header">
                <div class="quiz-header-content">
                  <v-chip 
                    color="white" 
                    size="small"
                    class="quiz-chip"
                  >
                    <v-icon start size="small">mdi-help-circle</v-icon>
                    {{ quiz.totalPreguntas || '?' }} preguntas
                  </v-chip>
                  
                  <div class="quiz-duration">00:00</div>
                </div>
              </div>
              
              <!-- Contenido -->
              <v-card-text class="pb-2">
                <div class="d-flex align-center mb-3">
                  <v-avatar 
                    size="32" 
                    color="orange" 
                    class="mr-3"
                  >
                    <span class="text-white font-weight-bold">
                      {{ quiz.nombre.charAt(0).toUpperCase() }}
                    </span>
                  </v-avatar>
                  <div>
                    <div class="text-h6 font-weight-bold">{{ quiz.nombre }}</div>
                    <div class="text-caption text-grey-darken-1">{{ quiz.nombreUsuario }}</div>
                  </div>
                </div>
                
                <p class="text-body-2 text-grey-darken-1 mb-3 quiz-description">
                  {{ quiz.descripcion || 'Sin descripción disponible' }}
                </p>
                
                <div class="text-caption text-grey">
                  Hace {{ quiz.fechaCreacion }}
                </div>
              </v-card-text>
              
              <!-- Acciones -->
              <v-card-actions class="pt-0">
                <v-btn
                  @click="abrirModalQuiz(quiz)"
                  variant="outlined"
                  color="grey-darken-1"
                  size="small"
                  rounded="lg"
                >
                  <v-icon start size="small">mdi-information</v-icon>
                  Info
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn
                  @click="realizarQuizDirecto(quiz)"
                  color="orange"
                  size="small"
                  rounded="lg"
                  class="text-white font-weight-bold"
                >
                  <v-icon start size="small">mdi-play</v-icon>
                  Realizar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <!-- Modal -->
    <QuizInfoModal
      v-model="showQuizModal"
      :quiz-id="selectedQuizId"
      @quiz-deleted="handleQuizDeleted"
      @quiz-updated="cargarQuizzes"
    />
  </v-app>
</template>

<style scoped>
.quiz-card {
  border: 2px solid #f5f5f5;
  transition: all 0.3s ease;
}

.quiz-card:hover {
  transform: translateY(-4px);
  border-color: #ff9800;
  box-shadow: 0 8px 25px rgba(255, 152, 0, 0.15);
}

.quiz-header {
  height: 120px;
  background: linear-gradient(135deg, #ff9800 0%, #ff6f00 100%);
  border-radius: 16px 16px 0 0;
  position: relative;
  display: flex;
  align-items: flex-end;
  padding: 16px;
}

.quiz-header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  width: 100%;
}

.quiz-chip {
  background: rgba(255, 255, 255, 0.95) !important;
  font-weight: 600;
  backdrop-filter: blur(10px);
}

.quiz-duration {
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.quiz-description {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
  height: 2.8em; /* Fija la altura para 2 líneas */
}
</style>