<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useQuizStore } from '../stores/Quiz';

// Propiedades de entrada
const props = defineProps({
  initialFilter: {
    type: String,
    default: 'Recientes'
  },
  query: {
    type: String,
    default: ''
  }
});

// Eventos de salida
const emit = defineEmits(['quiz-selected', 'filter-changed']);

// Estados para el manejo de datos
const quizzes = ref([]);
const isLoading = ref(true);
const error = ref(null);
const currentPage = ref(1);
const itemsPerPage = ref(8);
const totalItems = ref(0);
const filtroActual = ref(props.initialFilter);
const searchQuery = ref(props.query);

// Inicializamos el store de quizzes
const quizStore = useQuizStore();

// Inicializar componente
onMounted(async () => {
  filtroActual.value = props.initialFilter;
  searchQuery.value = props.query;
  await fetchQuizzes();
});

// Observar cambios en props para actualizar el componente
watch(() => props.query, (newQuery) => {
  searchQuery.value = newQuery;
  currentPage.value = 1; // Reiniciar paginación
  fetchQuizzes();
});

watch(() => props.initialFilter, (newFilter) => {
  filtroActual.value = newFilter;
  currentPage.value = 1; // Reiniciar paginación
  fetchQuizzes();
});

// Función para obtener quizzes desde la API
const fetchQuizzes = async () => {
  isLoading.value = true;
  error.value = null;
  
  try {
    // Usamos el store para obtener todos los quizzes
    await quizStore.fetchAllQuizzes();
    
    // Filtrar según filtroActual y searchQuery
    let filteredQuizzes = filterAndSortQuizzes(quizStore.quizzes);
    
    // Actualizar el total de items para la paginación
    totalItems.value = filteredQuizzes.length;
    
    // Aplicar paginación
    const startIndex = (currentPage.value - 1) * itemsPerPage.value;
    const endIndex = startIndex + itemsPerPage.value;
    quizzes.value = filteredQuizzes.slice(startIndex, endIndex);
    
  } catch (err) {
    console.error('Error al cargar quizzes:', err);
    error.value = quizStore.errorMessage || 'No se pudieron cargar los quizzes. Por favor, intenta de nuevo más tarde.';
    quizzes.value = [];
  } finally {
    isLoading.value = false;
  }
};

// Función para filtrar y ordenar quizzes según el filtro activo y la búsqueda
const filterAndSortQuizzes = (quizzesData) => {
  // Transformamos los QuizDTO a un formato compatible con la interfaz
  let adaptedQuizzes = quizzesData.map(q => ({
    id: q.idQuiz,
    titulo: q.nombre,
    creador: `Usuario ${q.idUsuario}`, // Podríamos obtener el nombre real del usuario en una implementación completa
    descripcion: q.descripcion,
    dificultad: obtenerDificultad(q), // Necesitaríamos calcular la dificultad de alguna manera
    categoria: obtenerCategoria(q.idAsignatura), // Mapear idAsignatura a una categoría
    tiempo: "10 min", // Valor por defecto, podría ser calculado en base a la cantidad de preguntas
    preguntas: 20, // Valor por defecto, podría obtenerse de otra API
    imagen: `https://picsum.photos/id/${q.idQuiz % 30}/480/270`, // Imagen de placeholder
    vistas: Math.floor(Math.random() * 100) + "K", // Valor aleatorio para ejemplo
    fechaPublicacion: "2 semanas" // Valor por defecto
  }));
  
  // Filtros por categoría
  if (filtroActual.value && !['Recientes', 'Populares', 'Por dificultad'].includes(filtroActual.value)) {
    adaptedQuizzes = adaptedQuizzes.filter(q => q.categoria === filtroActual.value);
  }
  
  // Ordenamientos
  if (filtroActual.value === 'Recientes') {
    // En una implementación real, ordenaríamos por fecha
    adaptedQuizzes = [...adaptedQuizzes].sort((a, b) => b.id - a.id); // Ordenar por ID de forma descendente como aproximación
  } else if (filtroActual.value === 'Populares') {
    // En una implementación real, ordenaríamos por popularidad
    adaptedQuizzes = [...adaptedQuizzes].sort((a, b) => {
      const vistasA = parseInt(a.vistas.replace('K', '000'));
      const vistasB = parseInt(b.vistas.replace('K', '000'));
      return vistasB - vistasA;
    });
  } else if (filtroActual.value === 'Por dificultad') {
    // Ordenar por dificultad
    const dificultadValor = {
      'Fácil': 1,
      'Media': 2,
      'Difícil': 3
    };
    
    adaptedQuizzes = [...adaptedQuizzes].sort((a, b) => {
      return dificultadValor[a.dificultad] - dificultadValor[b.dificultad];
    });
  }
  
  // Filtrar por búsqueda
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    adaptedQuizzes = adaptedQuizzes.filter(q => 
      q.titulo.toLowerCase().includes(query) || 
      q.creador.toLowerCase().includes(query) ||
      q.categoria.toLowerCase().includes(query) ||
      q.descripcion.toLowerCase().includes(query)
    );
  }
  
  return adaptedQuizzes;
};

// Función para cambiar página
const cambiarPagina = (pagina) => {
  currentPage.value = pagina;
  fetchQuizzes();
};

// Función para navegar al detalle de un quiz
const irAlQuiz = (quizId) => {
  emit('quiz-selected', quizId);
};

// Mapeo de dificultad a colores de Vuetify
const colorDificultad = (dificultad) => {
  const colores = {
    'Fácil': 'success',
    'Media': 'warning',
    'Difícil': 'error'
  };
  return colores[dificultad] || 'grey';
};

// Calcular número total de páginas
const totalPaginas = computed(() => Math.ceil(totalItems.value / itemsPerPage.value));

// Funciones auxiliares para mapear datos
function obtenerDificultad(quiz) {
  // En una implementación real, esto podría basarse en alguna propiedad del quiz
  // Por ahora asignamos valores aleatorios
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
</script>

<template>
  <div class="sugerencias-container">
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
        @click="fetchQuizzes"
        class="mt-2"
      >
        Reintentar
      </v-btn>
    </v-alert>
    
    <!-- Estado vacío -->
    <v-alert
      v-else-if="quizzes.length === 0"
      type="info"
      variant="tonal"
      class="my-4"
    >
      No se encontraron quizzes que coincidan con tu búsqueda.
    </v-alert>
    
    <!-- Resultados -->
    <v-row v-else>
      <v-col 
        v-for="quiz in quizzes" 
        :key="quiz.id" 
        cols="12" sm="6" md="4" lg="3"
      >
        <v-card 
          @click="irAlQuiz(quiz.id)"
          class="quiz-card"
          elevation="1"
          height="100%"
        >
          <div class="quiz-thumbnail">
            <v-img 
              :src="quiz.imagen" 
              :alt="quiz.titulo"
              height="170"
              cover
              :lazy-src="'https://picsum.photos/id/' + quiz.id + '/10/6'"
            >
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular indeterminate color="grey-lighten-3"></v-progress-circular>
                </v-row>
              </template>
              
              <!-- Badge de tiempo -->
              <div class="tiempo-badge">
                <v-chip size="x-small" color="black" text-color="white">
                  {{ quiz.tiempo }}
                </v-chip>
              </div>
              
              <!-- Badge de dificultad -->
              <div class="dificultad-badge">
                <v-chip size="x-small" :color="colorDificultad(quiz.dificultad)">
                  {{ quiz.dificultad }}
                </v-chip>
              </div>
            </v-img>
          </div>
          
          <v-card-item>
            <v-card-title class="text-subtitle-1 font-weight-medium text-truncate">
              {{ quiz.titulo }}
            </v-card-title>
            
            <v-card-subtitle class="pt-2 pb-0">
              {{ quiz.creador }}
            </v-card-subtitle>
            
            <div class="d-flex align-center text-caption text-grey my-1">
              <span>{{ quiz.vistas }} vistas</span>
              <v-icon size="x-small" class="mx-1">mdi-circle-small</v-icon>
              <span>{{ quiz.fechaPublicacion }}</span>
            </div>
            
            <div class="d-flex justify-space-between align-center mt-2">
              <v-chip size="x-small" color="grey-lighten-3" class="text-caption">
                {{ quiz.categoria }}
              </v-chip>
              
              <span class="text-caption">
                {{ quiz.preguntas }} preguntas
              </span>
            </div>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>
    
    <!-- Paginación -->
    <div v-if="!isLoading && quizzes.length > 0 && totalPaginas > 1" class="d-flex justify-center mt-8">
      <v-pagination
        v-model="currentPage"
        :length="totalPaginas"
        @update:model-value="cambiarPagina"
        :disabled="isLoading"
        :show-first-last="true"
        rounded="circle"
      ></v-pagination>
    </div>
  </div>
</template>

<style scoped>
.sugerencias-container {
  width: 100%;
}

.quiz-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
  height: 100%;
}

.quiz-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1) !important;
}

.quiz-thumbnail {
  position: relative;
}

.tiempo-badge {
  position: absolute;
  bottom: 8px;
  right: 8px;
}

.dificultad-badge {
  position: absolute;
  top: 8px;
  left: 8px;
}
</style>