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

interface Props {
  pregunta: PreguntaCreacion;
  index: number;
  esValida: boolean;
}

interface Emits {
  (e: 'update:pregunta', pregunta: PreguntaCreacion): void;
  (e: 'eliminar-pregunta'): void;
  (e: 'agregar-respuesta'): void;
  (e: 'eliminar-respuesta', respuestaIndex: number): void;
  (e: 'toggle-correcta', respuestaIndex: number): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const updatePregunta = (field: keyof PreguntaCreacion, value: any) => {
  emit('update:pregunta', {
    ...props.pregunta,
    [field]: value
  });
};

const updateRespuesta = (respuestaIndex: number, field: keyof RespuestaCreacion, value: any) => {
  const nuevasRespuestas = [...props.pregunta.respuestas];
  nuevasRespuestas[respuestaIndex] = {
    ...nuevasRespuestas[respuestaIndex],
    [field]: value
  };
  
  emit('update:pregunta', {
    ...props.pregunta,
    respuestas: nuevasRespuestas
  });
};
</script>

<template>
  <v-expansion-panel class="CardPregunta">
    <v-expansion-panel-title>
      <div class="CardPregunta__header">
        <v-chip color="purple" size="small" class="CardPregunta__numero">
          {{ index + 1 }}
        </v-chip>
        <span class="CardPregunta__titulo">
          {{ pregunta.descripcion || `Pregunta ${index + 1}` }}
        </span>
        <v-spacer />
        <v-chip
          :color="esValida ? 'success' : 'error'"
          size="x-small"
          class="CardPregunta__estado"
        >
          {{ esValida ? 'Válida' : 'Incompleta' }}
        </v-chip>
      </div>
    </v-expansion-panel-title>

    <v-expansion-panel-text>
      <div class="CardPregunta__contenido">
        <v-textarea
          :model-value="pregunta.descripcion"
          @update:model-value="(value) => updatePregunta('descripcion', value)"
          label="Texto de la pregunta *"
          variant="outlined"
          rows="2"
          class="CardPregunta__campo"
          hint="Escribe tu pregunta de forma clara y concisa"
          persistent-hint
        />

        <div class="CardPregunta__respuestas">
          <div class="CardPregunta__respuestas-header">
            <h4 class="CardPregunta__respuestas-titulo">Respuestas</h4>
            <v-btn
              @click="$emit('agregar-respuesta')"
              :disabled="pregunta.respuestas.length >= 4"
              color="info"
              size="small"
              variant="outlined"
            >
              <v-icon start size="small">mdi-plus</v-icon>
              Agregar
            </v-btn>
          </div>

          <div class="CardPregunta__grid">
            <v-card
              v-for="(respuesta, respuestaIndex) in pregunta.respuestas"
              :key="respuesta.id"
              class="CardPregunta__respuesta"
              :class="{ 'CardPregunta__respuesta--correcta': respuesta.esCorrecta }"
              variant="outlined"
            >
              <v-card-text class="CardPregunta__respuesta-contenido">
                <div class="CardPregunta__respuesta-header">
                  <v-radio-group
                    :model-value="respuesta.esCorrecta ? respuestaIndex : null"
                    @update:model-value="$emit('toggle-correcta', respuestaIndex)"
                    hide-details
                    class="CardPregunta__radio"
                  >
                    <v-radio
                      :value="respuestaIndex"
                      color="success"
                      density="compact"
                    >
                      <template v-slot:label>
                        <span class="CardPregunta__estado-texto">
                          {{ respuesta.esCorrecta ? 'Correcta' : 'Incorrecta' }}
                        </span>
                      </template>
                    </v-radio>
                  </v-radio-group>
                  
                  <v-btn
                    v-if="pregunta.respuestas.length > 2"
                    @click="$emit('eliminar-respuesta', respuestaIndex)"
                    icon="mdi-delete"
                    size="x-small"
                    color="error"
                    variant="text"
                  />
                </div>
                
                <v-text-field
                  :model-value="respuesta.texto"
                  @update:model-value="(value) => updateRespuesta(respuestaIndex, 'texto', value)"
                  :label="`Respuesta ${respuestaIndex + 1} *`"
                  variant="outlined"
                  density="compact"
                  hide-details
                />
              </v-card-text>
            </v-card>
          </div>
        </div>

        <div class="CardPregunta__eliminar">
          <v-btn
            @click="$emit('eliminar-pregunta')"
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
</template>

<style scoped lang="scss">
@import "@/assets/sass/components/CrearQuiz/CardPregunta";
</style>