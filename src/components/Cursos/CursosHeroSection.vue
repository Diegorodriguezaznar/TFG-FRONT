<template>
  <section class="CursosHero">
    <v-container class="CursosHero__Container">
      <v-row align="center" class="fill-height">
        <v-col cols="12" md="6" class="CursosHero__Content">
          <div class="CursosHero__Badge">
            <v-chip color="blue" variant="elevated" size="large" class="CursosHero__Chip">
              <v-icon start>mdi-book-education</v-icon>
              Catálogo de Cursos
            </v-chip>
          </div>
          
          <h1 class="CursosHero__Title">
            Explora Nuestros <span class="CursosHero__Brand">Cursos</span>
          </h1>
          <p class="CursosHero__Subtitle">
            Descubre una amplia variedad de cursos diseñados para potenciar tu aprendizaje. 
            Guarda tus favoritos y comienza tu viaje educativo.
          </p>
        </v-col>
        
        <v-col cols="12" md="6" class="text-center">
          <div class="CursosHero__AvatarContainer">
            <div class="CursosHero__AvatarGlow">
              <v-avatar size="200" color="blue" class="CursosHero__Avatar">
                <v-icon color="white" size="120">mdi-book-education</v-icon>
              </v-avatar>
            </div>
            
            <!-- Elementos flotantes -->
            <div class="CursosHero__FloatingElements">
              <div class="CursosHero__FloatingElement CursosHero__FloatingElement--1">
                <v-icon color="blue">mdi-bookmark</v-icon>
              </div>
              <div class="CursosHero__FloatingElement CursosHero__FloatingElement--2">
                <v-icon color="blue">mdi-school</v-icon>
              </div>
              <div class="CursosHero__FloatingElement CursosHero__FloatingElement--3">
                <v-icon color="blue">mdi-certificate</v-icon>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<style scoped>
.CursosHero {
  background: linear-gradient(135deg, #2196F3 0%, #1976D2 50%, #1565C0 100%);
  min-height: 70vh;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  color: white;
}

.CursosHero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="circuit" patternUnits="userSpaceOnUse" width="40" height="40"><path d="M10 10h20v20h-20z" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/><circle cx="20" cy="20" r="2" fill="rgba(255,255,255,0.2)"/></pattern></defs><rect width="100%" height="100%" fill="url(%23circuit)"/></svg>');
  opacity: 0.3;
}

.CursosHero__Container {
  position: relative;
  z-index: 2;
}

.CursosHero__Badge {
  margin-bottom: 1.5rem;
}

.CursosHero__Chip {
  font-weight: 600;
  letter-spacing: 0.5px;
}

.CursosHero__Title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  line-height: 1.2;
}

.CursosHero__Brand {
  color: #E3F2FD;
  text-shadow: 0 0 20px rgba(227, 242, 253, 0.5);
}

.CursosHero__Subtitle {
  font-size: 1.3rem;
  margin-bottom: 2rem;
  line-height: 1.6;
  opacity: 0.95;
  max-width: 500px;
}

.CursosHero__AvatarContainer {
  position: relative;
}

.CursosHero__AvatarGlow {
  position: relative;
  display: inline-block;
}

.CursosHero__AvatarGlow::before {
  content: '';
  position: absolute;
  top: -20px;
  left: -20px;
  right: -20px;
  bottom: -20px;
  background: radial-gradient(circle, rgba(33, 150, 243, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  animation: glow 2s ease-in-out infinite alternate;
}

.CursosHero__Avatar {
  position: relative;
  z-index: 2;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease;
}

.CursosHero__Avatar:hover {
  transform: scale(1.05);
}

.CursosHero__FloatingElements {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.CursosHero__FloatingElement {
  position: absolute;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  padding: 0.8rem;
  backdrop-filter: blur(10px);
  animation: float 3s ease-in-out infinite;
}

.CursosHero__FloatingElement--1 {
  top: 15%;
  right: 15%;
  animation-delay: 0s;
}

.CursosHero__FloatingElement--2 {
  bottom: 25%;
  left: 15%;
  animation-delay: 1s;
}

.CursosHero__FloatingElement--3 {
  top: 60%;
  right: 20%;
  animation-delay: 2s;
}

@keyframes glow {
  0%, 100% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-15px);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .CursosHero__Title {
    font-size: 2.5rem;
  }
  
  .CursosHero__Subtitle {
    font-size: 1.1rem;
  }
  
  .CursosHero__Avatar {
    width: 150px;
    height: 150px;
  }
  
  .CursosHero__Avatar .v-icon {
    font-size: 90px;
  }
}
</style>