<script setup lang="ts">
import { computed, watch, onMounted } from 'vue';
import { useAsignaturaStore } from '@/stores/Asignaturas';

const asignaturaStore = useAsignaturaStore();

const props = defineProps({
  filtroActual: {
    type: [String, Number],
    default: 'Todos'
  },
  cursoId: {
    type: Number,
    default: null
  }
});

const emit = defineEmits(['filtro-seleccionado']);

const loading = computed(() => asignaturaStore.isLoading);

const asignaturas = computed(() => {
  const opciones = [{ idAsignatura: 'Todos', nombre: 'Todos' }];
  
  if (asignaturaStore.asignaturas && asignaturaStore.asignaturas.length > 0) {
    asignaturaStore.asignaturas.forEach(asignatura => {
      opciones.push({
        idAsignatura: asignatura.idAsignatura,
        nombre: asignatura.nombre
      });
    });
  }
  
  return opciones;
});

const cargarAsignaturas = async () => {
  if (props.cursoId) {
    await asignaturaStore.fetchAsignaturasByCurso(props.cursoId);
  } else {
    await asignaturaStore.fetchAllAsignaturas();
  }
};

const seleccionarFiltro = (filtro: any) => {
  emit('filtro-seleccionado', filtro);
};

watch(() => props.cursoId, (newValue) => {
  if (newValue) {
    cargarAsignaturas();
  }
});

onMounted(() => {
  cargarAsignaturas();
});
</script>

<template>
  <div class="Filtros">
    <v-sheet class="Filtros__Contenedor">
      <div v-if="loading" class="Filtros__Loading text-center py-2">
        <v-progress-circular indeterminate size="24" color="orange"></v-progress-circular>
        <span class="ml-2">Cargando asignaturas...</span>
      </div>
      
      <v-slide-group v-else show-arrows>
        <v-slide-group-item v-for="asignatura in asignaturas" :key="asignatura.idAsignatura">
          <v-chip
            class="ma-2 Filtros__Chip"
            :class="{ 'Filtros__Chip--activo': filtroActual === asignatura.idAsignatura }"
            variant="outlined"
            @click="seleccionarFiltro(asignatura.idAsignatura)"
          >
            {{ asignatura.nombre }}
          </v-chip>
        </v-slide-group-item>
      </v-slide-group>
    </v-sheet>
  </div>
</template>

<style scoped>
.Filtros {
  margin-bottom: 16px;
}

.Filtros__Contenedor {
  border-radius: 8px;
  padding: 8px 0;
}

.Filtros__Chip {
  border: 2px solid #FF9800 !important;
  background-color: white !important;
  color: #FF9800 !important;
}

.Filtros__Chip--activo {
  background-color: #FF9800 !important;
  color: white !important;
}

.Filtros__Loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 0;
  color: #FF9800;
}
</style>