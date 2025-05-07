<script setup>
// --------------------------- Imports ---------------------------
import { ref, onMounted, provide } from 'vue';
import { useDisplay } from 'vuetify';
import Header from '../components/Header.vue';
import Sidebar from '../components/Sidebar.vue';
import QuizHero from '../components/QuizHero.vue';
import QuizInfo from '../components/QuizInfo.vue';
import QuizAcciones from '../components/QuizAcciones.vue';
import QuizzesRelacionados from '../components/QuizzesRelacionados.vue';

// --------------------------- Props ---------------------------
const props = defineProps({
  id: {
    type: [String, Number],
    default: () => '2' // ID por defecto para desarrollo
  }
});

// --------------------------- Variables ---------------------------
const sidebarOpen = ref(false);
const isLoading = ref(true);
const error = ref(null);
const quiz = ref(null);
const quizzesRelacionados = ref([]);
const { mobile } = useDisplay();

// Proporcionar datos a componentes hijos
provide('quiz', quiz);
provide('isLoading', isLoading);
provide('error', error);

// --------------------------- Métodos ---------------------------
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};

// Cargar los detalles del quiz
const cargarDetalleQuiz = async () => {
  isLoading.value = true;
  error.value = null;
  
  try {
    // Simulación de delay de red
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // AQUÍ ES DONDE HARÍAS LA PETICIÓN REAL A LA API
    // const response = await fetch(`/api/quizzes/${props.id}`);
    // const data = await response.json();
    // quiz.value = data;
    
    // Datos simulados
    quiz.value = {
      id: props.id,
      titulo: 'Historia de España: Edad Media',
      descripcion: 'Pon a prueba tus conocimientos sobre la fascinante historia medieval española. Este quiz abarca desde la caída del Imperio Romano hasta el fin de la Reconquista en 1492, explorando las culturas cristiana, musulmana y judía que coexistieron en la Península Ibérica durante más de ocho siglos.',
      creador: 'HistoriaTotal',
      dificultad: 'Media',
      categoria: 'Historia',
      tiempo: '15 min',
      preguntas: 25,
      imagen: 'https://picsum.photos/id/2/1200/500',
      vistas: '32K',
      puntuacion: 4.7,
      totalReviews: 128,
      fechaPublicacion: '3 días',
      etiquetas: ['Medieval', 'España', 'Reconquista', 'Al-Ándalus', 'Cultura'],
      tematica: 'Descubre el fascinante período de la Edad Media en España, un tiempo de convivencia entre culturas, guerras de reconquista, avances científicos y una rica herencia cultural que perdura hasta nuestros días.',
      requisitos: 'No se requieren conocimientos previos. Este test es adecuado para estudiantes de secundaria, aficionados a la historia y cualquier persona interesada en el período medieval.',
      estructura: 'El quiz incluye 25 preguntas de diferentes formatos: opción múltiple, verdadero/falso y algunas preguntas abiertas. Las preguntas están organizadas cronológicamente, comenzando por la caída del Imperio Romano y terminando con los Reyes Católicos.'
    };
    
    // Cargar quizzes relacionados
    await cargarQuizzesRelacionados();
    
  } catch (err) {
    console.error('Error al cargar detalles del quiz:', err);
    error.value = 'No se pudieron cargar los detalles del quiz. Por favor, intenta de nuevo más tarde.';
  } finally {
    isLoading.value = false;
  }
};

// Cargar quizzes relacionados
const cargarQuizzesRelacionados = async () => {
  try {
    // AQUÍ ES DONDE HARÍAS LA PETICIÓN REAL A LA API
    // const response = await fetch(`/api/quizzes/relacionados/${props.id}`);
    // const data = await response.json();
    // quizzesRelacionados.value = data.items;
    
    // Datos simulados
    quizzesRelacionados.value = [
      {
        id: 5,
        titulo: 'Arte Románico y Gótico',
        creador: 'ArtLover',
        dificultad: 'Media',
        categoria: 'Arte',
        tiempo: '12 min',
        preguntas: 18,
        imagen: 'https://picsum.photos/id/3/300/200',
        vistas: '24K',
      },
      {
        id: 8,
        titulo: 'Grandes batallas medievales',
        creador: 'HistoriaTotal',
        dificultad: 'Difícil',
        categoria: 'Historia',
        tiempo: '20 min',
        preguntas: 30,
        imagen: 'https://picsum.photos/id/4/300/200',
        vistas: '18K',
      },
      {
        id: 11,
        titulo: 'Mitología ibérica',
        creador: 'MythMaster',
        dificultad: 'Media',
        categoria: 'Historia',
        tiempo: '10 min',
        preguntas: 15,
        imagen: 'https://picsum.photos/id/5/300/200',
        vistas: '22K',
      }
    ];
  } catch (err) {
    console.error('Error al cargar quizzes relacionados:', err);
  }
};

// Navegación a la página para hacer el quiz
const iniciarQuiz = () => {
  // En producción, esto navegaría a la página del quiz:
  // router.push({ name: 'quiz-realizar', params: { id: props.id }});
  console.log(`Iniciando quiz ${props.id}`);
};

// Inicializar la visibilidad del sidebar basado en el tamaño de pantalla
onMounted(async () => {
  const handleResize = () => {
    sidebarOpen.value = !mobile.value;
  };
  
  // Configuración inicial
  handleResize();
  
  // Escuchar cambios de tamaño de ventana
  window.addEventListener('resize', handleResize);
  
  // Cargar datos
  await cargarDetalleQuiz();
  
  // Limpiar evento al desmontar
  return () => {
    window.removeEventListener('resize', handleResize);
  };
});

// Función para volver a la página anterior
const volverAtras = () => {
  // En producción, esto volvería a la página anterior:
  // router.back();
  console.log('Volviendo a la página anterior');
};
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
          <!-- Botón para volver -->
          <div class="mb-4">
            <v-btn
              variant="text"
              prepend-icon="mdi-arrow-left"
              @click="volverAtras"
              class="px-0"
            >
              Volver a Quizzes
            </v-btn>
          </div>
          
          <!-- Estado de carga -->
          <div v-if="isLoading" class="d-flex justify-center my-12">
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
              @click="cargarDetalleQuiz"
              class="mt-2"
            >
              Reintentar
            </v-btn>
          </v-alert>
          
          <!-- Detalle del quiz -->
          <div v-else-if="quiz" class="quiz-detalle">
            <!-- Componente Hero con imagen de fondo -->
            <QuizHero />
            
            <!-- Contenido principal -->
            <v-row>
              <!-- Columna izquierda con detalles -->
              <v-col cols="12" md="8">
                <!-- Componente con la información del quiz -->
                <QuizInfo />
                
                <!-- Componente de quizzes relacionados -->
                <QuizzesRelacionados :quizzes="quizzesRelacionados" />
              </v-col>
              
              <!-- Columna derecha con resumen y acciones -->
              <v-col cols="12" md="4">
                <!-- Componente de acciones -->
                <QuizAcciones @iniciar-quiz="iniciarQuiz" />
              </v-col>
            </v-row>
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
</style>