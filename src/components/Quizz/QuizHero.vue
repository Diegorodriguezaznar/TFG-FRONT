<script setup>
import { computed, inject } from 'vue';

// Obtener datos del quiz desde el contexto
const quiz = inject('quiz');

// Mapeo de dificultad a colores
const dificultadColor = computed(() => {
  if (!quiz.value) return 'grey';
  
  const colores = {
    'Fácil': 'success',
    'Media': 'warning',
    'Difícil': 'error'
  };
  
  return colores[quiz.value.dificultad] || 'grey';
});
</script>

<template>
  <v-card
    class="mb-6 quiz-hero"
    rounded="lg"
  >
    <v-img
      :src="quiz.imagen"
      height="300"
      cover
      gradient="to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.8)"
    >
      <div class="d-flex flex-column justify-end fill-height px-6 py-6">
        <!-- Badge de categoría en la parte superior -->
        <v-chip
          color="primary"
          label
          class="mb-2 align-self-start"
        >
          {{ quiz.categoria }}
        </v-chip>
        
        <h1 class="text-h3 text-white font-weight-bold">{{ quiz.titulo }}</h1>
        
        <div class="d-flex flex-wrap align-center mt-2">
          <div class="d-flex align-center mr-4 mb-2">
            <v-avatar color="primary" size="32" class="mr-2">
              <v-icon color="white">mdi-account</v-icon>
            </v-avatar>
            <span class="text-white">{{ quiz.creador }}</span>
          </div>
          
          <v-chip
            :color="dificultadColor"
            size="small"
            label
            class="mr-4 mb-2"
          >
            {{ quiz.dificultad }}
          </v-chip>
          
          <div class="d-flex align-center mr-4 mb-2">
            <v-icon color="amber" size="small" class="mr-1">mdi-star</v-icon>
            <span class="text-white mr-1">{{ quiz.puntuacion }}</span>
            <span class="text-grey-lighten-1">({{ quiz.totalReviews }})</span>
          </div>
          
          <div class="d-flex align-center mr-4 mb-2">
            <v-icon color="white" size="small" class="mr-1">mdi-eye</v-icon>
            <span class="text-white">{{ quiz.vistas }} vistas</span>
          </div>
          
          <div class="d-flex align-center mb-2">
            <v-icon color="white" size="small" class="mr-1">mdi-clock-outline</v-icon>
            <span class="text-white">{{ quiz.tiempo }}</span>
          </div>
        </div>
      </div>
    </v-img>
  </v-card>
</template>

<style scoped>
.quiz-hero {
  position: relative;
  overflow: hidden;
  border-radius: 16px;
}

@media (max-width: 600px) {
  .quiz-hero h1 {
    font-size: 1.75rem !important;
  }
}
</style>