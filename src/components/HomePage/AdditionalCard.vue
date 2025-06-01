<template>
  <v-card 
    class="AdditionalCard"
    elevation="4"
    @click="navegarARuta"
  >
    <v-card-text class="AdditionalCard__Content">
      <v-icon :size="40" :color="color" class="AdditionalCard__Icon">{{ icono }}</v-icon>
      <h3 class="AdditionalCard__Title">{{ titulo }}</h3>
      <p class="AdditionalCard__Description">{{ descripcion }}</p>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
// Props
const props = defineProps<{
  icono: string;
  color: string;
  titulo: string;
  descripcion: string;
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
@import "@/assets/sass/components/HomePage/AdditionalCard";
</style>