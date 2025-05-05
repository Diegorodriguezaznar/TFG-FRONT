<script setup lang="ts">
// --------------------------- Imports ---------------------------
import { ref, computed, watchEffect } from "vue";
import { useRoute } from "vue-router";
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import Sidebar from "@/components/Sidebar.vue";
import ListaTemarios from "@/components/ListaTemarios.vue";

// --------------------------- Breadcrumb ---------------------------
const items = ref([
  { title: "Cursos", disabled: false, href: "/cursos" },
  { title: "Asignaturas", disabled: false },
  { title: "Temarios", disabled: true },
]);

// --------------------------- Buscador ---------------------------
const searchQuery = ref("");

// --------------------------- Variables ---------------------------
const drawer = ref(false);
const route = useRoute();
const idAsignatura = computed(() => route.params.idAsignatura ? String(route.params.idAsignatura) : "");

// --------------------------- Métodos ---------------------------
// // Verificar que se cargan temarios
// const handleTemariosCargados = (temariosData) => {
//   console.log("Temarios cargados:", temariosData);
// };

</script>

<template>
  <v-app>
    <!-- --------------------------- Header --------------------------- -->
    <Header @toggle-sidebar="drawer = !drawer" @update-search="searchQuery = $event" /> <!-- Se agrega el evento de búsqueda -->

    <!-- --------------------------- Breadcrumb --------------------------- -->
    <v-breadcrumbs class="TemariosPage__Breadcrumb" :items="items">
      <template v-slot:prepend>
        <v-icon icon="$vuetify" size="small"></v-icon>
      </template>
    </v-breadcrumbs>

    <!-- --------------------------- Contenedor principal --------------------------- -->
    <v-container class="TemariosPage__Contenedor">
      
      <!-- --------------------------- Sidebar --------------------------- -->
      <Sidebar v-model="drawer" />

      <div class="TemariosPage__Contenido">
        <!-- --------------------------- Lista de temarios con búsqueda --------------------------- -->
        <ListaTemarios 
          :idAsignatura="idAsignatura" 
          :searchQuery="searchQuery"
          @temariosCargados="handleTemariosCargados"
        />
      </div>
    </v-container>

    <!-- --------------------------- Footer --------------------------- -->
    <Footer />
  </v-app>
</template>

<style lang="scss" scoped>
  @import "@/assets/sass/pages/Temarios.scss";
</style>
