<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useCursoStore } from '@/stores/Curso';
import { useAsignaturaStore } from '@/stores/Asignaturas';
import type { CursoDTO } from '@/stores/dtos/CursoDTO';
import type { AsignaturaDTO } from '@/stores/dtos/AsignaturasDTO';

const props = defineProps({
  initialCourseId: { type: Number, default: null },
  initialSubjectId: { type: Number, default: null }
});

const emit = defineEmits(['selection-changed']);

const cursoStore = useCursoStore();
const asignaturaStore = useAsignaturaStore();

const cursos = ref<CursoDTO[]>([]);
const asignaturas = ref<AsignaturaDTO[]>([]);
const selectedCourseId = ref<number | null>(props.initialCourseId);
const selectedSubjectId = ref<number | null>(props.initialSubjectId);
const loading = ref<boolean>(false);
const error = ref<string | null>(null);

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

const fetchData = async () => {
  try {
    loading.value = true;
    error.value = null;
    const result = await cursoStore.fetchAllCursos();
    cursos.value = result || [];
    
    if (cursos.value.length === 0) {
      error.value = "No se encontraron cursos disponibles.";
      return;
    }
    
    if (selectedCourseId.value) {
      await loadAsignaturas(selectedCourseId.value);
    }
  } catch (err: any) {
    error.value = err.message || "Error al cargar los datos";
  } finally {
    loading.value = false;
  }
};

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
  } finally {
    loading.value = false;
  }
};

const handleCourseChange = async () => {
  selectedSubjectId.value = null;
  
  if (selectedCourseId.value) {
    await loadAsignaturas(selectedCourseId.value);
  } else {
    asignaturas.value = [];
  }
  
  emitSelection();
};

const emitSelection = () => {
  emit('selection-changed', {
    courseId: selectedCourseId.value ? Number(selectedCourseId.value) : null,
    subjectId: selectedSubjectId.value ? Number(selectedSubjectId.value) : null
  });
};

watch(selectedSubjectId, emitSelection);

onMounted(fetchData);
</script>

<template>
  <v-card flat border class="CursoAsignaturaSelector">
    <v-card-title class="CursoAsignaturaSelector__header">
      <v-icon icon="mdi-school" class="CursoAsignaturaSelector__icono" color="primary" />
      <span class="CursoAsignaturaSelector__titulo">Asociar video</span>
    </v-card-title>
    
    <v-card-text class="CursoAsignaturaSelector__contenido">
      <div class="CursoAsignaturaSelector__selectores">
        <div class="CursoAsignaturaSelector__campo">
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
            class="CursoAsignaturaSelector__select"
          >
            <template v-slot:no-data>
              <div class="CursoAsignaturaSelector__no-data">
                No se encontraron cursos disponibles
              </div>
            </template>
          </v-select>
        </div>
        
        <div class="CursoAsignaturaSelector__campo">
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
            class="CursoAsignaturaSelector__select"
          >
            <template v-slot:no-data>
              <div class="CursoAsignaturaSelector__no-data">
                {{ selectedCourseId ? 'No hay asignaturas disponibles' : 'Selecciona un curso primero' }}
              </div>
            </template>
          </v-select>
        </div>
      </div>
      
      <v-alert
        v-if="error && !(selectedCourseId && asignaturas.length === 0) && !(cursos.length === 0)"
        type="error"
        variant="tonal"
        density="compact"
        class="CursoAsignaturaSelector__alerta"
      >
        {{ error }}
      </v-alert>
    </v-card-text>
  </v-card>
</template>

<style scoped lang="scss">
@import "@/assets/sass/components/SubirVideo/steps/SelectorAsignaturas";
</style>