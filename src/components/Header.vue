<script setup>
//imports
import { ref } from 'vue';

//buscador
const search = ref('');
</script>

<template>
  <v-app-bar app class="Header__Seccion" height="80">
    <v-btn icon @click="$emit('toggle-sidebar')" class="Header__BotonMovil">
      <v-icon>mdi-menu</v-icon>
    </v-btn>

    <!-- Logo SVG inline -->
    <div class="Header__Logo">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <!-- Sombra -->
        <rect x="40" y="60" width="120" height="140" rx="10" ry="10" fill="#A0522D" opacity="0.5"/>
        
        <!-- Base del bloc de notas -->
        <rect x="30" y="50" width="120" height="140" rx="10" ry="10" fill="#FF5500"/>
        
        <!-- Papel -->
        <rect x="35" y="55" width="110" height="110" rx="5" ry="5" fill="#EEEEEE" stroke="#FB7C3C" stroke-width="3"/>
        
        <!-- Anillas -->
        <circle cx="50" cy="45" r="7" fill="#F7A277"/>
        <circle cx="80" cy="45" r="7" fill="#F7A277"/>
        <circle cx="110" cy="45" r="7" fill="#F7A277"/>
        <circle cx="140" cy="45" r="7" fill="#F7A277"/>
        
        <!-- Líneas del texto con animación -->
        <rect class="text-line line1" x="50" y="80" width="100" height="8" rx="3" ry="3" fill="#333"/> <!-- Más larga -->
        <rect class="text-line line2" x="50" y="100" width="60" height="8" rx="3" ry="3" fill="#333"/> <!-- Más corta -->
        <rect class="text-line line3" x="50" y="120" width="100" height="8" rx="3" ry="3" fill="#333"/> <!-- Más larga -->

      </svg>
    </div>

    <v-toolbar-title class="Header__Titulo">AcademIQ</v-toolbar-title>

    <v-spacer></v-spacer>

    <!-- Buscador universal -->
    <v-text-field
      v-model="search"
      label="Buscar..."
      append-icon="mdi-magnify"
      single-line
      hide-details
      class="Header__Buscador"
      @input="$emit('update-search', search)"
    ></v-text-field>
  </v-app-bar>
</template>

<style lang="scss" scoped>
@import "@/assets/sass/layout/Header.scss";
</style>