<script setup>
// --------------------------- Imports ---------------------------
import { ref, onMounted, provide, watch } from 'vue';
import { useDisplay } from 'vuetify';
import { useQuizStore } from '../stores/Quiz';
import Header from '../components/Header.vue';
import Sidebar from '../components/Sidebar.vue';
import FiltrosQuizzes from '../components/FiltrosQuizzes.vue';
import SugerenciasQuizzes from '../components/SugerenciasQuizzes.vue';

// --------------------------- Variables ---------------------------
const sidebarOpen = ref(false);
const searchQuery = ref('');
const isLoading = ref(false);
const error = ref(null);
const categorias = ref([]);
const filtroActual = ref('Recientes');
const { mobile } = useDisplay();
const quizStore = useQuizStore();

// --------------------------- Inyección en el contexto ---------------------------
provide('searchQuery', searchQuery);
provide('filtroActual', filtroActual);

// --------------------------- Métodos ---------------------------
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};

// Manejo de búsqueda con debounce
const debounceTimeout = ref(null);
const updateSearch = (query) => {
  searchQuery.value = query;
  if (debounceTimeout.value) clearTimeout(debounceTimeout.value);
  debounceTimeout.value = setTimeout(() => {
    cargarQuizzes();
  }, 500);
};

// Cambiar el filtro activo
const cambiarFiltro = (filtro) => {
  filtroActual.value = filtro;
  cargarQuizzes();
};

// Cargar las categorías desde la API
const cargarCategorias = async () => {
  try {
    isLoading.value = true;
    
    // En una implementación real, podrías obtener las categorías de una API
    // Por ahora, usamos datos estáticos o generados a partir de las asignaturas
    categorias.value = [
      'Recientes', 'Populares', 'Por dificultad', 'Matemáticas', 
      'Ciencias', 'Historia', 'Literatura', 'Geografía', 'Arte', 
      'Deportes', 'Programación', 'Idiomas', 'Marketing'
    ];
  } catch (err) {
    console.error('Error al cargar categorías:', err);
    error.value = 'No se pudieron cargar las categorías de quizzes';
  } finally {
    isLoading.value = false;
  }
};

// Iniciar carga de quizzes
const cargarQuizzes = async () => {
  isLoading.value = true;
  error.value = null;
  
  try {
    // La carga real ocurre en el componente hijo SugerenciasQuizzes
    // Si necesitamos hacer operaciones adicionales, las haríamos aquí
    await new Promise(resolve => setTimeout(resolve, 300));
  } catch (err) {
    console.error('Error al cargar quizzes:', err);
    error.value = 'Ocurrió un error al cargar los quizzes';
  } finally {
    isLoading.value = false;
  }
};

// Ver detalle de un quiz
const verDetalleQuiz = async (quizId) => {
  try {
    // Obtener los detalles del quiz
    const quizDetails = await quizStore.fetchQuizById(quizId);
    
    if (!quizDetails) {
      error.value = 'No se pudo cargar el detalle del quiz';
      return;
    }
    
    // En producción, esto navegaría a la página del quiz:
    // router.push({ name: 'quiz-detail', params: { id: quizId }});
    console.log(`Navegando al quiz ${quizId}:`, quizDetails);
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
  
  // Cargar datos iniciales
  await cargarCategorias();
  await cargarQuizzes();
  
  // Limpiar evento al desmontar
  return () => {
    window.removeEventListener('resize', handleResize);
  };
});

// Observers para recargar datos
watch(filtroActual, () => {
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
          
          <!-- Componente de filtros en la parte superior -->
          <FiltrosQuizzes 
            :filtrosDisponibles="categorias"
            :initialFilter="filtroActual"
            :loading="isLoading"
            @filtro-cambiado="cambiarFiltro"
          />
          
          <!-- Separador visual -->
          <v-divider class="my-4"></v-divider>
          
          <!-- Componente de sugerencias de quizzes -->
          <SugerenciasQuizzes
            :query="searchQuery"
            :initialFilter="filtroActual"
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