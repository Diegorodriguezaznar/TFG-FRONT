<template>
  <v-app>
    <Header @toggle-sidebar="drawer = !drawer" @update-search="searchQuery = $event" />
    
    <Sidebar v-model="drawer" />

    <v-main class="HomePage">
      <HeroSection :nombre-usuario="nombreUsuario" @navegar="navegarA" />

      <FuncionalidadesPrincipales @navegar="navegarA" />

      <FuncionalidadesAdicionales @navegar="navegarA" />

      <EstadisticasSection />

      <CallToActionSection @navegar="navegarA" />
    </v-main>

    <Footer />
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUsuarioLogeadoStore } from '@/stores/UsuarioLogeado';

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