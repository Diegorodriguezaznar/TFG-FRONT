<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script setup>
import { onMounted } from 'vue';
import { useUsuarioLogeadoStore } from '@/stores/UsuarioLogeado';

const usuarioLogeadoStore = useUsuarioLogeadoStore();

onMounted(() => {
  // Cargar los datos del usuario desde localStorage al iniciar la aplicación
  usuarioLogeadoStore.cargarUsuarioDesdeStorage();
  
  // Verificar si se cargó correctamente
  if (usuarioLogeadoStore.estaAutenticado) {
    console.log('Usuario autenticado desde localStorage:', usuarioLogeadoStore.usuarioActual);
  } else {
    console.log('No hay usuario autenticado en localStorage');
  }
});
</script>