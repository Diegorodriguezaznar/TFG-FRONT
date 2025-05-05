<script setup lang="ts">
// --------------------------- Imports ---------------------------
import { computed } from "vue";
import { useRouter } from "vue-router";

// --------------------------- Evento de selección de temario ---------------------------
const seleccionarTemario = () => {
  if (props.temario && props.temario.id) {
    router.push(`/temarios/${props.temario.id}/archivos-test`);
  } else {
    console.error('Error: el temario o su ID no están definidos');
  }
};

// --------------------------- Router ---------------------------
const router = useRouter();

// --------------------------- Propiedades temario ---------------------------
const props = defineProps({
  temario: {
    type: Object,
    required: true
  }
});
</script>

<template>
  <!-- --------------------------- Card del temario --------------------------- -->
  <v-card class="mx-auto text-white" max-width="400" color="orange-darken-4">
    
    <!-- --------------------------- Título del temario --------------------------- -->
    <v-card-title class="text-h5 text-center">
      {{ temario.titulo }}
    </v-card-title>

    <!-- --------------------------- Descripción del temario --------------------------- -->
    <v-card-subtitle class="text-center">
      {{ temario.descripcion }}
    </v-card-subtitle>

    <!-- --------------------------- Acción de ver contenido --------------------------- -->
    <v-card-actions class="justify-center">
      <v-btn color="white" text @click="seleccionarTemario">
        Ver contenido
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
