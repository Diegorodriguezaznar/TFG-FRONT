<script setup lang="ts">
// --------------------------- Imports ---------------------------
import { useRouter } from 'vue-router';
import { computed } from 'vue';

// --------------------------- Evento de selección de test ---------------------------
const verTest = () => {
  if (props.test && props.test.id) {
    router.push(`/test/${props.test.id}`);
  }
};

// --------------------------- Router ---------------------------
const router = useRouter();

// --------------------------- Propiedades de test ---------------------------
const props = defineProps({
  test: {
    type: Object,
    required: true
  }
});

// --------------------------- Computed ---------------------------
const testTitle = computed(() => {
  return props.test?.titulo || props.test?.nombre || 'Test sin título';
});
</script>

<template>
  <!-- --------------------------- Card del test --------------------------- -->
  <v-card class="pa-3">
    
    <!-- --------------------------- Título del test --------------------------- -->
    <v-card-title>{{ testTitle }}</v-card-title>
    
    <!-- --------------------------- Separador --------------------------- -->
    <v-divider></v-divider>
    
    <!-- --------------------------- Botones del test --------------------------- -->
    <v-card-actions class="CardTest__Botones">
      <v-btn color="orange-darken-2" icon class="CardTest__Botones__Verbtn" @click="verTest">
        <v-icon color="white">mdi-eye</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style lang="scss" scoped>
  @import "@/assets/sass/components/Cards/Ctest.scss";
</style>
