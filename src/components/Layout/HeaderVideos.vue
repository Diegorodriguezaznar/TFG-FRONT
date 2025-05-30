<!-- src/components/Videos/HeaderVideos.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue';
import { useUsuarioLogeadoStore } from '@/stores/UsuarioLogeado';
import UserAvatar from '@/components/UserAvatar.vue';

// Variables
const searchQuery = ref('');

// Store
const usuarioStore = useUsuarioLogeadoStore();

// Computed
const usuarioActual = computed(() => usuarioStore.usuarioActual);

// Emits
const emit = defineEmits(['toggle-sidebar', 'update-search']);

// Métodos
const toggleSidebar = () => {
  emit('toggle-sidebar');
};

const handleSearch = () => {
  emit('update-search', searchQuery.value);
};

const clearSearch = () => {
  searchQuery.value = '';
  handleSearch();
};
</script>

<template>
<v-app-bar app color="white" elevation="2" class="HeaderVideos" height="70" sticky>
    <!-- Botón menú -->
    <v-btn 
      icon 
      @click="toggleSidebar" 
      class="HeaderVideos__MenuBtn"
      color="red"
      variant="text"
    >
      <v-icon>mdi-menu</v-icon>
    </v-btn>
    
    <!-- Logo y título -->
    <div class="HeaderVideos__Logo d-flex align-center">
      <v-icon color="red" size="x-large" class="mr-2">mdi-play-box-multiple</v-icon>
      <div class="d-flex flex-column d-none d-sm-flex">
        <span class="text-h6 font-weight-bold text-red">Videos</span>
        <span class="text-caption text-grey-darken-1">Comunidad AcademIQ</span>
      </div>
    </div>
    
    <!-- Buscador - MOVIDO Y AMPLIADO -->
    <div class="HeaderVideos__Search d-flex align-center">
      <v-text-field
        v-model="searchQuery"
        density="compact"
        variant="outlined"
        hide-details
        placeholder="Buscar video por título..."
        prepend-inner-icon="mdi-magnify"
        @keyup.enter="handleSearch"
        @input="handleSearch"
        class="HeaderVideos__SearchField"
        bg-color="grey-lighten-5"
        color="red"
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
    
    <v-spacer></v-spacer>
    
    <!-- Botón de perfil con UserAvatar -->
    <div class="HeaderVideos__ProfileSection">
      <v-btn 
        variant="text"
        to="/perfil"
        class="HeaderVideos__ProfileBtn"
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
.HeaderVideos {
  border-bottom: 2px solid rgba(255, 17, 0, 0.2)) !important;
  position: sticky !important;
  top: 0 !important;
  z-index: 1000 !important;
}

.HeaderVideos__MenuBtn {
  margin-right: 16px;
}

.HeaderVideos__Logo {
  min-width: 200px; /* Aumentado para dar más espacio */
  margin-right: 25px; /* 25px de separación como pediste */
}

/* BUSCADOR AMPLIADO Y REPOSICIONADO */
.HeaderVideos__Search {
  flex: 1; /* Ocupa todo el espacio disponible */
  max-width: 600px; /* Máximo ancho */
  min-width: 300px; /* Mínimo ancho */
  margin-right: 16px; /* Separación del botón de perfil */
}

.HeaderVideos__SearchField {
  width: 100% !important; /* Ocupa todo el ancho disponible */
  transition: all 0.3s ease;
}

.HeaderVideos__SearchField:focus-within {
  transform: scale(1.02);
}

.HeaderVideos__FilterMenu {
  background: white;
  border: 1px solid rgba(255, 152, 0, 0.2);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(255, 152, 0, 0.15);
}

.HeaderVideos__Filters .v-btn {
  border-color: rgba(184, 55, 23, 0.5);
}

.HeaderVideos__Filters .v-btn:hover {
  background-color: rgba(255, 152, 0, 0.1);
}

/* Responsive mejorado */
@media (max-width: 768px) {
  .HeaderVideos__Logo {
    min-width: 160px;
    margin-right: 15px; /* Reducido en móvil */
  }
  
  .HeaderVideos__Search {
    min-width: 200px;
    max-width: 300px;
  }
  
  .HeaderVideos__ProfileSection {
    padding-right: 15px; /* Reducido en tablet */
  }
}

@media (max-width: 600px) {
  .HeaderVideos__Logo {
    min-width: 60px; /* Solo ícono en móvil */
    margin-right: 10px;
  }
  
  .HeaderVideos__Search {
    min-width: 150px;
    max-width: 200px;
  }
  
  .HeaderVideos__SearchField {
    font-size: 14px; /* Texto más pequeño en móvil */
  }
  
  .HeaderVideos__ProfileSection {
    padding-right: 10px; /* Reducido en móvil */
  }
}

/* Animaciones */
.HeaderVideos__MenuBtn {
  transition: transform 0.2s ease;
}

.HeaderVideos__MenuBtn:hover {
  transform: scale(1.1);
}

/* AVATAR DE PERFIL - 25px de la derecha */
.HeaderVideos__ProfileSection {
  padding-right: 25px; /* 25px del borde derecho */
}

.HeaderVideos__ProfileBtn {
  border-radius: 50%;
  min-width: 40px;
  width: 40px;
  height: 40px;
  padding: 0;
  transition: all 0.2s ease;
}

.HeaderVideos__ProfileBtn:hover {
  background: rgba(255, 152, 0, 0.1);
  transform: scale(1.05);
}

/* Focus states */
:deep(.v-field--focused .v-field__outline) {
  border-color: #ff2600 !important;
  border-width: 2px !important;
}

:deep(.v-field--focused .v-field__prepend-inner .v-icon) {
  color: #ff0000 !important;
}
</style>