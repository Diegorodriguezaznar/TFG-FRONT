<script setup lang="ts">
import { ref } from 'vue';
import Footer from '@/components/Layout/Footer.vue';
import Sidebar from '@/components/Layout/Sidebar.vue';
import HeroSectionIA from '@/components/ChatIA/HeroSectionIA.vue';
import TutorialSectionIA from '@/components/ChatIA/TutorialSectionIA.vue';
import ChatInterfaceIA from '@/components/ChatIA/ChatInterfaceIA.vue';
import HeaderMarIAno from '@/components/Layout/HeaderMarIAno.vue';

// Variables
const drawer = ref(false);
const searchQuery = ref('');
const chatInterface = ref();

// Métodos
const scrollToChat = () => {
  if (chatInterface.value) {
    chatInterface.value.scrollToChat();
  }
};
</script>

<template>
  <v-app>
    <HeaderMarIAno @toggle-sidebar="drawer = !drawer" @update-search="searchQuery = $event" />
    
    <v-main class="ChatIA">
      <Sidebar v-model="drawer" />
      
      <!-- Hero Section -->
      <HeroSectionIA @scroll-to-chat="scrollToChat" />
      
      <!-- Tutorial Section -->
      <TutorialSectionIA />
      
      <!-- Chat Interface -->
      <ChatInterfaceIA ref="chatInterface" />
      
    </v-main>

    <Footer />
  </v-app>
</template>



<style scoped>
.ChatIA {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding-top: 0 !important; 
}
</style>