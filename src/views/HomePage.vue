<template>
  <v-app>
    <!-- Header -->
    <Header @toggle-sidebar="drawer = !drawer" @update-search="searchQuery = $event" />
    
    <!-- Sidebar -->
    <Sidebar v-model="drawer" />

    <!-- Contenido Principal -->
    <v-main class="HomePage">
      <!-- Hero Section -->
      <HeroSection :nombre-usuario="nombreUsuario" @navegar="navegarA" />

      <!-- Sección de Funcionalidades Principales -->
      <FuncionalidadesPrincipales @navegar="navegarA" />

      <!-- Sección de Funcionalidades Adicionales -->
      <FuncionalidadesAdicionales @navegar="navegarA" />

      <!-- Sección de Estadísticas -->
      <EstadisticasSection />

      <!-- Call to Action Final -->
      <CallToActionSection @navegar="navegarA" />
    </v-main>

    <!-- Footer -->
    <Footer />
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUsuarioLogeadoStore } from '@/stores/UsuarioLogeado';

// Componentes
import Header from '@/components/Layout/Header.vue';
import Footer from '@/components/Layout/Footer.vue';
import Sidebar from '@/components/Layout/Sidebar.vue';
import HeroSection from '@/components/HomePage/HeroSection.vue';
import FuncionalidadesPrincipales from '@/components/HomePage/FuncionalidadPrincipales.vue';
import FuncionalidadesAdicionales from '@/components/HomePage/FuncionalidadesAdicionales.vue';
import EstadisticasSection from '@/components/HomePage/EstadisticasSection.vue';
import CallToActionSection from '@/components/HomePage/CallToActionSection.vue';

// Router y stores
const router = useRouter();
const usuarioLogeadoStore = useUsuarioLogeadoStore();

// Variables
const drawer = ref(false);
const searchQuery = ref('');

// Computed
const nombreUsuario = computed(() => {
  return usuarioLogeadoStore.usuarioActual?.nombre || 'Usuario';
});

// Métodos
const navegarA = (ruta: string) => {
  router.push(ruta);
};
</script>

<style scoped>
.HomePage {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}
</style>