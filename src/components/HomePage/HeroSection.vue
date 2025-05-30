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
            <!-- Elementos flotantes decorativos -->
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

// Emits
defineEmits<{
  navegar: [ruta: string];
}>();
</script>

<style scoped>
.HeroSection {
  background: linear-gradient(135deg, #FF9800 0%, #FFB74D 50%, #FFCC02 100%);
  min-height: 85vh;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.HeroSection::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" patternUnits="userSpaceOnUse" width="100" height="100"><filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23noiseFilter)" opacity="0.1"/></pattern></defs><rect width="100%" height="100%" fill="url(%23grain)"/></svg>');
  opacity: 0.3;
}

.HeroSection__Container {
  position: relative;
  z-index: 2;
  height: 100%;
}

.HeroSection__Content {
  color: white;
  padding: 2rem 0;
}

.HeroSection__LogoContainer {
  margin-bottom: 2rem;
  display: flex;
  justify-content: flex-start;
}

.HeroSection__Logo {
  transform: scale(1.2);
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
}

.HeroSection__Title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  line-height: 1.2;
}

.HeroSection__Brand {
  color: #FFEB3B;
  text-shadow: 0 0 20px rgba(255, 235, 59, 0.5);
}

.HeroSection__Subtitle {
  font-size: 1.4rem;
  margin-bottom: 2rem;
  line-height: 1.6;
  opacity: 0.95;
  max-width: 600px;
}

.HeroSection__QuickActions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 2rem;
}

.HeroSection__QuickBtn {
  font-weight: 600;
  letter-spacing: 0.5px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.HeroSection__QuickBtn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.HeroSection__ImageContainer {
  position: relative;
}

.HeroSection__MainImage {
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  transform: rotate(-2deg);
  transition: transform 0.3s ease;
  height: 500px;
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
}

.HeroSection__MainImage:hover {
  transform: rotate(0deg) scale(1.02);
}

.HeroSection__FloatingElements {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.HeroSection__FloatingElement {
  position: absolute;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  padding: 1rem;
  backdrop-filter: blur(10px);
  animation: float 3s ease-in-out infinite;
}

.HeroSection__FloatingElement--1 {
  top: 10%;
  right: 10%;
  animation-delay: 0s;
}

.HeroSection__FloatingElement--2 {
  bottom: 20%;
  left: 10%;
  animation-delay: 1s;
}

.HeroSection__FloatingElement--3 {
  top: 50%;
  right: 5%;
  animation-delay: 2s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .HeroSection__Title {
    font-size: 2.5rem;
  }
  
  .HeroSection__Subtitle {
    font-size: 1.2rem;
  }
  
  .HeroSection__QuickActions {
    flex-direction: column;
  }
  
  .HeroSection__QuickBtn {
    width: 100%;
  }
  
  .HeroSection__MainImage {
    height: 350px;
  }
}

@media (max-width: 480px) {
  .HeroSection__Title {
    font-size: 2rem;
  }
  
  .HeroSection {
    min-height: 70vh;
  }
  
  .HeroSection__MainImage {
    height: 280px;
  }
}
</style>