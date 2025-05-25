<!-- src/views/ResultadoQuizPage.vue - VERSIÓN SOLO FRONTEND -->
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuizStore } from '@/stores/Quiz';
import { usePreguntaStore } from '@/stores/Pregunta';
import { useRespuestaStore } from '@/stores/Respuesta';
import type { PreguntaDTO } from '@/stores/dtos/PreguntaDTO';
import type { RespuestaDTO } from '@/stores/dtos/RespuestaDTO';

// Stores y router
const route = useRoute();
const router = useRouter();
const quizStore = useQuizStore();
const preguntaStore = usePreguntaStore();
const respuestaStore = useRespuestaStore();

// Variables reactivas
const loading = ref(true);
const quiz = ref(null);
const preguntas = ref<PreguntaDTO[]>([]);
const respuestasMap = ref<Map<number, RespuestaDTO[]>>(new Map());
const showConfetti = ref(false);
const showRevision = ref(false);

// Datos del resultado (obtenidos de sessionStorage)
const resultadoLocal = ref(null);

// Computed
const quizId = computed(() => Number(route.params.id));

const respuestasCorrectas = computed(() => {
  if (!resultadoLocal.value) return 0;
  return resultadoLocal.value.respuestasUsuario.filter(r => r.esCorrecta).length;
});

const respuestasIncorrectas = computed(() => {
  if (!resultadoLocal.value) return 0;
  return resultadoLocal.value.respuestasUsuario.filter(r => !r.esCorrecta).length;
});

const totalPreguntas = computed(() => {
  return resultadoLocal.value?.respuestasUsuario.length || 0;
});

const porcentaje = computed(() => {
  if (totalPreguntas.value === 0) return 0;
  return Math.round((respuestasCorrectas.value / totalPreguntas.value) * 100);
});

const nivelRendimiento = computed(() => {
  const pct = porcentaje.value;
  if (pct >= 90) return { nivel: 'Excelente', color: 'success', icon: 'mdi-trophy', emoji: '🏆' };
  if (pct >= 75) return { nivel: 'Muy Bueno', color: 'info', icon: 'mdi-medal', emoji: '🥈' };
  if (pct >= 60) return { nivel: 'Bueno', color: 'warning', icon: 'mdi-thumb-up', emoji: '👍' };
  if (pct >= 40) return { nivel: 'Regular', color: 'orange', icon: 'mdi-school', emoji: '📚' };
  return { nivel: 'Necesita Mejorar', color: 'error', icon: 'mdi-book-open', emoji: '💪' };
});

const mensajeMotivacional = computed(() => {
  const pct = porcentaje.value;
  if (pct >= 90) return '¡Increíble! Dominas completamente este tema.';
  if (pct >= 75) return '¡Muy bien! Tienes un excelente conocimiento.';
  if (pct >= 60) return 'Buen trabajo. Estás en el camino correcto.';
  if (pct >= 40) return 'No está mal, pero puedes mejorar con más práctica.';
  return 'No te desanimes. La práctica hace al maestro.';
});

// Datos para la revisión detallada
const revisionDetallada = computed(() => {
  if (!resultadoLocal.value || !preguntas.value.length) return [];
  
  return resultadoLocal.value.respuestasUsuario.map(respUsuario => {
    const pregunta = preguntas.value.find(p => p.idPregunta === respUsuario.idPregunta);
    const respuestas = respuestasMap.value.get(respUsuario.idPregunta) || [];
    const respuestaSeleccionada = respuestas.find(r => r.idRespuesta === respUsuario.idRespuestaSeleccionada);
    const respuestaCorrecta = respuestas.find(r => r.esCorrecta);
    
    return {
      numeroPregunta: resultadoLocal.value.respuestasUsuario.indexOf(respUsuario) + 1,
      pregunta: pregunta?.descripcion || 'Pregunta no encontrada',
      respuestaSeleccionada: respuestaSeleccionada?.texto || 'Sin respuesta',
      respuestaCorrecta: respuestaCorrecta?.texto || 'Sin respuesta correcta',
      esCorrecta: respUsuario.esCorrecta,
      todasLasRespuestas: respuestas
    };
  });
});

// Métodos
const cargarDatos = async () => {
  loading.value = true;
  try {
    console.log('📊 Cargando datos del resultado...');
    
    // Obtener resultado de sessionStorage
    const resultadoKey = `quiz_resultado_${quizId.value}`;
    const resultadoGuardado = sessionStorage.getItem(resultadoKey);
    
    if (!resultadoGuardado) {
      throw new Error('No se encontró el resultado del quiz. Es posible que haya expirado.');
    }
    
    resultadoLocal.value = JSON.parse(resultadoGuardado);
    console.log('✅ Resultado cargado:', resultadoLocal.value);

    // Cargar datos del quiz
    const quizData = await quizStore.fetchQuizCompletoById(quizId.value);
    if (!quizData) {
      throw new Error('Quiz no encontrado');
    }
    quiz.value = quizData;
    console.log('✅ Quiz cargado:', quizData.nombre);

    // Cargar preguntas para la revisión
    const preguntasData = await preguntaStore.fetchPreguntasByQuizId(quizId.value);
    preguntas.value = preguntasData;
    console.log('✅ Preguntas cargadas:', preguntasData.length);

    // Cargar respuestas
    const respuestasData = await respuestaStore.fetchRespuestasForQuiz(preguntasData);
    respuestasMap.value = respuestasData;
    console.log('✅ Respuestas cargadas');

    // Mostrar confetti si el resultado es bueno
    if (porcentaje.value >= 75) {
      setTimeout(() => {
        showConfetti.value = true;
        setTimeout(() => {
          showConfetti.value = false;
        }, 3000);
      }, 500);
    }

    console.log('🎉 Todos los datos cargados exitosamente');

  } catch (error) {
    console.error('❌ Error al cargar datos:', error);
    alert('Error al cargar el resultado del quiz: ' + error.message);
    router.push('/quizz-time!');
  } finally {
    loading.value = false;
  }
};

const volverAQuizzes = () => {
  // Limpiar datos del sessionStorage
  const resultadoKey = `quiz_resultado_${quizId.value}`;
  sessionStorage.removeItem(resultadoKey);
  router.push('/quizz-time!');
};

const repetirQuiz = () => {
  // Limpiar datos del sessionStorage
  const resultadoKey = `quiz_resultado_${quizId.value}`;
  sessionStorage.removeItem(resultadoKey);
  router.push(`/quiz/${quizId.value}`);
};

const toggleRevision = () => {
  showRevision.value = !showRevision.value;
};

const compartirResultado = () => {
  const mensaje = `🎯 ¡Acabo de completar el quiz "${quiz.value?.nombre}"!\n\n📊 Mi puntuación: ${porcentaje.value}% (${respuestasCorrectas.value}/${totalPreguntas.value})\n🏆 Nivel: ${nivelRendimiento.value.nivel}\n\n¡Prueba tú también! 🚀`;
  
  if (navigator.share) {
    navigator.share({
      title: `Resultado del Quiz: ${quiz.value?.nombre}`,
      text: mensaje,
      url: window.location.origin + `/quiz/${quizId.value}`
    });
  } else {
    navigator.clipboard.writeText(mensaje).then(() => {
      alert('📋 Resultado copiado al portapapeles!');
    });
  }
};

// Lifecycle
onMounted(() => {
  cargarDatos();
});
</script>

<template>
  <v-app>
    <!-- Confetti animado -->
    <div v-if="showConfetti" class="ResultadoQuiz__Confetti">
      <div class="confetti" v-for="i in 50" :key="i"></div>
    </div>

    <!-- App Bar -->
    <v-app-bar app color="white" elevation="2" height="70">
      <v-btn icon @click="volverAQuizzes" color="orange">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      
      <v-app-bar-title class="text-h6 font-weight-bold">
        Resultado del Quiz
      </v-app-bar-title>
      
      <v-spacer></v-spacer>
      
      <v-btn icon @click="compartirResultado" color="orange">
        <v-icon>mdi-share-variant</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- Contenido principal -->
    <v-main class="ResultadoQuizPage">
      <!-- Estado de carga -->
      <div v-if="loading" class="d-flex justify-center align-center" style="height: 80vh;">
        <div class="text-center">
          <v-progress-circular
            indeterminate
            color="orange"
            size="64"
            width="6"
            class="mb-4"
          ></v-progress-circular>
          <p class="text-h6">Procesando resultados...</p>
          <p class="text-body-2 text-grey">Calculando tu puntuación</p>
        </div>
      </div>

      <!-- Resultados -->
      <v-container v-else-if="resultadoLocal" class="ResultadoQuizPage__Container">
        <!-- Header con resultados principales -->
        <v-card class="ResultadoQuizPage__Header mb-6" elevation="6">
          <div class="ResultadoQuizPage__HeaderBg">
            <v-card-text class="text-center pa-8">
              <!-- Emoji y nivel -->
              <div class="text-h1 mb-4">
                {{ nivelRendimiento.emoji }}
              </div>
              
              <h1 class="text-h3 font-weight-bold text-white mb-2">
                {{ nivelRendimiento.nivel }}
              </h1>
              
              <p class="text-h5 text-white mb-6 opacity-90">
                {{ mensajeMotivacional }}
              </p>
              
              <!-- Puntuación principal -->
              <div class="ResultadoQuizPage__Score mb-6">
                <div class="ResultadoQuizPage__ScoreMain">
                  {{ respuestasCorrectas }} / {{ totalPreguntas }}
                </div>
                <div class="ResultadoQuizPage__ScoreLabel">
                  Respuestas Correctas
                </div>
              </div>
              
              <!-- Porcentaje circular -->
              <v-progress-circular
                :model-value="porcentaje"
                :color="nivelRendimiento.color"
                size="120"
                width="8"
                class="mb-4"
              >
                <span class="text-h4 font-weight-bold text-white">
                  {{ porcentaje }}%
                </span>
              </v-progress-circular>
              
              <!-- Información del quiz -->
              <div class="mt-6">
                <h3 class="text-h6 text-white mb-2">{{ quiz?.nombre }}</h3>
                <p class="text-body-1 text-white opacity-80">
                  Completado el {{ new Date().toLocaleDateString() }}
                </p>
              </div>
            </v-card-text>
          </div>
        </v-card>

        <!-- Estadísticas detalladas -->
        <v-row class="mb-6">
          <v-col cols="12" md="4">
            <v-card class="ResultadoQuizPage__StatCard" elevation="3" :color="'success'" variant="tonal">
              <v-card-text class="text-center pa-6">
                <v-icon color="success" size="48" class="mb-3">mdi-check-circle</v-icon>
                <div class="text-h4 font-weight-bold success--text">
                  {{ respuestasCorrectas }}
                </div>
                <div class="text-body-1 font-weight-medium">Correctas</div>
              </v-card-text>
            </v-card>
          </v-col>
          
          <v-col cols="12" md="4">
            <v-card class="ResultadoQuizPage__StatCard" elevation="3" :color="'error'" variant="tonal">
              <v-card-text class="text-center pa-6">
                <v-icon color="error" size="48" class="mb-3">mdi-close-circle</v-icon>
                <div class="text-h4 font-weight-bold error--text">
                  {{ respuestasIncorrectas }}
                </div>
                <div class="text-body-1 font-weight-medium">Incorrectas</div>
              </v-card-text>
            </v-card>
          </v-col>
          
          <v-col cols="12" md="4">
            <v-card class="ResultadoQuizPage__StatCard" elevation="3" :color="'info'" variant="tonal">
              <v-card-text class="text-center pa-6">
                <v-icon color="info" size="48" class="mb-3">mdi-help-circle</v-icon>
                <div class="text-h4 font-weight-bold info--text">
                  {{ totalPreguntas }}
                </div>
                <div class="text-body-1 font-weight-medium">Total</div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Botones de acción -->
        <v-card class="ResultadoQuizPage__Actions mb-6" elevation="3">
          <v-card-text class="pa-6">
            <div class="d-flex flex-column flex-md-row gap-4 align-center justify-center">
              <v-btn
                @click="toggleRevision"
                color="info"
                size="large"
                variant="elevated"
                prepend-icon="mdi-eye"
                class="flex-grow-1 flex-md-grow-0"
              >
                {{ showRevision ? 'Ocultar' : 'Ver' }} Revisión
              </v-btn>
              
              <v-btn
                @click="repetirQuiz"
                color="orange"
                size="large"
                variant="elevated"
                prepend-icon="mdi-refresh"
                class="flex-grow-1 flex-md-grow-0"
              >
                Repetir Quiz
              </v-btn>
              
              <v-btn
                @click="compartirResultado"
                color="success"
                size="large"
                variant="elevated"
                prepend-icon="mdi-share-variant"
                class="flex-grow-1 flex-md-grow-0"
              >
                Compartir
              </v-btn>
              
              <v-btn
                @click="volverAQuizzes"
                color="primary"
                size="large"
                variant="elevated"
                prepend-icon="mdi-format-list-bulleted"
                class="flex-grow-1 flex-md-grow-0"
              >
                Otros Quizzes
              </v-btn>
            </div>
          </v-card-text>
        </v-card>

        <!-- Revisión detallada -->
        <v-expand-transition>
          <v-card v-if="showRevision" class="ResultadoQuizPage__Revision" elevation="3">
            <v-card-title class="text-h5 font-weight-bold pa-6 pb-4">
              <v-icon class="mr-2">mdi-clipboard-text</v-icon>
              Revisión Detallada
            </v-card-title>
            
            <v-card-text class="pa-0">
              <div
                v-for="(item, index) in revisionDetallada"
                :key="index"
                class="ResultadoQuizPage__RevisionItem"
                :class="{ 'ResultadoQuizPage__RevisionItem--correct': item.esCorrecta }"
              >
                <div class="pa-6">
                  <!-- Número de pregunta y estado -->
                  <div class="d-flex align-center mb-4">
                    <v-chip
                      :color="item.esCorrecta ? 'success' : 'error'"
                      size="small"
                      class="mr-3"
                    >
                      <v-icon start :icon="item.esCorrecta ? 'mdi-check' : 'mdi-close'"></v-icon>
                      Pregunta {{ item.numeroPregunta }}
                    </v-chip>
                    <span class="text-body-2 text-grey">
                      {{ item.esCorrecta ? 'Correcta' : 'Incorrecta' }}
                    </span>
                  </div>
                  
                  <!-- Pregunta -->
                  <h3 class="text-h6 font-weight-medium mb-4">
                    {{ item.pregunta }}
                  </h3>
                  
                  <!-- Tu respuesta -->
                  <div class="mb-3">
                    <div class="text-subtitle-2 font-weight-bold mb-2">
                      Tu respuesta:
                    </div>
                    <div 
                      class="ResultadoQuizPage__Answer"
                      :class="{ 
                        'ResultadoQuizPage__Answer--correct': item.esCorrecta,
                        'ResultadoQuizPage__Answer--incorrect': !item.esCorrecta
                      }"
                    >
                      <v-icon 
                        :icon="item.esCorrecta ? 'mdi-check' : 'mdi-close'"
                        :color="item.esCorrecta ? 'success' : 'error'"
                        class="mr-2"
                      ></v-icon>
                      {{ item.respuestaSeleccionada }}
                    </div>
                  </div>
                  
                  <!-- Respuesta correcta (si es incorrecta) -->
                  <div v-if="!item.esCorrecta" class="mb-3">
                    <div class="text-subtitle-2 font-weight-bold mb-2">
                      Respuesta correcta:
                    </div>
                    <div class="ResultadoQuizPage__Answer ResultadoQuizPage__Answer--correct">
                      <v-icon icon="mdi-check" color="success" class="mr-2"></v-icon>
                      {{ item.respuestaCorrecta }}
                    </div>
                  </div>
                </div>
                
                <v-divider v-if="index < revisionDetallada.length - 1"></v-divider>
              </div>
            </v-card-text>
          </v-card>
        </v-expand-transition>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.ResultadoQuizPage {
  background: linear-gradient(135deg, #fff5f0 0%, #ffffff 100%);
  min-height: 100vh;
}

.ResultadoQuizPage__Container {
  padding-top: 24px;
  max-width: 1000px;
}

.ResultadoQuizPage__Header {
  border-radius: 20px;
  overflow: hidden;
  position: relative;
}

.ResultadoQuizPage__HeaderBg {
  background: linear-gradient(135deg, #FF6B35 0%, #FF8C42 50%, #FFB366 100%);
  position: relative;
}

.ResultadoQuizPage__HeaderBg::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><defs><radialGradient id="a"><stop offset="0" stop-color="%23ffffff" stop-opacity=".1"/><stop offset="1" stop-color="%23ffffff" stop-opacity="0"/></radialGradient></defs><circle cx="500" cy="500" r="500" fill="url(%23a)"/></svg>') center/cover;
  opacity: 0.3;
}

.ResultadoQuizPage__Score {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 20px;
  backdrop-filter: blur(10px);
  display: inline-block;
}

.ResultadoQuizPage__ScoreMain {
  font-size: 3rem;
  font-weight: 900;
  color: white;
  line-height: 1;
}

.ResultadoQuizPage__ScoreLabel {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
}

.ResultadoQuizPage__StatCard {
  border-radius: 16px;
  transition: transform 0.2s ease;
}

.ResultadoQuizPage__StatCard:hover {
  transform: translateY(-4px);
}

.ResultadoQuizPage__Actions {
  border-radius: 16px;
}

.ResultadoQuizPage__Revision {
  border-radius: 16px;
  overflow: hidden;
}

.ResultadoQuizPage__RevisionItem {
  transition: background-color 0.2s ease;
}

.ResultadoQuizPage__RevisionItem--correct {
  background: rgba(76, 175, 80, 0.02);
}

.ResultadoQuizPage__RevisionItem:not(.ResultadoQuizPage__RevisionItem--correct) {
  background: rgba(244, 67, 54, 0.02);
}

.ResultadoQuizPage__Answer {
  padding: 12px 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  font-weight: 500;
}

.ResultadoQuizPage__Answer--correct {
  background: rgba(76, 175, 80, 0.1);
  border: 1px solid rgba(76, 175, 80, 0.3);
}

.ResultadoQuizPage__Answer--incorrect {
  background: rgba(244, 67, 54, 0.1);
  border: 1px solid rgba(244, 67, 54, 0.3);
}

/* Animación de confetti */
.ResultadoQuizPage__Confetti {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
}

.confetti {
  position: absolute;
  width: 10px;
  height: 10px;
  background: #FF6B35;
  animation: confetti-fall 3s linear infinite;
}

.confetti:nth-child(odd) {
  background: #FF8C42;
  width: 8px;
  height: 8px;
  animation-duration: 2.5s;
}

.confetti:nth-child(even) {
  background: #FFB366;
  width: 6px;
  height: 6px;
  animation-duration: 3.5s;
}

.confetti:nth-child(4n) {
  background: #FFA726;
  border-radius: 50%;
}

@keyframes confetti-fall {
  0% {
    transform: translateY(-100vh) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
}

/* Generar posiciones aleatorias para el confetti */
.confetti:nth-child(1) { left: 10%; animation-delay: 0s; }
.confetti:nth-child(2) { left: 20%; animation-delay: 0.2s; }
.confetti:nth-child(3) { left: 30%; animation-delay: 0.4s; }
.confetti:nth-child(4) { left: 40%; animation-delay: 0.6s; }
.confetti:nth-child(5) { left: 50%; animation-delay: 0.8s; }
.confetti:nth-child(6) { left: 60%; animation-delay: 1s; }
.confetti:nth-child(7) { left: 70%; animation-delay: 1.2s; }
.confetti:nth-child(8) { left: 80%; animation-delay: 1.4s; }
.confetti:nth-child(9) { left: 90%; animation-delay: 1.6s; }
.confetti:nth-child(10) { left: 15%; animation-delay: 1.8s; }

@media (max-width: 600px) {
  .ResultadoQuizPage__Container {
    padding: 16px;
  }
  
  .ResultadoQuizPage__ScoreMain {
    font-size: 2.5rem;
  }
  
  .ResultadoQuizPage__Actions .d-flex {
    gap: 12px;
  }
}
</style>