<script setup lang="ts">
interface Paso {
  titulo: string;
  icono: string;
  completado: boolean;
}

interface Props {
  pasos: Paso[];
  pasoActual: number;
}

interface Emits {
  (e: 'ir-al-paso', paso: number): void;
}

defineProps<Props>();
defineEmits<Emits>();
</script>

<template>
  <v-card class="QuizStepper" elevation="3">
    <v-card-text class="QuizStepper__contenido">
      <div class="QuizStepper__pasos">
        <div
          v-for="(paso, index) in pasos"
          :key="index"
          class="QuizStepper__paso"
          :class="{ 
            'QuizStepper__paso--activo': index === pasoActual,
            'QuizStepper__paso--completado': paso.completado
          }"
          @click="$emit('ir-al-paso', index)"
        >
          <div class="QuizStepper__icono">
            <v-icon
              :color="index === pasoActual ? 'white' : paso.completado ? 'white' : 'grey'"
              :icon="paso.completado ? 'mdi-check' : paso.icono"
            />
          </div>
          <div class="QuizStepper__titulo">{{ paso.titulo }}</div>
          
          <div 
            v-if="index < pasos.length - 1"
            class="QuizStepper__conector"
            :class="{ 'QuizStepper__conector--activo': paso.completado }"
          />
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped lang="scss">
@import "@/assets/sass/components/CrearQuiz/QuizStepper";
</style>