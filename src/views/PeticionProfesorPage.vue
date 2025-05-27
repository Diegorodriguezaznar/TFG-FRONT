<script setup lang="ts">
import { ref } from 'vue'
import Header from '@/components/Layout/Header.vue'
import Sidebar from '@/components/Layout/Sidebar.vue'
import ModalSolicitudProfesor from '@/components/ModalSolicitudProfesor.vue'

const drawer = ref(false)
const currentStep = ref(1)
const showModal = ref(false)

const steps = [
  {
    title: 'Documentación',
    icon: 'mdi-file-document',
    description: 'Reúne tu título universitario, CV y certificaciones.',
  },
  {
    title: 'Solicitud',
    icon: 'mdi-send',
    description: 'Completa el formulario con tus datos y motivación.',
  },
  {
    title: 'Revisión',
    icon: 'mdi-account-search',
    description: 'Evaluamos tu perfil y documentación.',
  },
  {
    title: 'Aprobación',
    icon: 'mdi-check-circle',
    description: 'Recibes acceso completo a las herramientas de profesor.',
  }
]

const benefits = [
  {
    icon: 'mdi-currency-usd',
    title: 'Ingresos Flexibles',
    description: 'Genera ingresos enseñando en tu tiempo libre.'
  },
  {
    icon: 'mdi-earth',
    title: 'Alcance Global',
    description: 'Conecta con estudiantes de todo el mundo.'
  },
  {
    icon: 'mdi-brain',
    title: 'Desarrollo Profesional',
    description: 'Mejora tus habilidades de enseñanza.'
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
}
</script>

<template>
  <v-app>
    <Header @toggle-sidebar="drawer = !drawer" />
    <Sidebar v-model="drawer" />

    <v-main class="ConvertirseProfesor">
      <v-container fluid class="ConvertirseProfesor__Hero">
        <v-row justify="center" align="center" class="ConvertirseProfesor__HeroContent">
          <v-col cols="12" md="8">
            <h1 class="ConvertirseProfesor__Title">
              <v-icon class="ConvertirseProfesor__TitleIcon" color="primary" size="48">mdi-school</v-icon>
              Conviértete en Profesor
            </h1>
            <p class="ConvertirseProfesor__Subtitle">
              Comparte tu conocimiento con estudiantes de todo el mundo
            </p>
          </v-col>
        </v-row>
      </v-container>

      <v-container class="ConvertirseProfesor__Steps">
        <v-row justify="center">
          <v-col cols="12" md="10">
            <h2 class="ConvertirseProfesor__SectionTitle">¿Cómo convertirse en profesor?</h2>

            <v-stepper v-model="currentStep" alt-labels class="ConvertirseProfesor__Stepper" elevation="0">
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
                  <v-card class="ConvertirseProfesor__StepCard" elevation="2">
                    <v-card-text class="ConvertirseProfesor__StepContent">
                      <v-avatar class="ConvertirseProfesor__StepAvatar" size="80" color="primary">
                        <v-icon size="40" color="white">{{ step.icon }}</v-icon>
                      </v-avatar>
                      <h3 class="ConvertirseProfesor__StepTitle">{{ step.title }}</h3>
                      <p class="ConvertirseProfesor__StepDescription">{{ step.description }}</p>
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
                    class="ConvertirseProfesor__StepButton"
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
                    class="ConvertirseProfesor__StepButton"
                  >
                    Siguiente
                  </v-btn>
                </template>
              </v-stepper-actions>
            </v-stepper>
          </v-col>
        </v-row>
      </v-container>

      <v-container fluid class="ConvertirseProfesor__Benefits">
        <v-container>
          <v-row justify="center">
            <v-col cols="12" md="10">
              <h2 class="ConvertirseProfesor__SectionTitle ConvertirseProfesor__SectionTitle--White">Beneficios de ser profesor</h2>
              <v-row>
                <v-col 
                  v-for="(benefit, index) in benefits" 
                  :key="index"
                  cols="12" 
                  sm="6"
                  md="4"
                >
                  <v-card class="ConvertirseProfesor__BenefitCard" elevation="4">
                    <v-card-text class="ConvertirseProfesor__BenefitContent">
                      <v-avatar size="60" color="primary" class="ConvertirseProfesor__BenefitIcon">
                        <v-icon size="30" color="white">{{ benefit.icon }}</v-icon>
                      </v-avatar>
                      <h4 class="ConvertirseProfesor__BenefitTitle">{{ benefit.title }}</h4>
                      <p class="ConvertirseProfesor__BenefitDescription">{{ benefit.description }}</p>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </v-container>

      <v-container class="ConvertirseProfesor__CTA">
        <v-row justify="center">
          <v-col cols="12" md="8">
            <v-card class="ConvertirseProfesor__CTACard" elevation="8">
              <v-card-text class="ConvertirseProfesor__CTAContent">
                <v-icon size="60" color="primary" class="ConvertirseProfesor__CTAIcon">mdi-rocket-launch</v-icon>
                <h2 class="ConvertirseProfesor__CTATitle">¿Listo para comenzar?</h2>
                <p class="ConvertirseProfesor__CTADescription">
                  Envía tu solicitud y únete a nuestra comunidad educativa
                </p>
                <v-btn 
                  color="primary" 
                  size="x-large"
                  elevation="4"
                  class="ConvertirseProfesor__CTAButton"
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

      <ModalSolicitudProfesor 
        :dialog="showModal" 
        @close="closeModal"
        @success="handleSuccess"
      />
    </v-main>
  </v-app>
</template>

<style lang="scss" scoped>
@import "@/assets/sass/pages/PeticionProfesorPage";
</style>