<!-- src/views/CrearQuizPage.vue - Refactorizado con componentes -->
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useQuizStore } from '@/stores/Quiz';
import { usePreguntaStore } from '@/stores/Pregunta';
import { useRespuestaStore } from '@/stores/Respuesta';
import { useAsignaturaStore } from '@/stores/Asignaturas';
import { useUsuarioLogeadoStore } from '@/stores/UsuarioLogeado';

// Componentes
import QuizStepper from '@/components/Quizz/CrearQuiz/QuizStepper.vue';
import QuizInfo from '@/components/Quizz/CrearQuiz/QuizInfo.vue';
import PreguntasQuiz from '@/components/Quizz/CrearQuiz/PreguntasQuiz.vue';
import VistaPrevia from '@/components/Quizz/CrearQuiz/VistaPrevia.vue';

// Stores y router
const router = useRouter();
const route = useRoute();
const quizStore = useQuizStore();
const preguntaStore = usePreguntaStore();
const respuestaStore = useRespuestaStore();
const asignaturaStore = useAsignaturaStore();
const usuarioStore = useUsuarioLogeadoStore();

// Variables reactivas
const loading = ref(false);
const currentStep = ref(0);

// Detectar curso actual
const cursoActual = computed(() => {
  if (route.query.curso) {
    return Number(route.query.curso);
  }
  return null;
});

// Datos del quiz
const quizData = ref({
  nombre: '',
  descripcion: '',
  idAsignatura: null,
  idCurso: cursoActual.value,
  idUsuario: null
});

// Interfaces
interface RespuestaCreacion {
  id: string;
  texto: string;
  esCorrecta: boolean;
}

interface PreguntaCreacion {
  id: string;
  descripcion: string;
  respuestas: RespuestaCreacion[];
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
  return rol === 2 || rol === 3;
});

const asignaturas = computed(() => {
  if (cursoActual.value) {
    return asignaturaStore.asignaturas.filter(asignatura => 
      asignatura.idCurso === cursoActual.value
    );
  }
  return asignaturaStore.asignaturas;
});

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

// Navegación entre pasos
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

// Manejo de preguntas
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

// Guardar quiz
async function guardarQuiz() {
  if (!usuarioActual.value || !puedeGuardar.value) {
    alert('No se puede guardar el quiz. Verifica que hayas completado todos los campos.');
    return;
  }

  loading.value = true;
  let quizCreado = null;
  
  try {
    console.log('=== INICIANDO CREACIÓN DE QUIZ ===');
    
    // 1. Crear el quiz
    const datosNuevoQuiz = {
      nombre: quizData.value.nombre,
      descripcion: quizData.value.descripcion || '',
      idAsignatura: quizData.value.idAsignatura!,
      idCurso: quizData.value.idCurso,
      idUsuario: usuarioActual.value.idUsuario
    };
    
    quizCreado = await quizStore.createQuiz(datosNuevoQuiz);

    if (!quizCreado) {
      throw new Error('No se pudo crear el quiz.');
    }

    const quiz = quizCreado.quiz || quizCreado;
    
    if (!quiz || !quiz.idQuiz) {
      throw new Error('El quiz se creó pero no se recibió un ID válido.');
    }

    // 2. Crear preguntas y respuestas
    const preguntasCreadas = [];
    
    for (let i = 0; i < preguntasValidas.value.length; i++) {
      const pregunta = preguntasValidas.value[i];
      
      const datosNuevaPregunta = {
        descripcion: pregunta.descripcion,
        orden: i + 1,
        idQuiz: quiz.idQuiz
      };
      
      const nuevaPregunta = await preguntaStore.createPregunta(datosNuevaPregunta);

      if (!nuevaPregunta || !nuevaPregunta.idPregunta) {
        throw new Error(`No se pudo crear la pregunta "${pregunta.descripcion}".`);
      }

      preguntasCreadas.push(nuevaPregunta);

      // Crear respuestas
      for (let j = 0; j < pregunta.respuestas.length; j++) {
        const respuesta = pregunta.respuestas[j];
        
        const datosNuevaRespuesta = {
          texto: respuesta.texto,
          esCorrecta: respuesta.esCorrecta,
          orden: j + 1,
          idPregunta: nuevaPregunta.idPregunta
        };
        
        const nuevaRespuesta = await respuestaStore.createRespuesta(datosNuevaRespuesta);

        if (!nuevaRespuesta) {
          throw new Error(`No se pudo crear la respuesta "${respuesta.texto}".`);
        }
      }
    }

    console.log(' === QUIZ CREADO EXITOSAMENTE ===');
    
    const mensaje = cursoActual.value 
      ? `¡Quiz "${quizData.value.nombre}" creado exitosamente para el curso ${cursoActual.value}!`
      : `¡Quiz "${quizData.value.nombre}" creado exitosamente!`;
    
    alert(` ${mensaje}\n\n Resumen:\n• ${preguntasCreadas.length} preguntas creadas\n• ${preguntasValidas.value.reduce((total, p) => total + p.respuestas.length, 0)} respuestas añadidas`);
    
    // Limpiar y redirigir
    resetForm();
    
    if (cursoActual.value) {
      router.push(`/quizz-time!?curso=${cursoActual.value}`);
    } else {
      router.push('/quizz-time!');
    }

  } catch (error: any) {
    console.error(' === ERROR AL CREAR QUIZ ===', error);
    alert(` Error al crear el quiz: ${error.message}`);
  } finally {
    loading.value = false;
  }
}

// Resetear formulario
function resetForm() {
  quizData.value = {
    nombre: '',
    descripcion: '',
    idAsignatura: null,
    idCurso: cursoActual.value,
    idUsuario: usuarioActual.value?.idUsuario || null
  };
  preguntas.value = [];
  currentStep.value = 0;
  limpiarErrores();
}

// Cancelar creación
function cancelarCreacion() {
  if (confirm('¿Estás seguro de que quieres cancelar? Se perderán todos los cambios.')) {
    if (cursoActual.value) {
      router.push(`/quizz-time!?curso=${cursoActual.value}`);
    } else {
      router.push('/quizz-time!');
    }
  }
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

  // Verificar si hay asignaturas para el curso
  if (cursoActual.value && asignaturas.value.length === 0) {
    alert(`No hay asignaturas disponibles para este curso (${cursoActual.value}). Contacta al administrador.`);
    router.push(`/curso/${cursoActual.value}`);
    return;
  }

  // Agregar primera pregunta
  agregarPregunta();
});
</script>

<template>
  <v-app>
    <!-- App Bar -->
    <v-app-bar app color="white" elevation="2" height="70">
      <v-btn icon @click="cancelarCreacion" color="purple">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      
      <v-app-bar-title class="text-h6 font-weight-bold">
        {{ cursoActual ? `Crear Quiz - Curso ${cursoActual}` : 'Crear Nuevo Quiz' }}
      </v-app-bar-title>
      
      <v-spacer></v-spacer>
      
      <v-btn
        @click="guardarQuiz"
        :disabled="!puedeGuardar"
        :loading="loading"
        color="purple"
        variant="elevated"
      >
        <v-icon start>mdi-content-save</v-icon>
        Guardar Quiz
      </v-btn>
    </v-app-bar>

    <!-- Contenido principal -->
    <v-main class="CrearQuizPage">
      <v-container class="CrearQuizPage__Container">
        <!-- Indicador de curso -->
        <v-alert
          v-if="cursoActual"
          type="info"
          variant="tonal"
          class="mb-6"
        >
          <v-icon start>mdi-book-open</v-icon>
          <strong>Creando quiz para el Curso {{ cursoActual }}</strong>
          <br>
          <small>Solo se mostrarán las asignaturas de este curso</small>
        </v-alert>

        <!-- Stepper -->
        <QuizStepper
          :pasos="pasos"
          :paso-actual="currentStep"
          @ir-al-paso="irAlPaso"
        />

        <!-- Contenido de los pasos -->
        <v-card class="CrearQuizPage__Content" elevation="3">
          <v-card-text class="pa-8">
            <!-- Paso 1: Información -->
            <QuizInfo
              v-if="currentStep === 0"
              v-model:quiz-data="quizData"
              :asignaturas="asignaturas"
              :errores="errores"
              :curso-actual="cursoActual"
            />

            <!-- Paso 2: Preguntas -->
            <PreguntasQuiz
              v-else-if="currentStep === 1"
              v-model:preguntas="preguntas"
              :error-preguntas="errores.preguntas"
              @agregar-pregunta="agregarPregunta"
            />

            <!-- Paso 3: Vista Previa -->
            <VistaPrevia
              v-else-if="currentStep === 2"
              :quiz-data="quizData"
              :preguntas-validas="preguntasValidas"
              :curso-actual="cursoActual"
            />
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
              color="purple"
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

.CrearQuizPage__Content {
  border-radius: 16px;
}
</style>