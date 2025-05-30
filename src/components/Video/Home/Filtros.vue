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
  
  if (asignaturaStore.asignaturas?.length > 0) {
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
  <div class="FiltrosAsignaturas">
    <v-sheet class="FiltrosAsignaturas__contenedor">
      <div v-if="loading" class="FiltrosAsignaturas__loading">
        <v-progress-circular indeterminate size="24" color="red" />
        <span class="FiltrosAsignaturas__texto-loading">Cargando asignaturas...</span>
      </div>
      
      <v-slide-group v-else show-arrows>
        <v-slide-group-item v-for="asignatura in asignaturas" :key="asignatura.idAsignatura">
          <v-chip
            class="FiltrosAsignaturas__chip"
            :class="{ 'FiltrosAsignaturas__chip--activo': filtroActual === asignatura.idAsignatura }"
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

<style lang="scss" scoped>
@import "@/assets/sass/components/Home/Filtros";
</style>