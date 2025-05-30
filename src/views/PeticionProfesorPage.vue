<script setup lang="ts">
import { ref } from 'vue'
import Header from '@/components/Layout/Header.vue'
import Sidebar from '@/components/Layout/Sidebar.vue'
import ModalSolicitudProfesor from '@/components/Common/ModalSolicitudProfesor.vue'

const drawer = ref(false)
const currentStep = ref(1)
const showModal = ref(false)


const benefits = [
  {
    icon: 'mdi-plus',
    title: 'Creacion de cursos',
    description: 'Crea tus propios cursos.'
  },
  {
    icon: 'mdi-video',
    title: 'Videos y Quizzes',
    description: 'Sube videos y quizes en tus cursos.'
  },
  {
    icon: 'mdi-trophy',
    title: 'Compite con otros profesores',
    description: 'Compite por ver quien sube mas videos.'
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
              <v-icon class="ConvertirseProfesor__TitleIcon" color="white" size="48">mdi-school</v-icon>
              Conviértete en Profesor
            </h1>
            <p class="ConvertirseProfesor__Subtitle">
              Comparte tu conocimiento con estudiantes de todo el mundo
            </p>
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
                      <v-avatar size="60" color="orange" class="ConvertirseProfesor__BenefitIcon">
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