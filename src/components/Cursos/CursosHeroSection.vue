<template>
  <section class="cursos-hero">
    <v-container class="cursos-hero__container">
      <v-row align="center" class="fill-height">
        <v-col cols="12" md="6" class="cursos-hero__content">
          <h1 class="cursos-hero__title">
            Explora Nuestros <span class="cursos-hero__brand">Cursos</span>
          </h1>
          <p class="cursos-hero__subtitle">
            Descubre una amplia variedad de cursos diseñados para potenciar tu aprendizaje. 
            Guarda tus favoritos y comienza tu viaje educativo.
          </p>
        </v-col>
        
        <v-col cols="12" md="6" class="text-center">
          <div class="cursos-hero__avatar-container">
            <div class="cursos-hero__avatar-glow">
              <v-avatar size="200" color="blue" class="cursos-hero__avatar">
                <v-icon color="white" size="120">mdi-book-education</v-icon>
              </v-avatar>
            </div>
            
            <div class="cursos-hero__floating-elements">
              <div class="cursos-hero__floating-element cursos-hero__floating-element--1">
                <v-icon color="blue">mdi-bookmark</v-icon>
              </div>
              <div class="cursos-hero__floating-element cursos-hero__floating-element--2">
                <v-icon color="blue">mdi-school</v-icon>
              </div>
              <div class="cursos-hero__floating-element cursos-hero__floating-element--3">
                <v-icon color="blue">mdi-certificate</v-icon>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<style lang="scss" scoped>
@import "@/assets/sass/components/Cursos/CursosHeroSection";
</style>