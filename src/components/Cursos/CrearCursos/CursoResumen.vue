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
  <div class="CursoPreview">
    <v-card class="CursoPreview__card" max-width="100%" elevation="1">
      <v-img
        v-if="curso.imagen"
        :src="curso.imagen"
        height="200"
        cover
        class="CursoPreview__imagen"
        gradient="to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 80%"
      >
        <v-card-title class="CursoPreview__titulo CursoPreview__titulo--overlay">
          {{ curso.nombre || 'Título del curso' }}
        </v-card-title>
      </v-img>

      <v-card-title v-else class="CursoPreview__titulo">
        <v-icon size="24" color="grey" class="CursoPreview__icono">mdi-image-off</v-icon>
        {{ curso.nombre || 'Título del curso' }}
      </v-card-title>

      <v-card-text class="CursoPreview__contenido">
        <p class="CursoPreview__descripcion">
          {{ curso.descripcion || 'Aquí aparecerá la descripción de tu curso.' }}
        </p>
        
        <v-divider class="CursoPreview__divider" />
        
        <div class="CursoPreview__fecha">
          <v-icon size="small" color="grey" class="CursoPreview__icono-fecha">mdi-calendar</v-icon>
          <span class="CursoPreview__texto-fecha">Fecha: {{ new Date().toLocaleDateString() }}</span>
        </div>
      </v-card-text>
    </v-card>
    
    <div class="CursoPreview__aviso">
      <span class="CursoPreview__texto-aviso">
        * Esta es una vista previa de cómo se verá tu curso
      </span>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/sass/components/CrearCursos/CursoResumen";
</style>