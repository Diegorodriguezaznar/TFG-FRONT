<script setup>
import { inject } from 'vue';

// Obtener datos del quiz desde el contexto
const quiz = inject('quiz');

// Definir eventos de salida
const emit = defineEmits(['iniciar-quiz', 'guardar-quiz', 'compartir-quiz']);

// Manejar acción de iniciar quiz
const iniciarQuiz = () => {
  emit('iniciar-quiz');
};

// Manejar acción de guardar quiz
const guardarQuiz = () => {
  emit('guardar-quiz');
};

// Manejar acción de compartir quiz
const compartirQuiz = () => {
  emit('compartir-quiz');
};
</script>

<template>
  <v-card class="sticky-card" variant="elevated">
    <v-card-item>
      <v-card-title class="text-h5 mb-4">
        Resumen del quiz
      </v-card-title>
      
      <v-list>
        <v-list-item prepend-icon="mdi-help-circle-outline">
          <v-list-item-title>{{ quiz.preguntas }} preguntas</v-list-item-title>
        </v-list-item>
        
        <v-list-item prepend-icon="mdi-clock-outline">
          <v-list-item-title>Duración: {{ quiz.tiempo }}</v-list-item-title>
        </v-list-item>
        
        <v-list-item prepend-icon="mdi-book-open-variant">
          <v-list-item-title>Categoría: {{ quiz.categoria }}</v-list-item-title>
        </v-list-item>
        
        <v-list-item prepend-icon="mdi-star">
          <v-list-item-title>
            Puntuación: {{ quiz.puntuacion }} / 5
            <span class="text-caption text-grey">({{ quiz.totalReviews }} reviews)</span>
          </v-list-item-title>
        </v-list-item>
        
        <v-list-item prepend-icon="mdi-account">
          <v-list-item-title>Creado por: {{ quiz.creador }}</v-list-item-title>
        </v-list-item>
        
        <v-list-item prepend-icon="mdi-calendar">
          <v-list-item-title>Publicado: {{ quiz.fechaPublicacion }}</v-list-item-title>
        </v-list-item>
      </v-list>
      
      <v-divider class="my-3"></v-divider>
      
      <v-btn
        color="primary"
        block
        size="large"
        class="mt-4"
        @click="iniciarQuiz"
      >
        <v-icon start>mdi-play-circle</v-icon>
        Hacer Test
      </v-btn>
      
      <v-btn
        variant="outlined"
        block
        class="mt-3"
        @click="guardarQuiz"
      >
        <v-icon start>mdi-content-save</v-icon>
        Guardar para después
      </v-btn>
      
      <v-btn
        variant="text"
        block
        class="mt-2"
        @click="compartirQuiz"
      >
        <v-icon start>mdi-share-variant</v-icon>
        Compartir
      </v-btn>
    </v-card-item>
  </v-card>
</template>

<style scoped>
.sticky-card {
  position: sticky;
  top: 80px;
}

@media (max-width: 959px) {
  .sticky-card {
    position: static;
    margin-bottom: 24px;
  }
}
</style>