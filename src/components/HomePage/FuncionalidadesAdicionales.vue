<template>
  <section class="FuncionalidadesAdicionales">
    <v-container>
      <div class="FuncionalidadesAdicionales__Header">
        <h2 class="FuncionalidadesAdicionales__Title">Más Herramientas para Tu Éxito</h2>
        <p class="FuncionalidadesAdicionales__Subtitle">
          Funcionalidades adicionales que enriquecen tu experiencia de aprendizaje
        </p>
      </div>

      <v-row class="FuncionalidadesAdicionales__Grid" no-gutters>
        <!-- Profesores -->
        <v-col cols="12" sm="6" md="6" lg="3" xl="3">
          <div class="FuncionalidadesAdicionales__CardWrapper">
            <AdditionalCard
              icono="mdi-account-group"
              color="orange"
              titulo="Conoce a los Profesores"
              descripcion="Explora los perfiles de nuestros educadores expertos y descubre su experiencia y especialidades."
              ruta="/usuarios"
              @navegar="$emit('navegar', $event)"
            />
          </div>
        </v-col>

        <!-- Mis Cursos -->
        <v-col cols="12" sm="6" md="6" lg="3" xl="3">
          <div class="FuncionalidadesAdicionales__CardWrapper">
            <AdditionalCard
              icono="mdi-bookmark-multiple"
              color="green"
              titulo="Mis Cursos"
              descripcion="Accede rápidamente a los cursos en los que estás inscrito y continúa donde lo dejaste."
              ruta="/mis-cursos"
              @navegar="$emit('navegar', $event)"
            />
          </div>
        </v-col>

        <!-- IA Asistente -->
        <v-col cols="12" sm="6" md="6" lg="3" xl="3">
          <div class="FuncionalidadesAdicionales__CardWrapper">
            <AdditionalCard
              icono="mdi-robot-outline"
              color="cyan"
              titulo="MarIAno IA"
              descripcion="Chatea con nuestro asistente de IA para resolver dudas y obtener ayuda personalizada."
              ruta="/ia"
              @navegar="$emit('navegar', $event)"
            />
          </div>
        </v-col>

        <!-- Hazte Profesor -->
        <v-col cols="12" sm="6" md="6" lg="3" xl="3">
          <div class="FuncionalidadesAdicionales__CardWrapper">
            <AdditionalCard
              icono="mdi-school"
              color="indigo"
              titulo="Hazte Profesor"
              descripcion="¿Tienes conocimientos que compartir? Solicita convertirte en profesor y crea tu propio contenido."
              ruta="/peticion-profesor"
              @navegar="$emit('navegar', $event)"
            />
          </div>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup lang="ts">
import AdditionalCard from '@/components/HomePage/AdditionalCard.vue';

// Emits
defineEmits<{
  navegar: [ruta: string];
}>();
</script>

<style scoped lang="scss">
@import "@/assets/sass/components/HomePage/FuncionalidadesAdicionales";
</style>