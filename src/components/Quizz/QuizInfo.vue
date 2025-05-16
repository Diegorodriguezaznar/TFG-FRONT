<script setup>
import { inject } from 'vue';

// Obtener datos del quiz desde el contexto
const quiz = inject('quiz');
</script>

<template>
  <v-card class="mb-6" variant="elevated">
    <v-card-item>
      <v-card-title class="text-h5 mb-4">
        Sobre este quiz
      </v-card-title>
      <v-card-text>
        <p class="text-body-1 mb-4">{{ quiz.descripcion }}</p>
        
        <v-divider class="my-4"></v-divider>
        
        <h3 class="text-h6 mb-3">Temática</h3>
        <p class="text-body-1 mb-4">{{ quiz.tematica }}</p>
        
        <h3 class="text-h6 mb-3">¿A quién está dirigido?</h3>
        <p class="text-body-1 mb-4">{{ quiz.requisitos }}</p>
        
        <h3 class="text-h6 mb-3">Estructura del quiz</h3>
        <p class="text-body-1">{{ quiz.estructura }}</p>
      </v-card-text>
    </v-card-item>
  </v-card>
  
  <v-card class="mb-6" variant="elevated">
    <v-card-item>
      <v-card-title class="text-h5 mb-4">
        Etiquetas relacionadas
      </v-card-title>
      <v-card-text>
        <div class="d-flex flex-wrap">
          <v-chip
            v-for="etiqueta in quiz.etiquetas"
            :key="etiqueta"
            class="mr-2 mb-2"
            color="grey-lighten-3"
            variant="flat"
          >
            {{ etiqueta }}
          </v-chip>
        </div>
      </v-card-text>
    </v-card-item>
  </v-card>
</template>