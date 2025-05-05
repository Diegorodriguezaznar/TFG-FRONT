<script setup lang="ts">
// --------------------------- Imports ---------------------------
import { defineProps, defineEmits } from 'vue';

// --------------------------- propiedades ---------------------------
const props = defineProps({
  slides: {
    type: Array,
    required: true
  }
});

// --------------------------- eventos ---------------------------
const emit = defineEmits(['entrarCursos']);

// --------------------------- Función para manejar clic en el botón ---------------------------
const handleEntrarCursos = () => {
  emit('entrarCursos');
};
</script>

<template>
  <!-- --------------------------- Carrusel Home --------------------------- -->
  <div class="Carrusel__Home">
    <v-carousel class="Carrusel__Componente" height="600" progress="primary" hide-delimiters>
      
      <!-- --------------------------- Item del carrusel --------------------------- -->
      <v-carousel-item v-for="(slide, i) in slides" :key="i">
        <v-sheet height="100%">
          <div class="d-flex fill-height justify-center align-center">
            <v-img :src="slide.image" height="100%" cover>
              
              <!-- --------------------------- Contenido del slide --------------------------- -->
              <div class="Carrusel__Contenido">
                <h2 class="Carrusel__Titulo">{{ slide.title }}</h2>
                <p v-if="slide.text" class="Carrusel__Texto">{{ slide.text }}</p>
                
                <!-- --------------------------- Botón para entrar a cursos --------------------------- -->
                <v-btn 
                  v-if="slide.showButton" 
                  variant="outlined" 
                  color="white" 
                  class="Boton__Cursos" 
                  size="x-large" 
                  @click="handleEntrarCursos"
                >
                  Entra a Cursos
                </v-btn>
              </div>
            </v-img>
          </div>
        </v-sheet>
      </v-carousel-item>
    </v-carousel>
  </div>
</template>

<style lang="scss" scoped>
  @import "@/assets/sass/components/Carrusel.scss";
</style>
