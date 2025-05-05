<script setup lang="ts">
// --------------------------- Imports ---------------------------
import { ref, computed, defineEmits } from "vue";
import { useDisplay } from "vuetify";
import { useUsuarioLogeadoStore } from "@/stores/UsuarioLogeado";
import { useRouter } from "vue-router";

// --------------------------- Variables ---------------------------
const router = useRouter();
const usuarioLogeadoStore = useUsuarioLogeadoStore();
const emit = defineEmits(["mostrar-login"]);
const drawer = ref(true);
const isExpanded = ref(false);
const { mobile } = useDisplay();
const isMobile = computed(() => mobile.value);
const usuarioActual = computed(() => usuarioLogeadoStore.usuarioActual);

// --------------------------- Menú unificado ---------------------------
const menu = [
  { text: "Inicio", route: "/", icon: "mdi-home" },
  { text: "Cursos", route: "/cursos", icon: "mdi-school" },
  { text: "Mis Archivos", route: "/mis-archivos", icon: "mdi-file" },
  { text: "Mis Cursos", route: "/mis-cursos", icon: "mdi-heart" },
  { text: "Perfil", route: "/perfil", icon: "mdi-account" }
];

// --------------------------- Funciones ---------------------------
const logout = () => {
  usuarioLogeadoStore.usuarioActual = null;
  usuarioLogeadoStore.estaAutenticado = false;
  localStorage.removeItem("usuario");
  router.push("/");
};

const toggleSidebar = () => (isExpanded.value = false);
const expandSidebar = () => (isExpanded.value = true);
</script>

<template>
  <!-- --------------------------- Sidebar --------------------------- -->
  <v-navigation-drawer v-model="drawer" :width="isExpanded ? 250 : 80" :rail="!isExpanded" app class="SideBar">
    <!-- --------------------------- Información de usuario --------------------------- -->
    <v-list>
      <v-list-item
        :prepend-avatar="usuarioActual?.avatar || 'https://randomuser.mehttp://localhost:5687/api/portraits/women/85.jpg'"
        :subtitle="usuarioActual?.email || 'Usuario'"
        :title="usuarioActual?.nombre || 'Usuario'"
        @click="expandSidebar">
        
        <template v-slot:append>
          <v-btn v-if="isExpanded" icon variant="text" @click.stop="toggleSidebar">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
        </template>
      </v-list-item>
    </v-list>

    <v-divider class="border-opacity-100"></v-divider>

    <!-- --------------------------- Menú de navegación --------------------------- -->
    <v-list density="compact" nav>
      <template v-for="(item, index) in menu" :key="item.text">
        <v-list-item link :to="item.route" :prepend-icon="item.icon">
          <v-list-item-title v-if="isExpanded">{{ item.text }}</v-list-item-title>
        </v-list-item>
        <v-divider class="border-opacity-100" :thickness="1" v-if="index < menu.length - 1"></v-divider>
      </template>
      
      <!-- --------------------------- Cerrar sesión --------------------------- -->
      <v-list-item @click="logout" prepend-icon="mdi-logout">
        <v-list-item-title v-if="isExpanded">Cerrar sesión</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>

  <!-- --------------------------- Botón para abrir el drawer en móvil --------------------------- -->
  <v-btn v-if="isMobile" icon @click="drawer = !drawer" class="SideBar__Boton">
    <v-icon>mdi-menu</v-icon>
  </v-btn>
</template>

<style lang="scss" scoped>
  @import "@/assets/sass/layout/SideBar.scss";
</style>
