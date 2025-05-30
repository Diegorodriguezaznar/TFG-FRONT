<!-- src/components/ChatIA/CTASectionIA.vue -->
<template>
  <section class="CTAIA">
    <v-container>
      <v-card class="CTAIA__Card" elevation="12" rounded="xl">
        <div class="CTAIA__Background">
          <div class="CTAIA__Content">
            <div class="text-center">
              <v-avatar size="80" color="white" class="CTAIA__Avatar mb-4">
                <v-icon color="cyan" size="50">mdi-robot-love</v-icon>
              </v-avatar>
              
              <h2 class="CTAIA__Title mb-3">
                ¿Necesitas más ayuda?
              </h2>
              <p class="CTAIA__Subtitle mb-6">
                Si MarIAno no puede resolver tu consulta, nuestro equipo de soporte está aquí para ayudarte
              </p>
              
              <div class="CTAIA__Actions">
                <v-btn
                  color="white"
                  size="x-large"
                  variant="elevated"
                  rounded="xl"
                  class="CTAIA__Button mr-4 mb-3"
                  href="mailto:soporte@academiq.com"
                >
                  <v-icon start>mdi-email</v-icon>
                  Contactar Soporte
                </v-btn>
                
                <v-btn
                  color="cyan-lighten-2"
                  size="x-large"
                  variant="elevated"
                  rounded="xl"
                  class="CTAIA__Button mb-3"
                  to="/usuarios"
                >
                  <v-icon start>mdi-account-group</v-icon>
                  Ver Profesores
                </v-btn>
              </div>
              
              <div class="CTAIA__Info mt-6">
                <div class="CTAIA__InfoGrid">
                  <div class="CTAIA__InfoItem">
                    <v-icon color="white" size="large" class="mb-2">mdi-clock-fast</v-icon>
                    <h4>Respuesta Rápida</h4>
                    <p>Respuesta en menos de 24 horas</p>
                  </div>
                  <div class="CTAIA__InfoItem">
                    <v-icon color="white" size="large" class="mb-2">mdi-account-heart</v-icon>
                    <h4>Soporte Humano</h4>
                    <p>Atención personalizada</p>
                  </div>
                  <div class="CTAIA__InfoItem">
                    <v-icon color="white" size="large" class="mb-2">mdi-shield-check</v-icon>
                    <h4>Solución Garantizada</h4>
                    <p>Resolvemos tu problema</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </v-card>
    </v-container>
  </section>
</template>

<script setup lang="ts">
// Este componente es estático, no necesita lógica
</script>

<style scoped>
.CTAIA {
  padding: 80px 0;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.CTAIA__Card {
  position: relative;
  overflow: hidden;
  max-width: 900px;
  margin: 0 auto;
}

.CTAIA__Background {
  background: linear-gradient(135deg, #00BCD4 0%, #00ACC1 50%, #0097A7 100%);
  position: relative;
}

.CTAIA__Background::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" patternUnits="userSpaceOnUse" width="20" height="20"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100%" height="100%" fill="url(%23grid)"/></svg>');
}

.CTAIA__Content {
  position: relative;
  z-index: 2;
  padding: 3rem 2rem;
  color: white;
}

.CTAIA__Avatar {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.CTAIA__Title {
  font-size: 2.5rem;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.CTAIA__Subtitle {
  font-size: 1.2rem;
  opacity: 0.95;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.CTAIA__Actions {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.CTAIA__Button {
  font-weight: 600;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.CTAIA__Button:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.CTAIA__Info {
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding-top: 2rem;
}

.CTAIA__InfoGrid {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 2rem;
}

.CTAIA__InfoItem {
  text-align: center;
  flex: 1;
  min-width: 150px;
}

.CTAIA__InfoItem h4 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.CTAIA__InfoItem p {
  font-size: 0.9rem;
  opacity: 0.9;
  margin: 0;
}

/* Animaciones */
.CTAIA__Card {
  animation: slideUp 0.8s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .CTAIA {
    padding: 60px 0;
  }
  
  .CTAIA__Content {
    padding: 2rem 1rem;
  }
  
  .CTAIA__Title {
    font-size: 2rem;
  }
  
  .CTAIA__Subtitle {
    font-size: 1.1rem;
  }
  
  .CTAIA__Actions {
    flex-direction: column;
    align-items: center;
  }
  
  .CTAIA__Button {
    width: 100%;
    max-width: 300px;
  }
  
  .CTAIA__InfoGrid {
    flex-direction: column;
    gap: 1.5rem;
  }
}
</style>