<template>
  <section class="CallToActionSection">
    <v-container>
      <div class="CallToActionSection__Content">
        <h2 class="CallToActionSection__Title">¿Listo para comenzar tu viaje de aprendizaje?</h2>
        <p class="CallToActionSection__Subtitle">
          Elige tu camino y comienza a explorar todo lo que AcademIQ tiene para ofrecerte
        </p>
        <div class="CallToActionSection__Buttons">
          <v-btn 
            color="blue" 
            size="x-large" 
            variant="elevated"
            @click="$emit('navegar', '/cursos')"
            class="CallToActionSection__Button"
          >
            <v-icon start>mdi-book-education</v-icon>
            Explorar Cursos
          </v-btn>
          <v-btn 
            color="red" 
            size="x-large" 
            variant="elevated"
            @click="$emit('navegar', '/explorar')"
            class="CallToActionSection__Button"
          >
            <v-icon start>mdi-play-circle</v-icon>
            Ver Videos
          </v-btn>
          <v-btn 
            color="purple" 
            size="x-large" 
            variant="elevated"
            @click="$emit('navegar', '/quizz-time!')"
            class="CallToActionSection__Button"
          >
            <v-icon start>mdi-brain</v-icon>
            Hacer Quiz
          </v-btn>
        </div>
      </div>
    </v-container>
  </section>
</template>

<script setup lang="ts">
// Emits
defineEmits<{
  navegar: [ruta: string];
}>();
</script>

<style scoped lang="scss">
@import "@/assets/sass/components/HomePage/CallToActionSection";
</style>