<script setup lang="ts">
import { ref } from 'vue';

const searchQuery = ref('');

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
    
    <v-btn icon class="Header__btn-usuario" to="/perfil">
      <v-avatar color="primary" size="32">
        <v-icon color="white">mdi-account</v-icon>
      </v-avatar>
    </v-btn>
  </v-app-bar>
</template>

<style lang="scss" scoped>
@import "@/assets/sass/layout/Header";
</style>