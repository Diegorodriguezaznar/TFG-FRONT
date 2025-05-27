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
    descripcion: "",
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

      <v-container class="AsignaturaCrear">
        <v-card class="AsignaturaCrear__Card">
          <v-card-title class="AsignaturaCrear__Header">
            <v-icon size="32" class="AsignaturaCrear__Icon">mdi-book-plus</v-icon>
            <span class="AsignaturaCrear__Title">Añadir asignatura al curso</span>
          </v-card-title>

          <v-card-text class="AsignaturaCrear__Content">
            <v-alert
              v-if="success"
              type="success"
              class="AsignaturaCrear__Alert"
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
                class="AsignaturaCrear__Input"
              />

              <v-card-actions class="AsignaturaCrear__Actions">
                <v-spacer />
                <v-btn
                  type="submit"
                  color="primary"
                  :disabled="!isFormValid"
                  :loading="loading"
                  prepend-icon="mdi-content-save"
                  class="AsignaturaCrear__Button"
                >
                  Crear asignatura
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>

    <v-footer app height="64" class="AsignaturaCrear__Footer">
      <span>&copy; {{ new Date().getFullYear() }} AcademIQ</span>
    </v-footer>
  </v-app>
</template>

<style lang="scss" scoped>
@import "@/assets/sass/pages/CrearAsignaturas";
</style>