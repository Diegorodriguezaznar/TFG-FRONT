<template>
  <section class="HeroSection">
    <v-container class="HeroSection__Container">
      <v-row align="center" class="fill-height">
        <v-col cols="12" md="6" class="HeroSection__Content">
          <div class="HeroSection__LogoContainer">
            <AcademIQLogo class="HeroSection__Logo" />
          </div>
          
          <div class="HeroSection__Welcome">
            <h1 class="HeroSection__Title">
              ¡Bienvenido a <span class="HeroSection__Brand">AcademIQ</span>!
            </h1>
            <p class="HeroSection__Subtitle">
              Tu plataforma integral de aprendizaje donde puedes explorar cursos, 
              ver videos educativos y poner a prueba tus conocimientos con quizzes interactivos.
            </p>
            
            <div class="HeroSection__QuickActions">
              <v-btn 
                color="white" 
                variant="elevated" 
                size="large"
                @click="$emit('navegar', '/cursos')"
                class="HeroSection__QuickBtn"
              >
                <v-icon start>mdi-book-education</v-icon>
                Explorar Cursos
              </v-btn>
              <v-btn 
                color="white" 
                variant="outlined" 
                size="large"
                @click="$emit('navegar', '/quizz-time!')"
                class="HeroSection__QuickBtn"
              >
                <v-icon start>mdi-brain</v-icon>
                Hacer Quiz
              </v-btn>
            </div>
          </div>
        </v-col>
        <v-col cols="12" md="6" class="text-center">
          <div class="HeroSection__ImageContainer">
            <v-img
              src="https://images.unsplash.com/photo-1683871268982-a19153dbb35d?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zm9uZG8lMjBkZSUyMGxhJTIwYmlibGlvdGVjYXxlbnwwfHwwfHx8MA%3D%3D"
              alt="Librería - Educación y Aprendizaje"
              class="HeroSection__MainImage"
              cover
            ></v-img>
            <div class="HeroSection__FloatingElements">
              <div class="HeroSection__FloatingElement HeroSection__FloatingElement--1">
                <v-icon color="white" size="30">mdi-book</v-icon>
              </div>
              <div class="HeroSection__FloatingElement HeroSection__FloatingElement--2">
                <v-icon color="white" size="25">mdi-lightbulb</v-icon>
              </div>
              <div class="HeroSection__FloatingElement HeroSection__FloatingElement--3">
                <v-icon color="white" size="35">mdi-graduation-cap</v-icon>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup lang="ts">
import AcademIQLogo from '@/components/Common/AcademIQ.vue';

defineEmits<{
  navegar: [ruta: string];
}>();
</script>

<style scoped lang="scss">
@import "@/assets/sass/components/HomePage/HeroSection";
</style>