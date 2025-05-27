<template>
  <v-card 
    class="AdditionalCard"
    elevation="4"
    @click="navegarARuta"
  >
    <v-card-text class="AdditionalCard__Content">
      <v-icon :size="40" :color="color" class="AdditionalCard__Icon">{{ icono }}</v-icon>
      <h3 class="AdditionalCard__Title">{{ titulo }}</h3>
      <p class="AdditionalCard__Description">{{ descripcion }}</p>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
// Props
const props = defineProps<{
  icono: string;
  color: string;
  titulo: string;
  descripcion: string;
  ruta: string;
}>();

// Emits
const emit = defineEmits<{
  navegar: [ruta: string];
}>();

// Métodos
const navegarARuta = () => {
  emit('navegar', props.ruta);
};
</script>

<style scoped>
.AdditionalCard {
  height: 100%;
  min-height: 220px; /* ALTURA MÍNIMA UNIFORME */
  border-radius: 16px;
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
}

.AdditionalCard:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1) !important;
}

.AdditionalCard__Content {
  text-align: center;
  padding: 2rem 1.5rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.AdditionalCard__Icon {
  margin-bottom: 1rem;
  display: block;
  flex-shrink: 0;
}

.AdditionalCard__Title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
  text-align: center;
  flex-shrink: 0;
}

.AdditionalCard__Description {
  color: #666;
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0;
  text-align: center;
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Forzar todas las cards a la misma altura en el grid */
@media (min-width: 960px) {
  .AdditionalCard {
    min-height: 240px; /* Altura base más alta para desktop */
  }
}

/* Animación */
.AdditionalCard {
  animation: fadeInUp 0.5s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 959px) {
  .AdditionalCard {
    min-height: 200px;
  }
}

@media (max-width: 599px) {
  .AdditionalCard__Content {
    padding: 1.5rem 1rem;
  }
  
  .AdditionalCard__Title {
    font-size: 1.1rem;
  }
  
  .AdditionalCard__Description {
    font-size: 0.9rem;
  }
  
  .AdditionalCard {
    min-height: 180px;
  }
}
</style>