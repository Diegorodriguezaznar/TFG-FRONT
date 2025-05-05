<script setup lang="ts">
// --------------------------- Imports ---------------------------
import { ref, computed, watchEffect } from "vue";
import { useRoute } from "vue-router";
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import Sidebar from "@/components/Sidebar.vue";
import CardAsignatura from "@/components/CardAsignatura.vue";

// --------------------------- Breadcrumb ---------------------------
const items = ref([
  { title: "Cursos", disabled: false, href: "/cursos" },
  { title: "Asignaturas", disabled: true },
]);

// --------------------------- Fetch de asignaturas ---------------------------
async function fetchAsignaturasByCurso(idCurso: string) {
  if (!idCurso) return; // Evitar llamadas con ID vacío

  try {
    const response = await fetch(`http://localhost:5687/api/Asignatura/curso/${idCurso}`);
    if (!response.ok) throw new Error("Error al obtener las asignaturas del curso");

    asignaturas.value = await response.json();
  } catch (error: any) {
    errorMessage.value = error.message;
  }
}

// --------------------------- Buscador ---------------------------
const searchQuery = ref("");
const asignaturasFiltradas = computed(() => {
  if (!searchQuery.value) return asignaturas.value;
  return asignaturas.value.filter(asignatura =>
    asignatura.nombre.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// --------------------------- Almacenar datos de asignaturas ---------------------------
const asignaturas = ref([]);

// --------------------------- Variables ---------------------------
const drawer = ref(false);
const route = useRoute();
const idCurso = computed(() => route.params.idCurso ?? "");
const errorMessage = ref<string>("");

// --------------------------- Cargar asignaturas al cambiar ID de curso ---------------------------
watchEffect(() => {
  if (idCurso.value) {
    fetchAsignaturasByCurso(idCurso.value);
  }
});

</script>

<template>
  <v-app>
    <!-- --------------------------- Header --------------------------- -->
    <Header @toggle-sidebar="drawer = !drawer" @update-search="searchQuery = $event" />

    <!-- --------------------------- Breadcrumb --------------------------- -->
    <v-breadcrumbs class="AsignaturasPage__Breadcrumb" :items="items">
      <template v-slot:prepend>
        <v-icon icon="$vuetify" size="small"></v-icon>
      </template>
    </v-breadcrumbs>

    <v-container class="AsignaturasPage__Contenedor">
      <!-- --------------------------- Sidebar --------------------------- -->
      <Sidebar v-model="drawer" />

      <!-- --------------------------- Contenido --------------------------- -->
      <div class="AsignaturasPage__Contenido">
        <v-container class="AsignaturasPage__ContenedorAsignaturas">
          <v-row align="start" justify="start">
            <!-- --------------------------- Mostrar Asignaturas --------------------------- -->
            <v-col v-for="asignatura in asignaturasFiltradas" :key="asignatura.id" cols="12" sm="6" md="4" lg="3">
              <CardAsignatura :asignatura="asignatura" />
            </v-col>
          </v-row>
        </v-container>
      </div>
    </v-container>

    <!-- --------------------------- Footer --------------------------- -->
    <Footer />
  </v-app>
</template>

<style lang="scss" scoped>
  @import "@/assets/sass/pages/Asignaturas.scss";
</style>
