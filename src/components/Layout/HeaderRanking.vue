<!-- src/components/Favoritos/HeaderFavoritos.vue -->
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
    class="HeaderFavoritos"
    height="70"
    sticky
  >
    <!-- Botón menú -->
    <v-btn 
      icon 
      @click="toggleSidebar" 
      class="HeaderFavoritos__MenuBtn"
      color="amber-darken-2"
      variant="text"
    >
      <v-icon>mdi-menu</v-icon>
    </v-btn>
    
    <!-- Logo y título -->
    <div class="HeaderFavoritos__Logo d-flex align-center">
      <v-icon color="amber-darken-2" size="x-large" class="mr-2">mdi-trophy</v-icon>
      <div class="d-flex flex-column d-none d-sm-flex">
        <span class="text-h6 font-weight-bold text-amber-darken-2">Ranking</span>
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
  border-bottom: 2px solid rgba(229, 255, 0, 0.2) !important;
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
  border: 1px solid rgba(238, 255, 0, 0.2);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(255, 251, 0, 0.15);
}

.HeaderFavoritos__Filters .v-btn {
  border-color: rgba(255, 208, 0, 0.5);
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

.HeaderFavoritos__MenuBtn {
  transition: transform 0.2s ease;
}

.HeaderFavoritos__MenuBtn:hover {
  transform: scale(1.1);
}

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
  background: rgba(220, 233, 30, 0.1);
  transform: scale(1.05);
}
</style>