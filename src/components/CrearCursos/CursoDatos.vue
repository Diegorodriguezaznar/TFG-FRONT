<script setup lang="ts">
import { defineModel } from 'vue';

const cursoForm = defineModel({
  type: Object,
  required: true
});
</script>

<template>
  <v-form>
    <v-text-field
      label="Nombre del curso"
      v-model="cursoForm.nombre"
      required
      variant="outlined"
      :rules="[v => !!v || 'El nombre es obligatorio']"
      placeholder="Ej. Desarrollo Web Full Stack"
      prepend-icon="mdi-format-title"
      class="mb-4"
    />

    <v-text-field
      label="URL de la imagen"
      v-model="cursoForm.imagen"
      variant="outlined"
      placeholder="https://ejemplo.com/imagen.jpg"
      prepend-icon="mdi-image"
      class="mb-4"
      hint="Imagen de portada para el curso"
    />

    <v-textarea
      label="Descripción"
      v-model="cursoForm.descripcion"
      variant="outlined"
      auto-grow
      rows="4"
      placeholder="Describe los objetivos y contenido del curso..."
      :rules="[v => !!v || 'La descripción es obligatoria']"
      prepend-icon="mdi-text-box"
      class="mb-2"
    />
  </v-form>
</template>