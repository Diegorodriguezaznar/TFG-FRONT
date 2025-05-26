<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUsuarioLogeadoStore } from '@/stores/UsuarioLogeado';
import Cabecera from '@/components/Layout/Header.vue';
import BarraLateral from '@/components/Layout/Sidebar.vue';
import ListaVideosFavoritos from '@/components/ListaVideosFavoritos.vue';

const usuarioLogeadoStore = useUsuarioLogeadoStore();
const sidebarOpen = ref(true);

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};

const updateSearch = (query: string) => {
  // Podrías implementar búsqueda aquí si quisieras
};

onMounted(async () => {
  // Cargar usuario desde localStorage si no está cargado
  await usuarioLogeadoStore.cargarUsuarioDesdeStorage();
});
</script>

<template>
  <v-app>
    <!-- Cabecera -->
    <Cabecera @toggle-sidebar="toggleSidebar" @update-search="updateSearch" />
    
    <!-- Barra lateral -->
    <BarraLateral v-model="sidebarOpen" />
    
    <!-- Contenido principal -->
    <v-main>
      <v-container class="pa-4">
        <ListaVideosFavoritos />
      </v-container>
    </v-main>
  </v-app>
</template>