<template>
  <v-card 
    :class="[
      'FeatureCard',
      `FeatureCard--${color}`
    ]"
    elevation="8"
    @click="navegarARuta"
  >
    <div class="FeatureCard__Icon">
      <v-icon :size="60" :color="color">{{ icono }}</v-icon>
    </div>
    
    <v-card-title class="FeatureCard__Title">
      {{ titulo }}
    </v-card-title>
    
    <v-card-text class="FeatureCard__Description">
      <p>{{ descripcion }}</p>
      
      <ul v-if="caracteristicas?.length" class="FeatureCard__List">
        <li v-for="(caracteristica, index) in caracteristicas" :key="index">
          {{ caracteristica }}
        </li>
      </ul>
    </v-card-text>
    
    <v-card-actions class="FeatureCard__Actions">
      <v-btn 
        :color="color" 
        variant="elevated" 
        size="large"
        @click.stop="navegarARuta"
        block
      >
        <v-icon v-if="iconoBoton" start>{{ iconoBoton }}</v-icon>
        {{ textoBoton }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
// Props
const props = defineProps<{
  icono: string;
  color: string;
  titulo: string;
  descripcion: string;
  caracteristicas?: string[];
  textoBoton: string;
  iconoBoton?: string;
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
.FeatureCard {
  height: 100%;
  border-radius: 20px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  border: 2px solid transparent;
}

.FeatureCard:hover {
  transform: translateY(-10px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15) !important;
}

.FeatureCard--blue:hover {
  border-color: #2196F3;
}

.FeatureCard--red:hover {
  border-color: #F44336;
}

.FeatureCard--purple:hover {
  border-color: #9C27B0;
}

.FeatureCard--green:hover {
  border-color: #4CAF50;
}

.FeatureCard--orange:hover {
  border-color: #FF9800;
}

.FeatureCard__Icon {
  text-align: center;
  padding: 2rem 0 1rem;
  background: rgba(0, 0, 0, 0.02);
}

.FeatureCard__Title {
  font-size: 1.8rem;
  font-weight: 700;
  text-align: center;
  color: #333;
  padding: 1rem 2rem 0;
}

.FeatureCard__Description {
  padding: 1.5rem 2rem;
  font-size: 1rem;
  line-height: 1.6;
  color: #555;
}

.FeatureCard__List {
  margin-top: 1.5rem;
  padding-left: 0;
  list-style: none;
}

.FeatureCard__List li {
  padding: 0.5rem 0;
  position: relative;
  padding-left: 1.5rem;
}

.FeatureCard__List li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #4CAF50;
  font-weight: bold;
}

.FeatureCard__Actions {
  padding: 0 2rem 2rem;
}

/* Animación */
.FeatureCard {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>