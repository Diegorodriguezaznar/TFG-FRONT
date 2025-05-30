<script setup lang="ts">
interface QuizData {
  nombre: string;
  descripcion: string;
  idAsignatura: number | null;
  idCurso: number | null;
  idUsuario: number | null;
}

interface Asignatura {
  idAsignatura: number;
  nombre: string;
  idCurso?: number;
}

interface Errores {
  nombre: string;
  asignatura: string;
  preguntas: string;
}

interface Props {
  quizData: QuizData;
  asignaturas: Asignatura[];
  errores: Errores;
  cursoActual: number | null;
}

interface Emits {
  (e: 'update:quiz-data', data: QuizData): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const updateQuizData = (field: keyof QuizData, value: any) => {
  emit('update:quiz-data', {
    ...props.quizData,
    [field]: value
  });
};
</script>

<template>
  <div class="QuizInfo">
    <h2 class="text-h4 font-weight-bold mb-6 text-center">
      Información del Quiz
    </h2>
    
    <v-row>
      <v-col cols="12" md="8" offset-md="2">
        <v-text-field
          :model-value="quizData.nombre"
          @update:model-value="(value) => updateQuizData('nombre', value)"
          label="Nombre del Quiz *"
          variant="outlined"
          size="large"
          :error-messages="errores.nombre"
          hint="Elige un nombre descriptivo y atractivo"
          persistent-hint
          class="mb-4"
        ></v-text-field>
        
        <v-textarea
          :model-value="quizData.descripcion"
          @update:model-value="(value) => updateQuizData('descripcion', value)"
          label="Descripción (opcional)"
          variant="outlined"
          rows="3"
          hint="Describe de qué trata este quiz"
          persistent-hint
          class="mb-4"
        ></v-textarea>
        
        <v-select
          :model-value="quizData.idAsignatura"
          @update:model-value="(value) => updateQuizData('idAsignatura', value)"
          :items="asignaturas"
          item-title="nombre"
          item-value="idAsignatura"
          :label="cursoActual ? `Asignatura del Curso ${cursoActual} *` : 'Asignatura *'"
          variant="outlined"
          :error-messages="errores.asignatura"
          :hint="cursoActual ? `Solo asignaturas del curso ${cursoActual}` : 'Selecciona la materia correspondiente'"
          persistent-hint
          :no-data-text="cursoActual ? `No hay asignaturas en el curso ${cursoActual}` : 'No hay asignaturas disponibles'"
        ></v-select>

        <!-- Info sobre asignaturas filtradas -->
        <div v-if="cursoActual" class="text-caption text-grey-darken-1 mt-2">
          {{ asignaturas.length }} asignatura{{ asignaturas.length !== 1 ? 's' : '' }} 
          disponible{{ asignaturas.length !== 1 ? 's' : '' }} en este curso
        </div>
      </v-col>
    </v-row>
  </div>
</template>
