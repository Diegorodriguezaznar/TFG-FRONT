<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useUsuarioLogeadoStore } from '@/stores/UsuarioLogeado';
import Header from '@/components/Layout/Header.vue';
import Footer from '@/components/Layout/Footer.vue';
import SideBarCursos from '@/components/Layout/SideBarCursos.vue';
import CardCurso from '@/components/CardCurso.vue';

const items = ref([{ title: 'Cursos', disabled: true, href: '/cursos' }]);
const usuarioLogeadoStore = useUsuarioLogeadoStore();

const drawer = ref(false);
const mostrarLogin = ref(false);
const cursos = ref([]);

const searchQuery = ref('');
const cursosFiltrados = computed(() => {
  if (!searchQuery.value) return cursos.value;
  return cursos.value.filter(curso =>
    curso.nombre.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

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
    // Error manejado silenciosamente
  }
};

const handleCursoGuardado = (cursoId) => {
  // Lógica de curso guardado
};

const handleCursoEliminado = (cursoId) => {
  // Lógica de curso eliminado
};

onMounted(fetchCursos);
</script>

<template>
  <v-app>
    <Header @toggle-sidebar="drawer = !drawer" @update-search="searchQuery = $event" />
    <SideBarCursos v-model="drawer" />

    <div class="CursosPage">
      <v-breadcrumbs class="CursosPage__Breadcrumb" :items="items">
        <template v-slot:prepend>
          <v-icon icon="mdi-book-open-variant" size="small"></v-icon>
        </template>
      </v-breadcrumbs>

      <v-container class="CursosPage__Container">
        <div class="CursosPage__Header">
          <h1 class="CursosPage__Title">Explora nuestros cursos</h1>
        </div>

        <div class="CursosPage__Content">
          <v-container class="CursosPage__Grid">
            <v-row align="stretch" justify="start">
              <v-col v-for="curso in cursosFiltrados" :key="curso.idCurso" cols="12" sm="6" md="4" lg="3" class="CursosPage__GridItem">
                <CardCurso 
                  :id="curso.idCurso"
                  :titulo="curso.nombre"
                  :subtitulo="curso.subtitulo"
                  :descripcion="curso.descripcion"
                  :imagen="curso.imagen"
                  @guardado="handleCursoGuardado"
                  @eliminado="handleCursoEliminado"
                />
              </v-col>
            </v-row>
          </v-container>
        </div>
      </v-container>
    </div>
    
    <Footer />

    <Login 
      v-if="mostrarLogin" 
      :mostrar="mostrarLogin" 
      @cerrar="mostrarLogin = false" 
    />
  </v-app>
</template>

<style lang="scss" scoped>
@import "@/assets/sass/pages/CursosPage";
</style>