<!-- src/components/Explorar/FiltrosSection.vue - Versión Simplificada -->
<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  asignaturas: Array<{ idAsignatura: string | number; nombre: string }>;
  filtros: {
    asignatura: string;
    ordenarPor: string;
  };
}>();

const emit = defineEmits<{
  'actualizar-filtro': [campo: string, valor: any];
}>();

// Opciones de ordenamiento
const opcionesOrden = [
  { value: 'Más Recientes', text: 'Más recientes', icon: 'mdi-clock-outline', color: '#4CAF50' },
  { value: 'Más Antiguos', text: 'Más antiguos', icon: 'mdi-history', color: '#9E9E9E' },
  { value: 'Más Likes', text: 'Más likes', icon: 'mdi-heart', color: '#E91E63' },
  { value: 'Menos Likes', text: 'Menos likes', icon: 'mdi-heart-outline', color: '#9E9E9E' },
  { value: 'Alfabético', text: 'A-Z', icon: 'mdi-sort-alphabetical-ascending', color: '#673AB7' },
  { value: 'Alfabético Inverso', text: 'Z-A', icon: 'mdi-sort-alphabetical-descending', color: '#3F51B5' }
];

// Asignaturas formateadas
const asignaturasFormateadas = computed(() => {
  const opciones = [{ 
    idAsignatura: 'Todos', 
    nombre: 'Todas las asignaturas', 
    icon: 'mdi-book-open-variant', 
    color: '#FF5722' 
  }];
  
  if (props.asignaturas?.length > 0) {
    props.asignaturas.forEach((asignatura, index) => {
      const colors = [
        '#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', 
        '#2196F3', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', 
        '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800'
      ];
      opciones.push({
        idAsignatura: asignatura.idAsignatura,
        nombre: asignatura.nombre,
        icon: 'mdi-book',
        color: colors[index % colors.length]
      });
    });
  }
  
  return opciones;
});

// Contar filtros activos
const filtrosActivos = computed(() => {
  let count = 0;
  if (props.filtros.asignatura !== 'Todos') count++;
  if (props.filtros.ordenarPor !== 'Más Recientes') count++;
  return count;
});

// Métodos
const actualizarFiltro = (campo: string, valor: any) => {
  emit('actualizar-filtro', campo, valor);
};

const limpiarTodosFiltros = () => {
  emit('actualizar-filtro', 'reset', true);
};
</script>

<template>
  <div class="filtros-section">
    <!-- Header -->
    <div class="filtros-section__header">
      <div class="filtros-section__header-content">
        <div class="filtros-section__header-info">
          <div class="filtros-section__header-icon">
            <v-icon color="white" size="20">mdi-tune</v-icon>
          </div>
          <div class="filtros-section__header-text">
            <h3 class="filtros-section__title">Filtros de Búsqueda</h3>
            <p class="filtros-section__subtitle">Personaliza tu exploración</p>
          </div>
          <v-chip 
            v-if="filtrosActivos > 0"
            color="red"
            size="small"
            variant="elevated"
            class="filtros-section__counter"
          >
            <v-icon start size="small">mdi-filter</v-icon>
            {{ filtrosActivos }}
          </v-chip>
        </div>
        
        <v-btn
          v-if="filtrosActivos > 0"
          @click="limpiarTodosFiltros"
          color="white"
          variant="outlined"
          rounded="xl"
          size="small"
        >
          <v-icon start>mdi-refresh</v-icon>
          Limpiar
        </v-btn>
      </div>
    </div>
    
    <!-- Filtros -->
    <div class="filtros-section__content">
      <v-row>
        <!-- Asignatura -->
        <v-col cols="12" md="6">
          <div class="filtros-section__filter-group">
            <label class="filtros-section__label">
              <v-icon size="small" color="red">mdi-book</v-icon>
              Asignatura
            </label>
            <v-select
              :model-value="filtros.asignatura"
              @update:model-value="actualizarFiltro('asignatura', $event)"
              :items="asignaturasFormateadas"
              item-title="nombre"
              item-value="idAsignatura"
              variant="outlined"
              density="comfortable"
              color="red"
              bg-color="white"
              rounded="lg"
              hide-details
            >
              <template v-slot:selection="{ item }">
                <div class="d-flex align-center">
                  <v-icon :color="item.raw.color" size="small" class="mr-2">{{ item.raw.icon }}</v-icon>
                  <span class="text-truncate">{{ item.title }}</span>
                </div>
              </template>
              <template v-slot:item="{ props, item }">
                <v-list-item v-bind="props">
                  <template v-slot:prepend>
                    <v-icon :color="item.raw.color" size="small">{{ item.raw.icon }}</v-icon>
                  </template>
                </v-list-item>
              </template>
            </v-select>
          </div>
        </v-col>
        
        <!-- Ordenar por -->
        <v-col cols="12" md="6">
          <div class="filtros-section__filter-group">
            <label class="filtros-section__label">
              <v-icon size="small" color="red">mdi-sort</v-icon>
              Ordenar por
            </label>
            <v-select
              :model-value="filtros.ordenarPor"
              @update:model-value="actualizarFiltro('ordenarPor', $event)"
              :items="opcionesOrden"
              item-title="text"
              item-value="value"
              variant="outlined"
              density="comfortable"
              color="red"
              bg-color="white"
              rounded="lg"
              hide-details
            >
              <template v-slot:selection="{ item }">
                <div class="d-flex align-center">
                  <v-icon :color="item.raw.color" size="small" class="mr-2">{{ item.raw.icon }}</v-icon>
                  <span class="text-truncate">{{ item.title }}</span>
                </div>
              </template>
              <template v-slot:item="{ props, item }">
                <v-list-item v-bind="props">
                  <template v-slot:prepend>
                    <v-icon :color="item.raw.color" size="small">{{ item.raw.icon }}</v-icon>
                  </template>
                </v-list-item>
              </template>
            </v-select>
          </div>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/sass/components/Video/Explorar/FiltrosSection";
</style>