<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useAsignaturaStore } from "@/stores/Asignaturas";
import { useUsuarioLogeadoStore } from "@/stores/UsuarioLogeado";
import type { AsignaturaCrearDTO } from "@/stores/dtos/AsignaturaCrearDTO";
import Header from "@/components/Layout/Header.vue";
import Sidebar from "@/components/Layout/Sidebar.vue";

const route = useRoute();
const asignaturaStore = useAsignaturaStore();
const usuarioLogeadoStore = useUsuarioLogeadoStore();

const drawer = ref(false);
const idCurso = parseInt(route.params.idCurso as string);
const nombre = ref("");
const loading = ref(false);
const success = ref(false);

const isFormValid = computed(() => nombre.value.trim().length >= 2);

const crearAsignatura = async () => {
  if (!isFormValid.value) return;

  loading.value = true;

  const dto: AsignaturaCrearDTO = {
    nombre: nombre.value.trim(),
    descripcion: "", // si más adelante se usa
    idCurso
  };

  const resultado = await asignaturaStore.createAsignatura(dto);

  success.value = resultado;
  if (resultado) nombre.value = "";

  loading.value = false;
};

onMounted(() => {
  if (!usuarioLogeadoStore.usuarioActual) {
    usuarioLogeadoStore.cargarUsuarioDesdeStorage();
  }
});
</script>

<template>
  <v-app>
    <Header @toggle-sidebar="drawer = !drawer" />
    <v-main>
      <Sidebar v-model="drawer" />

      <v-container class="mt-6">
        <v-card class="mx-auto my-8" max-width="700" elevation="3">
          <v-card-title class="text-h4 d-flex align-center py-4 primary">
            <v-icon size="32" class="me-3" color="white">mdi-book-plus</v-icon>
            <span class="white--text">Añadir asignatura al curso</span>
          </v-card-title>

          <v-card-text class="pa-6">
            <v-alert
              v-if="success"
              type="success"
              class="mb-4"
              dismissible
              @click:close="success = false"
            >
              Asignatura creada correctamente.
            </v-alert>

            <v-form @submit.prevent="crearAsignatura">
              <v-text-field
                v-model="nombre"
                label="Nombre de la asignatura"
                required
                variant="outlined"
                color="primary"
              />

              <v-card-actions class="pt-4">
                <v-spacer />
                <v-btn
                  type="submit"
                  color="primary"
                  :disabled="!isFormValid"
                  :loading="loading"
                  prepend-icon="mdi-content-save"
                  class="text-none"
                >
                  Crear asignatura
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>

    <v-footer app height="64" class="bg-grey-lighten-4 d-flex align-center justify-center">
      <span class="text-body-2">&copy; {{ new Date().getFullYear() }} AcademIQ</span>
    </v-footer>
  </v-app>
</template>

<style scoped>
.primary {
  background: linear-gradient(135deg, #1976d2, #0d47a1);
}
</style>
