<template>
  <v-card class="quizzes-curso" elevation="2">
    <v-card-title class="quizzes-curso__header">
      <div class="d-flex align-center">
        <v-icon color="purple" size="large" class="mr-3">mdi-help-circle</v-icon>
        <div>
          <h2 class="quizzes-curso__title">Quizzes del Curso</h2>
          <p class="quizzes-curso__subtitle">
            {{ props.quizzes.length }} quiz{{ props.quizzes.length !== 1 ? 'zes' : '' }} en {{ cursoNombre }}
          </p>
        </div>
      </div>
    </v-card-title>
    
    <v-card-text class="quizzes-curso__content">
      <div v-if="props.quizzes.length === 0" class="quizzes-curso__empty">
        <v-icon color="grey-lighten-2" size="64" class="mb-4">mdi-help-circle-outline</v-icon>
        <h3 class="quizzes-curso__empty-title">No hay quizzes en este curso</h3>
        <p class="quizzes-curso__empty-text">Los quizzes aparecerán aquí cuando se añadan al curso</p>
      </div>
      
      <div v-else class="quizzes-curso__grid">
        <v-row>
          <v-col 
            v-for="quiz in quizzesVisibles" 
            :key="quiz.idQuiz"
            cols="12" 
            sm="6" 
            md="4"
            class="quizzes-curso__col"
          >
            <v-card 
              class="quizzes-curso__quiz" 
              elevation="1" 
              @click="verQuiz(quiz)"
              rounded="xl"
            >
              <div class="quizzes-curso__quiz-header">
                <div class="quizzes-curso__play-icon">
                  <v-icon color="white" size="large">mdi-play-circle</v-icon>
                </div>
                
                <div class="quizzes-curso__basic-info">
                  <v-chip 
                    size="small" 
                    color="white" 
                    variant="elevated"
                    class="quizzes-curso__difficulty-chip"
                  >
                    <v-icon start size="small">mdi-target</v-icon>
                    Quiz
                  </v-chip>
                </div>
              </div>
              
              <v-card-item class="quizzes-curso__info">
                <v-card-title class="quizzes-curso__quiz-titulo">
                  {{ quiz.nombre }}
                </v-card-title>
                
                <v-card-text class="quizzes-curso__quiz-descripcion">
                  {{ quiz.descripcion || 'Sin descripción disponible' }}
                </v-card-text>
                
                <div class="quizzes-curso__meta">
                  <div class="d-flex align-center text-caption text-grey">
                    <v-icon size="small" class="mr-1">mdi-calendar</v-icon>
                    <span>Creado el {{ quiz.fechaCreacion }}</span>
                  </div>
                </div>
              </v-card-item>
              
              <v-card-actions class="quizzes-curso__acciones">
                <v-btn 
                  color="grey" 
                  variant="outlined" 
                  size="small"
                  @click.stop="verDetalleQuiz(quiz)"
                  rounded="lg"
                  class="mr-2"
                >
                  <v-icon start size="small">mdi-information</v-icon>
                  Info
                </v-btn>
                
                <v-btn 
                  color="purple" 
                  variant="elevated" 
                  size="small"
                  @click.stop="verQuiz(quiz)"
                  rounded="lg"
                  class="flex-grow-1"
                >
                  <v-icon start size="small">mdi-play-circle</v-icon>
                  Hacer Quiz
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
        
        <div v-if="hayMasQuizzes" class="quizzes-curso__toggle">
          <v-btn 
            @click="toggleMostrarTodos"
            color="purple"
            variant="outlined"
            size="large"
            block
            rounded="lg"
          >
            <v-icon start>{{ mostrarTodos ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
            {{ mostrarTodos ? 'Mostrar menos' : `Mostrar todos (${props.quizzes.length})` }}
          </v-btn>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import type { QuizCompletaDTO } from '@/stores/dtos/QuizCompletaDTO';

const props = defineProps<{
  quizzes: QuizCompletaDTO[];
  cursoNombre: string;
  cursoId: number;
}>();

const emit = defineEmits<{
  'mostrar-info-quiz': [quizId: number];
}>();

const router = useRouter();
const mostrarTodos = ref(false);
const itemsPorDefecto = 6;

const quizzesVisibles = computed(() => {
  if (mostrarTodos.value) {
    return props.quizzes;
  }
  return props.quizzes.slice(0, itemsPorDefecto);
});

const hayMasQuizzes = computed(() => {
  return props.quizzes.length > itemsPorDefecto;
});

const toggleMostrarTodos = () => {
  mostrarTodos.value = !mostrarTodos.value;
};

const verQuiz = (quiz: QuizCompletaDTO) => {
  router.push(`/quiz/${quiz.idQuiz}`);
};

const verDetalleQuiz = (quiz: QuizCompletaDTO) => {
  emit('mostrar-info-quiz', quiz.idQuiz);
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/components/Cursos/QuizzesCurso";
</style>