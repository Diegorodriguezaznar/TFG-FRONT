<script setup lang="ts">
// --------------------------- Imports ---------------------------
import { ref } from 'vue';

// --------------------------- Props y Emits ---------------------------
const props = defineProps({
  filtroActual: {
    type: String,
    default: 'Todos'
  }
});

const emit = defineEmits(['filtro-seleccionado']);

// --------------------------- Asignaturas/filtros ---------------------------
const asignaturas = ref([
  'Todos',
  'Mates',
  'Lengua',
  'Historia',
  'Física',
  'Química',
  'Biología',
  'Inglés',
  'Arte',
  'Informática',
  'Música'
]);

// --------------------------- Métodos ---------------------------
const seleccionarFiltro = (filtro) => {
  emit('filtro-seleccionado', filtro);
};
</script>

<template>
  <div class="Filtros">
    <v-sheet class="Filtros__Contenedor">
      <v-slide-group show-arrows>
        <v-slide-group-item v-for="asignatura in asignaturas" :key="asignatura">
          <v-chip
            class="ma-2 Filtros__Chip"
            :class="{ 'Filtros__Chip--activo': filtroActual === asignatura }"
            variant="outlined"
            @click="seleccionarFiltro(asignatura)"
          >
            {{ asignatura }}
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
</style>