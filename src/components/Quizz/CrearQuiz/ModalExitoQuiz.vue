<!-- src/components/Quizz/CrearQuiz/ModalExitoQuiz.vue -->
<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  modelValue: boolean;
  nombreQuiz: string;
  cursoActual?: number | null;
  totalPreguntas: number;
  totalRespuestas: number;
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'continuar'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const dialog = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value)
});

function handleContinuar() {
  emit('continuar');
  dialog.value = false;
}
</script>

<template>
  <v-dialog v-model="dialog" max-width="400" persistent>
    <v-card>
      <v-card-text class="pa-6">
        <v-alert
          type="success"
          variant="tonal"
          class="mb-4"
          prominent
        >
          <template v-slot:prepend>
            <v-icon>mdi-check-circle</v-icon>
          </template>
          
          <div class="text-body-1">
            <strong>Quiz creado correctamente.</strong> 
            "{{ nombreQuiz }}" está listo para usar.
            <div class="mt-2 text-body-2">
              {{ totalPreguntas }} {{ totalPreguntas === 1 ? 'pregunta' : 'preguntas' }} • 
              {{ totalRespuestas }} {{ totalRespuestas === 1 ? 'respuesta' : 'respuestas' }}
            </div>
          </div>
        </v-alert>
      </v-card-text>

      <v-card-actions class="px-6 pb-6">
        <v-spacer></v-spacer>
        <v-btn 
          @click="handleContinuar" 
          color="success" 
          variant="text"
        >
          CONTINUAR
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>