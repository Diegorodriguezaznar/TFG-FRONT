<script setup lang="ts">
defineProps<{
  curso: {
    nombre: string;
    imagen: string;
    descripcion: string;
  };
}>();
</script>

<template>
  <v-card class="mx-auto" max-width="100%" elevation="1">
    <v-img
      :src="curso.imagen"
      height="200"
      cover
      class="align-end"
      gradient="to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 80%"
      v-if="curso.imagen"
    >
      <v-card-title class="text-white font-weight-medium">
        {{ curso.nombre || 'Título del curso' }}
      </v-card-title>
    </v-img>

    <v-card-title v-if="!curso.imagen">
      <v-icon size="24" color="grey" class="me-2">mdi-image-off</v-icon>
      {{ curso.nombre || 'Título del curso' }}
    </v-card-title>

    <v-card-text>
      <p class="text-body-1 my-2">{{ curso.descripcion || 'Aquí aparecerá la descripción de tu curso.' }}</p>
      
      <v-divider class="my-3"></v-divider>
      
      <div class="d-flex align-center">
        <v-icon size="small" color="grey" class="me-1">mdi-calendar</v-icon>
        <span class="text-caption text-grey">Fecha: {{ new Date().toLocaleDateString() }}</span>
      </div>
    </v-card-text>
  </v-card>
  
  <div class="mt-4 text-center">
    <span class="text-caption text-grey">
      * Esta es una vista previa de cómo se verá tu curso
    </span>
  </div>
</template>