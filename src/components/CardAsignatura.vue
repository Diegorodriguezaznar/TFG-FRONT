<script setup lang="ts">
/* --------------------------- Imports --------------------------- */
import { useRouter } from "vue-router";

/* --------------------------- Router --------------------------- */
const router = useRouter();

/* --------------------------- Métodos --------------------------- */
const irATemarios = () => {
  if (props.asignatura && props.asignatura.idAsignatura) {
      router.push(`/temarios/${props.asignatura.idAsignatura}`);
  } else {
      console.error('Error: la asignatura o su ID no están definidos');
  }
};

/* --------------------------- Props --------------------------- */
const props = defineProps<{ 
  asignatura: { 
    idAsignatura: number;
    nombre: string;
    descripcion: string;
  } 
}>();
</script>

<template>
  <v-card class="mx-auto d-flex flex-column" max-width="400" color="orange-lighten-1">
    <div class="pa-3 flex-grow-1">
      <v-card-title class="text-h5 text-white text-wrap">
        <span class="d-block text-truncate" style="max-width: 100%;">
          {{ asignatura.nombre }}
        </span>
      </v-card-title>

      <v-card-subtitle class="text-white text-wrap">
        <span class="d-block text-truncate" style="max-width: 100%;">
          {{ asignatura.descripcion }}
        </span>
      </v-card-subtitle>
    </div>

    <v-card-actions class="justify-end">
      <v-btn 
        class="ms-2"
        size="small"
        color="orange-lighten-5"
        text="Ver temarios"
        variant="outlined"
        @click="irATemarios"
      ></v-btn>
    </v-card-actions>
  </v-card>
</template>
