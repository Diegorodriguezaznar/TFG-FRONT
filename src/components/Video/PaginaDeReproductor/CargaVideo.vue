<script setup lang="ts">
defineProps<{
  error?: string
}>();
</script>

<template>
  <!-- Estado de carga -->
  <div v-if="!error" class="d-flex justify-center align-center" style="height: 50vh;">
    <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
  </div>
  
  <!-- Estado de error -->
  <div v-else class="d-flex justify-center align-center flex-column" style="height: 50vh;">
    <v-icon color="error" size="64" class="mb-4">mdi-alert-circle</v-icon>
    <h2 class="text-h5 text-center mb-2">No se pudo cargar el video</h2>
    <p class="text-body-1 text-center">{{ error }}</p>
    <v-btn color="primary" class="mt-4" to="/cursos">
      Volver a cursos
    </v-btn>
  </div>
</template>