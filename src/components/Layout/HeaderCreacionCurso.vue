<!-- src/components/Cursos/HeaderCursos.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue';
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
<v-app-bar app color="white" elevation="2" class="HeaderCursos" height="70" sticky>
    <!-- Botón menú -->
    <v-btn 
      icon 
      @click="toggleSidebar" 
      class="HeaderCursos__MenuBtn"
      color="blue"
      variant="text"
    >
      <v-icon>mdi-menu</v-icon>
    </v-btn>
    
    <!-- Logo y título -->
    <div class="HeaderCursos__Logo d-flex align-center">
      <v-icon color="blue" size="x-large" class="mr-2">mdi-book-open-page-variant</v-icon>
      <div class="d-flex flex-column d-none d-sm-flex">
        <span class="text-h6 font-weight-bold text-blue">Crear Curso</span>
      </div>
    </div>
    
    <v-spacer></v-spacer>
    
    <!-- Botón de perfil con UserAvatar -->
    <div class="HeaderCursos__ProfileSection">
      <v-btn 
        variant="text"
        to="/perfil"
        class="HeaderCursos__ProfileBtn"
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
.HeaderCursos {
  border-bottom: 2px solid rgba(0, 26, 255, 0.2) !important;
  position: sticky !important;
  top: 0 !important;
  z-index: 1000 !important;
}

.HeaderCursos__MenuBtn {
  margin-right: 16px;
}

.HeaderCursos__Logo {
  min-width: 200px;
  margin-right: 25px;
}

/* Responsive mejorado */
@media (max-width: 768px) {
  .HeaderCursos__Logo {
    min-width: 160px;
    margin-right: 15px;
  }
  
  .HeaderCursos__ProfileSection {
    padding-right: 15px;
  }
}

@media (max-width: 600px) {
  .HeaderCursos__Logo {
    min-width: 60px; /* Solo ícono en móvil */
    margin-right: 10px;
  }
  
  .HeaderCursos__ProfileSection {
    padding-right: 10px;
  }
}

/* Animaciones */
.HeaderCursos__MenuBtn {
  transition: transform 0.2s ease;
}

.HeaderCursos__MenuBtn:hover {
  transform: scale(1.1);
}

/* AVATAR DE PERFIL - 25px de la derecha */
.HeaderCursos__ProfileSection {
  padding-right: 25px; 
}

.HeaderCursos__ProfileBtn {
  border-radius: 50%;
  min-width: 40px;
  width: 40px;
  height: 40px;
  padding: 0;
  transition: all 0.2s ease;
}

.HeaderCursos__ProfileBtn:hover {
  background: rgba(255, 152, 0, 0.1);
  transform: scale(1.05);
}
</style>