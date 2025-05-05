<script setup lang="ts">
// --------------------------- Imports ---------------------------
import { ref } from "vue";
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import Sidebar from "@/components/Sidebar.vue";
import MisArchivos from "@/components/MisArchivos.vue";

// --------------------------- Variables ---------------------------
const drawer = ref(false);
const searchQuery = ref('');
const items = ref([{ title: 'Mis Archivos', disabled: false },]);
</script>

<template>
  <v-app>
    <!-- --------------------------- Header --------------------------- -->
    <Header @toggle-sidebar="drawer = !drawer" />

    <!-- --------------------------- Breadcrumb --------------------------- -->
    <v-breadcrumbs class="MisCursos__Breadcrumb" :items="items">
      <template v-slot:prepend>
        <v-icon icon="$vuetify" size="small"></v-icon>
      </template>
    </v-breadcrumbs>

    <!-- --------------------------- Contenedor principal --------------------------- -->
    <v-container class="MisCursos__Contenedor">
      
      <!-- --------------------------- Sidebar --------------------------- -->
      <Sidebar v-model="drawer" />

      <!-- --------------------------- Contenido --------------------------- -->
      <div class="MisCursos__Contenido">
        <MisArchivos />
      </div>
    </v-container>

    <!-- --------------------------- Footer --------------------------- -->
    <Footer />
  </v-app>
</template>

<style lang="scss" scoped>
  @import "@/assets/sass/pages/MisCursos.scss";
</style>
