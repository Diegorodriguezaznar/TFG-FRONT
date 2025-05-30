<script setup lang="ts">
import { ref } from 'vue';
import CardPregunta from './CardPregunta.vue';

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

interface Props {
  preguntas: PreguntaCreacion[];
  errorPreguntas: string;
}

interface Emits {
  (e: 'update:preguntas', preguntas: PreguntaCreacion[]): void;
  (e: 'agregar-pregunta'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const preguntaExpandida = ref<number[]>([0]);

const validarPregunta = (pregunta: PreguntaCreacion): boolean => {
  return !!(
    pregunta.descripcion.trim() && 
    pregunta.respuestas.length >= 2 && 
    pregunta.respuestas.every(r => r.texto.trim()) &&
    pregunta.respuestas.some(r => r.esCorrecta)
  );
};

const actualizarPregunta = (index: number, pregunta: PreguntaCreacion) => {
  const nuevasPreguntas = [...props.preguntas];
  nuevasPreguntas[index] = pregunta;
  emit('update:preguntas', nuevasPreguntas);
};

const eliminarPregunta = (index: number) => {
  const nuevasPreguntas = props.preguntas.filter((_, i) => i !== index);
  emit('update:preguntas', nuevasPreguntas);
};

const agregarRespuesta = (preguntaIndex: number) => {
  if (props.preguntas[preguntaIndex].respuestas.length < 4) {
    const nuevasPreguntas = [...props.preguntas];
    nuevasPreguntas[preguntaIndex].respuestas.push({
      id: `resp_${Date.now()}`,
      texto: '',
      esCorrecta: false
    });
    emit('update:preguntas', nuevasPreguntas);
  }
};

const eliminarRespuesta = (preguntaIndex: number, respuestaIndex: number) => {
  if (props.preguntas[preguntaIndex].respuestas.length > 2) {
    const nuevasPreguntas = [...props.preguntas];
    nuevasPreguntas[preguntaIndex].respuestas.splice(respuestaIndex, 1);
    emit('update:preguntas', nuevasPreguntas);
  }
};

const toggleRespuestaCorrecta = (preguntaIndex: number, respuestaIndex: number) => {
  const nuevasPreguntas = [...props.preguntas];
  nuevasPreguntas[preguntaIndex].respuestas.forEach(r => r.esCorrecta = false);
  nuevasPreguntas[preguntaIndex].respuestas[respuestaIndex].esCorrecta = true;
  emit('update:preguntas', nuevasPreguntas);
};
</script>

<template>
  <div class="PreguntasQuiz">
    <div class="PreguntasQuiz__header">
      <h2 class="PreguntasQuiz__titulo">Preguntas del Quiz</h2>
      <v-btn
        @click="$emit('agregar-pregunta')"
        :disabled="preguntas.length >= 20"
        color="purple"
        variant="elevated"
      >
        <v-icon start>mdi-plus</v-icon>
        Agregar Pregunta
      </v-btn>
    </div>

    <v-alert
      v-if="errorPreguntas"
      type="error"
      variant="tonal"
      class="PreguntasQuiz__alerta"
    >
      {{ errorPreguntas }}
    </v-alert>

    <div v-if="preguntas.length === 0" class="PreguntasQuiz__vacio">
      <v-icon color="grey" size="64" class="PreguntasQuiz__icono-vacio">mdi-help-circle-outline</v-icon>
      <p class="PreguntasQuiz__texto-vacio">No hay preguntas aún</p>
      <v-btn @click="$emit('agregar-pregunta')" color="purple" variant="elevated" class="PreguntasQuiz__boton-vacio">
        <v-icon start>mdi-plus</v-icon>
        Crear Primera Pregunta
      </v-btn>
    </div>

    <div v-else>
      <v-expansion-panels
        v-model="preguntaExpandida"
        multiple
        class="PreguntasQuiz__lista"
      >
        <CardPregunta
          v-for="(pregunta, index) in preguntas"
          :key="pregunta.id"
          :pregunta="pregunta"
          :index="index"
          :es-valida="validarPregunta(pregunta)"
          @update:pregunta="(p) => actualizarPregunta(index, p)"
          @eliminar-pregunta="eliminarPregunta(index)"
          @agregar-respuesta="agregarRespuesta(index)"
          @eliminar-respuesta="(respIndex) => eliminarRespuesta(index, respIndex)"
          @toggle-correcta="(respIndex) => toggleRespuestaCorrecta(index, respIndex)"
        />
      </v-expansion-panels>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/sass/components/CrearQuiz/PreguntasQuiz";
</style>