<script setup lang="ts">
// --------------------------- Imports ---------------------------
import { ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Header from '@/components/Header.vue';
import Sidebar from '@/components/Sidebar.vue';
import Footer from '@/components/Footer.vue';
import Archivos from '@/components/Archivos.vue';
import ListaTest from '@/components/ListaTest.vue';

// --------------------------- Breadcrumb ---------------------------
const items = ref([
  { title: 'Cursos', disabled: false, href: '/cursos' },
  { title: 'Asignaturas', disabled: false },
  { title: 'Temarios', disabled: false },
  { title: "Archivos & Tests", disabled: true }
]);

// --------------------------- Variables ---------------------------
const drawer = ref(false);
const tab = ref(1);
const terminoBusqueda = ref("");
const route = useRoute();
const temarioId = ref<number | null>(null);

// --------------------------- Watcher ---------------------------
watch(() => route.params.idTemario, (nuevoId) => {
  if (nuevoId) {
    temarioId.value = Number(nuevoId);
  }
}, { immediate: true });

// --------------------------- Métodos ---------------------------
const updateSearch = (query: string) => {
  terminoBusqueda.value = query;
};

// --------------------------- Obtener ID del temario ---------------------------
onMounted(() => {
  if (route.params.idTemario) {
    temarioId.value = Number(route.params.idTemario);
  }
});
</script>

<template>
  <v-app>
    <!-- --------------------------- Header --------------------------- -->
    <Header @toggle-sidebar="drawer = !drawer" @update-search="updateSearch" />

    <!-- --------------------------- Breadcrumb --------------------------- -->
    <v-breadcrumbs class="ArchivosyTestPage__Breadcrumb" :items="items">
      <template v-slot:prepend>
        <v-icon icon="$vuetify" size="small"></v-icon>
      </template>
    </v-breadcrumbs>

    <!-- --------------------------- Contenedor principal --------------------------- -->
    <v-container class="ArchivosyTestPage__Contenedor">
      <Sidebar v-model="drawer" />

      <!-- --------------------------- Contenido principal --------------------------- -->
      <div class="ArchivosyTestPage__Contenido" v-if="temarioId !== null">
        <v-card class="ArchivosyTestPage__Tab">
          <!-- --------------------------- Tabs --------------------------- -->
          <v-tabs v-model="tab" align-tabs="left" color="orange-darken-3">
            <v-tab :value="1">
              <v-icon class="mr-2">mdi-folder</v-icon> Archivos
            </v-tab>
            <v-tab :value="2">
              <v-icon class="mr-2">mdi-file-document-edit</v-icon> Tests
            </v-tab>
          </v-tabs>

          <!-- --------------------------- Ventanas de contenido --------------------------- -->
          <v-window v-model="tab">
            <v-window-item :value="1">
              <Archivos :terminoBusqueda="terminoBusqueda" :temarioId="temarioId" />
            </v-window-item>

            <v-window-item :value="2">
              <ListaTest :searchQuery="terminoBusqueda" :temarioId="temarioId" />
            </v-window-item>
          </v-window>
        </v-card>
      </div>

      <!-- --------------------------- Mensaje cuando no hay temario seleccionado --------------------------- -->
      <div v-else class="content text-center">
        <v-alert type="warning" icon="mdi-alert-circle">
          No se ha seleccionado ningún temario. Por favor, seleccione un temario para ver sus archivos y tests.
        </v-alert>
      </div>
    </v-container>

    <!-- --------------------------- Footer --------------------------- -->
    <Footer />
  </v-app>
</template>

<style lang="scss" scoped>
 @import "@/assets/sass/pages/ArchivosyTest.scss";
</style>
