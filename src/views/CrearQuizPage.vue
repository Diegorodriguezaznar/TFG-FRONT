<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuizStore } from '@/stores/Quiz';
import { usePreguntaStore } from '@/stores/Pregunta';
import { useRespuestaStore } from '@/stores/Respuesta';
import { useAsignaturaStore } from '@/stores/Asignaturas';
import { useUsuarioLogeadoStore } from '@/stores/UsuarioLogeado';
import type { PreguntaDTO } from '@/stores/dtos/PreguntaDTO';
import type { RespuestaDTO } from '@/stores/dtos/RespuestaDTO';

// Stores y router
const router = useRouter();
const quizStore = useQuizStore();
const preguntaStore = usePreguntaStore();
const respuestaStore = useRespuestaStore();
const asignaturaStore = useAsignaturaStore();
const usuarioStore = useUsuarioLogeadoStore();

// Variables reactivas
const loading = ref(false);
const currentStep = ref(0);
const showPreview = ref(false);

// Datos del quiz
const quizData = ref({
  nombre: '',
  descripcion: '',
  idAsignatura: null,
  idUsuario: null
});

// Interfaz para preguntas en creación
interface PreguntaCreacion {
  id: string;
  descripcion: string;
  respuestas: RespuestaCreacion[];
}

interface RespuestaCreacion {
  id: string;
  texto: string;
  esCorrecta: boolean;
}

const preguntas = ref<PreguntaCreacion[]>([]);

// Validaciones
const errores = ref({
  nombre: '',
  asignatura: '',
  preguntas: ''
});

// Computed
const usuarioActual = computed(() => usuarioStore.usuarioActual);

const puedeCrearQuiz = computed(() => {
  const rol = usuarioActual.value?.idRol;
  return rol === 2 || rol === 3; // Solo profesores y gestores
});

const asignaturas = computed(() => asignaturaStore.asignaturas);

const pasos = computed(() => [
  { titulo: 'Información', icono: 'mdi-information', completado: validarPaso1() },
  { titulo: 'Preguntas', icono: 'mdi-help-circle', completado: validarPaso2() },
  { titulo: 'Vista Previa', icono: 'mdi-eye', completado: false }
]);

const preguntasValidas = computed(() => {
  return preguntas.value.filter(p => 
    p.descripcion.trim() && 
    p.respuestas.length >= 2 && 
    p.respuestas.every(r => r.texto.trim()) &&
    p.respuestas.some(r => r.esCorrecta)
  );
});

const puedeGuardar = computed(() => {
  return validarPaso1() && preguntasValidas.value.length >= 1;
});

// Métodos de validación
function validarPaso1(): boolean {
  return !!(quizData.value.nombre.trim() && quizData.value.idAsignatura);
}

function validarPaso2(): boolean {
  return preguntasValidas.value.length >= 1;
}

function limpiarErrores() {
  errores.value = {
    nombre: '',
    asignatura: '',
    preguntas: ''
  };
}

// Métodos de navegación
function siguientePaso() {
  limpiarErrores();
  
  if (currentStep.value === 0) {
    if (!validarPaso1()) {
      if (!quizData.value.nombre.trim()) errores.value.nombre = 'El nombre es obligatorio';
      if (!quizData.value.idAsignatura) errores.value.asignatura = 'Selecciona una asignatura';
      return;
    }
  }
  
  if (currentStep.value === 1) {
    if (!validarPaso2()) {
      errores.value.preguntas = 'Debes crear al menos una pregunta válida';
      return;
    }
  }
  
  if (currentStep.value < pasos.value.length - 1) {
    currentStep.value++;
  }
}

function pasoAnterior() {
  if (currentStep.value > 0) {
    currentStep.value--;
  }
}

function irAlPaso(paso: number) {
  currentStep.value = paso;
}

// Métodos para manejo de preguntas
function agregarPregunta() {
  const nuevaPregunta: PreguntaCreacion = {
    id: `pregunta_${Date.now()}`, 
    descripcion: '',
    respuestas: [
      { id: `resp_${Date.now()}_1`, texto: '', esCorrecta: true },
      { id: `resp_${Date.now()}_2`, texto: '', esCorrecta: false }
    ]
  };
  preguntas.value.push(nuevaPregunta);
}

function eliminarPregunta(index: number) {
  preguntas.value.splice(index, 1);
}

function agregarRespuesta(preguntaIndex: number) {
  if (preguntas.value[preguntaIndex].respuestas.length < 4) {
    preguntas.value[preguntaIndex].respuestas.push({
      id: `resp_${Date.now()}`,
      texto: '',
      esCorrecta: false
    });
  }
}

function eliminarRespuesta(preguntaIndex: number, respuestaIndex: number) {
  if (preguntas.value[preguntaIndex].respuestas.length > 2) {
    preguntas.value[preguntaIndex].respuestas.splice(respuestaIndex, 1);
  }
}

function toggleRespuestaCorrecta(preguntaIndex: number, respuestaIndex: number) {
  // Primero marcar todas como incorrectas
  preguntas.value[preguntaIndex].respuestas.forEach(r => r.esCorrecta = false);
  // Luego marcar la seleccionada como correcta
  preguntas.value[preguntaIndex].respuestas[respuestaIndex].esCorrecta = true;
}

// Guardar quiz
// Quitar import de useToast y volver a usar alerts
// import { useToast } from '@/composables/useToast';

// Quitar esta línea:
// const { success, error } = useToast();

// Actualizar el método guardarQuiz para usar alerts normales
async function guardarQuiz() {
  if (!usuarioActual.value || !puedeGuardar.value) return;

  loading.value = true;
  try {
    // 1. Crear el quiz
    const nuevoQuiz = await quizStore.createQuiz({
      nombre: quizData.value.nombre,
      descripcion: quizData.value.descripcion,
      idAsignatura: quizData.value.idAsignatura!,
      idUsuario: usuarioActual.value.idUsuario
    });

    if (!nuevoQuiz) {
      throw new Error('Error al crear el quiz');
    }

    // 2. Crear las preguntas
    for (let i = 0; i < preguntasValidas.value.length; i++) {
      const pregunta = preguntasValidas.value[i];
      
      const nuevaPregunta = await preguntaStore.createPregunta({
        descripcion: pregunta.descripcion,
        orden: i + 1,
        idQuiz: nuevoQuiz.idQuiz
      });

      if (!nuevaPregunta) {
        throw new Error(`Error al crear la pregunta ${i + 1}`);
      }

      // 3. Crear las respuestas para cada pregunta
      for (let j = 0; j < pregunta.respuestas.length; j++) {
        const respuesta = pregunta.respuestas[j];
        
        await respuestaStore.createRespuesta({
          texto: respuesta.texto,
          esCorrecta: respuesta.esCorrecta,
          orden: j + 1,
          idPregunta: nuevaPregunta.idPregunta
        });
      }
    }

    // Éxito - mostrar alert y redirigir
    alert('¡Quiz creado exitosamente!');
    router.push('/quizz-time!');

  } catch (error) {
    console.error('Error al guardar quiz:', error);
    alert('Error al crear el quiz. Inténtalo de nuevo.');
  } finally {
    loading.value = false;
  }
}

// Cancelar creación
function cancelarCreacion() {
  if (confirm('¿Estás seguro de que quieres cancelar? Se perderán todos los cambios.')) {
    router.push('/quizz-time!');
  }
}

// Variables reactivas adicionales
const preguntaExpandida = ref<number[]>([0]);

// Método para validar pregunta individual
function validarPregunta(pregunta: PreguntaCreacion): boolean {
  return !!(
    pregunta.descripcion.trim() && 
    pregunta.respuestas.length >= 2 && 
    pregunta.respuestas.every(r => r.texto.trim()) &&
    pregunta.respuestas.some(r => r.esCorrecta)
  );
}

// Lifecycle
onMounted(async () => {
  // Verificar permisos
  if (!puedeCrearQuiz.value) {
    alert('No tienes permisos para crear quizzes');
    router.push('/quizz-time!');
    return;
  }

  // Cargar asignaturas
  await asignaturaStore.fetchAllAsignaturas();
  
  // Inicializar datos del usuario
  if (usuarioActual.value) {
    quizData.value.idUsuario = usuarioActual.value.idUsuario;
  }

  // Agregar primera pregunta por defecto
  agregarPregunta();
});
</script>

<template>
  <v-app>
    <!-- App Bar -->
    <v-app-bar app color="white" elevation="2" height="70">
      <v-btn icon @click="cancelarCreacion" color="orange">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      
      <v-app-bar-title class="text-h6 font-weight-bold">
        Crear Nuevo Quiz
      </v-app-bar-title>
      
      <v-spacer></v-spacer>
      
      <v-btn
        @click="guardarQuiz"
        :disabled="!puedeGuardar"
        :loading="loading"
        color="success"
        variant="elevated"
      >
        <v-icon start>mdi-content-save</v-icon>
        Guardar Quiz
      </v-btn>
    </v-app-bar>

    <!-- Contenido principal -->
    <v-main class="CrearQuizPage">
      <v-container class="CrearQuizPage__Container">
        <!-- Stepper de pasos -->
        <v-card class="CrearQuizPage__Stepper mb-6" elevation="3">
          <v-card-text class="pa-6">
            <div class="d-flex justify-space-between align-center">
              <div
                v-for="(paso, index) in pasos"
                :key="index"
                class="CrearQuizPage__Step"
                :class="{ 
                  'CrearQuizPage__Step--active': index === currentStep,
                  'CrearQuizPage__Step--completed': paso.completado
                }"
                @click="irAlPaso(index)"
              >
                <div class="CrearQuizPage__StepIcon">
                  <v-icon
                    :color="index === currentStep ? 'white' : paso.completado ? 'success' : 'grey'"
                    :icon="paso.completado ? 'mdi-check' : paso.icono"
                  ></v-icon>
                </div>
                <div class="CrearQuizPage__StepLabel">
                  {{ paso.titulo }}
                </div>
                
                <!-- Línea conectora -->
                <div 
                  v-if="index < pasos.length - 1"
                  class="CrearQuizPage__StepConnector"
                  :class="{ 'CrearQuizPage__StepConnector--active': paso.completado }"
                ></div>
              </div>
            </div>
          </v-card-text>
        </v-card>

        <!-- Contenido de los pasos -->
        <v-card class="CrearQuizPage__Content" elevation="3">
          <v-card-text class="pa-8">
            <!-- Paso 1: Información del Quiz -->
            <div v-if="currentStep === 0" class="CrearQuizPage__StepContent">
              <h2 class="text-h4 font-weight-bold mb-6 text-center">
                Información del Quiz
              </h2>
              
              <v-row>
                <v-col cols="12" md="8" offset-md="2">
                  <v-text-field
                    v-model="quizData.nombre"
                    label="Nombre del Quiz *"
                    variant="outlined"
                    size="large"
                    :error-messages="errores.nombre"
                    hint="Elige un nombre descriptivo y atractivo"
                    persistent-hint
                    class="mb-4"
                  ></v-text-field>
                  
                  <v-textarea
                    v-model="quizData.descripcion"
                    label="Descripción (opcional)"
                    variant="outlined"
                    rows="3"
                    hint="Describe de qué trata este quiz"
                    persistent-hint
                    class="mb-4"
                  ></v-textarea>
                  
                  <v-select
                    v-model="quizData.idAsignatura"
                    :items="asignaturas"
                    item-title="nombre"
                    item-value="idAsignatura"
                    label="Asignatura *"
                    variant="outlined"
                    :error-messages="errores.asignatura"
                    hint="Selecciona la materia correspondiente"
                    persistent-hint
                  ></v-select>
                </v-col>
              </v-row>
            </div>

            <!-- Paso 2: Crear Preguntas -->
            <div v-else-if="currentStep === 1" class="CrearQuizPage__StepContent">
              <div class="d-flex align-center justify-space-between mb-6">
                <h2 class="text-h4 font-weight-bold">
                  Preguntas del Quiz
                </h2>
                <v-btn
                  @click="agregarPregunta"
                  :disabled="preguntas.length >= 20"
                  color="orange"
                  variant="elevated"
                >
                  <v-icon start>mdi-plus</v-icon>
                  Agregar Pregunta
                </v-btn>
              </div>

              <v-alert
                v-if="errores.preguntas"
                type="error"
                variant="tonal"
                class="mb-4"
              >
                {{ errores.preguntas }}
              </v-alert>

              <!-- Lista de preguntas -->
              <div v-if="preguntas.length === 0" class="text-center py-12">
                <v-icon color="grey" size="64" class="mb-4">mdi-help-circle-outline</v-icon>
                <p class="text-h6 text-grey">No hay preguntas aún</p>
                <v-btn @click="agregarPregunta" color="orange" variant="elevated" class="mt-4">
                  <v-icon start>mdi-plus</v-icon>
                  Crear Primera Pregunta
                </v-btn>
              </div>

              <div v-else>
                <v-expansion-panels
                  v-model="preguntaExpandida"
                  multiple
                  class="CrearQuizPage__Questions"
                >
                  <v-expansion-panel
                    v-for="(pregunta, preguntaIndex) in preguntas"
                    :key="pregunta.id"
                    class="CrearQuizPage__Question mb-4"
                  >
                    <v-expansion-panel-title>
                      <div class="d-flex align-center">
                        <v-chip color="orange" size="small" class="mr-3">
                          {{ preguntaIndex + 1 }}
                        </v-chip>
                        <span class="font-weight-medium">
                          {{ pregunta.descripcion || `Pregunta ${preguntaIndex + 1}` }}
                        </span>
                        <v-spacer></v-spacer>
                        <v-chip
                          :color="validarPregunta(pregunta) ? 'success' : 'error'"
                          size="x-small"
                          class="mr-2"
                        >
                          {{ validarPregunta(pregunta) ? 'Válida' : 'Incompleta' }}
                        </v-chip>
                      </div>
                    </v-expansion-panel-title>

                    <v-expansion-panel-text>
                      <div class="pa-4">
                        <!-- Texto de la pregunta -->
                        <v-textarea
                          v-model="pregunta.descripcion"
                          label="Texto de la pregunta *"
                          variant="outlined"
                          rows="2"
                          class="mb-4"
                          hint="Escribe tu pregunta de forma clara y concisa"
                          persistent-hint
                        ></v-textarea>

                        <!-- Respuestas -->
                        <div class="mb-4">
                          <div class="d-flex align-center justify-space-between mb-3">
                            <h4 class="text-h6 font-weight-medium">Respuestas</h4>
                            <v-btn
                              @click="agregarRespuesta(preguntaIndex)"
                              :disabled="pregunta.respuestas.length >= 4"
                              color="info"
                              size="small"
                              variant="outlined"
                            >
                              <v-icon start size="small">mdi-plus</v-icon>
                              Agregar
                            </v-btn>
                          </div>

                          <v-row>
                            <v-col
                              v-for="(respuesta, respuestaIndex) in pregunta.respuestas"
                              :key="respuesta.id"
                              cols="12"
                              md="6"
                            >
                              <v-card
                                class="CrearQuizPage__Answer"
                                :class="{ 'CrearQuizPage__Answer--correct': respuesta.esCorrecta }"
                                variant="outlined"
                              >
                                <v-card-text class="pa-3">
                                  <div class="d-flex align-center mb-2">
                                    <v-radio-group
                                      :model-value="respuesta.esCorrecta ? respuestaIndex : null"
                                      @update:model-value="toggleRespuestaCorrecta(preguntaIndex, respuestaIndex)"
                                      hide-details
                                      class="ma-0 pa-0"
                                    >
                                      <v-radio
                                        :value="respuestaIndex"
                                        color="success"
                                        density="compact"
                                      >
                                        <template v-slot:label>
                                          <span class="text-caption">
                                            {{ respuesta.esCorrecta ? 'Correcta' : 'Incorrecta' }}
                                          </span>
                                        </template>
                                      </v-radio>
                                    </v-radio-group>
                                    
                                    <v-spacer></v-spacer>
                                    
                                    <v-btn
                                      v-if="pregunta.respuestas.length > 2"
                                      @click="eliminarRespuesta(preguntaIndex, respuestaIndex)"
                                      icon="mdi-delete"
                                      size="x-small"
                                      color="error"
                                      variant="text"
                                    ></v-btn>
                                  </div>
                                  
                                  <v-text-field
                                    v-model="respuesta.texto"
                                    :label="`Respuesta ${respuestaIndex + 1} *`"
                                    variant="outlined"
                                    density="compact"
                                    hide-details
                                  ></v-text-field>
                                </v-card-text>
                              </v-card>
                            </v-col>
                          </v-row>
                        </div>

                        <!-- Eliminar pregunta -->
                        <div class="text-center">
                          <v-btn
                            @click="eliminarPregunta(preguntaIndex)"
                            color="error"
                            variant="outlined"
                            size="small"
                          >
                            <v-icon start>mdi-delete</v-icon>
                            Eliminar Pregunta
                          </v-btn>
                        </div>
                      </div>
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>
              </div>
            </div>

            <!-- Paso 3: Vista Previa -->
            <div v-else-if="currentStep === 2" class="CrearQuizPage__StepContent">
              <h2 class="text-h4 font-weight-bold mb-6 text-center">
                Vista Previa del Quiz
              </h2>

              <!-- Información del quiz -->
              <v-card class="CrearQuizPage__Preview mb-6" elevation="2">
                <v-card-text class="pa-6">
                  <div class="text-center mb-4">
                    <h3 class="text-h5 font-weight-bold mb-2">
                      {{ quizData.nombre }}
                    </h3>
                    <p v-if="quizData.descripcion" class="text-body-1 mb-4">
                      {{ quizData.descripcion }}
                    </p>
                    <v-chip color="orange" size="large">
                      {{ preguntasValidas.length }} preguntas
                    </v-chip>
                  </div>
                </v-card-text>
              </v-card>

              <!-- Preview de preguntas -->
              <div v-for="(pregunta, index) in preguntasValidas" :key="pregunta.id" class="mb-4">
                <v-card class="CrearQuizPage__PreviewQuestion" elevation="1">
                  <v-card-text class="pa-6">
                    <div class="d-flex align-center mb-4">
                      <v-chip color="orange" size="small" class="mr-3">
                        {{ index + 1 }}
                      </v-chip>
                      <span class="text-h6 font-weight-medium">
                        {{ pregunta.descripcion }}
                      </span>
                    </div>

                    <v-radio-group disabled>
                      <v-radio
                        v-for="respuesta in pregunta.respuestas"
                        :key="respuesta.id"
                        :value="respuesta.id"
                        :color="respuesta.esCorrecta ? 'success' : 'default'"
                      >
                        <template v-slot:label>
                          <span :class="{ 'font-weight-bold success--text': respuesta.esCorrecta }">
                            {{ respuesta.texto }}
                            <v-icon v-if="respuesta.esCorrecta" color="success" size="small" class="ml-1">
                              mdi-check
                            </v-icon>
                          </span>
                        </template>
                      </v-radio>
                    </v-radio-group>
                  </v-card-text>
                </v-card>
              </div>
            </div>
          </v-card-text>

          <!-- Botones de navegación -->
          <v-card-actions class="px-8 pb-8">
            <v-btn
              v-if="currentStep > 0"
              @click="pasoAnterior"
              variant="outlined"
              color="grey"
            >
              <v-icon start>mdi-chevron-left</v-icon>
              Anterior
            </v-btn>

            <v-spacer></v-spacer>

            <v-btn
              v-if="currentStep < pasos.length - 1"
              @click="siguientePaso"
              color="orange"
              variant="elevated"
            >
              Siguiente
              <v-icon end>mdi-chevron-right</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.CrearQuizPage {
  background: linear-gradient(135deg, #fff5f0 0%, #ffffff 100%);
  min-height: 100vh;
}

.CrearQuizPage__Container {
  padding-top: 24px;
  max-width: 1200px;
}

.CrearQuizPage__Stepper {
  border-radius: 16px;
}

.CrearQuizPage__Step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
}

.CrearQuizPage__StepIcon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.CrearQuizPage__Step--active .CrearQuizPage__StepIcon {
  background: #FF6B35;
  color: white;
  transform: scale(1.1);
}

.CrearQuizPage__Step--completed .CrearQuizPage__StepIcon {
  background: #4CAF50;
  color: white;
}

.CrearQuizPage__StepLabel {
  font-weight: 500;
  font-size: 0.875rem;
  color: #666;
  transition: color 0.3s ease;
}

.CrearQuizPage__Step--active .CrearQuizPage__StepLabel {
  color: #FF6B35;
  font-weight: 600;
}

.CrearQuizPage__StepConnector {
  position: absolute;
  top: 24px;
  left: 60px;
  width: calc(100% - 48px);
  height: 2px;
  background: #e0e0e0;
  transition: background 0.3s ease;
}

.CrearQuizPage__StepConnector--active {
  background: #4CAF50;
}

.CrearQuizPage__Content {
  border-radius: 16px;
}

.CrearQuizPage__Questions {
  gap: 16px;
}

.CrearQuizPage__Question {
  border-radius: 12px;
  border: 1px solid rgba(255, 107, 53, 0.2);
}

.CrearQuizPage__Answer {
  transition: all 0.2s ease;
}

.CrearQuizPage__Answer--correct {
  border-color: #4CAF50 !important;
  background: rgba(76, 175, 80, 0.05);
}

.CrearQuizPage__Preview {
  border-radius: 16px;
}

.CrearQuizPage__PreviewQuestion {
  border-radius: 12px;
  border: 1px solid rgba(255, 107, 53, 0.1);
}

@media (max-width: 600px) {
  .CrearQuizPage__Container {
    padding: 16px;
  }
  
  .CrearQuizPage__Step {
    margin: 0 8px;
  }
  
  .CrearQuizPage__StepIcon {
    width: 40px;
    height: 40px;
  }
  
  .CrearQuizPage__StepLabel {
    font-size: 0.75rem;
  }
}
</style>