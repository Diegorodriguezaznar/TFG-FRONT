<!-- src/components/Cursos/HeaderCursos.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue';
import { useUsuarioLogeadoStore } from '@/stores/UsuarioLogeado';
import UserAvatar from '@/components/Common/UserAvatar.vue';

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
<v-app-bar app color="white" elevation="2" class="header-cursos" height="70" sticky>
    <!-- Botón menú -->
    <v-btn 
      icon 
      @click="toggleSidebar" 
      class="header-cursos__menu-btn"
      color="blue"
      variant="text"
    >
      <v-icon>mdi-menu</v-icon>
    </v-btn>
    
    <!-- Logo y título -->
    <div class="header-cursos__logo d-flex align-center">
      <v-icon color="blue" size="x-large" class="mr-2">mdi-book-open-page-variant</v-icon>
      <div class="d-flex flex-column d-none d-sm-flex">
        <span class="text-h6 font-weight-bold text-blue">Cursos</span>
      </div>
    </div>
    
    <!-- Buscador -->
    <div class="header-cursos__search d-flex align-center">
      <v-text-field
        v-model="searchQuery"
        density="compact"
        variant="outlined"
        hide-details
        placeholder="Buscar curso..."
        prepend-inner-icon="mdi-magnify"
        @keyup.enter="handleSearch"
        @input="handleSearch"
        class="header-cursos__search-field"
        bg-color="grey-lighten-5"
        color="blue"
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
    <div class="header-cursos__profile-section">
      <v-btn 
        variant="text"
        to="/perfil"
        class="header-cursos__profile-btn"
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
@import "@/assets/sass/layout/HeaderCursos";
</style>