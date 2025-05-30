<template>
  <section class="HeroIA">
    <v-container class="HeroIA__Container">
      <v-row align="center" class="fill-height">
        <v-col cols="12" md="6" class="HeroIA__Content">
          <div class="HeroIA__Badge">
            <v-chip color="cyan" variant="elevated" size="large" class="HeroIA__BetaChip">
              <v-icon start>mdi-robot-excited</v-icon>
              MarIAno IA - Beta
            </v-chip>
          </div>
          
          <h1 class="HeroIA__Title">
            Conoce a <span class="HeroIA__Brand">MarIAno</span>
          </h1>
          <p class="HeroIA__Subtitle">
            Tu asistente inteligente especializado en AcademIQ. MarIAno está aquí para ayudarte 
            con todas tus dudas sobre la plataforma, desde navegar por los cursos hasta 
            resolver problemas técnicos.
          </p>
          
          <div class="HeroIA__Stats">
            <div class="HeroIA__Stat">
              <v-icon color="cyan" size="large">mdi-lightning-bolt</v-icon>
              <div class="HeroIA__StatContent">
                <h3>Respuestas Instantáneas</h3>
                <p>Obtén ayuda al momento</p>
              </div>
            </div>
            <div class="HeroIA__Stat">
              <v-icon color="cyan" size="large">mdi-brain</v-icon>
              <div class="HeroIA__StatContent">
                <h3>Conocimiento Especializado</h3>
                <p>Experto en AcademIQ</p>
              </div>
            </div>
          </div>
          
          <v-btn 
            color="cyan" 
            size="x-large" 
            variant="elevated"
            @click="$emit('scroll-to-chat')"
            class="HeroIA__ChatBtn"
          >
            <v-icon start>mdi-chat</v-icon>
            Iniciar Conversación
          </v-btn>
        </v-col>
        
        <v-col cols="12" md="6" class="text-center">
          <div class="HeroIA__AvatarContainer">
            <div class="HeroIA__AvatarGlow">
              <v-avatar size="200" color="cyan" class="HeroIA__Avatar">
                <v-icon color="white" size="120">mdi-robot-happy</v-icon>
              </v-avatar>
            </div>
            
            <!-- Elementos flotantes -->
            <div class="HeroIA__FloatingElements">
              <div class="HeroIA__FloatingElement HeroIA__FloatingElement--1">
                <v-icon color="cyan">mdi-help-circle</v-icon>
              </div>
              <div class="HeroIA__FloatingElement HeroIA__FloatingElement--2">
                <v-icon color="cyan">mdi-lightbulb-on</v-icon>
              </div>
              <div class="HeroIA__FloatingElement HeroIA__FloatingElement--3">
                <v-icon color="cyan">mdi-message-text</v-icon>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup lang="ts">
// Emits
defineEmits<{
  'scroll-to-chat': [];
}>();
</script>

<style scoped>
.HeroIA {
  background: linear-gradient(135deg, #00BCD4 0%, #00ACC1 50%, #0097A7 100%);
  min-height: 70vh;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  color: white;
}

.HeroIA::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="circuit" patternUnits="userSpaceOnUse" width="40" height="40"><path d="M10 10h20v20h-20z" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/><circle cx="20" cy="20" r="2" fill="rgba(255,255,255,0.2)"/></pattern></defs><rect width="100%" height="100%" fill="url(%23circuit)"/></svg>');
  opacity: 0.3;
}

.HeroIA__Container {
  position: relative;
  z-index: 2;
}

.HeroIA__Badge {
  margin-bottom: 1.5rem;
}

.HeroIA__BetaChip {
  font-weight: 600;
  letter-spacing: 0.5px;
}

.HeroIA__Title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  line-height: 1.2;
}

.HeroIA__Brand {
  color: #E0F7FA;
  text-shadow: 0 0 20px rgba(224, 247, 250, 0.5);
}

.HeroIA__Subtitle {
  font-size: 1.3rem;
  margin-bottom: 2rem;
  line-height: 1.6;
  opacity: 0.95;
  max-width: 500px;
}

.HeroIA__Stats {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.HeroIA__Stat {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.HeroIA__StatContent h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
}

.HeroIA__StatContent p {
  font-size: 0.9rem;
  margin: 0;
  opacity: 0.8;
}

.HeroIA__ChatBtn {
  font-weight: 600;
  letter-spacing: 0.5px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.HeroIA__ChatBtn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.HeroIA__AvatarContainer {
  position: relative;
}

.HeroIA__AvatarGlow {
  position: relative;
  display: inline-block;
}

.HeroIA__AvatarGlow::before {
  content: '';
  position: absolute;
  top: -20px;
  left: -20px;
  right: -20px;
  bottom: -20px;
  background: radial-gradient(circle, rgba(0, 188, 212, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  animation: glow 2s ease-in-out infinite alternate;
}

.HeroIA__Avatar {
  position: relative;
  z-index: 2;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease;
}

.HeroIA__Avatar:hover {
  transform: scale(1.05);
}

.HeroIA__FloatingElements {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.HeroIA__FloatingElement {
  position: absolute;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  padding: 0.8rem;
  backdrop-filter: blur(10px);
  animation: float 3s ease-in-out infinite;
}

.HeroIA__FloatingElement--1 {
  top: 15%;
  right: 15%;
  animation-delay: 0s;
}

.HeroIA__FloatingElement--2 {
  bottom: 25%;
  left: 15%;
  animation-delay: 1s;
}

.HeroIA__FloatingElement--3 {
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
  .HeroIA__Title {
    font-size: 2.5rem;
  }
  
  .HeroIA__Subtitle {
    font-size: 1.1rem;
  }
  
  .HeroIA__Stats {
    margin-bottom: 1.5rem;
  }
  
  .HeroIA__Avatar {
    width: 150px;
    height: 150px;
  }
  
  .HeroIA__Avatar .v-icon {
    font-size: 90px;
  }
}
</style>