// src/views/QuizDetalle.vue
// Actualizado para utilizar el Store de Asignaturas

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuizStore } from '@/stores/Quiz';
import { useAsignaturaStore } from '@/stores/Asignaturas';
import Header from '@/components/Layout/Header.vue';
import Sidebar from '@/components/Layout/Sidebar.vue';
import { useDisplay } from 'vuetify';

// Variables
const quiz = ref(null);
const isLoading = ref(true);
const error = ref(null);
const sidebarOpen = ref(false);
const { mobile } = useDisplay();

// Inicializar stores y route
const quizStore = useQuizStore();
const asignaturaStore = useAsignaturaStore();
const route = useRoute();
const router = useRouter();

// Obtener el ID del quiz (desde los parámetros de ruta o consulta)
const quizId = computed(() => {
  // Si hay un ID en los parámetros, lo usamos
  if (route.params.id) {
    return parseInt(route.params.id);
  }
  // Si no hay ID, verificamos si hay un ID en la consulta
  else if (route.query.id) {
    return parseInt(route.query.id);
  }
  
  // Si no hay ID en ningún lado, devolvemos null (mostraremos un mensaje amigable)
  return null;
});

// Función para cargar los datos del quiz
const loadQuizData = async () => {
  isLoading.value = true;
  error.value = null;
  
  try {
    // Si no tenemos ID, mostramos un mensaje amigable en vez de error
    if (!quizId.value) {
      quiz.value = {
        id: 0,
        titulo: "Selecciona un Quiz",
        descripcion: "Por favor, selecciona un quiz de la lista para ver sus detalles.",
        creador: "Sistema",
        categoria: "General",
        dificultad: "Media",
        tiempo: "N/A",
        preguntas: 0,
        imagen: "https://picsum.photos/800/450",
        fechaCreacion: new Date().toLocaleDateString()
      };
      isLoading.value = false;
      return;
    }
    
    // Cargar asignaturas si no están cargadas
    if (asignaturaStore.asignaturas.length === 0) {
      await asignaturaStore.fetchAllAsignaturas();
    }
    
    // Usar el store para obtener los detalles del quiz
    const quizData = await quizStore.fetchQuizById(quizId.value);
    
    if (!quizData) {
      throw new Error('No se pudo encontrar el quiz');
    }
    
    // Adaptar los datos del quiz para la visualización
    quiz.value = {
      id: quizData.idQuiz,
      titulo: quizData.nombre,
      descripcion: quizData.descripcion,
      creador: `Usuario ${quizData.idUsuario}`,
      categoria: obtenerCategoria(quizData.idAsignatura),
      dificultad: obtenerDificultad(quizData),
      tiempo: "10 min", // Valor por defecto
      preguntas: 20, // Valor por defecto
      imagen: `https://picsum.photos/id/${quizData.idQuiz % 30}/800/450`,
      fechaCreacion: new Date().toLocaleDateString()
    };
  } catch (err) {
    console.error('Error al cargar el quiz:', err);
    error.value = quizStore.errorMessage || err.message || 'No se pudo cargar el quiz';
  } finally {
    isLoading.value = false;
  }
};

// Función para volver a la página anterior
const goBack = () => {
  router.back();
};

// Función para iniciar el quiz
const iniciarQuiz = () => {
  // Aquí se implementaría la navegación a la vista de preguntas del quiz
  console.log('Iniciando quiz:', quiz.value?.id);
  // router.push({ name: 'quiz-play', params: { id: quiz.value.id } });
};

// Toggle sidebar
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};

// Funciones auxiliares para mapear datos
function obtenerDificultad(quiz) {
  // En una implementación real, esto podría basarse en alguna propiedad del quiz
  const dificultades = ['Fácil', 'Media', 'Difícil'];
  return dificultades[quiz.idQuiz % 3];
}

function obtenerCategoria(idAsignatura) {
  // Intentar obtener el nombre de la asignatura desde el store
  if (asignaturaStore.asignaturas.length > 0) {
    const asignatura = asignaturaStore.asignaturas.find(a => a.idAsignatura === idAsignatura);
    if (asignatura) {
      return asignatura.nombre;
    }
  }
  
  // Si no se encuentra, usar el mapa de respaldo
  const categoriasRespaldo = {
    1: 'Matemáticas',
    2: 'Ciencias',
    3: 'Historia',
    4: 'Literatura',
    5: 'Geografía',
    6: 'Arte',
    7: 'Deportes',
    8: 'Programación',
    9: 'Idiomas',
    10: 'Marketing'
  };
  
  return categoriasRespaldo[idAsignatura] || 'Otras';
}

// Mapeo de dificultad a colores de Vuetify
const colorDificultad = (dificultad) => {
  const colores = {
    'Fácil': 'success',
    'Media': 'warning',
    'Difícil': 'error'
  };
  return colores[dificultad] || 'grey';
};

// Inicializar componente
onMounted(() => {
  // Configurar sidebar según tamaño de pantalla
  const handleResize = () => {
    sidebarOpen.value = !mobile.value;
  };
  
  // Configuración inicial
  handleResize();
  
  // Escuchar cambios de tamaño de ventana
  window.addEventListener('resize', handleResize);
  
  // Cargar datos del quiz
  loadQuizData();
  
  // Limpiar evento al desmontar
  return () => {
    window.removeEventListener('resize', handleResize);
  };
});
</script>

<template>
  <v-app>
    <!-- Header con props para controlar sidebar -->
    <Header 
      @toggle-sidebar="toggleSidebar"
    />
    
    <div class="d-flex">
      <!-- Sidebar con v-model para controlar su visibilidad -->
      <Sidebar 
        v-model="sidebarOpen"
      />
      
      <!-- Contenido principal -->
      <v-main class="main-content">
        <v-container fluid class="px-4 py-4 mt-14">
          <!-- Botón para volver atrás -->
          <v-btn
            icon
            variant="text"
            @click="goBack"
            class="mb-4"
          >
            <v-icon>mdi-arrow-left</v-icon>
            <span class="ml-2">Volver</span>
          </v-btn>
          
          <!-- Estado de carga -->
          <div v-if="isLoading" class="d-flex justify-center my-8">
            <v-progress-circular 
              indeterminate 
              color="primary"
              size="64"
            ></v-progress-circular>
          </div>
          
          <!-- Estado de error -->
          <v-alert
            v-else-if="error"
            type="error"
            variant="tonal"
            class="my-4"
          >
            {{ error }}
            <template v-slot:append>
              <v-btn
                variant="text"
                @click="loadQuizData"
                :loading="isLoading"
              >
                Reintentar
              </v-btn>
            </template>
          </v-alert>
          
          <!-- Contenido del quiz -->
          <div v-else-if="quiz" class="quiz-detail">
            <v-card class="quiz-card">
              <v-img 
                :src="quiz.imagen" 
                :alt="quiz.titulo"
                height="350"
                cover
                class="quiz-image"
              >
                <div class="overlay">
                  <div class="badge-container">
                    <v-chip class="ma-1" size="small" :color="colorDificultad(quiz.dificultad)">
                      {{ quiz.dificultad }}
                    </v-chip>
                    <v-chip class="ma-1" size="small" color="grey-lighten-3">
                      {{ quiz.categoria }}
                    </v-chip>
                    <v-chip class="ma-1" size="small" color="black" text-color="white">
                      {{ quiz.tiempo }}
                    </v-chip>
                  </div>
                </div>
              </v-img>
              
              <v-card-item>
                <v-card-title class="text-h4 font-weight-bold">
                  {{ quiz.titulo }}
                </v-card-title>
                
                <v-card-subtitle class="pt-2 text-subtitle-1">
                  Por {{ quiz.creador }} • Publicado el {{ quiz.fechaCreacion }}
                </v-card-subtitle>
                
                <v-card-text class="text-body-1 my-4">
                  <p>{{ quiz.descripcion }}</p>
                  
                  <v-divider v-if="quiz.id !== 0" class="my-4"></v-divider>
                  
                  <div v-if="quiz.id !== 0" class="quiz-details">
                    <div class="detail-item">
                      <v-icon color="primary" class="mr-2">mdi-help-circle</v-icon>
                      <span>{{ quiz.preguntas }} preguntas</span>
                    </div>
                    
                    <div class="detail-item">
                      <v-icon color="primary" class="mr-2">mdi-clock-outline</v-icon>
                      <span>{{ quiz.tiempo }} aproximadamente</span>
                    </div>
                    
                    <div class="detail-item">
                      <v-icon color="primary" class="mr-2">mdi-school</v-icon>
                      <span>{{ quiz.categoria }}</span>
                    </div>
                    
                    <div class="detail-item">
                      <v-icon :color="colorDificultad(quiz.dificultad)" class="mr-2">mdi-target</v-icon>
                      <span>Dificultad: {{ quiz.dificultad }}</span>
                    </div>
                  </div>
                </v-card-text>
                
                <v-card-actions v-if="quiz.id !== 0" class="justify-center">
                  <v-btn
                    color="primary"
                    size="large"
                    block
                    @click="iniciarQuiz"
                    prepend-icon="mdi-play"
                  >
                    Iniciar Quiz
                  </v-btn>
                </v-card-actions>
                
                <v-card-actions v-else class="justify-center">
                  <v-btn
                    color="primary"
                    size="large"
                    block
                    @click="goBack"
                    prepend-icon="mdi-format-list-bulleted"
                  >
                    Ver Lista de Quizzes
                  </v-btn>
                </v-card-actions>
              </v-card-item>
            </v-card>
          </div>
        </v-container>
      </v-main>
    </div>
  </v-app>
</template>

<style scoped>
.main-content {
  flex: 1;
  background-color: #f9f9f9;
  min-height: 100vh;
}

/* Ajustar contenido principal según el estado del sidebar */
@media (min-width: 960px) {
  .main-content {
    margin-left: 80px; /* Ancho del sidebar colapsado */
  }
}

/* Modo móvil */
@media (max-width: 959px) {
  .main-content {
    margin-left: 0;
  }
}

.quiz-detail {
  max-width: 900px;
  margin: 0 auto;
}

.quiz-card {
  border-radius: 12px;
  overflow: hidden;
}

.quiz-image {
  position: relative;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.7));
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 20px;
}

.badge-container {
  display: flex;
  flex-wrap: wrap;
}

.quiz-details {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.detail-item {
  display: flex;
  align-items: center;
  padding: 8px;
  background-color: #f5f5f5;
  border-radius: 8px;
}
</style>