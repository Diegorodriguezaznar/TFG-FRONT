<script setup lang="ts">
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

interface QuizData {
  nombre: string;
  descripcion: string;
  idAsignatura: number | null;
  idCurso: number | null;
  idUsuario: number | null;
}

interface Props {
  quizData: QuizData;
  preguntasValidas: PreguntaCreacion[];
  cursoActual: number | null;
}

defineProps<Props>();
</script>

<template>
  <div class="VistaPrevia">
    <h2 class="VistaPrevia__titulo">Vista Previa del Quiz</h2>

    <v-card class="VistaPrevia__info" elevation="2">
      <v-card-text class="VistaPrevia__info-contenido">
        <div class="VistaPrevia__encabezado">
          <h3 class="VistaPrevia__nombre">{{ quizData.nombre }}</h3>
          <p v-if="quizData.descripcion" class="VistaPrevia__descripcion">
            {{ quizData.descripcion }}
          </p>
          <div class="VistaPrevia__chips">
            <v-chip color="purple" size="large">
              {{ preguntasValidas.length }} preguntas
            </v-chip>
            <v-chip v-if="cursoActual" color="blue" size="large">
              <v-icon start size="small">mdi-book-open</v-icon>
              Curso {{ cursoActual }}
            </v-chip>
          </div>
        </div>
      </v-card-text>
    </v-card>

    <div v-for="(pregunta, index) in preguntasValidas" :key="pregunta.id" class="VistaPrevia__pregunta-item">
      <v-card class="VistaPrevia__pregunta" elevation="1">
        <v-card-text class="VistaPrevia__pregunta-contenido">
          <div class="VistaPrevia__pregunta-header">
            <v-chip color="purple" size="small" class="VistaPrevia__numero">
              {{ index + 1 }}
            </v-chip>
            <span class="VistaPrevia__pregunta-texto">{{ pregunta.descripcion }}</span>
          </div>

          <v-radio-group disabled>
            <v-radio
              v-for="respuesta in pregunta.respuestas"
              :key="respuesta.id"
              :value="respuesta.id"
              :color="respuesta.esCorrecta ? 'success' : 'default'"
            >
              <template v-slot:label>
                <span class="VistaPrevia__respuesta" :class="{ 'VistaPrevia__respuesta--correcta': respuesta.esCorrecta }">
                  {{ respuesta.texto }}
                  <v-icon v-if="respuesta.esCorrecta" color="success" size="small" class="VistaPrevia__check">
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
</template>

<style scoped lang="scss">
@import "@/assets/sass/components/CrearQuiz/VistaPrevia";
</style>