<!-- src/components/PerfilUsuario/QuizzesUsuario.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import type { QuizDTO } from '@/stores/dtos/QuizDTO';

// Props
const props = defineProps<{
  quizzes: QuizDTO[];
  usuarioNombre: string;
}>();

// Variables
const router = useRouter();
const mostrarTodos = ref(false);
const itemsPorDefecto = 5;

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

const verQuiz = (quiz: QuizDTO) => {
  router.push({
    path: '/quizz-detail',
    query: { id: quiz.idQuiz }
  });
};

const formatearFecha = (fecha: string | Date) => {
  const fechaObj = typeof fecha === 'string' ? new Date(fecha) : fecha;
  return fechaObj.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const obtenerDificultad = (quiz: QuizDTO) => {
  // Generar dificultad basada en el ID del quiz
  const dificultades = ['Fácil', 'Media', 'Difícil'];
  return dificultades[quiz.idQuiz % 3];
};

const obtenerCategoria = (idAsignatura: number) => {
  const categorias: Record<number, string> = {
    1: 'Matemáticas',
    2: 'Ciencias',
    3: 'Historia',
    4: 'Literatura',
    5: 'Geografía',
    6: 'Arte',
    7: 'Deportes',
    8: 'Programación',
    9: 'Idiomas',
    10: 'Marketing'
  };
  return categorias[idAsignatura] || 'Otras';
};

const colorDificultad = (dificultad: string) => {
  const colores: Record<string, string> = {
    'Fácil': 'success',
    'Media': 'warning',
    'Difícil': 'error'
  };
  return colores[dificultad] || 'grey';
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
      <!-- Sin quizzes -->
      <div v-if="props.quizzes.length === 0" class="QuizzesUsuario__Empty">
        <v-icon color="grey-lighten-2" size="64" class="mb-4">mdi-help-circle-outline</v-icon>
        <h3 class="text-h6 text-grey-darken-1 mb-2">No hay quizzes creados</h3>
        <p class="text-body-2 text-grey">Este usuario aún no ha creado ningún quiz</p>
      </div>
      
      <!-- Lista de quizzes -->
      <div v-else>
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
            >
              <!-- Header del quiz con imagen -->
              <div class="QuizzesUsuario__QuizHeader">
                <v-img 
                  :src="`https://picsum.photos/seed/quiz${quiz.idQuiz}/400/200`" 
                  height="140" 
                  cover
                  class="QuizzesUsuario__QuizImagen"
                >
                  <template v-slot:placeholder>
                    <v-row class="fill-height ma-0" align="center" justify="center">
                      <v-progress-circular indeterminate color="purple"></v-progress-circular>
                    </v-row>
                  </template>
                </v-img>
                
                <!-- Overlay con badges -->
                <div class="QuizzesUsuario__QuizOverlay">
                  <div class="QuizzesUsuario__QuizBadges">
                    <v-chip 
                      size="small" 
                      :color="colorDificultad(obtenerDificultad(quiz))"
                      variant="elevated"
                      class="mb-1"
                    >
                      {{ obtenerDificultad(quiz) }}
                    </v-chip>
                    
                    <v-chip 
                      size="small" 
                      color="white"
                      variant="elevated"
                    >
                      {{ obtenerCategoria(quiz.idAsignatura) }}
                    </v-chip>
                  </div>
                  
                  <!-- Play icon -->
                  <div class="QuizzesUsuario__PlayIcon">
                    <v-icon color="white" size="large">mdi-play-circle</v-icon>
                  </div>
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
                
                <div class="QuizzesUsuario__QuizMeta">
                  <div class="d-flex align-center text-caption text-grey">
                    <v-icon size="small" class="mr-1">mdi-calendar</v-icon>
                    <span>Creado hace {{ Math.floor(Math.random() * 30) + 1 }} días</span>
                  </div>
                  
                  <div class="d-flex align-center text-caption text-grey mt-1">
                    <v-icon size="small" class="mr-1">mdi-account-multiple</v-icon>
                    <span>{{ Math.floor(Math.random() * 500) + 50 }} participantes</span>
                  </div>
                </div>
              </v-card-item>
              
              <!-- Acciones -->
              <v-card-actions class="QuizzesUsuario__QuizAcciones">
                <v-btn 
                  color="purple" 
                  variant="elevated" 
                  size="small"
                  @click.stop="verQuiz(quiz)"
                  block
                >
                  <v-icon start>mdi-play-circle</v-icon>
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
.QuizzesUsuario {
  border-radius: 16px;
  border: 1px solid rgba(156, 39, 176, 0.2);
}

.QuizzesUsuario__Header {
  background: linear-gradient(135deg, rgba(156, 39, 176, 0.1) 0%, rgba(186, 104, 200, 0.05) 100%);
  border-bottom: 1px solid rgba(156, 39, 176, 0.1);
  padding: 20px;
}

.QuizzesUsuario__Content {
  padding: 20px;
}

.QuizzesUsuario__Empty {
  text-align: center;
  padding: 40px 20px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 12px;
  border: 2px dashed rgba(0, 0, 0, 0.1);
}

.QuizzesUsuario__QuizCol {
  animation: fadeInUp 0.7s ease-out;
}

.QuizzesUsuario__Quiz {
  height: 100%;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  cursor: pointer;
  border: 1px solid rgba(156, 39, 176, 0.1);
  position: relative;
  overflow: hidden;
}

.QuizzesUsuario__Quiz:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(156, 39, 176, 0.2);
  border-color: rgba(156, 39, 176, 0.3);
}

.QuizzesUsuario__QuizHeader {
  position: relative;
  overflow: hidden;
}

.QuizzesUsuario__QuizImagen {
  border-radius: 12px 12px 0 0;
  transition: transform 0.3s ease;
}

.QuizzesUsuario__Quiz:hover .QuizzesUsuario__QuizImagen {
  transform: scale(1.05);
}

.QuizzesUsuario__QuizOverlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.6));
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 12px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.QuizzesUsuario__Quiz:hover .QuizzesUsuario__QuizOverlay {
  opacity: 1;
}

.QuizzesUsuario__QuizBadges {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.QuizzesUsuario__PlayIcon {
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: center;
}

.QuizzesUsuario__QuizInfo {
  padding: 16px;
}

.QuizzesUsuario__QuizTitulo {
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

.QuizzesUsuario__QuizDescripcion {
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

.QuizzesUsuario__QuizMeta {
  padding-top: 8px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.QuizzesUsuario__QuizAcciones {
  padding: 16px;
  padding-top: 0;
}

.QuizzesUsuario__ToggleContainer {
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
  .QuizzesUsuario__Header {
    padding: 16px;
  }
  
  .QuizzesUsuario__Content {
    padding: 16px;
  }
  
  .QuizzesUsuario__Empty {
    padding: 32px 16px;
  }
}
</style>