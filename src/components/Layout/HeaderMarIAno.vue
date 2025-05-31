<!-- src/components/MarIAno/HeaderMarIAno.vue -->
<script setup lang="ts">
import { computed } from 'vue';
import { useUsuarioLogeadoStore } from '@/stores/UsuarioLogeado';
import UserAvatar from '@/components/Common/UserAvatar.vue';

// Store
const usuarioStore = useUsuarioLogeadoStore();

// Computed
const usuarioActual = computed(() => usuarioStore.usuarioActual);

// Emits
const emit = defineEmits(['toggle-sidebar']);

// Métodos
const toggleSidebar = () => {
  emit('toggle-sidebar');
};
</script>

<template>
  <v-app-bar 
    app 
    color="white" 
    elevation="2" 
    class="header-mariano"
    height="70"
    sticky
  >
    <!-- Botón menú -->
    <v-btn 
      icon 
      @click="toggleSidebar" 
      class="header-mariano__menu-btn"
      color="cyan"
      variant="text"
    >
      <v-icon>mdi-menu</v-icon>
    </v-btn>
    
    <!-- Logo y título -->
    <div class="header-mariano__logo d-flex align-center">
      <v-icon color="cyan" size="x-large" class="mr-2">mdi-robot-happy</v-icon>
      <div class="d-flex flex-column d-none d-sm-flex">
        <span class="text-h6 font-weight-bold text-cyan">MarIAno</span>
      </div>
    </div>
    
    <v-spacer></v-spacer>
    
    <!-- Botón de perfil con UserAvatar -->
    <div class="header-mariano__profile-section">
      <v-btn 
        variant="text"
        to="/perfil"
        class="header-mariano__profile-btn"
      >
        <UserAvatar
          v-if="usuarioActual"
          :usuario="usuarioActual"
          :size="32"
        />
        <UserAvatar
          v-else
          :nombre="'Invitado'"
          :id-rol="1"
          :size="32"
        />
      </v-btn>
    </div>
  </v-app-bar>
</template>

<style lang="scss" scoped>
@import "@/assets/sass/layout/HeaderMarIAno";
</style>