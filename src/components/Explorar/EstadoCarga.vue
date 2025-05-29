<!-- src/components/Explorar/EstadoCarga.vue -->
<script setup lang="ts">
// No necesita props ni lógica especial
</script>

<template>
  <div class="EstadoCarga">
    <v-card class="EstadoCarga__Card" elevation="2">
      <v-card-text class="EstadoCarga__Content">
        <div class="text-center py-12">
          <!-- Logo chuli animado -->
          <div class="EstadoCarga__VideoLogo mb-4">
            <div class="EstadoCarga__VideoIcon">
              <v-icon color="white" size="32">mdi-play</v-icon>
            </div>
            <v-progress-circular 
              indeterminate 
              color="red" 
              size="80"
              width="3"
              class="EstadoCarga__Progress"
            ></v-progress-circular>
          </div>
          
          <h3 class="EstadoCarga__Title mb-2">Cargando videos...</h3>
          <p class="EstadoCarga__Subtitle">
            Estamos buscando el mejor contenido para ti
          </p>
          
          <!-- Skeleton loaders para simular contenido -->
          <div class="EstadoCarga__Skeleton mt-8">
            <v-row>
              <v-col v-for="i in 6" :key="i" cols="12" sm="6" md="4" lg="2">
                <v-skeleton-loader
                  type="card"
                  class="EstadoCarga__SkeletonItem"
                ></v-skeleton-loader>
              </v-col>
            </v-row>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<style scoped>
.EstadoCarga {
  padding: 40px 0;
}

.EstadoCarga__Card {
  border-radius: 16px;
  border: 1px solid rgba(244, 67, 54, 0.1);
  background: linear-gradient(135deg, rgba(244, 67, 54, 0.02) 0%, #ffffff 100%);
}

.EstadoCarga__Content {
  padding: 32px;
}

.EstadoCarga__Title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
}

.EstadoCarga__Subtitle {
  color: #666;
  font-size: 1rem;
  margin: 0;
}

.EstadoCarga__Skeleton {
  max-width: 800px;
  margin: 0 auto;
}

.EstadoCarga__SkeletonItem {
  border-radius: 12px;
  border: 1px solid rgba(244, 67, 54, 0.1);
}

/* Animación del spinner */
.EstadoCarga__Card {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.95;
  }
}

/* Responsive */
@media (max-width: 600px) {
  .EstadoCarga__Content {
    padding: 24px 16px;
  }
  
  .EstadoCarga__Title {
    font-size: 1.3rem;
  }
  
  .EstadoCarga__Skeleton {
    margin-top: 24px;
  }
}
</style>