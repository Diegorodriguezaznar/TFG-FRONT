<template>
  <v-card 
    :class="[
      'FeatureCard',
      `FeatureCard--${color}`
    ]"
    elevation="8"
    @click="navegarARuta"
  >
    <div class="FeatureCard__Icon">
      <v-icon :size="60" :color="color">{{ icono }}</v-icon>
    </div>
    
    <v-card-title class="FeatureCard__Title">
      {{ titulo }}
    </v-card-title>
    
    <v-card-text class="FeatureCard__Description">
      <p>{{ descripcion }}</p>
      
      <ul v-if="caracteristicas?.length" class="FeatureCard__List">
        <li v-for="(caracteristica, index) in caracteristicas" :key="index">
          {{ caracteristica }}
        </li>
      </ul>
    </v-card-text>
    
    <v-card-actions class="FeatureCard__Actions">
      <v-btn 
        :color="color" 
        variant="elevated" 
        size="large"
        @click.stop="navegarARuta"
        block
      >
        <v-icon v-if="iconoBoton" start>{{ iconoBoton }}</v-icon>
        {{ textoBoton }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
// Props
const props = defineProps<{
  icono: string;
  color: string;
  titulo: string;
  descripcion: string;
  caracteristicas?: string[];
  textoBoton: string;
  iconoBoton?: string;
  ruta: string;
}>();

// Emits
const emit = defineEmits<{
  navegar: [ruta: string];
}>();

// Métodos
const navegarARuta = () => {
  emit('navegar', props.ruta);
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/components/HomePage/FeatureCard";
</style>