<!-- src/components/Quizz/QuizInfoModal.vue - Modal de información del quiz -->
<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuizStore } from '@/stores/Quiz';
import { usePreguntaStore } from '@/stores/Pregunta';
import { useRespuestaStore } from '@/stores/Respuesta';
import { useAsignaturaStore } from '@/stores/Asignaturas';
import { useUsuarioLogeadoStore } from '@/stores/UsuarioLogeado';
import type { QuizCompletaDTO } from '@/stores/dtos/QuizCompletaDTO';

// Props y emits
const props = defineProps<{
  modelValue: boolean;
  quizId: number | null;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'quiz-deleted': [quizId: number];
  'quiz-updated': [];
}>();

// Stores y router
const router = useRouter();
const quizStore = useQuizStore();
const preguntaStore = usePreguntaStore();
const respuestaStore = useRespuestaStore();
const asignaturaStore = useAsignaturaStore();
const usuarioStore = useUsuarioLogeadoStore();

// Variables reactivas
const loading = ref(false);
const quiz = ref<QuizCompletaDTO | null>(null);
const totalPreguntas = ref(0);
const asignatura = ref(null);
const showDeleteConfirm = ref(false);
const deleting = ref(false);

// Computed
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const usuarioActual = computed(() => usuarioStore.usuarioActual);

const esCreadorDelQuiz = computed(() => {
  return quiz.value && usuarioActual.value && 
         quiz.value.idUsuario === usuarioActual.value.idUsuario;
});

const puedeAdministrar = computed(() => {
  // Es creador O es admin (rol 1)
  return esCreadorDelQuiz.value || 
         (usuarioActual.value?.idRol === 1);
});

// Métodos
const cargarDatosQuiz = async () => {
  if (!props.quizId) return;
  
  loading.value = true;
  try {
    console.log('📊 Cargando información del quiz ID:', props.quizId);
    
    // Cargar datos del quiz
    const quizData = await quizStore.fetchQuizCompletoById(props.quizId);
    if (!quizData) {
      throw new Error('Quiz no encontrado');
    }
    quiz.value = quizData;
    console.log('✅ Quiz cargado:', quizData);

    // Cargar número de preguntas
    const preguntas = await preguntaStore.fetchPreguntasByQuizId(props.quizId);
    totalPreguntas.value = preguntas.length;
    quiz.value.totalPreguntas = preguntas.length;
    console.log('✅ Total de preguntas:', preguntas.length);

    // Cargar información de la asignatura
    if (quiz.value.idAsignatura) {
      asignatura.value = await asignaturaStore.fetchAsignaturaById(quiz.value.idAsignatura);
      console.log('✅ Asignatura cargada:', asignatura.value?.nombre);
    }

  } catch (error) {
    console.error('❌ Error al cargar quiz:', error);
    alert('Error al cargar la información del quiz');
    cerrarModal();
  } finally {
    loading.value = false;
  }
};

const iniciarQuiz = () => {
  if (!usuarioActual.value) {
    alert('Debes iniciar sesión para realizar el quiz');
    return;
  }
  
  if (totalPreguntas.value === 0) {
    alert('Este quiz no tiene preguntas disponibles');
    return;
  }
  
  cerrarModal();
  router.push(`/quiz/${props.quizId}`);
};

const cerrarModal = () => {
  isOpen.value = false;
};

const compartirQuiz = () => {
  const mensaje = `🎯 ¡Mira este quiz!\n\n📚 "${quiz.value?.nombre}"\n👨‍🏫 Por: ${quiz.value?.nombreUsuario}\n❓ ${totalPreguntas.value} preguntas\n🎓 ${asignatura.value?.nombre || 'Educación'}\n\n¡Ponlo a prueba! 🚀`;
  
  if (navigator.share) {
    navigator.share({
      title: `Quiz: ${quiz.value?.nombre}`,
      text: mensaje,
      url: window.location.origin + `/quiz-info/${props.quizId}`
    });
  } else {
    navigator.clipboard.writeText(mensaje).then(() => {
      alert('📋 Información del quiz copiada al portapapeles!');
    });
  }
};

// MÉTODO PARA ELIMINAR QUIZ COMPLETO
const eliminarQuizCompleto = async () => {
  if (!quiz.value || !props.quizId) return;
  
  deleting.value = true;
  try {
    console.log('🗑️ === ELIMINANDO QUIZ COMPLETO ===');
    console.log('Quiz a eliminar:', quiz.value.nombre, 'ID:', props.quizId);
    
    // 1. Cargar todas las preguntas del quiz
    console.log('📝 Cargando preguntas del quiz...');
    const preguntas = await preguntaStore.fetchPreguntasByQuizId(props.quizId);
    console.log(`✅ Encontradas ${preguntas.length} preguntas`);
    
    // 2. Para cada pregunta, eliminar sus respuestas
    console.log('📋 Eliminando respuestas...');
    for (const pregunta of preguntas) {
      console.log(`  - Eliminando respuestas de pregunta ${pregunta.idPregunta}...`);
      
      // Cargar respuestas de esta pregunta
      const respuestas = await respuestaStore.fetchRespuestasByPreguntaId(pregunta.idPregunta);
      console.log(`    📋 Encontradas ${respuestas.length} respuestas`);
      
      // Eliminar cada respuesta
      for (const respuesta of respuestas) {
        const eliminada = await respuestaStore.deleteRespuesta(respuesta.idRespuesta);
        if (eliminada) {
          console.log(`    ✅ Respuesta ${respuesta.idRespuesta} eliminada`);
        } else {
          console.warn(`    ⚠️ No se pudo eliminar respuesta ${respuesta.idRespuesta}`);
        }
      }
    }
    
    // 3. Eliminar todas las preguntas
    console.log('📝 Eliminando preguntas...');
    for (const pregunta of preguntas) {
      const eliminada = await preguntaStore.deletePregunta(pregunta.idPregunta);
      if (eliminada) {
        console.log(`  ✅ Pregunta ${pregunta.idPregunta} eliminada`);
      } else {
        console.warn(`  ⚠️ No se pudo eliminar pregunta ${pregunta.idPregunta}`);
      }
    }
    
    // 4. Finalmente, eliminar el quiz (CON ID DE USUARIO)
    console.log('🎯 Eliminando quiz...');
    const quizEliminado = await quizStore.deleteQuiz(props.quizId, quiz.value.idUsuario);
    
    if (quizEliminado) {
      console.log('🎉 === QUIZ ELIMINADO COMPLETAMENTE ===');
      console.log(`✅ Quiz "${quiz.value.nombre}" y todos sus datos eliminados exitosamente`);
      
      // Mostrar mensaje de éxito
      alert(`✅ Quiz "${quiz.value.nombre}" eliminado completamente.\n\n📊 Resumen:\n• Quiz eliminado\n• ${preguntas.length} preguntas eliminadas\n• Todas las respuestas eliminadas`);
      
      // Emitir evento para que el componente padre actualice la lista
      emit('quiz-deleted', props.quizId);
      
      // Cerrar modal
      cerrarModal();
    } else {
      throw new Error('No se pudo eliminar el quiz principal');
    }
    
  } catch (error: any) {
    console.error('💥 Error al eliminar quiz completo:', error);
    
    let mensaje = 'Error al eliminar el quiz';
    if (error.message.includes('Failed to fetch')) {
      mensaje = 'Error de conexión. Verifica que el servidor esté funcionando.';
    } else if (error.message.includes('quiz principal')) {
      mensaje = 'Se eliminaron las preguntas y respuestas, pero no se pudo eliminar el quiz principal.';
    } else {
      mensaje = error.message || mensaje;
    }
    
    alert(`❌ ${mensaje}\n\n🔍 Revisa la consola para más detalles.`);
    
  } finally {
    deleting.value = false;
    showDeleteConfirm.value = false;
  }
};

const confirmarEliminacion = () => {
  showDeleteConfirm.value = true;
};

// Watchers
watch(() => props.quizId, (newId) => {
  if (newId && props.modelValue) {
    cargarDatosQuiz();
  }
});

watch(() => props.modelValue, (isOpen) => {
  if (isOpen && props.quizId) {
    cargarDatosQuiz();
  }
});
</script>

<template>
  <v-dialog
    v-model="isOpen"
    max-width="800"
    persistent
    scrollable
  >
    <v-card v-if="!loading && quiz" class="QuizInfoModal">
      <!-- Header con gradiente -->
      <div class="QuizInfoModal__Header">
        <div class="QuizInfoModal__HeaderGradient">
          <div class="QuizInfoModal__HeaderContent">
            <!-- Botón cerrar -->
            <v-btn
              @click="cerrarModal"
              icon
              variant="text"
              color="white"
              class="QuizInfoModal__CloseBtn"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
            
            <!-- Badge de asignatura (solo si existe) -->
            <div class="QuizInfoModal__Badges" v-if="asignatura">
              <v-chip
                color="white"
                variant="elevated"
                size="small"
                class="mb-2"
              >
                <v-icon start size="small">mdi-book-open-variant</v-icon>
                {{ asignatura.nombre }}
              </v-chip>
            </div>

            <!-- Título -->
            <h2 class="QuizInfoModal__Title text-white mb-2">
              {{ quiz.nombre }}
            </h2>

            <!-- Autor -->
            <div class="QuizInfoModal__Author">
              <v-avatar size="32" class="mr-2">
                <v-img :src="`https://picsum.photos/seed/user${quiz.idUsuario}/32/32`"></v-img>
              </v-avatar>
              <div>
                <div class="text-white font-weight-medium text-body-2">
                  {{ quiz.nombreUsuario }}
                </div>
                <div class="text-white opacity-80 text-caption">
                  {{ quiz.fechaCreacion }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Contenido principal -->
      <v-card-text class="QuizInfoModal__Content pa-6">
        <!-- Descripción -->
        <div class="mb-4" v-if="quiz.descripcion">
          <h3 class="text-h6 font-weight-bold mb-3">
            <v-icon class="mr-2" color="orange">mdi-information</v-icon>
            Descripción
          </h3>
          <p class="text-body-1">
            {{ quiz.descripcion }}
          </p>
        </div>

        <!-- Solo mostrar estadísticas si tenemos datos reales -->
        <div class="mb-4" v-if="totalPreguntas > 0">
          <v-divider class="my-4" v-if="quiz.descripcion"></v-divider>
          
          <h3 class="text-h6 font-weight-bold mb-3">
            <v-icon class="mr-2" color="blue">mdi-chart-box</v-icon>
            Información
          </h3>
          
          <div class="text-center">
            <v-icon color="orange" size="48">mdi-help-circle</v-icon>
            <div class="text-h4 font-weight-bold mt-2">{{ totalPreguntas }}</div>
            <div class="text-body-1 text-grey">{{ totalPreguntas === 1 ? 'Pregunta' : 'Preguntas' }}</div>
          </div>
        </div>

        <!-- Instrucciones básicas -->
        <div>
          <v-divider class="my-4"></v-divider>
          
          <h3 class="text-h6 font-weight-bold mb-3">
            <v-icon class="mr-2" color="success">mdi-format-list-checks</v-icon>
            ¿Cómo funciona?
          </h3>
          
          <v-list density="compact" class="QuizInfoModal__Instructions">
            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="success" size="small">mdi-numeric-1-circle</v-icon>
              </template>
              <v-list-item-title class="text-body-2">Responde cada pregunta seleccionando una opción</v-list-item-title>
            </v-list-item>
            
            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="info" size="small">mdi-numeric-2-circle</v-icon>
              </template>
              <v-list-item-title class="text-body-2">Puedes navegar entre preguntas libremente</v-list-item-title>
            </v-list-item>
            
            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="warning" size="small">mdi-numeric-3-circle</v-icon>
              </template>
              <v-list-item-title class="text-body-2">Al finalizar verás tu puntuación y respuestas correctas</v-list-item-title>
            </v-list-item>
          </v-list>
        </div>
      </v-card-text>

      <!-- Acciones -->
      <v-card-actions class="QuizInfoModal__Actions pa-6 pt-0">
        <v-row>
          <!-- Botón principal -->
          <v-col cols="12" class="pb-2">
            <v-btn
              @click="iniciarQuiz"
              :disabled="totalPreguntas === 0"
              color="orange"
              size="large"
              block
              variant="elevated"
            >
              <v-icon start>mdi-play</v-icon>
              Comenzar Quiz
            </v-btn>
          </v-col>
          
          <!-- Botones secundarios -->
          <v-col cols="6" sm="4">
            <v-btn
              @click="compartirQuiz"
              color="blue"
              variant="outlined"
              size="small"
              block
            >
              <v-icon start size="small">mdi-share-variant</v-icon>
              Compartir
            </v-btn>
          </v-col>
          
          <v-col cols="6" sm="4">
            <v-btn
              @click="cerrarModal"
              color="grey"
              variant="outlined"
              size="small"
              block
            >
              <v-icon start size="small">mdi-close</v-icon>
              Cerrar
            </v-btn>
          </v-col>
          
          <!-- Botón de administración (solo para creador/admin) -->
          <v-col v-if="puedeAdministrar" cols="12" sm="4">
            <v-btn
              @click="confirmarEliminacion"
              color="error"
              variant="outlined"
              size="small"
              block
            >
              <v-icon start size="small">mdi-delete</v-icon>
              {{ esCreadorDelQuiz ? 'Eliminar Quiz' : 'Eliminar (Admin)' }}
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>

    <!-- Estado de carga -->
    <v-card v-else-if="loading" class="QuizInfoModal">
      <v-card-text class="text-center py-12">
        <v-progress-circular
          indeterminate
          color="orange"
          size="64"
          width="6"
          class="mb-4"
        ></v-progress-circular>
        <p class="text-h6">Cargando información...</p>
      </v-card-text>
    </v-card>

    <!-- Estado de error -->
    <v-card v-else class="QuizInfoModal">
      <v-card-text class="text-center py-12">
        <v-icon color="error" size="64" class="mb-4">mdi-alert-circle</v-icon>
        <h3 class="text-h6 mb-4">Error al cargar</h3>
        <v-btn @click="cerrarModal" color="grey">Cerrar</v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>

  <!-- Dialog de confirmación de eliminación -->
  <v-dialog v-model="showDeleteConfirm" max-width="500">
    <v-card>
      <v-card-title class="text-h5 font-weight-bold d-flex align-center">
        <v-icon color="error" class="mr-2">mdi-alert-circle</v-icon>
        Confirmar Eliminación
      </v-card-title>
      
      <v-card-text>
        <v-alert type="error" variant="tonal" class="mb-4">
          <div class="font-weight-bold">⚠️ Esta acción es irreversible</div>
        </v-alert>
        
        <p class="mb-4">
          Estás a punto de eliminar <strong>"{{ quiz?.nombre }}"</strong> y 
          <strong>todos sus datos relacionados</strong>:
        </p>
        
        <v-list density="compact">
          <v-list-item>
            <template v-slot:prepend>
              <v-icon color="error" size="small">mdi-quiz</v-icon>
            </template>
            <v-list-item-title>El quiz principal</v-list-item-title>
          </v-list-item>
          
          <v-list-item>
            <template v-slot:prepend>
              <v-icon color="error" size="small">mdi-help-circle</v-icon>
            </template>
            <v-list-item-title>{{ totalPreguntas }} preguntas</v-list-item-title>
          </v-list-item>
          
          <v-list-item>
            <template v-slot:prepend>
              <v-icon color="error" size="small">mdi-format-list-bulleted</v-icon>
            </template>
            <v-list-item-title>Todas las respuestas asociadas</v-list-item-title>
          </v-list-item>
          
          <v-list-item>
            <template v-slot:prepend>
              <v-icon color="error" size="small">mdi-chart-line</v-icon>
            </template>
            <v-list-item-title>Resultados de usuarios (si los hay)</v-list-item-title>
          </v-list-item>
        </v-list>
        
        <p class="mt-4 text-body-2 text-grey-darken-1">
          Esta acción no se puede deshacer. ¿Estás completamente seguro?
        </p>
      </v-card-text>
      
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn 
          @click="showDeleteConfirm = false" 
          :disabled="deleting"
          variant="text"
        >
          Cancelar
        </v-btn>
        <v-btn 
          @click="eliminarQuizCompleto" 
          :loading="deleting"
          color="error" 
          variant="elevated"
        >
          <v-icon start>mdi-delete</v-icon>
          Sí, eliminar todo
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.QuizInfoModal {
  border-radius: 16px;
  overflow: hidden;
}

.QuizInfoModal__Header {
  position: relative;
}

.QuizInfoModal__HeaderGradient {
  background: linear-gradient(135deg, #FF6B35 0%, #FF8C42 50%, #FFB366 100%);
  height: 180px;
  position: relative;
}

.QuizInfoModal__HeaderContent {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.3));
}

.QuizInfoModal__CloseBtn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(8px);
}

.QuizInfoModal__Badges {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.QuizInfoModal__Title {
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 1.2;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.QuizInfoModal__Author {
  display: flex;
  align-items: center;
}

.QuizInfoModal__Content {
  max-height: 400px;
  overflow-y: auto;
}

.QuizInfoModal__Instructions .v-list-item {
  min-height: 32px;
}

.QuizInfoModal__Actions {
  background: #f8f9fa;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

/* Responsive */
@media (max-width: 600px) {
  .QuizInfoModal__Title {
    font-size: 1.5rem;
  }
  
  .QuizInfoModal__HeaderContent {
    padding: 16px;
  }
  
  .QuizInfoModal__Content {
    max-height: 350px;
  }
  
  .QuizInfoModal__HeaderGradient {
    height: 150px;
  }
}
</style>