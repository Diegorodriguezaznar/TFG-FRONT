<script setup lang="ts">
import { ref } from 'vue';
import { useUsuarioLogeadoStore } from '@/stores/UsuarioLogeado';
import UserAvatar from '@/components/UserAvatar.vue';

const searchQuery = ref('');
const usuarioStore = useUsuarioLogeadoStore();

const emit = defineEmits(['toggle-sidebar', 'update-search']);

const toggleSidebar = () => {
  emit('toggle-sidebar');
};

const updateSearch = () => {
  emit('update-search', searchQuery.value);
};
</script>

<template>
  <v-app-bar app color="white" elevation="1" class="Header">
    <v-btn icon @click="toggleSidebar" class="Header__btn-menu">
      <v-icon>mdi-menu</v-icon>
    </v-btn>
    
    <div class="Header__logo">
      <v-icon color="orange" size="x-large" class="Header__icono">mdi-play-box</v-icon>
      <span class="Header__texto">AcademIQ Play</span>
    </div>
    
    <v-text-field
      v-model="searchQuery"
      density="compact"
      variant="outlined"
      hide-details
      placeholder="Buscar videos..."
      append-inner-icon="mdi-magnify"
      @click:append-inner="updateSearch"
      @keyup.enter="updateSearch"
      class="Header__buscador"
      bg-color="grey-lighten-4"
    />
    
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
}

.Header__Logo {
  display: flex;
  align-items: center;
  min-width: 140px;
  margin-right: 16px;
}

.Header__Buscador {
  max-width: 600px;
  flex-grow: 1;
  margin: 0 16px;
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
  .Header__Buscador {
    margin: 0 8px;
  }
  
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