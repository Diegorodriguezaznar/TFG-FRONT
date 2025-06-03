<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import type { QuizDTO } from '@/stores/dtos/QuizDTO';

const props = defineProps<{
  quizzes: QuizDTO[];
  usuarioNombre: string;
}>();

const router = useRouter();
const mostrarTodos = ref(false);
const itemsPorDefecto = 6; // Cambiado de 5 a 6 para coincidir

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

const formatearFecha = (fecha: string) => {
  if (!fecha) return 'Sin fecha';
  try {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    return 'Fecha inválida';
  }
};
</script>

<template>
  <v-card class="QuizzesUsuario" elevation="2">
    <v-card-title class="QuizzesUsuario__Header">
      <div class="d-flex align-center">
        <v-icon color="purple" size="large" class="mr-3">mdi-help-circle</v-icon>
        <div>
          <h2 class="text-h5 font-weight-bold">Quizzes Creados</h2>
          <p class="text-subtitle-2 text-grey mb-0">
            {{ props.quizzes.length }} quiz{{ props.quizzes.length !== 1 ? 'zes' : '' }} por {{ usuarioNombre }}
          </p>
        </div>
      </div>
    </v-card-title>
    
    <v-card-text class="QuizzesUsuario__Content">
      <div v-if="props.quizzes.length === 0" class="QuizzesUsuario__Empty">
        <v-icon color="grey-lighten-2" size="64" class="mb-4">mdi-help-circle-outline</v-icon>
        <h3 class="text-h6 text-grey-darken-1 mb-2">No hay quizzes creados</h3>
        <p class="text-body-2 text-grey">Este usuario aún no ha creado ningún quiz</p>
      </div>
      
      <div v-else class="QuizzesUsuario__QuizGrid">
        <v-row>
          <v-col 
            v-for="quiz in quizzesVisibles" 
            :key="quiz.idQuiz"
            cols="12" 
            sm="6" 
            md="4"
            class="QuizzesUsuario__QuizCol"
          >
            <v-card 
              class="QuizzesUsuario__Quiz" 
              elevation="1" 
              @click="verQuiz(quiz)"
              rounded="xl"
            >
              <!-- Header con degradado morado (igual que QuizzesCurso) -->
              <div class="QuizzesUsuario__QuizHeader">
                <!-- Icono de play centrado -->
                <div class="QuizzesUsuario__PlayIcon">
                  <v-icon color="white" size="large">mdi-play-circle</v-icon>
                </div>
                
                <!-- Información básica en la esquina -->
                <div class="QuizzesUsuario__BasicInfo">
                  <v-chip 
                    size="small" 
                    color="white" 
                    variant="elevated"
                    class="QuizzesUsuario__DifficultyChip"
                  >
                    <v-icon start size="small">mdi-target</v-icon>
                    Quiz
                  </v-chip>
                </div>
              </div>
              
              <!-- Información del quiz -->
              <v-card-item class="QuizzesUsuario__QuizInfo">
                <v-card-title class="QuizzesUsuario__QuizTitulo">
                  {{ quiz.nombre }}
                </v-card-title>
                
                <v-card-text class="QuizzesUsuario__QuizDescripcion">
                  {{ quiz.descripcion || 'Sin descripción disponible' }}
                </v-card-text>
                
                <!-- Meta información -->
                <div class="QuizzesUsuario__Meta">
                  <div class="d-flex align-center text-caption text-grey">
                    <v-icon size="small" class="mr-1">mdi-calendar</v-icon>
                    <span>Creado el {{ formatearFecha(quiz.fechaCreacion) }}</span>
                  </div>
                </div>
              </v-card-item>
              
              <!-- Acciones (igual que QuizzesCurso) -->
              <v-card-actions class="QuizzesUsuario__QuizAcciones">
                
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
        
        <!-- Botón para mostrar más/menos -->
        <div v-if="hayMasQuizzes" class="QuizzesUsuario__ToggleContainer">
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

<style scoped lang="scss">
@import "@/assets/sass/components/Usuarios/Perfil/QuizzesUsuario.scss";
</style>