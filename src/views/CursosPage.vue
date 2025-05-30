<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useUsuarioLogeadoStore } from '@/stores/UsuarioLogeado';
import { useCursoStore } from '@/stores/Curso';
import HeaderCursos from '@/components/Layout/HeaderCursos.vue';
import Footer from '@/components/Layout/Footer.vue';
import SideBar from '@/components/Layout/SideBar.vue';
import CursosHeroSection from '@/components/Cursos/CursosHeroSection.vue';
import CursosListSection from '@/components/Cursos/CursosListSection.vue';

const usuarioLogeadoStore = useUsuarioLogeadoStore();
const cursoStore = useCursoStore();

const drawer = ref(false);
const searchQuery = ref('');
const loading = ref(true);

const cursosFiltrados = computed(() => {
  if (!searchQuery.value) return cursoStore.cursos;
  return cursoStore.cursos.filter(curso =>
    curso.nombre.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    (curso.descripcion && curso.descripcion.toLowerCase().includes(searchQuery.value.toLowerCase()))
  );
});

const fetchCursos = async () => {
  loading.value = true;
  try {
    await cursoStore.fetchAllCursos();
  } catch (error) {
    console.error('Error al cargar cursos:', error);
  } finally {
    loading.value = false;
  }
};

const handleCursoGuardado = (cursoId) => {
  console.log('Curso guardado:', cursoId);
};

const handleCursoEliminado = (cursoId) => {
  console.log('Curso eliminado:', cursoId);
};

onMounted(() => {
  fetchCursos();
});
</script>

<template>
  <v-app>
    <HeaderCursos @toggle-sidebar="drawer = !drawer" @update-search="searchQuery = $event" />
    <SideBar v-model="drawer" />

    <v-main class="CursosPage">
      <CursosHeroSection />
      
      <CursosListSection 
        :cursos="cursosFiltrados"
        :loading="loading"
        :search-query="searchQuery"
        @refresh="fetchCursos"
        @clear-search="searchQuery = ''"
        @curso-guardado="handleCursoGuardado"
        @curso-eliminado="handleCursoEliminado"
      />
    </v-main>
    
    <Footer />
  </v-app>
</template>

<style scoped>
.CursosPage {
  background: #f5f5f5;
  padding-top: 0 !important; 
}
</style>