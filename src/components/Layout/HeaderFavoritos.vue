<!-- src/components/Favoritos/HeaderFavoritos.vue -->
<script setup lang="ts">
import { computed } from 'vue';
import { useUsuarioLogeadoStore } from '@/stores/UsuarioLogeado';
import UserAvatar from '@/components/UserAvatar.vue';

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
    class="HeaderFavoritos"
    height="70"
    sticky
  >
    <!-- Botón menú -->
    <v-btn 
      icon 
      @click="toggleSidebar" 
      class="HeaderFavoritos__MenuBtn"
      color="pink"
      variant="text"
    >
      <v-icon>mdi-menu</v-icon>
    </v-btn>
    
    <!-- Logo y título -->
    <div class="HeaderFavoritos__Logo d-flex align-center">
      <v-icon color="pink" size="x-large" class="mr-2">mdi-heart</v-icon>
      <div class="d-flex flex-column d-none d-sm-flex">
        <span class="text-h6 font-weight-bold text-pink">Favoritos</span>
        <span class="text-caption text-grey-darken-1">Comunidad AcademIQ</span>
      </div>
    </div>
    
    <v-spacer></v-spacer>
    
    <!-- Botón de perfil con UserAvatar -->
    <div class="HeaderFavoritos__ProfileSection">
      <v-btn 
        variant="text"
        to="/perfil"
        class="HeaderFavoritos__ProfileBtn"
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

<style scoped>
.HeaderFavoritos {
  border-bottom: 2px solid rgba(255, 0, 200, 0.2) !important;
}

.HeaderFavoritos__MenuBtn {
  margin-right: 16px;
}

.HeaderFavoritos__Logo {
  min-width: 200px;
  margin-right: 25px;
}

.HeaderFavoritos__FilterMenu {
  background: white;
  border: 1px solid rgba(255, 0, 200, 0.2);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(255, 152, 0, 0.15);
}

.HeaderFavoritos__Filters .v-btn {
  border-color: rgba(255, 0, 221, 0.5);
}

.HeaderFavoritos__Filters .v-btn:hover {
  background-color: rgba(255, 152, 0, 0.1);
}

/* Responsive mejorado */
@media (max-width: 768px) {
  .HeaderFavoritos__Logo {
    min-width: 160px;
    margin-right: 15px;
  }
  
  .HeaderFavoritos__ProfileSection {
    padding-right: 15px;
  }
}

@media (max-width: 600px) {
  .HeaderFavoritos__Logo {
    min-width: 60px;
    margin-right: 10px;
  }
  
  .HeaderFavoritos__ProfileSection {
    padding-right: 10px;
  }
}

/* Animaciones */
.HeaderFavoritos__MenuBtn {
  transition: transform 0.2s ease;
}

.HeaderFavoritos__MenuBtn:hover {
  transform: scale(1.1);
}

/* AVATAR DE PERFIL - 25px de la derecha */
.HeaderFavoritos__ProfileSection {
  padding-right: 25px;
}

.HeaderFavoritos__ProfileBtn {
  border-radius: 50%;
  min-width: 40px;
  width: 40px;
  height: 40px;
  padding: 0;
  transition: all 0.2s ease;
}

.HeaderFavoritos__ProfileBtn:hover {
  background: rgba(233, 30, 99, 0.1);
  transform: scale(1.05);
}
</style>