<script setup lang="ts">
// Imports esenciales
import { ref, computed, watch, onMounted } from 'vue';
import { useCursoStore } from '@/stores/Curso';
import { useAsignaturaStore } from '@/stores/Asignaturas';
import type { CursoDTO } from '@/stores/dtos/CursoDTO';
import type { AsignaturaDTO } from '@/stores/dtos/AsignaturasDTO';

// Props y emits
const props = defineProps({
  initialCourseId: { type: Number, default: null },
  initialSubjectId: { type: Number, default: null }
});

const emit = defineEmits(['selection-changed']);

// Stores
const cursoStore = useCursoStore();
const asignaturaStore = useAsignaturaStore();

// Estado
const cursos = ref<CursoDTO[]>([]);
const asignaturas = ref<AsignaturaDTO[]>([]);
const selectedCourseId = ref<number | null>(props.initialCourseId);
const selectedSubjectId = ref<number | null>(props.initialSubjectId);
const loading = ref<boolean>(false);
const error = ref<string | null>(null);

// Items para selects
const cursoItems = computed(() => [
  { text: 'Seleccionar curso', value: null, disabled: true },
  ...cursos.value.map(curso => ({
    text: curso.nombre,
    value: curso.idCurso
  }))
]);

const asignaturaItems = computed(() => [
  { text: 'Seleccionar asignatura', value: null, disabled: true },
  ...asignaturas.value.map(asignatura => ({
    text: asignatura.nombre,
    value: asignatura.idAsignatura
  }))
]);

// Cargar datos
const fetchData = async () => {
  try {
    // Cargar cursos
    loading.value = true;
    error.value = null;
    const result = await cursoStore.fetchAllCursos();
    cursos.value = result || [];
    
    // Verificar si hay cursos
    if (cursos.value.length === 0) {
      error.value = "No se encontraron cursos disponibles.";
      return;
    }
    
    // Cargar asignaturas si hay curso seleccionado
    if (selectedCourseId.value) {
      await loadAsignaturas(selectedCourseId.value);
    }
  } catch (err: any) {
    error.value = err.message || "Error al cargar los datos";
    console.error("Error:", err);
  } finally {
    loading.value = false;
  }
};

// Cargar asignaturas de un curso
const loadAsignaturas = async (courseId: number) => {
  if (!courseId) return;
  
  loading.value = true;
  error.value = null;
  
  try {
    await asignaturaStore.fetchAsignaturasByCurso(courseId);
    asignaturas.value = asignaturaStore.asignaturas;
    
    if (asignaturas.value.length === 0) {
      error.value = "No se encontraron asignaturas para este curso.";
    }
  } catch (err: any) {
    error.value = err.message || "Error al cargar las asignaturas";
    console.error("Error:", err);
  } finally {
    loading.value = false;
  }
};

// Manejar cambio de curso
const handleCourseChange = async () => {
  selectedSubjectId.value = null;
  
  if (selectedCourseId.value) {
    await loadAsignaturas(selectedCourseId.value);
  } else {
    asignaturas.value = [];
  }
  
  emitSelection();
};

// Notificar selección
const emitSelection = () => {
  emit('selection-changed', {
    courseId: selectedCourseId.value ? Number(selectedCourseId.value) : null,
    subjectId: selectedSubjectId.value ? Number(selectedSubjectId.value) : null
  });
};

// Observar cambios
watch(selectedSubjectId, emitSelection);

// Inicialización
onMounted(fetchData);
</script>

<template>
  <v-card flat border class="mb-4 bg-grey-lighten-5">
    <v-card-title class="d-flex align-center pb-0">
      <v-icon icon="mdi-school" class="me-2" color="primary"></v-icon>
      <span class="text-subtitle-1 font-weight-medium">Asociar video</span>
    </v-card-title>
    
    <v-card-text>
      <v-row>
        <!-- Selector de Curso -->
        <v-col cols="12" sm="6">
          <v-select
            v-model="selectedCourseId"
            :items="cursoItems"
            item-title="text"
            item-value="value"
            label="Curso"
            density="comfortable"
            variant="outlined"
            :loading="loading"
            :disabled="loading"
            :error-messages="error && cursos.length === 0 ? [error] : []"
            @update:model-value="handleCourseChange"
            hide-details="auto"
            prepend-inner-icon="mdi-book-education"
          >
            <template v-slot:no-data>
              <div class="pa-2 text-center">
                No se encontraron cursos disponibles
              </div>
            </template>
          </v-select>
        </v-col>
        
        <!-- Selector de Asignatura -->
        <v-col cols="12" sm="6">
          <v-select
            v-model="selectedSubjectId"
            :items="asignaturaItems"
            item-title="text"
            item-value="value"
            label="Asignatura"
            density="comfortable"
            variant="outlined"
            :loading="loading"
            :disabled="!selectedCourseId || loading || asignaturas.length === 0"
            :error-messages="error && selectedCourseId && asignaturas.length === 0 ? [error] : []"
            hide-details="auto"
            prepend-inner-icon="mdi-clipboard-text"
          >
            <template v-slot:no-data>
              <div class="pa-2 text-center">
                {{ selectedCourseId ? 'No hay asignaturas disponibles' : 'Selecciona un curso primero' }}
              </div>
            </template>
          </v-select>
        </v-col>
      </v-row>
      
      <!-- Mensaje de error -->
      <v-alert
        v-if="error && !(selectedCourseId && asignaturas.length === 0) && !(cursos.length === 0)"
        type="error"
        variant="tonal"
        density="compact"
        class="mt-2"
      >
        {{ error }}
      </v-alert>
    </v-card-text>
  </v-card>
</template>

<style scoped>
:deep(.v-field--focused .v-field__outline) {
  border-color: #FF9800 !important;
}

:deep(.v-field--error .v-field__outline) {
  border-color: #d32f2f !important;
}
</style>