<script setup>
// Propiedades de entrada para recibir los quizzes relacionados
const props = defineProps({
  quizzes: {
    type: Array,
    default: () => []
  }
});

// Eventos de salida
const emit = defineEmits(['quiz-selected']);

// Función para navegar a otro quiz
const verOtroQuiz = (quizId) => {
  emit('quiz-selected', quizId);
};

// Mapeo de dificultad a colores de Vuetify
const colorDificultad = (dificultad) => {
  const colores = {
    'Fácil': 'success',
    'Media': 'warning',
    'Difícil': 'error'
  };
  return colores[dificultad] || 'grey';
};
</script>

<template>
  <div v-if="props.quizzes && props.quizzes.length > 0">
    <h2 class="text-h5 font-weight-medium mb-4">Otros quizzes que te pueden interesar</h2>
    <v-row>
      <v-col
        v-for="quiz in props.quizzes"
        :key="quiz.id"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card
          @click="verOtroQuiz(quiz.id)"
          class="quiz-card h-100"
          elevation="1"
        >
          <v-img
            :src="quiz.imagen"
            :alt="quiz.titulo"
            height="120"
            cover
          ></v-img>
          
          <v-card-item>
            <v-card-title class="text-subtitle-1 font-weight-medium text-truncate">
              {{ quiz.titulo }}
            </v-card-title>
            <div class="d-flex justify-space-between align-center mt-2">
              <v-chip
                :color="colorDificultad(quiz.dificultad)"
                size="x-small"
              >
                {{ quiz.dificultad }}
              </v-chip>
              <span class="text-caption">
                {{ quiz.tiempo }}
              </span>
            </div>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>
.quiz-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}

.quiz-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1) !important;
}
</style>