<!-- src/views/HacerQuizzesPage.vue -->
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useQuizStore } from '@/stores/Quiz';
import { useUsuarioLogeadoStore } from '@/stores/UsuarioLogeado';
import Header from '@/components/Layout/Header.vue';
import Sidebar from '@/components/Layout/Sidebar.vue';
import type { QuizCompletaDTO } from '@/stores/dtos/QuizCompletaDTO';

// Stores y router
const quizStore = useQuizStore();
const usuarioStore = useUsuarioLogeadoStore();
const router = useRouter();

// Variables reactivas
const drawer = ref(false);
const searchQuery = ref('');
const loading = ref(true);
const selectedFilter = ref('Todos');

// Filtros disponibles
const filters = ['Todos', 'Mis Quizzes', 'Más Recientes', 'Más Populares'];

// Computed
const usuarioActual = computed(() => usuarioStore.usuarioActual);
const puedeCrearQuiz = computed(() => {
  const rol = usuarioActual.value?.idRol;
  return rol === 2 || rol === 3; // Solo profesores y gestores
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

const realizarQuiz = (quiz: QuizCompletaDTO) => {
  router.push(`/quiz/${quiz.idQuiz}`);
};

const crearQuiz = () => {
  router.push('/admin/crear-quiz');
};

const cargarQuizzes = async () => {
  loading.value = true;
  try {
    await quizStore.fetchAllQuizzes();
  } catch (error) {
    console.error('Error al cargar quizzes:', error);
  } finally {
    loading.value = false;
  }
};

// Lifecycle
onMounted(() => {
  cargarQuizzes();
});
</script>

<template>
  <v-app>
    <!-- Header -->
    <Header @toggle-sidebar="toggleSidebar" @update-search="updateSearch" />
    
    <!-- Contenedor principal -->
    <v-main class="QuizzesPage">
      <!-- Sidebar -->
      <Sidebar v-model="drawer" />
      
      <!-- Contenido -->
      <v-container class="QuizzesPage__Container">
        <!-- Header de la página -->
        <div class="QuizzesPage__Header">
          <div class="d-flex align-center justify-space-between flex-wrap mb-6">
            <div>
              <h1 class="text-h3 font-weight-bold QuizzesPage__Title mb-2">
                🎯 Quiz Time!
              </h1>
              <p class="text-h6 QuizzesPage__Subtitle">
                Pon a prueba tus conocimientos con nuestros quizzes interactivos
              </p>
            </div>
            
            <v-btn
              v-if="puedeCrearQuiz"
              @click="crearQuiz"
              color="gradient"
              size="large"
              elevation="4"
              rounded="pill"
              class="QuizzesPage__CreateBtn"
            >
              <v-icon start>mdi-plus</v-icon>
              Crear Quiz
            </v-btn>
          </div>
          
          <!-- Filtros -->
          <div class="QuizzesPage__Filters mb-6">
            <v-chip-group
              v-model="selectedFilter"
              selected-class="text-white"
              mandatory
            >
              <v-chip
                v-for="filter in filters"
                :key="filter"
                :value="filter"
                color="orange"
                variant="elevated"
                size="large"
                class="mr-2"
              >
                {{ filter }}
              </v-chip>
            </v-chip-group>
          </div>
        </div>
        
        <!-- Estado de carga -->
        <div v-if="loading" class="d-flex justify-center my-12">
          <div class="text-center">
            <v-progress-circular
              indeterminate
              color="orange"
              size="64"
              width="6"
              class="mb-4"
            ></v-progress-circular>
            <p class="text-h6 text-grey-darken-1">Cargando quizzes...</p>
          </div>
        </div>
        
        <!-- Sin resultados -->
        <div v-else-if="quizzesFiltrados.length === 0" class="text-center py-12">
          <v-icon color="orange" size="80" class="mb-4">mdi-quiz</v-icon>
          <h3 class="text-h5 mb-4">{{ searchQuery ? 'No se encontraron quizzes' : 'No hay quizzes disponibles' }}</h3>
          <p class="text-body-1 text-grey-darken-1 mb-6">
            {{ searchQuery ? 'Intenta con otros términos de búsqueda' : 'Sé el primero en crear un quiz' }}
          </p>
          <v-btn
            v-if="puedeCrearQuiz && !searchQuery"
            @click="crearQuiz"
            color="orange"
            size="large"
            variant="elevated"
          >
            <v-icon start>mdi-plus</v-icon>
            Crear mi primer quiz
          </v-btn>
        </div>
        
        <!-- Grid de quizzes -->
        <div v-else class="QuizzesPage__Grid">
          <v-row>
            <v-col
              v-for="quiz in quizzesFiltrados"
              :key="quiz.idQuiz"
              cols="12"
              sm="6"
              md="4"
              lg="3"
            >
              <v-card
                class="QuizCard h-100"
                elevation="3"
                rounded="xl"
                hover
                @click="realizarQuiz(quiz)"
              >
                <!-- Header del quiz con gradiente -->
                <div class="QuizCard__Header">
                  <div class="QuizCard__HeaderOverlay">
                    <v-chip
                      color="white"
                      size="small"
                      class="QuizCard__Chip"
                    >
                      <v-icon start size="small">mdi-help-circle</v-icon>
                      {{ quiz.totalPreguntas || '?' }} preguntas
                    </v-chip>
                  </div>
                </div>
                
                <!-- Contenido del quiz -->
                <v-card-item class="pb-2">
                  <v-card-title class="QuizCard__Title">
                    {{ quiz.nombre }}
                  </v-card-title>
                  
                  <v-card-subtitle class="QuizCard__Author">
                    <v-icon size="small" class="mr-1">mdi-account</v-icon>
                    {{ quiz.nombreUsuario }}
                  </v-card-subtitle>
                </v-card-item>
                
                <v-card-text class="QuizCard__Description">
                  <p class="text-body-2">
                    {{ quiz.descripcion || 'Sin descripción disponible' }}
                  </p>
                  
                  <div class="d-flex align-center mt-3">
                    <v-icon size="small" color="grey" class="mr-1">mdi-calendar</v-icon>
                    <span class="text-caption text-grey">{{ quiz.fechaCreacion }}</span>
                  </div>
                </v-card-text>
                
                <!-- Botón de acción -->
                <v-card-actions class="pt-0">
                  <v-btn
                    @click.stop="realizarQuiz(quiz)"
                    color="orange"
                    variant="elevated"
                    size="large"
                    block
                    rounded="pill"
                    class="QuizCard__ActionBtn"
                  >
                    <v-icon start>mdi-play</v-icon>
                    Realizar Quiz
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.QuizzesPage {
  background: linear-gradient(135deg, #fff5f0 0%, #ffffff 50%, #fff8f5 100%);
  min-height: 100vh;
}

.QuizzesPage__Container {
  padding-top: 24px;
  max-width: 1400px;
}

.QuizzesPage__Header {
  background: white;
  padding: 32px;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(255, 107, 53, 0.1);
  border: 1px solid rgba(255, 107, 53, 0.1);
  margin-bottom: 32px;
}

.QuizzesPage__Title {
  background: linear-gradient(135deg, #FF6B35 0%, #FF8C42 50%, #FFB366 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.QuizzesPage__Subtitle {
  color: #666;
  font-weight: 400;
}

.QuizzesPage__CreateBtn {
  background: linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%) !important;
  color: white !important;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.QuizzesPage__CreateBtn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 107, 53, 0.3) !important;
}

.QuizzesPage__Filters {
  display: flex;
  justify-content: center;
}

.QuizzesPage__Grid {
  animation: fadeIn 0.6s ease-out;
}

.QuizCard {
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border: 1px solid rgba(255, 107, 53, 0.1);
  background: linear-gradient(135deg, #ffffff 0%, #fff8f5 100%);
}

.QuizCard:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 30px rgba(255, 107, 53, 0.2) !important;
  border-color: rgba(255, 107, 53, 0.3);
}

.QuizCard__Header {
  height: 120px;
  background: linear-gradient(135deg, #FF6B35 0%, #FF8C42 50%, #FFB366 100%);
  position: relative;
  display: flex;
  align-items: flex-end;
  padding: 16px;
}

.QuizCard__HeaderOverlay {
  background: linear-gradient(to top, rgba(0,0,0,0.3), transparent);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: flex-end;
  padding: 16px;
}

.QuizCard__Chip {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.9) !important;
  font-weight: 600;
}

.QuizCard__Title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #333;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  padding: 8px 0 4px 0;
}

.QuizCard__Author {
  color: #FF6B35;
  font-weight: 600;
  display: flex;
  align-items: center;
  padding: 0;
}

.QuizCard__Description {
  padding: 12px 16px;
}

.QuizCard__Description p {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  color: #666;
  line-height: 1.4;
}

.QuizCard__ActionBtn {
  background: linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%) !important;
  color: white !important;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: all 0.2s ease;
  margin: 0 16px 16px 16px;
}

.QuizCard__ActionBtn:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 15px rgba(255, 107, 53, 0.4);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 600px) {
  .QuizzesPage__Container {
    padding: 16px;
  }
  
  .QuizzesPage__Header {
    padding: 20px;
    margin-bottom: 20px;
  }
  
  .QuizzesPage__Title {
    font-size: 2rem;
  }
  
  .QuizzesPage__Subtitle {
    font-size: 1.1rem;
  }
  
  .QuizzesPage__Filters {
    overflow-x: auto;
    padding-bottom: 8px;
  }
}
</style>