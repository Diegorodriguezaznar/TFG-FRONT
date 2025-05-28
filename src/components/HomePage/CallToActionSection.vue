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
            @click="$emit('navegar', '/cursos')"
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

<style scoped>
.CallToActionSection {
  padding: 100px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.CallToActionSection::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" patternUnits="userSpaceOnUse" width="100" height="100"><filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23noiseFilter)" opacity="0.1"/></pattern></defs><rect width="100%" height="100%" fill="url(%23grain)"/></svg>');
  opacity: 0.3;
}

.CallToActionSection__Content {
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.CallToActionSection__Title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.CallToActionSection__Subtitle {
  font-size: 1.3rem;
  margin-bottom: 3rem;
  opacity: 0.95;
  line-height: 1.6;
}

.CallToActionSection__Buttons {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
}

.CallToActionSection__Button {
  font-size: 1.1rem;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.CallToActionSection__Button:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

/* Responsive */
@media (max-width: 768px) {
  .CallToActionSection {
    padding: 80px 0;
  }
  
  .CallToActionSection__Title {
    font-size: 2rem;
  }
  
  .CallToActionSection__Subtitle {
    font-size: 1.1rem;
  }
  
  .CallToActionSection__Buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .CallToActionSection__Button {
    width: 100%;
    max-width: 300px;
  }
}

@media (max-width: 480px) {
  .CallToActionSection__Title {
    font-size: 1.8rem;
  }
}
</style>