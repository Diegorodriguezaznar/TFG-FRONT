<script setup>
// --------------------------- Imports ---------------------------
import { ref, computed, onMounted } from 'vue';
import { useUsuarioLogeadoStore } from '@/stores/UsuarioLogeado';
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import Sidebar from '@/components/Sidebar.vue';
import CardCurso from '@/components/CardCurso.vue';
import Login from '@/components/Login.vue';

// --------------------------- Breadcrumb ---------------------------
const items = ref([{ title: 'Cursos', disabled: true, href: '/cursos' }]);

// --------------------------- Fetch de cursos ---------------------------
const fetchCursos = async () => {
  try {
    const response = await fetch("http://localhost:5190/api/Curso", {
      headers: usuarioLogeadoStore.usuarioActual 
        ? { 'Authorization': `Bearer ${usuarioLogeadoStore.usuarioActual.token}` }
        : {}
    });
    
    if (!response.ok) throw new Error("Error al obtener los cursos");

    cursos.value = await response.json();
  } catch (error) {
    console.error(error);
  }
};

// --------------------------- Buscador ---------------------------
const searchQuery = ref('');
const cursosFiltrados = computed(() => {
  if (!searchQuery.value) return cursos.value;
  return cursos.value.filter(curso =>
    curso.nombre.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// --------------------------- Almacenar cursos ---------------------------
const cursos = ref([]);

// --------------------------- Variables ---------------------------
const drawer = ref(false);
const mostrarLogin = ref(false); 

// --------------------------- Llamada al store de usuario ---------------------------
const usuarioLogeadoStore = useUsuarioLogeadoStore();

// --------------------------- Llamada al método para obtener cursos ---------------------------
onMounted(fetchCursos);
</script>

<template>
  <v-app>
    <!-- --------------------------- Header --------------------------- -->
    <Header @toggle-sidebar="drawer = !drawer" @update-search="searchQuery = $event" />

    <!-- --------------------------- Breadcrumb --------------------------- -->
    <v-breadcrumbs class="CursosPage___Breadcrumb" :items="items">
      <template v-slot:prepend>
        <v-icon icon="$vuetify" size="small"></v-icon>
      </template>
    </v-breadcrumbs>

    <!-- --------------------------- Contenedor principal --------------------------- -->
    <v-container class="CursosPage__Contenedor">
      <!-- --------------------------- Sidebar --------------------------- -->
      <Sidebar v-model="drawer" @mostrar-login="mostrarLogin = true" />

      <!-- --------------------------- Contenido --------------------------- -->
      <div class="CursosPage___contenido">
        <v-container class="CursosPage___ContenedorCursos">
          <v-row align="start" justify="start">
            <!-- --------------------------- Mostrar cursos --------------------------- -->
            <v-col v-for="curso in cursosFiltrados" :key="curso.idCurso" cols="12" sm="6" md="4" lg="3">
              <CardCurso 
                :id="curso.idCurso"
                :titulo="curso.nombre"
                :subtitulo="curso.subtitulo"
                :descripcion="curso.descripcion"
                :imagen="curso.imagen"
              />
            </v-col>
          </v-row>
        </v-container>
      </div>
    </v-container>

    <!-- --------------------------- Footer --------------------------- -->
    <Footer />

    <!-- --------------------------- Login Modal --------------------------- -->
    <Login 
      v-if="mostrarLogin" 
      :mostrar="mostrarLogin" 
      @cerrar="mostrarLogin = false" 
    />
  </v-app>
</template>

<style lang="scss" scoped>
  @import "@/assets/sass/pages/Cursos.scss";
</style>
