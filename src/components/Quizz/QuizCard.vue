// src/components/quiz/QuizCard.vue
// Versión con cambios mínimos para implementar la navegación

<script setup>
import { defineProps, defineEmits } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  quiz: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['quiz-selected']);

const router = useRouter();

// Mapeo de dificultad a colores de Vuetify
const colorDificultad = (dificultad) => {
  const colores = {
    'Fácil': 'success',
    'Media': 'warning',
    'Difícil': 'error'
  };
  return colores[dificultad] || 'grey';
};

// Función para navegar al detalle del quiz
const navigateToQuizDetail = () => {
  // Primero emitimos el evento para mantener compatibilidad con tu código existente
  emit('quiz-selected', props.quiz.id);
  
  // Ahora también navegamos directamente usando el router
  // Usa la ruta que ya tienes en tu sistema
  router.push({ 
    path: `/quizz-detail`,
    query: { id: props.quiz.id }
  });
};
</script>

<template>
  <v-card 
    @click="navigateToQuizDetail"
    class="quiz-card"
    elevation="1"
    height="100%"
  >
    <div class="quiz-thumbnail">
      <v-img 
        :src="quiz.imagen" 
        :alt="quiz.titulo"
        height="170"
        cover
        :lazy-src="'https://picsum.photos/id/' + quiz.id + '/10/6'"
      >
        <template v-slot:placeholder>
          <v-row class="fill-height ma-0" align="center" justify="center">
            <v-progress-circular indeterminate color="grey-lighten-3"></v-progress-circular>
          </v-row>
        </template>
        
        <!-- Badge de tiempo -->
        <div class="tiempo-badge">
          <v-chip size="x-small" color="black" text-color="white">
            {{ quiz.tiempo }}
          </v-chip>
        </div>
        
        <!-- Badge de dificultad -->
        <div class="dificultad-badge">
          <v-chip size="x-small" :color="colorDificultad(quiz.dificultad)">
            {{ quiz.dificultad }}
          </v-chip>
        </div>
      </v-img>
    </div>
    
    <v-card-item>
      <v-card-title class="text-subtitle-1 font-weight-medium text-truncate">
        {{ quiz.titulo }}
      </v-card-title>
      
      <v-card-subtitle class="pt-2 pb-0">
        {{ quiz.creador }}
      </v-card-subtitle>
      
      <div class="d-flex align-center text-caption text-grey my-1">
        <span>{{ quiz.vistas }} vistas</span>
        <v-icon size="x-small" class="mx-1">mdi-circle-small</v-icon>
        <span>{{ quiz.fechaPublicacion }}</span>
      </div>
      
      <div class="d-flex justify-space-between align-center mt-2">
        <v-chip size="x-small" color="grey-lighten-3" class="text-caption">
          {{ quiz.categoria }}
        </v-chip>
        
        <span class="text-caption">
          {{ quiz.preguntas }} preguntas
        </span>
      </div>
    </v-card-item>
  </v-card>
</template>

<style scoped>
.quiz-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
  height: 100%;
}

.quiz-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1) !important;
}

.quiz-thumbnail {
  position: relative;
}

.tiempo-badge {
  position: absolute;
  bottom: 8px;
  right: 8px;
}

.dificultad-badge {
  position: absolute;
  top: 8px;
  left: 8px;
}
</style>