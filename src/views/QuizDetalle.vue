// src/views/QuizDetalle.vue
// Versión corregida para obtener ID desde query params

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useQuizStore } from '../stores/Quiz';
import { useRoute, useRouter } from 'vue-router';

// Refs para gestionar el estado
const quiz = ref(null);
const isLoading = ref(true);
const error = ref(null);

// Inicializar stores y route
const quizStore = useQuizStore();
const route = useRoute();
const router = useRouter();

// Obtener el ID del quiz desde los query params (como está configurado en Quizzes.vue)
const quizId = computed(() => {
  if (route.query.id) {
    return parseInt(route.query.id);  
  }
  return null;
});

// Función para cargar los datos del quiz
const loadQuizData = async () => {
  isLoading.value = true;
  error.value = null;
  
  // Verificar si hay un ID válido
  if (!quizId.value) {
    error.value = 'No se ha especificado un ID de quiz válido';
    isLoading.value = false;
    return;
  }
  
  try {
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
    error.value = quizStore.errorMessage || 'No se pudo cargar el quiz';
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

// Funciones auxiliares para mapear datos
function obtenerDificultad(quiz) {
  // En una implementación real, esto podría basarse en alguna propiedad del quiz
  const dificultades = ['Fácil', 'Media', 'Difícil'];
  return dificultades[quiz.idQuiz % 3];
}

function obtenerCategoria(idAsignatura) {
  // Mapa de idAsignatura a categorías
  const categorias = {
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
  
  return categorias[idAsignatura] || 'Otras';
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

// Cargar los datos cuando el componente se monta
onMounted(() => {
  loadQuizData();
});

// Observar cambios en la ruta para recargar datos cuando cambia el ID
watch(() => route.query.id, () => {
  if (quizId.value) {
    loadQuizData();
  }
}, { immediate: false });
</script>

<template>
  <v-app>
    <v-app-bar>
      <v-app-bar-nav-icon @click="goBack">
        <v-icon>mdi-arrow-left</v-icon>
      </v-app-bar-nav-icon>
      <v-app-bar-title>Detalle del Quiz</v-app-bar-title>
    </v-app-bar>
    
    <v-main>
      <v-container class="py-8">
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
          <v-btn
            variant="text"
            @click="loadQuizData"
            class="mt-2"
          >
            Reintentar
          </v-btn>
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
                
                <v-divider class="my-4"></v-divider>
                
                <div class="quiz-details">
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
              
              <v-card-actions class="justify-center">
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
            </v-card-item>
          </v-card>
          
          <!-- Aquí podrías agregar componentes adicionales como comentarios,
               quizzes relacionados, etc. -->
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
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