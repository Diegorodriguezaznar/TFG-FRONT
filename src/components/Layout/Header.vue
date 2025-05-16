<script setup lang="ts">
// --------------------------- Imports ---------------------------
import { ref } from 'vue';

// --------------------------- Variables ---------------------------
const searchQuery = ref('');

// --------------------------- Emits ---------------------------
const emit = defineEmits(['toggle-sidebar', 'update-search']);

// --------------------------- Métodos ---------------------------
const toggleSidebar = () => {
  emit('toggle-sidebar');
};

const updateSearch = () => {
  emit('update-search', searchQuery.value);
};
</script>

<template>
  <v-app-bar app color="white" elevation="1" class="Header">
    <!-- Botón para abrir el sidebar -->
    <v-btn icon @click="toggleSidebar" class="Header__BtnMenu">
      <v-icon>mdi-menu</v-icon>
    </v-btn>
    
    <!-- Logo -->
    <div class="Header__Logo">
      <v-icon color="orange" size="x-large" class="mr-2">mdi-play-box</v-icon>
      <span class="text-h6 font-weight-bold">AcademIQ Play</span>
    </div>
    
    <!-- Buscador -->
    <v-text-field
      v-model="searchQuery"
      density="compact"
      variant="outlined"
      hide-details
      placeholder="Buscar videos..."
      append-inner-icon="mdi-magnify"
      @click:append-inner="updateSearch"
      @keyup.enter="updateSearch"
      class="Header__Buscador"
      bg-color="grey-lighten-4"
    ></v-text-field>
    
    <!-- Icono de usuario -->
    <v-btn icon class="Header__BtnUsuario" to="/perfil">
      <v-avatar color="primary" size="32">
        <v-icon color="white">mdi-account</v-icon>
      </v-avatar>
    </v-btn>
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
}
</style>