<template>
  <section class="TutorialIA">
    <v-container>
      <div class="TutorialIA__Header">
        <h2 class="TutorialIA__Title">¿Cómo puede ayudarte MarIAno?</h2>
      </div>

      <v-row class="TutorialIA__Features">
        <v-col cols="12" md="6" lg="3" v-for="(feature, index) in features" :key="index">
          <v-card 
            class="TutorialIA__FeatureCard h-100" 
            elevation="3"
            rounded="xl"
          >
            <v-card-text class="TutorialIA__FeatureContent">
              <div class="TutorialIA__FeatureIcon">
                <v-icon :color="feature.color" size="48">{{ feature.icon }}</v-icon>
              </div>
              <h3 class="TutorialIA__FeatureTitle">{{ feature.title }}</h3>
              <p class="TutorialIA__FeatureDescription">{{ feature.description }}</p>
              
              <div class="TutorialIA__FeatureExamples">
                <h4>Ejemplos de preguntas:</h4>
                <ul>
                  <li v-for="example in feature.examples" :key="example">{{ example }}</li>
                </ul>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Sección de consejos -->
      <div class="TutorialIA__Tips">
        <v-card class="TutorialIA__TipsCard" color="cyan-lighten-5" rounded="xl">
          <v-card-text class="pa-6">
            <div class="d-flex align-center mb-4">
              <v-icon color="cyan" size="large" class="mr-3">mdi-lightbulb-on</v-icon>
              <h3 class="TutorialIA__TipsTitle">Consejos para obtener mejores respuestas</h3>
            </div>
            
            <v-row>
              <v-col cols="12" md="4" v-for="(tip, index) in tips" :key="index">
                <div class="TutorialIA__Tip">
                  <div class="TutorialIA__TipIcon">
                    <v-icon color="cyan" size="small">{{ tip.icon }}</v-icon>
                  </div>
                  <div class="TutorialIA__TipContent">
                    <h4>{{ tip.title }}</h4>
                    <p>{{ tip.description }}</p>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </div>
    </v-container>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const features = ref([
  {
    icon: 'mdi-compass',
    color: 'blue',
    title: 'Navegación',
    description: 'Te ayudo a moverte por AcademIQ y encontrar lo que necesitas.',
    examples: [
      '¿Cómo accedo a mis cursos?',
      '¿Dónde encuentro los videos favoritos?',
      '¿Cómo cambio mi perfil?'
    ]
  },
  {
    icon: 'mdi-school',
    color: 'green',
    title: 'Cursos y Aprendizaje',
    description: 'Información sobre cursos, videos, quizzes y todo el contenido educativo.',
    examples: [
      '¿Cómo me inscribo en un curso?',
      '¿Qué tipos de quizzes hay?',
      '¿Puedo descargar los videos?'
    ]
  },
  {
    icon: 'mdi-account-group',
    color: 'orange',
    title: 'Comunidad',
    description: 'Todo sobre profesores, estudiantes y la interacción en la plataforma.',
    examples: [
      '¿Cómo contacto con un profesor?',
      '¿Puedo comentar en los videos?',
      '¿Cómo me convierto en profesor?'
    ]
  },
  {
    icon: 'mdi-tools',
    color: 'purple',
    title: 'Problemas Técnicos',
    description: 'Soluciones para errores, problemas de acceso y configuración.',
    examples: [
      'No puedo reproducir un video',
      'Olvidé mi contraseña',
      'El quiz no se carga correctamente'
    ]
  }
]);

const tips = ref([
  {
    icon: 'mdi-message-text-outline',
    title: 'Sé específico',
    description: 'Describe tu problema o pregunta con el mayor detalle posible.'
  },
  {
    icon: 'mdi-format-list-bulleted',
    title: 'Una pregunta a la vez',
    description: 'Es mejor hacer preguntas individuales para respuestas más precisas.'
  },
  {
    icon: 'mdi-chat-question',
    title: 'Usa palabras clave',
    description: 'Incluye términos como "curso", "video", "quiz", "perfil", etc.'
  }
]);

const faqs = ref([
  {
    question: '¿MarIAno tiene acceso a mi información personal?',
    answer: 'No, MarIAno solo puede ayudarte con información general sobre AcademIQ. No tiene acceso a tus datos personales, calificaciones o información privada.'
  },
  {
    question: '¿Las conversaciones quedan guardadas?',
    answer: 'Las conversaciones se mantienen durante tu sesión actual para contexto, pero no se almacenan permanentemente por motivos de privacidad.'
  },
  {
    question: '¿Qué hago si MarIAno no puede resolver mi problema?',
    answer: 'Deberias probar a a reformular la pregunta , probablemente MarIAno no te haya entendido.'
  },
  {
    question: '¿MarIAno está disponible 24/7?',
    answer: 'Sí, MarIAno está disponible en cualquier momento mientras tengas acceso a AcademIQ. Es tu asistente virtual siempre listo para ayudar.'
  }
]);
</script>

<style scoped>
.TutorialIA {
  padding: 80px 0;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.TutorialIA__Header {
  text-align: center;
  margin-bottom: 60px;
}

.TutorialIA__Title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1rem;
}

.TutorialIA__Subtitle {
  font-size: 1.2rem;
  color: #666;
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
}

.TutorialIA__Features {
  margin-bottom: 60px;
}

.TutorialIA__FeatureCard {
  border: 1px solid rgba(0, 188, 212, 0.2);
  transition: all 0.3s ease;
}

.TutorialIA__FeatureCard:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 188, 212, 0.15);
  border-color: rgba(0, 188, 212, 0.4);
}

.TutorialIA__FeatureContent {
  text-align: center;
  padding: 2rem;
}

.TutorialIA__FeatureIcon {
  margin-bottom: 1.5rem;
}

.TutorialIA__FeatureTitle {
  font-size: 1.3rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
}

.TutorialIA__FeatureDescription {
  color: #666;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.TutorialIA__FeatureExamples {
  text-align: left;
  background: rgba(0, 188, 212, 0.05);
  padding: 1rem;
  border-radius: 12px;
  border-left: 4px solid #00BCD4;
}

.TutorialIA__FeatureExamples h4 {
  font-size: 0.9rem;
  font-weight: 600;
  color: #00BCD4;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.TutorialIA__FeatureExamples ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.TutorialIA__FeatureExamples li {
  padding: 0.25rem 0;
  color: #555;
  font-size: 0.9rem;
  position: relative;
  padding-left: 1rem;
}

.TutorialIA__FeatureExamples li::before {
  content: '•';
  color: #00BCD4;
  position: absolute;
  left: 0;
  font-weight: bold;
}

.TutorialIA__Tips {
  margin-bottom: 60px;
}

.TutorialIA__TipsCard {
  border: 1px solid rgba(0, 188, 212, 0.2);
}

.TutorialIA__TipsTitle {
  color: #00BCD4;
  font-weight: 600;
}

.TutorialIA__Tip {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.TutorialIA__TipIcon {
  background: rgba(0, 188, 212, 0.1);
  border-radius: 50%;
  padding: 0.5rem;
  flex-shrink: 0;
}

.TutorialIA__TipContent h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.25rem;
}

.TutorialIA__TipContent p {
  font-size: 0.875rem;
  color: #666;
  margin: 0;
  line-height: 1.4;
}

.TutorialIA__FAQ {
  margin-bottom: 40px;
}

.TutorialIA__FAQTitle {
  text-align: center;
  font-size: 2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 2rem;
}

.TutorialIA__FAQPanels {
  max-width: 800px;
  margin: 0 auto;
}

.TutorialIA__FAQPanel {
  margin-bottom: 1rem;
  border-radius: 12px;
  overflow: hidden;
}

.TutorialIA__FAQQuestion {
  font-weight: 500;
  background: rgba(0, 188, 212, 0.05);
}

.TutorialIA__FAQAnswer {
  color: #555;
  line-height: 1.6;
}

/* Animaciones */
.TutorialIA__FeatureCard {
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

/* Responsive */
@media (max-width: 768px) {
  .TutorialIA {
    padding: 60px 0;
  }
  
  .TutorialIA__Title {
    font-size: 2rem;
  }
  
  .TutorialIA__FeatureContent {
    padding: 1.5rem;
  }
}
</style>