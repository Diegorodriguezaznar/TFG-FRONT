<script setup>
// --------------------------- Imports ---------------------------
import { ref, watch, computed, onMounted } from 'vue';
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import Sidebar from '@/components/Sidebar.vue';
import UserTab from '@/components/UserTab.vue';
import Login from '@/components/Login.vue';
import { useUsuarioLogeadoStore } from "@/stores/UsuarioLogeado";
import AvatarRiendo from '@/components/AvatarEmote.vue';

// --------------------------- Store de usuario ---------------------------
const usuarioLogeadoStore = useUsuarioLogeadoStore();

// --------------------------- Variables ---------------------------
const drawer = ref(false);
const items = ref([{ title: 'Perfil', disabled: false }]);

// --------------------------- Obtener el usuario actual ---------------------------
const usuarioActual = computed(() => usuarioLogeadoStore.usuarioActual);

// --------------------------- Nombre de usuario ---------------------------
const nombre = computed({
  get: () => usuarioActual.value?.nombre || "Usuario",
  set: (value) => {
    // Placeholder para futura funcionalidad de edición
  }
});

// --------------------------- Verificar usuario en localStorage ---------------------------
const checkUsuarioLocal = () => {
  const usuarioGuardado = localStorage.getItem('usuario');
  if (usuarioGuardado && !usuarioActual.value) {
    try {
      usuarioLogeadoStore.usuarioActual = JSON.parse(usuarioGuardado);
      usuarioLogeadoStore.estaAutenticado = true;
    } catch (error) {
      console.error("Error al recuperar usuario del localStorage:", error);
    }
  }
};

// --------------------------- Frases inspiradoras para el perfil ---------------------------
const estados = [
  "Me encanta Estudiar",
  "Soy una persona aplicada",
  "Vivan las Mates!",
  "La historia mola",
  "Fan de literatura",
  "Alumno sin igual"
];

// --------------------------- Ejecutar al montar el componente ---------------------------
onMounted(() => {
  checkUsuarioLocal();
});
</script>

<template>
  <v-app>
    <!-- --------------------------- Header --------------------------- -->
    <Header @toggle-sidebar="drawer = !drawer" />
    
    <!-- --------------------------- Breadcrumb --------------------------- -->
    <v-breadcrumbs class="PerfilPage__Breadcrumb" :items="items">
      <template v-slot:prepend>
        <v-icon icon="$vuetify" size="small"></v-icon>
      </template>
    </v-breadcrumbs>

    <!-- --------------------------- Contenedor principal --------------------------- -->
    <v-container class="perfil-container">
      <!-- --------------------------- Sidebar --------------------------- -->
      <Sidebar v-model="drawer" />

      <div class="perfil-content">
        <v-row class="perfil-row">
          
          <!-- --------------------------- Fila superior con avatar, nombre, email y frase --------------------------- -->
          <v-col cols="12" class="perfil-info-row">
            <v-card class="perfil-card">
              <v-row no-gutters align="center">
                <!-- --------------------------- Avatar --------------------------- -->
                <v-col cols="12" sm="3" class="perfil-avatar-container">
                  <AvatarRiendo />
                </v-col>

                <!-- --------------------------- Información del usuario --------------------------- -->
                <v-col cols="12" sm="9" class="perfil-info">
                  <v-row>
                    <!-- --------------------------- Nombre --------------------------- -->
                    <v-col cols="12" sm="6">
                      <v-text-field 
                        class="perfil-nombre" 
                        label="Nombre" 
                        v-model="nombre" 
                        variant="outlined"
                        density="compact"
                        bg-color="white"
                        readonly
                      ></v-text-field>
                    </v-col>
                    
                    <!-- --------------------------- Email --------------------------- -->
                    <v-col cols="12" sm="6">
                      <v-text-field
                        class="perfil-email"
                        label="Email"
                        v-model="usuarioActual.gmail"
                        variant="outlined"
                        density="compact"
                        bg-color="white"
                        readonly
                      ></v-text-field>
                    </v-col>
                    
                    <!-- --------------------------- Frase --------------------------- -->
                    <v-col cols="12">
                      <v-autocomplete 
                        class="perfil-frase" 
                        label="¿Cuál es tu frase?" 
                        :items="estados" 
                        variant="outlined"
                        density="compact"
                        bg-color="white"
                      ></v-autocomplete>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-card>
          </v-col>

          <!-- --------------------------- Fila inferior con pestañas --------------------------- -->
          <v-col cols="12" class="perfil-tab-row">
            <UserTab />
          </v-col>
        </v-row>
      </div>
    </v-container>

    <!-- --------------------------- Footer --------------------------- -->
    <Footer />
  </v-app>
</template>

<style lang="scss" scoped>
  @import "@/assets/sass/pages/Perfil.scss";
</style>
