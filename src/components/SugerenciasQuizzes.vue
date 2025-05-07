<script setup>
import { ref, onMounted, computed, watch } from 'vue';

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

// Datos de ejemplo (en producción estos datos vendrían de la API)
const mockQuizzes = [
  {
    id: 1,
    titulo: 'Capitales del mundo',
    creador: 'GeoExpert',
    dificultad: 'Media',
    categoria: 'Geografía',
    tiempo: '10 min',
    preguntas: 20,
    imagen: 'https://picsum.photos/id/1/480/270',
    vistas: '45K',
    fechaPublicacion: '2 semanas'
  },
  {
    id: 2,
    titulo: 'Historia de España: Edad Media',
    creador: 'HistoriaTotal',
    dificultad: 'Difícil',
    categoria: 'Historia',
    tiempo: '15 min',
    preguntas: 25,
    imagen: 'https://picsum.photos/id/2/480/270',
    vistas: '32K',
    fechaPublicacion: '3 días'
  },
  {
    id: 3,
    titulo: 'Matemáticas básicas',
    creador: 'MathGenius',
    dificultad: 'Fácil',
    categoria: 'Matemáticas',
    tiempo: '8 min',
    preguntas: 15,
    imagen: 'https://picsum.photos/id/3/480/270',
    vistas: '128K',
    fechaPublicacion: '1 mes'
  },
  {
    id: 4,
    titulo: 'Literatura universal',
    creador: 'Bookworm',
    dificultad: 'Media',
    categoria: 'Literatura',
    tiempo: '12 min',
    preguntas: 18,
    imagen: 'https://picsum.photos/id/4/480/270',
    vistas: '67K',
    fechaPublicacion: '5 días'
  },
  {
    id: 5,
    titulo: 'Ciencias naturales avanzado',
    creador: 'SciencePro',
    dificultad: 'Difícil',
    categoria: 'Ciencias',
    tiempo: '20 min',
    preguntas: 30,
    imagen: 'https://picsum.photos/id/5/480/270',
    vistas: '89K',
    fechaPublicacion: '1 semana'
  },
  {
    id: 6,
    titulo: 'Arte contemporáneo',
    creador: 'ArtLover',
    dificultad: 'Media',
    categoria: 'Arte',
    tiempo: '15 min',
    preguntas: 22,
    imagen: 'https://picsum.photos/id/6/480/270',
    vistas: '41K',
    fechaPublicacion: '2 días'
  },
  {
    id: 7,
    titulo: 'Deportes olímpicos',
    creador: 'OlympicFan',
    dificultad: 'Fácil',
    categoria: 'Deportes',
    tiempo: '10 min',
    preguntas: 20,
    imagen: 'https://picsum.photos/id/7/480/270',
    vistas: '76K',
    fechaPublicacion: '4 días'
  },
  {
    id: 8,
    titulo: 'Gastronomía internacional',
    creador: 'FoodExplorer',
    dificultad: 'Media',
    categoria: 'Gastronomía',
    tiempo: '12 min',
    preguntas: 18,
    imagen: 'https://picsum.photos/id/8/480/270',
    vistas: '54K',
    fechaPublicacion: '6 días'
  },
  {
    id: 9,
    titulo: 'Redes sociales y marketing',
    creador: 'SocialGuru',
    dificultad: 'Media',
    categoria: 'Marketing',
    tiempo: '15 min',
    preguntas: 25,
    imagen: 'https://picsum.photos/id/9/480/270',
    vistas: '38K',
    fechaPublicacion: '1 semana'
  },
  {
    id: 10,
    titulo: 'Física cuántica para principiantes',
    creador: 'QuantumExplorer',
    dificultad: 'Difícil',
    categoria: 'Ciencias',
    tiempo: '25 min',
    preguntas: 30,
    imagen: 'https://picsum.photos/id/10/480/270',
    vistas: '29K',
    fechaPublicacion: '2 semanas'
  }
];

// Inicializar componente
onMounted(() => {
  filtroActual.value = props.initialFilter;
  searchQuery.value = props.query;
  fetchQuizzes();
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
// En producción, esta función haría una petición real a la API
const fetchQuizzes = async () => {
  isLoading.value = true;
  error.value = null;
  
  try {
    // Simulación de delay de red para mostrar el estado de carga
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // AQUÍ ES DONDE HARÍAS LA PETICIÓN REAL A LA API
    // const response = await fetch(`/api/quizzes?page=${currentPage.value}&limit=${itemsPerPage.value}&filter=${filtroActual.value}&search=${searchQuery.value}`);
    // const data = await response.json();
    // quizzes.value = data.items;
    // totalItems.value = data.total;
    
    // Simulación de la petición a la API
    let filteredQuizzes = [...mockQuizzes];
    
    // Simulación de filtrado por categoría
    if (filtroActual.value && filtroActual.value !== 'Recientes' && filtroActual.value !== 'Populares' && filtroActual.value !== 'Por dificultad') {
      filteredQuizzes = filteredQuizzes.filter(q => q.categoria === filtroActual.value);
    }
    
    // Simulación de ordenamiento
    if (filtroActual.value === 'Populares') {
      filteredQuizzes = [...filteredQuizzes].sort((a, b) => {
        const vistasA = parseInt(a.vistas.replace('K', '000'));
        const vistasB = parseInt(b.vistas.replace('K', '000'));
        return vistasB - vistasA;
      });
    } else if (filtroActual.value === 'Recientes') {
      // Ordenar por fecha de publicación (más reciente primero)
      const fechaValor = (fecha) => {
        if (fecha.includes('día')) {
          return parseInt(fecha.split(' ')[0]) || 1;
        } else if (fecha.includes('semana')) {
          return parseInt(fecha.split(' ')[0]) * 7 || 7;
        } else if (fecha.includes('mes')) {
          return parseInt(fecha.split(' ')[0]) * 30 || 30;
        }
        return 100; // Por defecto, valor alto
      };
      
      filteredQuizzes = [...filteredQuizzes].sort((a, b) => {
        return fechaValor(a.fechaPublicacion) - fechaValor(b.fechaPublicacion);
      });
    } else if (filtroActual.value === 'Por dificultad') {
      // Ordenar por dificultad (fácil a difícil)
      const dificultadValor = {
        'Fácil': 1,
        'Media': 2,
        'Difícil': 3
      };
      
      filteredQuizzes = [...filteredQuizzes].sort((a, b) => {
        return dificultadValor[a.dificultad] - dificultadValor[b.dificultad];
      });
    }
    
    // Simulación de búsqueda
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      filteredQuizzes = filteredQuizzes.filter(q => 
        q.titulo.toLowerCase().includes(query) || 
        q.creador.toLowerCase().includes(query) ||
        q.categoria.toLowerCase().includes(query)
      );
    }
    
    // Simulación de paginación
    totalItems.value = filteredQuizzes.length;
    const startIndex = (currentPage.value - 1) * itemsPerPage.value;
    const endIndex = startIndex + itemsPerPage.value;
    quizzes.value = filteredQuizzes.slice(startIndex, endIndex);
    
  } catch (err) {
    console.error('Error al cargar quizzes:', err);
    error.value = 'No se pudieron cargar los quizzes. Por favor, intenta de nuevo más tarde.';
    quizzes.value = [];
  } finally {
    isLoading.value = false;
  }
};

// Función para cambiar página
const cambiarPagina = (pagina) => {
  currentPage.value = pagina;
  fetchQuizzes();
};

// Función para navegar al detalle de un quiz
const irAlQuiz = (quizId) => {
  emit('quiz-selected', quizId);
  // En producción, esto navegaría a la página del quiz, por ejemplo:
  // router.push({ name: 'quiz-detail', params: { id: quizId }});
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