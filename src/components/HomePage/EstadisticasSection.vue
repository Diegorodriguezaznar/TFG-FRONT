<template>
  <section class="EstadisticasSection">
    <v-container>
      <v-row class="text-center">
        <v-col cols="6" md="3">
          <div class="EstadisticasSection__Card">
            <v-icon size="50" color="#FF9800" class="EstadisticasSection__Icon">mdi-play-circle</v-icon>
            <p class="EstadisticasSection__Label">Videos Educativos</p>
          </div>
        </v-col>
        <v-col cols="6" md="3">
          <div class="EstadisticasSection__Card">
            <v-icon size="50" color="#FF9800" class="EstadisticasSection__Icon">mdi-book-education</v-icon>
            <p class="EstadisticasSection__Label">Cursos Disponibles</p>
          </div>
        </v-col>
        <v-col cols="6" md="3">
          <div class="EstadisticasSection__Card">
            <v-icon size="50" color="#FF9800" class="EstadisticasSection__Icon">mdi-brain</v-icon>
            <p class="EstadisticasSection__Label">Quizzes Interactivos</p>
          </div>
        </v-col>
        <v-col cols="6" md="3">
          <div class="EstadisticasSection__Card">
            <v-icon size="50" color="#FF9800" class="EstadisticasSection__Icon">mdi-account-group</v-icon>
            <p class="EstadisticasSection__Label">Profesores Expertos</p>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup lang="ts">
// Necesito estar iniciado
</script>

<style scoped lang="scss">
@import "@/assets/sass/components/HomePage/EstadisticasSection";
</style>