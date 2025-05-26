<template>
  <div class="convertirse-profesor">
    <!-- Hero Section -->
    <v-container fluid class="hero-section">
      <v-row justify="center" align="center" class="text-center">
        <v-col cols="12" md="8">
          <h1 class="hero-title">
            <v-icon class="mr-3" color="primary" size="48">mdi-school</v-icon>
            Conviértete en Profesor
          </h1>
          <p class="hero-subtitle">
            Únete a nuestra comunidad educativa y comparte tu conocimiento con estudiantes de todo el mundo
          </p>
        </v-col>
      </v-row>
    </v-container>

    <!-- Steps Section -->
    <v-container class="steps-section">
      <v-row justify="center">
        <v-col cols="12" md="10">
          <h2 class="section-title text-center mb-8">¿Cómo convertirse en profesor?</h2>
          
          <v-stepper 
            v-model="currentStep" 
            alt-labels 
            class="custom-stepper"
            elevation="0"
          >
            <v-stepper-header>
              <v-stepper-item 
                v-for="(step, index) in steps" 
                :key="index"
                :complete="currentStep > index + 1"
                :value="index + 1"
                :color="currentStep === index + 1 ? 'primary' : 'grey'"
              >
                <template v-slot:icon>
                  <v-icon>{{ step.icon }}</v-icon>
                </template>
                {{ step.title }}
              </v-stepper-item>
            </v-stepper-header>

            <v-stepper-window>
              <v-stepper-window-item 
                v-for="(step, index) in steps" 
                :key="index"
                :value="index + 1"
              >
                <v-card class="step-card" elevation="2">
                  <v-card-text class="pa-6">
                    <div class="step-content">
                      <v-avatar class="step-avatar mb-4" size="80" color="primary">
                        <v-icon size="40" color="white">{{ step.icon }}</v-icon>
                      </v-avatar>
                      <h3 class="step-title mb-3">{{ step.title }}</h3>
                      <p class="step-description">{{ step.description }}</p>
                      <v-chip-group class="mt-4">
                        <v-chip 
                          v-for="requirement in step.requirements" 
                          :key="requirement"
                          color="primary" 
                          variant="outlined"
                          size="small"
                        >
                          {{ requirement }}
                        </v-chip>
                      </v-chip-group>
                    </div>
                  </v-card-text>
                </v-card>
              </v-stepper-window-item>
            </v-stepper-window>

            <v-stepper-actions>
              <template v-slot:prev>
                <v-btn 
                  v-if="currentStep > 1"
                  variant="outlined"
                  @click="currentStep--"
                  prepend-icon="mdi-chevron-left"
                >
                  Anterior
                </v-btn>
              </template>
              
              <template v-slot:next>
                <v-btn 
                  v-if="currentStep < steps.length"
                  color="primary"
                  @click="currentStep++"
                  append-icon="mdi-chevron-right"
                >
                  Siguiente
                </v-btn>
              </template>
            </v-stepper-actions>
          </v-stepper>
        </v-col>
      </v-row>
    </v-container>

    <!-- Benefits Section -->
    <v-container fluid class="benefits-section">
      <v-container>
        <v-row justify="center">
          <v-col cols="12" md="10">
            <h2 class="section-title text-center mb-8 white--text">Beneficios de ser profesor</h2>
            <v-row>
              <v-col 
                v-for="(benefit, index) in benefits" 
                :key="index"
                cols="12" 
                md="4"
              >
                <v-card class="benefit-card h-100" elevation="4">
                  <v-card-text class="text-center pa-6">
                    <v-avatar size="60" color="primary" class="mb-4">
                      <v-icon size="30" color="white">{{ benefit.icon }}</v-icon>
                    </v-avatar>
                    <h4 class="benefit-title mb-3">{{ benefit.title }}</h4>
                    <p class="benefit-description">{{ benefit.description }}</p>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-container>

    <!-- CTA Section -->
    <v-container class="cta-section">
      <v-row justify="center">
        <v-col cols="12" md="8" class="text-center">
          <v-card class="cta-card" elevation="8">
            <v-card-text class="pa-8">
              <v-icon size="60" color="primary" class="mb-4">mdi-rocket-launch</v-icon>
              <h2 class="cta-title mb-4">¿Listo para comenzar?</h2>
              <p class="cta-description mb-6">
                Envía tu solicitud ahora y únete a nuestra comunidad de educadores profesionales
              </p>
              <v-btn 
                color="primary" 
                size="x-large"
                elevation="4"
                class="cta-button"
                @click="openModal"
              >
                <v-icon left>mdi-account-star</v-icon>
                Conviértete en Profesor
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Modal Component -->
    <ModalSolicitudProfesor 
      :dialog="showModal" 
      @close="closeModal"
      @success="handleSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ModalSolicitudProfesor from '@/components/ModalSolicitudProfesor.vue'

const currentStep = ref(1)
const showModal = ref(false)

const steps = [
  {
    title: 'Preparación',
    icon: 'mdi-file-document',
    description: 'Reúne toda la documentación necesaria que certifique tu experiencia y formación académica como profesor.',
    requirements: ['Título universitario', 'Certificaciones', 'CV actualizado']
  },
  {
    title: 'Solicitud',
    icon: 'mdi-send',
    description: 'Completa el formulario de solicitud con tus datos personales, documentación y motivación para ser profesor.',
    requirements: ['Formulario completo', 'Documentos adjuntos', 'Carta de motivación']
  },
  {
    title: 'Revisión',
    icon: 'mdi-account-search',
    description: 'Nuestro equipo revisará tu solicitud y documentación para evaluar tu idoneidad como profesor.',
    requirements: ['Verificación de documentos', 'Evaluación de perfil', 'Proceso de validación']
  },
  {
    title: 'Aprobación',
    icon: 'mdi-check-circle',
    description: 'Una vez aprobada tu solicitud, recibirás acceso completo a las herramientas de profesor.',
    requirements: ['Acceso a dashboard', 'Creación de cursos', 'Gestión de estudiantes']
  }
]

const benefits = [
  {
    icon: 'mdi-currency-usd',
    title: 'Ingresos Flexibles',
    description: 'Genera ingresos adicionales enseñando en tu tiempo libre con total flexibilidad horaria.'
  },
  {
    icon: 'mdi-earth',
    title: 'Alcance Global',
    description: 'Conecta con estudiantes de todo el mundo y expande tu impacto educativo sin límites.'
  },
  {
    icon: 'mdi-brain',
    title: 'Desarrollo Profesional',
    description: 'Mejora tus habilidades de enseñanza y mantente actualizado en tu área de expertise.'
  }
]

const openModal = () => {
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const handleSuccess = () => {
  showModal.value = false
  // Aquí puedes agregar lógica adicional como mostrar un mensaje de éxito
}
</script>

<style lang="scss" scoped>
.convertirse-profesor {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4rem 0;
  
  .hero-title {
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 1rem;
    text-shadow: 0 2px 4px rgba(0,0,0,0.3);
  }
  
  .hero-subtitle {
    font-size: 1.25rem;
    opacity: 0.9;
    max-width: 600px;
    margin: 0 auto;
  }
}

.steps-section {
  padding: 4rem 0;
  
  .section-title {
    font-size: 2.5rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 3rem;
  }
  
  .custom-stepper {
    background: transparent !important;
    box-shadow: none !important;
  }
  
  .step-card {
    border-radius: 16px;
    border: 2px solid transparent;
    transition: all 0.3s ease;
    
    &:hover {
      border-color: #667eea;
      transform: translateY(-4px);
    }
  }
  
  .step-content {
    text-align: center;
    
    .step-avatar {
      margin: 0 auto;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }
    
    .step-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #333;
    }
    
    .step-description {
      font-size: 1rem;
      color: #666;
      line-height: 1.6;
    }
  }
}

.benefits-section {
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  padding: 4rem 0;
  
  .section-title {
    color: white;
    font-size: 2.5rem;
    font-weight: 600;
  }
  
  .benefit-card {
    border-radius: 16px;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 24px rgba(0,0,0,0.15);
    }
    
    .benefit-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #333;
    }
    
    .benefit-description {
      color: #666;
      line-height: 1.6;
    }
  }
}

.cta-section {
  padding: 4rem 0;
  
  .cta-card {
    border-radius: 24px;
    background: linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%);
    
    .cta-title {
      font-size: 2rem;
      font-weight: 700;
      color: #333;
    }
    
    .cta-description {
      font-size: 1.1rem;
      color: #666;
      line-height: 1.6;
    }
    
    .cta-button {
      font-size: 1.1rem;
      font-weight: 600;
      padding: 16px 32px;
      border-radius: 12px;
      text-transform: none;
      box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
      }
    }
  }
}

// Responsive adjustments
@media (max-width: 768px) {
  .hero-section {
    .hero-title {
      font-size: 2rem;
    }
    
    .hero-subtitle {
      font-size: 1rem;
    }
  }
  
  .section-title {
    font-size: 2rem !important;
  }
  
  .cta-section {
    .cta-title {
      font-size: 1.5rem;
    }
  }
}
</style>