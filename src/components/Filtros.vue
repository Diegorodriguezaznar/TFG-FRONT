<script setup>
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
            class="ma-2"
            :color="filtroActual === asignatura ? 'primary' : 'grey-lighten-3'"
            :text-color="filtroActual === asignatura ? 'white' : 'default'"
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
</style>