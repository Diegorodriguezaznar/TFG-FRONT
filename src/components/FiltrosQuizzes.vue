<script setup>
import { ref, onMounted, watch } from 'vue';

// Propiedades de entrada
const props = defineProps({
  initialFilter: {
    type: String,
    default: 'Recientes'
  },
  // Recibir lista de filtros desde componente padre
  filtrosDisponibles: {
    type: Array,
    default: () => [
      'Recientes', 'Populares', 'Por dificultad', 'Matemáticas', 
      'Ciencias', 'Historia', 'Literatura', 'Geografía', 'Arte', 'Deportes'
    ]
  },
  loading: {
    type: Boolean,
    default: false
  }
});

// Eventos de salida
const emit = defineEmits(['filtro-cambiado']);

// Estado local
const filtroSeleccionado = ref(props.initialFilter);

// Inicializar valor seleccionado
onMounted(() => {
  filtroSeleccionado.value = props.initialFilter;
});

// Observar cambios en filtro inicial
watch(() => props.initialFilter, (nuevoFiltro) => {
  filtroSeleccionado.value = nuevoFiltro;
});

// Función para cambiar el filtro
const seleccionarFiltro = (filtro) => {
  if (filtroSeleccionado.value === filtro) return;
  
  filtroSeleccionado.value = filtro;
  emit('filtro-cambiado', filtro);
};
</script>

<template>
  <div class="filtros-container">
    <div class="d-flex align-center mb-4">
      <h2 class="text-h5 font-weight-medium">Explora Quizzes</h2>
      
      <!-- Indicador de carga -->
      <v-progress-circular
        v-if="props.loading" 
        indeterminate
        color="primary"
        size="20"
        class="ml-4"
      ></v-progress-circular>
    </div>
    
    <!-- Chips de filtros -->
    <div class="filtros-chips">
      <v-chip-group
        v-model="filtroSeleccionado"
        mandatory
        selected-class="primary"
        class="filtros-chip-group"
      >
        <v-chip
          v-for="filtro in props.filtrosDisponibles"
          :key="filtro"
          :value="filtro"
          @click="seleccionarFiltro(filtro)"
          class="mr-2 mb-2"
          variant="elevated"
        >
          {{ filtro }}
        </v-chip>
      </v-chip-group>
    </div>
  </div>
</template>

<style scoped>
.filtros-container {
  width: 100%;
  padding-top: 16px;
}

.filtros-chips {
  display: flex;
  align-items: center;
  padding-bottom: 8px;
}

.filtros-chip-group {
  flex-wrap: wrap;
}

/* Scroll horizontal en dispositivos pequeños */
@media (max-width: 600px) {
  .filtros-chip-group {
    flex-wrap: nowrap;
    overflow-x: auto;
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  .filtros-chip-group::-webkit-scrollbar {
    display: none;
  }
}
</style>