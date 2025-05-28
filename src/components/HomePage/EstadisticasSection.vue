<template>
  <section class="EstadisticasSection">
    <v-container>
      <v-row class="text-center">
        <v-col cols="6" md="3">
          <div class="EstadisticasSection__Card">
            <v-icon size="50" color="#FF9800" class="EstadisticasSection__Icon">mdi-play-circle</v-icon>
            <h3 class="EstadisticasSection__Number">1000+</h3>
            <p class="EstadisticasSection__Label">Videos Educativos</p>
          </div>
        </v-col>
        <v-col cols="6" md="3">
          <div class="EstadisticasSection__Card">
            <v-icon size="50" color="#FF9800" class="EstadisticasSection__Icon">mdi-book-education</v-icon>
            <h3 class="EstadisticasSection__Number">50+</h3>
            <p class="EstadisticasSection__Label">Cursos Disponibles</p>
          </div>
        </v-col>
        <v-col cols="6" md="3">
          <div class="EstadisticasSection__Card">
            <v-icon size="50" color="#FF9800" class="EstadisticasSection__Icon">mdi-brain</v-icon>
            <h3 class="EstadisticasSection__Number">200+</h3>
            <p class="EstadisticasSection__Label">Quizzes Interactivos</p>
          </div>
        </v-col>
        <v-col cols="6" md="3">
          <div class="EstadisticasSection__Card">
            <v-icon size="50" color="#FF9800" class="EstadisticasSection__Icon">mdi-account-group</v-icon>
            <h3 class="EstadisticasSection__Number">30+</h3>
            <p class="EstadisticasSection__Label">Profesores Expertos</p>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup lang="ts">
// Este componente es solo de presentación, no necesita lógica
</script>

<style scoped>
.EstadisticasSection {
  padding: 80px 0;
  background: #333;
  color: white;
}

.EstadisticasSection__Card {
  padding: 2rem 1rem;
  transition: transform 0.3s ease;
}

.EstadisticasSection__Card:hover {
  transform: scale(1.05);
}

.EstadisticasSection__Icon {
  margin-bottom: 1rem;
}

.EstadisticasSection__Number {
  font-size: 3rem;
  font-weight: 700;
  color: #FF9800;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(255, 152, 0, 0.3);
}

.EstadisticasSection__Label {
  font-size: 1.1rem;
  opacity: 0.9;
  margin: 0;
  font-weight: 500;
}

/* Responsive */
@media (max-width: 768px) {
  .EstadisticasSection {
    padding: 60px 0;
  }
  
  .EstadisticasSection__Number {
    font-size: 2.5rem;
  }
  
  .EstadisticasSection__Label {
    font-size: 1rem;
  }
}
</style>