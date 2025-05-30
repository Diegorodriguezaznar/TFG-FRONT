<script setup lang="ts">
import { useUsuarioLogeadoStore } from '@/stores/UsuarioLogeado';
import UserAvatar from '@/components/UserAvatar.vue';

const usuarioStore = useUsuarioLogeadoStore();

const emit = defineEmits(['toggle-sidebar']);

const toggleSidebar = () => {
  emit('toggle-sidebar');
};
</script>

<template>
  <v-app-bar app color="white" elevation="1" class="Header" flat>
    <v-btn icon @click="toggleSidebar" class="Header__btn-menu">
      <v-icon>mdi-menu</v-icon>
    </v-btn>
    
    <div class="Header__logo">
      <v-icon color="orange" size="x-large" class="Header__icono">mdi-play-box</v-icon>
      <span class="Header__texto">AcademIQ Play</span>
    </div>
    
    <!-- Spacer para empujar el avatar al extremo derecho -->
    <v-spacer></v-spacer>
    
    <!-- Avatar de usuario en el extremo derecho -->
    <div class="Header__UserSection">
      <v-btn 
        variant="text"
        to="/perfil"
        class="Header__UserButton"
      >
        <UserAvatar
          v-if="usuarioStore.usuarioActual"
          :usuario="usuarioStore.usuarioActual"
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

<style scoped>
.Header {
  padding: 0 16px;
  display: flex;
  align-items: center;
  position: sticky !important;
  top: 0 !important;
  z-index: 1000 !important;
  margin-bottom: 0 !important;
  box-shadow: none !important;
}

.Header__Logo {
  display: flex;
  align-items: center;
  min-width: 140px;
  margin-right: 16px;
}

.Header__UserSection {
  padding-right: 20px; 
}

.Header__UserButton {
  border-radius: 50%;
  min-width: 40px;
  width: 40px;
  height: 40px;
  padding: 0;
  transition: all 0.2s ease;
}

.Header__UserButton:hover {
  background: rgba(255, 152, 0, 0.1);
  transform: scale(1.05);
}

@media (max-width: 600px) {
  .Header__Logo span {
    display: none;
  }
  
  .Header__Logo {
    min-width: unset;
  }
  
  .Header__UserSection {
    padding-right: 20px; 
  }
}
</style>