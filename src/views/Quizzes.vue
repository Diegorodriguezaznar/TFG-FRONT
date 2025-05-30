// src/views/Quizzes.vue
// Versión corregida para la navegación a QuizDetalle

<script setup>
// --------------------------- Imports ---------------------------
import { ref, onMounted, provide, watch } from 'vue';
import { useDisplay } from 'vuetify';
import { useRouter } from 'vue-router';
import { useQuizStore } from '../stores/Quiz';
import { useAsignaturaStore } from '../stores/Asignaturas';
import Header from '../components/Layout/Header.vue';
import Sidebar from '../components/Layout/Sidebar.vue';
import Filtros from '../components/Video/Home/Filtros.vue'; 
import FiltrosOrden from '../components/FiltrosOrden.vue'; 
import SugerenciasQuizzes from '../components/Quizz/SugerenciasQuizzes.vue';

// --------------------------- Variables ---------------------------
const sidebarOpen = ref(false);
const searchQuery = ref('');
const isLoading = ref(false);
const error = ref(null);
const filtroOrden = ref('Recientes');
const asignaturaSeleccionada = ref(null);
const idAsignaturaFiltro = ref(null);
const { mobile } = useDisplay();
const quizStore = useQuizStore();
const asignaturaStore = useAsignaturaStore();
const router = useRouter();

// --------------------------- Inyección en el contexto ---------------------------
provide('searchQuery', searchQuery);
provide('filtroOrden', filtroOrden);
provide('asignaturaSeleccionada', asignaturaSeleccionada);

// --------------------------- Métodos ---------------------------
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};

onMounted(async () => {
  if (route.params.idCurso) {
    await quizStore.fetchQuizzesByCurso(Number(route.params.idCurso));
  } else {
    await quizStore.fetchAllQuizzes();
  }
});

// Manejo de búsqueda con debounce
const debounceTimeout = ref(null);
const updateSearch = (query) => {
  searchQuery.value = query;
  if (debounceTimeout.value) clearTimeout(debounceTimeout.value);
  debounceTimeout.value = setTimeout(() => {
    cargarQuizzes();
  }, 500);
};

// Cambiar el filtro de ordenamiento
const cambiarFiltroOrden = (filtro) => {
  filtroOrden.value = filtro;
  cargarQuizzes();
};

// Cambiar la asignatura seleccionada
const cambiarAsignatura = (nombre) => {
  asignaturaSeleccionada.value = nombre;
  
  // Buscar el ID de la asignatura si se ha seleccionado una
  if (nombre) {
    const asignatura = asignaturaStore.asignaturas.find(a => a.nombre === nombre);
    if (asignatura) {
      idAsignaturaFiltro.value = asignatura.idAsignatura;
    } else {
      idAsignaturaFiltro.value = null;
    }
  } else {
    idAsignaturaFiltro.value = null;
  }
  
  cargarQuizzes();
};

// Cargar quizzes
const cargarQuizzes = async () => {
  isLoading.value = true;
  error.value = null;
  
  try {
    // La carga real ocurre en el componente hijo SugerenciasQuizzes
    await new Promise(resolve => setTimeout(resolve, 300));
  } catch (err) {
    console.error('Error al cargar quizzes:', err);
    error.value = 'Ocurrió un error al cargar los quizzes';
  } finally {
    isLoading.value = false;
  }
};

// Ver detalle de un quiz - MÉTODO CORREGIDO
const verDetalleQuiz = async (quizId) => {
  try {
    // Obtener los detalles del quiz
    const quizDetails = await quizStore.fetchQuizById(quizId);
    
    if (!quizDetails) {
      error.value = 'No se pudo cargar el detalle del quiz';
      return;
    }
    
    // Navegar a la página de detalle usando QUERY parameters (como está configurado actualmente)
    router.push({ 
      path: '/quizz-detail',
      query: { id: quizId } 
    });
  } catch (err) {
    console.error(`Error al navegar al quiz ${quizId}:`, err);
    error.value = 'Error al cargar los detalles del quiz';
  }
};

// Inicializar componente
onMounted(async () => {
  // Configurar sidebar según tamaño de pantalla
  const handleResize = () => {
    sidebarOpen.value = !mobile.value;
  };
  
  // Configuración inicial
  handleResize();
  
  // Escuchar cambios de tamaño de ventana
  window.addEventListener('resize', handleResize);
  
  // Cargar quizzes iniciales
  await cargarQuizzes();
  
  // Limpiar evento al desmontar
  return () => {
    window.removeEventListener('resize', handleResize);
  };
});

// Observers para recargar datos
watch([filtroOrden, asignaturaSeleccionada], () => {
  cargarQuizzes();
});

watch(searchQuery, () => {
  if (debounceTimeout.value) clearTimeout(debounceTimeout.value);
  debounceTimeout.value = setTimeout(() => {
    cargarQuizzes();
  }, 500);
});
</script>

<template>
  <v-app>
    <!-- Header con props para controlar sidebar y búsqueda -->
    <Header 
      @toggle-sidebar="toggleSidebar" 
      @update-search="updateSearch"
    />
    
    <div class="d-flex">
      <!-- Sidebar con v-model para controlar su visibilidad -->
      <Sidebar 
        v-model="sidebarOpen"
      />
      
      <!-- Contenido principal -->
      <v-main class="main-content">
        <v-container fluid class="px-4 py-4 mt-14"> <!-- mt-14 para compensar el Header -->
          <!-- Notificación de error general -->
          <v-alert
            v-if="error"
            type="error"
            variant="tonal"
            closable
            class="mb-4"
          >
            {{ error }}
            <template v-slot:append>
              <v-btn
                variant="text"
                @click="cargarQuizzes"
                :loading="isLoading"
              >
                Reintentar
              </v-btn>
            </template>
          </v-alert>
          
          <!-- Mostrar error del store si existe -->
          <v-alert
            v-if="quizStore.errorMessage"
            type="error"
            variant="tonal"
            closable
            class="mb-4"
          >
            {{ quizStore.errorMessage }}
            <template v-slot:append>
              <v-btn
                variant="text"
                @click="cargarQuizzes"
                :loading="isLoading"
              >
                Reintentar
              </v-btn>
            </template>
          </v-alert>
          
          <!-- Filtros componente (solo asignaturas) -->
          <Filtros 
            :initialFilter="asignaturaSeleccionada"
            :loading="isLoading"
            @filtro-cambiado="cambiarAsignatura"
          />
          
          <!-- Separador visual -->
          <v-divider class="my-4"></v-divider>
          
          <!-- Filtros de Ordenamiento (abajo de las asignaturas) -->
          <FiltrosOrden 
            :initialFilter="filtroOrden"
            :loading="isLoading"
            @filtro-cambiado="cambiarFiltroOrden"
          />
          
          <!-- Separador visual -->
          <v-divider class="my-4"></v-divider>
          
          <!-- Componente de sugerencias de quizzes -->
          <SugerenciasQuizzes
            :query="searchQuery"
            :initialFilter="filtroOrden"
            :idAsignatura="idAsignaturaFiltro"
            @quiz-selected="verDetalleQuiz"
          />
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