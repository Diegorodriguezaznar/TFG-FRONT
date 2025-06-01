<template>
  <section class="hero-ia">
    <v-container class="hero-ia__container">
      <v-row align="center" class="fill-height">
        <v-col cols="12" md="6" class="hero-ia__content">
          <div class="hero-ia__badge">
          </div>
          
          <h1 class="hero-ia__title">
            Conoce a <span class="hero-ia__brand">MarIAno</span>
          </h1>
          <p class="hero-ia__subtitle">
            Tu asistente inteligente especializado en AcademIQ. MarIAno está aquí para ayudarte 
            con todas tus dudas sobre la plataforma, desde navegar por los cursos hasta 
            resolver problemas técnicos.
          </p>
          
          <v-btn 
            color="cyan" 
            size="x-large" 
            variant="elevated"
            @click="$emit('scroll-to-chat')"
            class="hero-ia__chat-btn"
          >
            <v-icon start>mdi-chat</v-icon>
            Iniciar Conversación
          </v-btn>
        </v-col>
        
        <v-col cols="12" md="6" class="text-center">
          <div class="hero-ia__avatar-container">
            <div class="hero-ia__avatar-glow">
              <v-avatar size="200" color="cyan" class="hero-ia__avatar">
                <v-icon color="white" size="120">mdi-robot-happy</v-icon>
              </v-avatar>
            </div>
            
            <div class="hero-ia__floating-elements">
              <div class="hero-ia__floating-element hero-ia__floating-element--1">
                <v-icon color="cyan">mdi-help-circle</v-icon>
              </div>
              <div class="hero-ia__floating-element hero-ia__floating-element--2">
                <v-icon color="cyan">mdi-lightbulb-on</v-icon>
              </div>
              <div class="hero-ia__floating-element hero-ia__floating-element--3">
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
defineEmits<{
  'scroll-to-chat': [];
}>();
</script>

<style lang="scss" scoped>
@import "@/assets/sass/components/ChatIA/HeroSectionIA";
</style>