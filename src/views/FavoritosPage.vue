<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUsuarioLogeadoStore } from '@/stores/UsuarioLogeado';
import HeaderFavoritos from '@/components/Layout/HeaderFavoritos.vue';
import BarraLateral from '@/components/Layout/Sidebar.vue';
import ListaVideosFavoritos from '@/components/ListaVideosFavoritos.vue';

const usuarioLogeadoStore = useUsuarioLogeadoStore();
const sidebarOpen = ref(true);

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};

const updateSearch = (query: string) => {
  // Búsqueda implementada en componente hijo
};

onMounted(async () => {
  await usuarioLogeadoStore.cargarUsuarioDesdeStorage();
});
</script>

<template>
  <v-app>
    <HeaderFavoritos @toggle-sidebar="toggleSidebar" @update-search="updateSearch" />
    <BarraLateral v-model="sidebarOpen" />
    
    <v-main>
      <v-container class="FavoritosPage">
        <ListaVideosFavoritos />
      </v-container>
    </v-main>
  </v-app>
</template>

<style lang="scss" scoped>
.FavoritosPage {
  padding: 1rem;

  @media (min-width: 768px) {
    padding: 1.5rem;
  }

  @media (min-width: 1024px) {
    padding: 2rem;
  }
}
</style>