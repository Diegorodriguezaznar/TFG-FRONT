<!-- src/views/RealizarQuizPage.vue -->
<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuizStore } from '@/stores/Quiz';
import { usePreguntaStore } from '@/stores/Pregunta';
import { useRespuestaStore } from '@/stores/Respuesta';
import { useResultadoQuizStore } from '@/stores/ResultadoQuiz';
import { useUsuarioLogeadoStore } from '@/stores/UsuarioLogeado';
import type { PreguntaDTO } from '@/stores/dtos/PreguntaDTO';
import type { RespuestaDTO } from '@/stores/dtos/RespuestaDTO';
import type { RespuestaUsuarioDTO } from '@/stores/dtos/ResultadoQuizDTO';

// Stores y router
const route = useRoute();
const router = useRouter();
const quizStore = useQuizStore();
const preguntaStore = usePreguntaStore();
const respuestaStore = useRespuestaStore();
const resultadoStore = useResultadoQuizStore();
const usuarioStore = useUsuarioLogeadoStore();

// Variables reactivas
const loading = ref(true);
const quiz = ref(null);
const preguntas = ref<PreguntaDTO[]>([]);
const respuestasMap = ref<Map<number, RespuestaDTO[]>>(new Map());
const preguntaActual = ref(0);
const respuestasUsuario = ref<Map<number, number>>(new Map()); // idPregunta -> idRespuesta
const tiempoInicio = ref<Date>(new Date());
const showConfirmDialog = ref(false);

// Computed
const quizId = computed(() => Number(route.params.id));
const usuarioActual = computed(() => usuarioStore.usuarioActual);

const preguntaActualData = computed(() => {
  return preguntas.value[preguntaActual.value] || null;
});

const respuestasActuales = computed(() => {
  if (!preguntaActualData.value) return [];
  return respuestasMap.value.get(preguntaActualData.value.idPregunta) || [];
});

const progreso = computed(() => {
  return preguntas.value.length > 0 ? ((preguntaActual.value + 1) / preguntas.value.length) * 100 : 0;
});

const esUltimaPregunta = computed(() => {
  return preguntaActual.value === preguntas.value.length - 1;
});

const puedeAvanzar = computed(() => {
  if (!preguntaActualData.value) return false;
  return respuestasUsuario.value.has(preguntaActualData.value.idPregunta);
});

const totalRespuestas = computed(() => {
  return respuestasUsuario.value.size;
});

// Métodos
const cargarQuiz = async () => {
  loading.value = true;
  try {
    // Cargar datos del quiz
    const quizData = await quizStore.fetchQuizCompletoById(quizId.value);
    if (!quizData) {
      throw new Error('Quiz no encontrado');
    }
    quiz.value = quizData;

    // Cargar preguntas
    const preguntasData = await preguntaStore.fetchPreguntasByQuizId(quizId.value);
    if (preguntasData.length === 0) {
      throw new Error('Este quiz no tiene preguntas');
    }
    preguntas.value = preguntasData;
    quiz.value.totalPreguntas = preguntasData.length;

    // Cargar respuestas para todas las preguntas
    const respuestasData = await respuestaStore.fetchRespuestasForQuiz(preguntasData);
    respuestasMap.value = respuestasData;

    // Verificar que todas las preguntas tengan respuestas
    for (const pregunta of preguntasData) {
      const respuestas = respuestasData.get(pregunta.idPregunta);
      if (!respuestas || respuestas.length === 0) {
        throw new Error(`La pregunta "${pregunta.descripcion}" no tiene respuestas disponibles`);
      }
    }

  } catch (error) {
    console.error('Error al cargar quiz:', error);
    router.push('/quizz-time!');
  } finally {
    loading.value = false;
  }
};

const seleccionarRespuesta = (idRespuesta: number) => {
  if (!preguntaActualData.value) return;
  respuestasUsuario.value.set(preguntaActualData.value.idPregunta, idRespuesta);
};

const siguientePregunta = () => {
  if (preguntaActual.value < preguntas.value.length - 1) {
    preguntaActual.value++;
  }
};

const preguntaAnterior = () => {
  if (preguntaActual.value > 0) {
    preguntaActual.value--;
  }
};

const irAPregunta = (index: number) => {
  if (index >= 0 && index < preguntas.value.length) {
    preguntaActual.value = index;
  }
};

const finalizarQuiz = () => {
  showConfirmDialog.value = true;
};

const confirmarFinalizacion = async () => {
  if (!quiz.value || !usuarioActual.value) return;

  loading.value = true;
  try {
    // Construir respuestas del usuario
    const respuestasUsuarioArray: RespuestaUsuarioDTO[] = [];
    
    for (const pregunta of preguntas.value) {
      const idRespuestaSeleccionada = respuestasUsuario.value.get(pregunta.idPregunta);
      if (idRespuestaSeleccionada) {
        const respuestas = respuestasMap.value.get(pregunta.idPregunta) || [];
        const respuestaSeleccionada = respuestas.find(r => r.idRespuesta === idRespuestaSeleccionada);
        
        respuestasUsuarioArray.push({
          idPregunta: pregunta.idPregunta,
          idRespuestaSeleccionada,
          esCorrecta: respuestaSeleccionada?.esCorrecta || false
        });
      }
    }

    // Calcular puntuación
    const puntuacion = resultadoStore.calcularPuntuacion(respuestasUsuarioArray);

    // Guardar resultado
    const resultado = {
      idQuiz: quiz.value.idQuiz,
      idUsuario: usuarioActual.value.idUsuario,
      puntuacion,
      fechaRealizacion: new Date().toISOString(),
      respuestasUsuario: respuestasUsuarioArray
    };

    const guardado = await resultadoStore.saveResultadoQuiz(resultado);
    
    if (guardado) {
      // Navegar a resultados
      router.push(`/quiz/${quizId.value}/resultado`);
    } else {
      throw new Error('Error al guardar el resultado');
    }

  } catch (error) {
    console.error('Error al finalizar quiz:', error);
    alert('Error al guardar el resultado. Inténtalo de nuevo.');
  } finally {
    loading.value = false;
    showConfirmDialog.value = false;
  }
};

const salirQuiz = () => {
  router.push('/quizz-time!');
};

// Auto-save del progreso cada 30 segundos
let autoSaveInterval: number;

// Lifecycle
onMounted(() => {
  cargarQuiz();
  tiempoInicio.value = new Date();
  
  // Auto-save cada 30 segundos
  autoSaveInterval = setInterval(() => {
    // Aquí podrías implementar auto-save del progreso si lo deseas
    console.log('Auto-save del progreso:', totalRespuestas.value, 'de', preguntas.value.length);
  }, 30000);
});

// Cleanup
onUnmounted(() => {
  if (autoSaveInterval) {
    clearInterval(autoSaveInterval);
  }
});
</script>

<template>
  <v-app>
    <!-- App Bar fijo -->
    <v-app-bar app color="white" elevation="2" height="70">
      <v-btn icon @click="salirQuiz" color="orange">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      
      <v-app-bar-title v-if="quiz" class="text-h6 font-weight-bold">
        {{ quiz.nombre }}
      </v-app-bar-title>
      
      <v-spacer></v-spacer>
      
      <!-- Progreso y navegación -->
      <div v-if="!loading && preguntas.length > 0" class="d-flex align-center">
        <span class="text-body-2 mr-4">
          {{ preguntaActual + 1 }} de {{ preguntas.length }}
        </span>
        
        <v-btn
          @click="finalizarQuiz"
          color="orange"
          variant="elevated"
          size="small"
          :disabled="totalRespuestas === 0"
        >
          <v-icon start>mdi-check</v-icon>
          Finalizar
        </v-btn>
      </div>
    </v-app-bar>

    <!-- Contenido principal -->
    <v-main class="RealizarQuizPage">
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
          <p class="text-h6">Cargando quiz...</p>
        </div>
      </div>

      <!-- Quiz content -->
      <div v-else-if="quiz && preguntas.length > 0" class="RealizarQuizPage__Content">
        <!-- Barra de progreso -->
        <v-progress-linear
          :model-value="progreso"
          color="orange"
          height="6"
          class="RealizarQuizPage__Progress"
        ></v-progress-linear>

        <v-container class="RealizarQuizPage__Container">
          <!-- Navegación de preguntas (móvil) -->
          <div class="RealizarQuizPage__QuestionNav d-flex d-md-none mb-4">
            <v-btn-group variant="outlined" divided>
              <v-btn
                v-for="(pregunta, index) in preguntas"
                :key="pregunta.idPregunta"
                :color="respuestasUsuario.has(pregunta.idPregunta) ? 'orange' : 'grey'"
                :variant="index === preguntaActual ? 'elevated' : 'outlined'"
                size="small"
                @click="irAPregunta(index)"
              >
                {{ index + 1 }}
              </v-btn>
            </v-btn-group>
          </div>

          <v-row>
            <!-- Navegación lateral (desktop) -->
            <v-col cols="12" md="3" class="d-none d-md-block">
              <v-card class="RealizarQuizPage__Sidebar" elevation="2">
                <v-card-title class="text-h6 pb-2">
                  Navegación
                </v-card-title>
                
                <v-card-text class="pt-0">
                  <div class="RealizarQuizPage__QuestionGrid">
                    <v-btn
                      v-for="(pregunta, index) in preguntas"
                      :key="pregunta.idPregunta"
                      :color="respuestasUsuario.has(pregunta.idPregunta) ? 'orange' : 'grey'"
                      :variant="index === preguntaActual ? 'elevated' : 'outlined'"
                      size="small"
                      class="ma-1"
                      @click="irAPregunta(index)"
                    >
                      {{ index + 1 }}
                    </v-btn>
                  </div>
                  
                  <v-divider class="my-4"></v-divider>
                  
                  <div class="text-center">
                    <p class="text-body-2 mb-2">Progreso</p>
                    <p class="text-h6 font-weight-bold">
                      {{ totalRespuestas }} / {{ preguntas.length }}
                    </p>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- Pregunta actual -->
            <v-col cols="12" md="9">
              <v-card 
                v-if="preguntaActualData" 
                class="RealizarQuizPage__QuestionCard"
                elevation="3"
              >
                <v-card-text class="pa-6">
                  <!-- Número de pregunta -->
                  <div class="d-flex align-center mb-4">
                    <v-chip color="orange" size="large" class="mr-3">
                      Pregunta {{ preguntaActual + 1 }}
                    </v-chip>
                    <span class="text-body-2 text-grey">
                      de {{ preguntas.length }}
                    </span>
                  </div>

                  <!-- Texto de la pregunta -->
                  <h2 class="RealizarQuizPage__QuestionText mb-6">
                    {{ preguntaActualData.descripcion }}
                  </h2>

                  <!-- Respuestas -->
                  <v-radio-group
                    :model-value="respuestasUsuario.get(preguntaActualData.idPregunta)"
                    @update:model-value="seleccionarRespuesta"
                    class="RealizarQuizPage__Answers"
                  >
                    <v-radio
                      v-for="respuesta in respuestasActuales"
                      :key="respuesta.idRespuesta"
                      :value="respuesta.idRespuesta"
                      class="RealizarQuizPage__Answer mb-3"
                    >
                      <template v-slot:label>
                        <div class="RealizarQuizPage__AnswerText">
                          {{ respuesta.texto }}
                        </div>
                      </template>
                    </v-radio>
                  </v-radio-group>
                </v-card-text>

                <!-- Botones de navegación -->
                <v-card-actions class="px-6 pb-6">
                  <v-btn
                    @click="preguntaAnterior"
                    :disabled="preguntaActual === 0"
                    variant="outlined"
                    color="grey"
                  >
                    <v-icon start>mdi-chevron-left</v-icon>
                    Anterior
                  </v-btn>

                  <v-spacer></v-spacer>

                  <v-btn
                    v-if="!esUltimaPregunta"
                    @click="siguientePregunta"
                    :disabled="!puedeAvanzar"
                    color="orange"
                    variant="elevated"
                  >
                    Siguiente
                    <v-icon end>mdi-chevron-right</v-icon>
                  </v-btn>

                  <v-btn
                    v-else
                    @click="finalizarQuiz"
                    :disabled="totalRespuestas === 0"
                    color="success"
                    variant="elevated"
                    size="large"
                  >
                    <v-icon start>mdi-check</v-icon>
                    Finalizar Quiz
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </v-main>

    <!-- Dialog de confirmación -->
    <v-dialog v-model="showConfirmDialog" max-width="500px">
      <v-card>
        <v-card-title class="text-h5 font-weight-bold">
          ¿Finalizar Quiz?
        </v-card-title>
        
        <v-card-text>
          <p class="mb-4">
            Estás a punto de finalizar el quiz. Has respondido 
            <strong>{{ totalRespuestas }}</strong> de <strong>{{ preguntas.length }}</strong> preguntas.
          </p>
          
          <v-alert
            v-if="totalRespuestas < preguntas.length"
            type="warning"
            variant="tonal"
            class="mb-4"
          >
            Aún tienes preguntas sin responder. ¿Estás seguro de que quieres continuar?
          </v-alert>
          
          <p class="text-body-2 text-grey">
            Una vez finalizado, no podrás modificar tus respuestas.
          </p>
        </v-card-text>
        
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="showConfirmDialog = false" variant="text">
            Cancelar
          </v-btn>
          <v-btn 
            @click="confirmarFinalizacion" 
            color="success" 
            variant="elevated"
            :loading="loading"
          >
            Sí, finalizar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<style scoped>
.RealizarQuizPage {
  background: linear-gradient(135deg, #fff5f0 0%, #ffffff 100%);
  min-height: 100vh;
}

.RealizarQuizPage__Progress {
  position: sticky;
  top: 70px;
  z-index: 10;
}

.RealizarQuizPage__Container {
  padding-top: 24px;
  max-width: 1200px;
}

.RealizarQuizPage__Sidebar {
  position: sticky;
  top: 120px;
}

.RealizarQuizPage__QuestionGrid {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.RealizarQuizPage__QuestionCard {
  border-radius: 16px;
  border: 1px solid rgba(255, 107, 53, 0.1);
}

.RealizarQuizPage__QuestionText {
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.4;
  color: #333;
}

.RealizarQuizPage__Answers :deep(.v-selection-control) {
  margin-bottom: 16px;
}

.RealizarQuizPage__Answer :deep(.v-selection-control__wrapper) {
  margin-right: 16px;
}

.RealizarQuizPage__AnswerText {
  font-size: 1.1rem;
  line-height: 1.4;
  padding: 12px 16px;
  border-radius: 8px;
  background: #f8f9fa;
  border: 2px solid transparent;
  transition: all 0.2s ease;
  width: 100%;
}

.RealizarQuizPage__Answer :deep(.v-selection-control--dirty) .RealizarQuizPage__AnswerText {
  background: rgba(255, 107, 53, 0.1);
  border-color: #FF6B35;
}

.RealizarQuizPage__QuestionNav {
  justify-content: center;
  overflow-x: auto;
  padding-bottom: 8px;
}

@media (max-width: 600px) {
  .RealizarQuizPage__Container {
    padding: 16px;
  }
  
  .RealizarQuizPage__QuestionText {
    font-size: 1.25rem;
  }
  
  .RealizarQuizPage__AnswerText {
    font-size: 1rem;
    padding: 10px 12px;
  }
}
</style>