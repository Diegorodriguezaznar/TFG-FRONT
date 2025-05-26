<!-- src/components/Usuarios/HeaderUsuarios.vue -->
<script setup lang="ts">
import { ref } from 'vue';

// Variables
const searchQuery = ref('');

// Emits
const emit = defineEmits(['toggle-sidebar', 'search']);

// Métodos
const toggleSidebar = () => {
  emit('toggle-sidebar');
};

const handleSearch = () => {
  emit('search', searchQuery.value);
};

const clearSearch = () => {
  searchQuery.value = '';
  handleSearch();
};
</script>

<template>
  <v-app-bar 
    app 
    color="white" 
    elevation="2" 
    class="HeaderUsuarios"
    height="70"
  >
    <!-- Botón menú -->
    <v-btn 
      icon 
      @click="toggleSidebar" 
      class="HeaderUsuarios__MenuBtn"
      color="orange"
      variant="text"
    >
      <v-icon>mdi-menu</v-icon>
    </v-btn>
    
    <!-- Logo y título -->
    <div class="HeaderUsuarios__Logo d-flex align-center">
      <v-icon color="orange" size="x-large" class="mr-2">mdi-account-tie</v-icon>
      <div class="d-flex flex-column d-none d-sm-flex">
        <span class="text-h6 font-weight-bold text-orange">Profesores</span>
        <span class="text-caption text-grey-darken-1">Comunidad AcademIQ</span>
      </div>
    </div>
    
    <v-spacer></v-spacer>
    
    <!-- Buscador -->
    <div class="HeaderUsuarios__Search d-flex align-center">
      <v-text-field
        v-model="searchQuery"
        density="compact"
        variant="outlined"
        hide-details
        placeholder="Buscar profesor por nombre..."
        prepend-inner-icon="mdi-magnify"
        @keyup.enter="handleSearch"
        @input="handleSearch"
        class="HeaderUsuarios__SearchField"
        bg-color="grey-lighten-5"
        color="orange"
        :style="{ maxWidth: '300px' }"
      >
        <template v-slot:append-inner v-if="searchQuery">
          <v-btn 
            icon="mdi-close" 
            variant="text" 
            size="small"
            @click="clearSearch"
            color="grey"
          ></v-btn>
        </template>
      </v-text-field>
    </div>
    
    <!-- Botón de perfil -->
    <v-btn 
      icon 
      class="HeaderUsuarios__ProfileBtn ml-2" 
      to="/perfil"
      color="orange"
      variant="text"
    >
      <v-avatar color="orange" size="32">
        <v-icon color="white">mdi-account</v-icon>
      </v-avatar>
    </v-btn>
  </v-app-bar>
</template>

<style scoped>
.HeaderUsuarios {
  border-bottom: 2px solid rgba(255, 152, 0, 0.2) !important;
}

.HeaderUsuarios__MenuBtn {
  margin-right: 16px;
}

.HeaderUsuarios__Logo {
  min-width: 180px;
}

.HeaderUsuarios__Search {
  flex-shrink: 1;
  max-width: 400px;
}

.HeaderUsuarios__SearchField {
  transition: all 0.3s ease;
}

.HeaderUsuarios__SearchField:focus-within {
  transform: scale(1.02);
}

.HeaderUsuarios__FilterMenu {
  background: white;
  border: 1px solid rgba(255, 152, 0, 0.2);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(255, 152, 0, 0.15);
}

.HeaderUsuarios__Filters .v-btn {
  border-color: rgba(255, 152, 0, 0.5);
}

.HeaderUsuarios__Filters .v-btn:hover {
  background-color: rgba(255, 152, 0, 0.1);
}

/* Responsive */
@media (max-width: 768px) {
  .HeaderUsuarios__Search {
    max-width: 200px;
  }
  
  .HeaderUsuarios__SearchField {
    max-width: 180px !important;
  }
}

@media (max-width: 600px) {
  .HeaderUsuarios__Logo {
    min-width: 60px;
  }
  
  .HeaderUsuarios__Search {
    max-width: 150px;
  }
  
  .HeaderUsuarios__SearchField {
    max-width: 140px !important;
  }
}

/* Animaciones */
.HeaderUsuarios__MenuBtn,
.HeaderUsuarios__ProfileBtn {
  transition: transform 0.2s ease;
}

.HeaderUsuarios__MenuBtn:hover,
.HeaderUsuarios__ProfileBtn:hover {
  transform: scale(1.1);
}

/* Focus states */
:deep(.v-field--focused .v-field__outline) {
  border-color: #FF9800 !important;
  border-width: 2px !important;
}

:deep(.v-field--focused .v-field__prepend-inner .v-icon) {
  color: #FF9800 !important;
}
</style>