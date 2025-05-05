<script setup lang="ts">
/* ----------------------------- Imports ----------------------------- */
import { computed } from "vue";
import type { Archivo } from "@/stores/Archivo";

/* ------------------------------ Props ------------------------------ */
const props = defineProps<{ archivo: Archivo }>();

/* ---------------------------- Emits ---------------------------- */
const emit = defineEmits(["ver"]);

/* --------------------------- Métodos --------------------------- */
const verArchivo = () => {
  emit("ver", props.archivo);
};

/* --------------------------- Computed --------------------------- */
const tipoClase = computed(() => {
  switch (props.archivo.tipo.toLowerCase()) {
    case "pdf": return "Archivo___PDF";
    case "word": return "Archivo___Word";
    case "imagen": return "Archivo___Imagen";
    case "video": return "Archivo___Video";
    default: return "Archivo___Otro";
  }
});
</script>

<template>
  <v-col cols="12" md="6" lg="4">
    <!-- 1. Card contenedor -->
    <v-card class="pa-3">
      
      <!-- 2. Título y tipo de archivo -->
      <div class="d-flex align-center justify-space-between Archivos__TituloContenedor">
        <v-card-title class="Archivo__Titulo">{{ props.archivo.titulo }}</v-card-title>
        
        <!-- Tipo de archivo con clase dinámica -->
        <div class="Archivo__Tipo" :class="tipoClase">{{ props.archivo.tipo }}</div>
      </div>

      <!-- 3. Separador -->
      <v-divider></v-divider>

      <!-- 4. Acciones (botones de ver y descargar) -->
      <v-card-actions class="Archivos__Botones">
        
        <!-- Botón ver archivo -->
        <v-btn
          color="blue-grey-lighten-2"
          icon
          class="Archivos__Boton"
          @click="verArchivo"
          aria-label="Ver archivo"
        >
          <v-icon color="white">mdi-eye</v-icon>
        </v-btn>
        
        <!-- Botón descargar archivo -->
        <v-btn
          color="orange-darken-2"
          icon
          :href="props.archivo.url"
          target="_blank"
          download
          aria-label="Descargar archivo"
        >
          <v-icon color="orange">mdi-download</v-icon>
        </v-btn>

      </v-card-actions>
    </v-card>
  </v-col>
</template>


<style lang="scss" scoped>
@import "@/assets/sass/components/Cards/Carchivo.scss";
</style>
