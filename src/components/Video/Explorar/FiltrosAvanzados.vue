<!-- src/components/Explorar/FiltrosSection.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{
  asignaturas: Array<{ idAsignatura: string | number; nombre: string }>;
  filtros: {
    asignatura: string;
    duracion: string;
    fechaPublicacion: string;
    ordenarPor: string;
    soloFavoritos: boolean;
  };
}>();

const emit = defineEmits<{
  'actualizar-filtro': [campo: string, valor: any];
}>();

const mostrarFiltrosAvanzados = ref(false);

// Opciones de filtros
const opcionesDuracion = [
  { value: 'Todas', text: 'Todas las duraciones' },
  { value: 'Corto', text: 'Cortos (< 5 min)' },
  { value: 'Medio', text: 'Medios (5-15 min)' },
  { value: 'Largo', text: 'Largos (> 15 min)' }
];

const opcionesFecha = [
  { value: 'Todas', text: 'Todas las fechas' },
  { value: 'Hoy', text: 'Hoy' },
  { value: 'Semana', text: 'Esta semana' },
  { value: 'Mes', text: 'Este mes' },
  { value: 'Año', text: 'Este año' }
];

const opcionesOrden = [
  { value: 'Más Recientes', text: 'Más recientes' },
  { value: 'Más Antiguos', text: 'Más antiguos' },
  { value: 'Más Likes', text: 'Más likes' },
  { value: 'Menos Likes', text: 'Menos likes' },
  { value: 'Duración Ascendente', text: 'Duración (menor a mayor)' },
  { value: 'Duración Descendente', text: 'Duración (mayor a menor)' },
  { value: 'Alfabético', text: 'Alfabético (A-Z)' },
  { value: 'Alfabético Inverso', text: 'Alfabético (Z-A)' }
];

// Asignaturas formateadas
const asignaturasFormateadas = computed(() => {
  const opciones = [{ idAsignatura: 'Todos', nombre: 'Todas las asignaturas' }];
  
  if (props.asignaturas?.length > 0) {
    props.asignaturas.forEach(asignatura => {
      opciones.push({
        idAsignatura: asignatura.idAsignatura,
        nombre: asignatura.nombre
      });
    });
  }
  
  return opciones;
});

// Contar filtros activos
const filtrosActivos = computed(() => {
  let count = 0;
  if (props.filtros.asignatura !== 'Todos') count++;
  if (props.filtros.duracion !== 'Todas') count++;
  if (props.filtros.fechaPublicacion !== 'Todas') count++;
  if (props.filtros.ordenarPor !== 'Más Recientes') count++;
  if (props.filtros.soloFavoritos) count++;
  return count;
});

// Métodos
const actualizarFiltro = (campo: string, valor: any) => {
  emit('actualizar-filtro', campo, valor);
};

const toggleFiltrosAvanzados = () => {
  mostrarFiltrosAvanzados.value = !mostrarFiltrosAvanzados.value;
};

const limpiarTodosFiltros = () => {
  emit('actualizar-filtro', 'reset', true);
};
</script>

<template>
  <v-card class="FiltrosSection" elevation="3">
    <v-card-title class="FiltrosSection__Header">
      <div class="d-flex align-center justify-space-between w-100">
        <div class="d-flex align-center">
          <v-icon color="red" class="mr-2">mdi-filter</v-icon>
          <span class="font-weight-bold text-red">Filtros de Búsqueda</span>
          <v-chip 
            v-if="filtrosActivos > 0"
            color="red"
            size="small"
            variant="elevated"
            class="ml-2"
          >
            {{ filtrosActivos }}
          </v-chip>
        </div>
        
        <v-btn
          @click="toggleFiltrosAvanzados"
          variant="text"
          size="small"
          :color="mostrarFiltrosAvanzados ? 'red' : 'grey'"
        >
          <v-icon>
            {{ mostrarFiltrosAvanzados ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
          </v-icon>
          {{ mostrarFiltrosAvanzados ? 'Ocultar' : 'Mostrar' }} Filtros
        </v-btn>
      </div>
    </v-card-title>
    
    <!-- Filtros básicos (siempre visibles) -->
    <v-card-text class="FiltrosSection__Basic pb-0">
      <v-row>
        <!-- Asignatura -->
        <v-col cols="12" sm="6" md="4">
          <v-select
            :model-value="filtros.asignatura"
            @update:model-value="actualizarFiltro('asignatura', $event)"
            :items="asignaturasFormateadas"
            item-title="nombre"
            item-value="idAsignatura"
            label="Asignatura"
            variant="outlined"
            density="compact"
            prepend-inner-icon="mdi-book"
            color="red"
          >
            <template v-slot:selection="{ item }">
              <span class="text-truncate">{{ item.title }}</span>
            </template>
          </v-select>
        </v-col>
        
        <!-- Ordenar por -->
        <v-col cols="12" sm="6" md="4">
          <v-select
            :model-value="filtros.ordenarPor"
            @update:model-value="actualizarFiltro('ordenarPor', $event)"
            :items="opcionesOrden"
            item-title="text"
            item-value="value"
            label="Ordenar por"
            variant="outlined"
            density="compact"
            prepend-inner-icon="mdi-sort"
            color="red"
          >
            <template v-slot:selection="{ item }">
              <span class="text-truncate">{{ item.title }}</span>
            </template>
          </v-select>
        </v-col>
        
        <!-- Botón mostrar más filtros (móvil/tablet) -->
        <v-col cols="12" md="4" class="d-flex align-center">
          <v-btn
            @click="toggleFiltrosAvanzados"
            :color="mostrarFiltrosAvanzados ? 'red' : 'grey'"
            :variant="mostrarFiltrosAvanzados ? 'elevated' : 'outlined'"
            block
            size="large"
          >
            <v-icon start>mdi-tune</v-icon>
            {{ mostrarFiltrosAvanzados ? 'Ocultar' : 'Más' }} Filtros
            <v-badge 
              v-if="filtrosActivos > 2"
              :content="filtrosActivos - 2"
              color="red"
              class="ml-2"
            ></v-badge>
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
    
    <!-- Filtros avanzados -->
    <v-expand-transition>
      <v-card-text v-show="mostrarFiltrosAvanzados" class="FiltrosSection__Advanced pt-0">
        <v-divider class="mb-4" color="red" opacity="0.3"></v-divider>
        
        <v-row>
          <!-- Duración -->
          <v-col cols="12" sm="6" md="4">
            <v-select
              :model-value