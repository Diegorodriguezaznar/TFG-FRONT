<!-- src/components/Explorar/EstadisticasVideos.vue -->
<script setup lang="ts">
const props = defineProps<{
  estadisticas: {
    total: number;
    duracionPromedio: number;
    totalLikes: number;
    totalAsignaturas: number;
  };
}>();
</script>

<template>
  <div class="EstadisticasVideos">
    <v-row>
      <v-col cols="6" sm="3">
        <v-card class="EstadisticasVideos__Card" elevation="2">
          <v-card-text class="text-center py-4">
            <div class="EstadisticasVideos__Number EstadisticasVideos__Number--red">
              {{ estadisticas.total }}
            </div>
            <div class="EstadisticasVideos__Label">Videos</div>
            <v-icon class="EstadisticasVideos__Icon" color="red">mdi-play-circle</v-icon>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="6" sm="3">
        <v-card class="EstadisticasVideos__Card" elevation="2">
          <v-card-text class="text-center py-4">
            <div class="EstadisticasVideos__Number EstadisticasVideos__Number--pink">
              {{ estadisticas.duracionPromedio }}min
            </div>
            <div class="EstadisticasVideos__Label">Duración Promedio</div>
            <v-icon class="EstadisticasVideos__Icon" color="pink">mdi-clock</v-icon>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="6" sm="3">
        <v-card class="EstadisticasVideos__Card" elevation="2">
          <v-card-text class="text-center py-4">
            <div class="EstadisticasVideos__Number EstadisticasVideos__Number--deep-orange">
              {{ estadisticas.totalLikes }}
            </div>
            <div class="EstadisticasVideos__Label">Total Likes</div>
            <v-icon class="EstadisticasVideos__Icon" color="deep-orange">mdi-heart</v-icon>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="6" sm="3">
        <v-card class="EstadisticasVideos__Card" elevation="2">
          <v-card-text class="text-center py-4">
            <div class="EstadisticasVideos__Number EstadisticasVideos__Number--red-darken">
              {{ estadisticas.totalAsignaturas }}
            </div>
            <div class="EstadisticasVideos__Label">Asignaturas</div>
            <v-icon class="EstadisticasVideos__Icon" color="red-darken-2">mdi-book</v-icon>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>
.EstadisticasVideos__Card {
  border-radius: 16px;
  border: 1px solid rgba(244, 67, 54, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(244, 67, 54, 0.02) 0%, #ffffff 100%);
}

.EstadisticasVideos__Card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(244, 67, 54, 0.15);
  border-color: rgba(244, 67, 54, 0.3);
}

.EstadisticasVideos__Number {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 4px;
  line-height: 1;
}

.EstadisticasVideos__Number--red {
  color: #F44336;
}

.EstadisticasVideos__Number--pink {
  color: #E91E63;
}

.EstadisticasVideos__Number--deep-orange {
  color: #FF5722;
}

.EstadisticasVideos__Number--red-darken {
  color: #C62828;
}

.EstadisticasVideos__Label {
  font-size: 0.875rem;
  color: #666;
  font-weight: 500;
  margin-bottom: 8px;
}

.EstadisticasVideos__Icon {
  position: absolute;
  top: 12px;
  right: 12px;
  opacity: 0.3;
}

/* Animación de entrada */
.EstadisticasVideos__Card {
  animation: slideInUp 0.6s ease-out;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 600px) {
  .EstadisticasVideos__Number {
    font-size: 2rem;
  }
  
  .EstadisticasVideos__Label {
    font-size: 0.8rem;
  }
}
</style>