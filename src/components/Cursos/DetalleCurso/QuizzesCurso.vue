<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import type { QuizCompletaDTO } from '@/stores/dtos/QuizCompletaDTO';

// Props
const props = defineProps<{
  quizzes: QuizCompletaDTO[];
  cursoNombre: string;
  cursoId: number;
}>();

// Emits
const emit = defineEmits<{
  'mostrar-info-quiz': [quizId: number];
}>();

// Variables
const router = useRouter();
const mostrarTodos = ref(false);
const itemsPorDefecto = 6;

// Computed
const quizzesVisibles = computed(() => {
  if (mostrarTodos.value) {
    return props.quizzes;
  }
  return props.quizzes.slice(0, itemsPorDefecto);
});

const hayMasQuizzes = computed(() => {
  return props.quizzes.length > itemsPorDefecto;
});

// Métodos
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

<template>
  <v-card class="QuizzesCurso" elevation="2">
    <v-card-title class="QuizzesCurso__Header">
      <div class="d-flex align-center">
        <v-icon color="purple" size="large" class="mr-3">mdi-help-circle</v-icon>
        <div>
          <h2 class="text-h5 font-weight-bold">Quizzes del Curso</h2>
          <p class="text-subtitle-2 text-grey mb-0">
            {{ props.quizzes.length }} quiz{{ props.quizzes.length !== 1 ? 'zes' : '' }} en {{ cursoNombre }}
          </p>
        </div>
      </div>
    </v-card-title>
    
    <v-card-text class="QuizzesCurso__Content">
      <!-- Sin quizzes -->
      <div v-if="props.quizzes.length === 0" class="QuizzesCurso__Empty">
        <v-icon color="grey-lighten-2" size="64" class="mb-4">mdi-help-circle-outline</v-icon>
        <h3 class="text-h6 text-grey-darken-1 mb-2">No hay quizzes en este curso</h3>
        <p class="text-body-2 text-grey">Los quizzes aparecerán aquí cuando se añadan al curso</p>
      </div>
      
      <!-- Lista de quizzes -->
      <div v-else class="QuizzesCurso__QuizGrid">
        <v-row>
          <v-col 
            v-for="quiz in quizzesVisibles" 
            :key="quiz.idQuiz"
            cols="12" 
            sm="6" 
            md="4"
            class="QuizzesCurso__QuizCol"
          >
            <v-card 
              class="QuizzesCurso__Quiz" 
              elevation="1" 
              @click="verQuiz(quiz)"
              rounded="xl"
            >
              <!-- Header compacto con degradado morado -->
              <div class="QuizzesCurso__QuizHeader">
                <!-- Icono de play centrado -->
                <div class="QuizzesCurso__PlayIcon">
                  <v-icon color="white" size="large">mdi-play-circle</v-icon>
                </div>
                
                <!-- Información básica del quiz -->
                <div class="QuizzesCurso__QuizBasicInfo">
                  <v-chip 
                    size="small" 
                    color="white" 
                    variant="elevated"
                    class="QuizzesCurso__DifficultyChip"
                  >
                    <v-icon start size="small">mdi-target</v-icon>
                    Quiz
                  </v-chip>
                </div>
              </div>
              
              <!-- Información del quiz -->
              <v-card-item class="QuizzesCurso__QuizInfo">
                <v-card-title class="QuizzesCurso__QuizTitulo">
                  {{ quiz.nombre }}
                </v-card-title>
                
                <v-card-text class="QuizzesCurso__QuizDescripcion">
                  {{ quiz.descripcion || 'Sin descripción disponible' }}
                </v-card-text>
                
                <div class="QuizzesCurso__QuizMeta">
                  <div class="d-flex align-center text-caption text-grey">
                    <v-icon size="small" class="mr-1">mdi-calendar</v-icon>
                    <span>Creado el {{ quiz.fechaCreacion }}</span>
                  </div>
                </div>
              </v-card-item>
              
              <!-- Acciones -->
              <v-card-actions class="QuizzesCurso__QuizAcciones">
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
        
        <!-- Botón para mostrar más/menos -->
        <div v-if="hayMasQuizzes" class="QuizzesCurso__ToggleContainer">
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

<style scoped>
.QuizzesCurso {
  border-radius: 16px;
  border: 1px solid rgba(156, 39, 176, 0.2);
  margin-bottom: 24px;
}

.QuizzesCurso__Header {
  background: linear-gradient(135deg, rgba(156, 39, 176, 0.1) 0%, rgba(186, 104, 200, 0.05) 100%);
  border-bottom: 1px solid rgba(156, 39, 176, 0.1);
  padding: 20px;
}

.QuizzesCurso__Content {
  padding: 20px;
}

.QuizzesCurso__QuizGrid {
  margin-top: 15px; 
}

.QuizzesCurso__Empty {
  text-align: center;
  padding: 40px 20px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 12px;
  border: 2px dashed rgba(0, 0, 0, 0.1);
}

.QuizzesCurso__QuizCol {
  animation: fadeInUp 0.7s ease-out;
  margin-bottom: 15px;
}

.QuizzesCurso__Quiz {
  height: 100%;
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  cursor: pointer;
  border: 1px solid rgba(156, 39, 176, 0.1);
  position: relative;
  overflow: hidden;
}

.QuizzesCurso__Quiz:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(156, 39, 176, 0.2);
  border-color: rgba(156, 39, 176, 0.3);
}

.QuizzesCurso__QuizHeader {
  height: 100px;
  background: linear-gradient(135deg, #9C27B0 0%, #BA68C8 50%, #E1BEE7 100%);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 16px;
  border-radius: 16px 16px 0 0;
}

.QuizzesCurso__PlayIcon {
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.QuizzesCurso__Quiz:hover .QuizzesCurso__PlayIcon {
  opacity: 1;
}

.QuizzesCurso__QuizBasicInfo {
  position: absolute;
  top: 8px;
  right: 8px;
}

.QuizzesCurso__DifficultyChip {
  font-weight: 600;
  backdrop-filter: blur(10px);
}

.QuizzesCurso__QuizInfo {
  padding: 16px;
}

.QuizzesCurso__QuizTitulo {
  font-size: 1.1rem;
  font-weight: 600;
  line-height: 1.3;
  color: #333;
  padding: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.QuizzesCurso__QuizDescripcion {
  color: #555;
  font-size: 0.875rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
  padding: 8px 0;
}

.QuizzesCurso__QuizMeta {
  padding-top: 8px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.QuizzesCurso__QuizAcciones {
  padding: 16px;
  padding-top: 0;
}

.QuizzesCurso__ToggleContainer {
  margin-top: 24px;
  text-align: center;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 600px) {
  .QuizzesCurso__Header {
    padding: 16px;
  }
  
  .QuizzesCurso__Content {
    padding: 16px;
  }
  
  .QuizzesCurso__Empty {
    padding: 32px 16px;
  }
  
  .QuizzesCurso__QuizHeader {
    height: 80px;
    padding: 10px 12px;
  }
  
  .QuizzesCurso__QuizAcciones {
    flex-direction: column;
    gap: 8px;
  }
  
  .QuizzesCurso__QuizAcciones .v-btn {
    width: 100%;
  }
}
</style>