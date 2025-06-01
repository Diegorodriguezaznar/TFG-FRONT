<template>
  <v-container v-if="cursoStore.loading" class="lista-cursos">
    <v-row align="stretch" justify="start">
      <v-col v-for="i in 8" :key="i" cols="12" sm="6" md="4" lg="3" class="d-flex">
        <v-skeleton-loader
          type="card"
          height="350"
          class="lista-cursos__skeleton"
        ></v-skeleton-loader>
      </v-col>
    </v-row>
  </v-container>
  
  <v-container v-else-if="cursosFiltrados.length === 0" class="lista-cursos lista-cursos--empty">
    <v-row>
      <v-col cols="12" class="text-center py-8">
        <div class="lista-cursos__empty-state">
          <div class="lista-cursos__empty-icon mb-4">
            <v-icon size="x-large" color="grey-lighten-2">mdi-book-off</v-icon>
          </div>
          <div class="lista-cursos__empty-title">No se encontraron cursos</div>
          <div v-if="searchQuery" class="lista-cursos__empty-text">
            Prueba con otro término de búsqueda
          </div>
          <div v-else class="lista-cursos__empty-text">
            Vuelve pronto para ver nuestros nuevos cursos
          </div>
          <v-btn 
            color="primary" 
            variant="outlined" 
            prepend-icon="mdi-refresh"
            @click="cursoStore.fetchAllCursos()"
            class="lista-cursos__refresh-btn"
          >
            Refrescar cursos
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
  
  <v-container v-else class="lista-cursos">
    <v-row align="stretch" justify="start">
      <v-col 
        v-for="(curso, index) in cursosFiltrados" 
        :key="curso.idCurso" 
        cols="12" 
        sm="6" 
        md="4" 
        lg="3"
        class="d-flex lista-cursos__item"
        :class="{ 'lista-cursos__item--animate': animarEntrada }"
        :style="{ 'animation-delay': `${index * 0.05}s` }"
      >
        <CardCurso 
          :id="curso.idCurso"
          :titulo="curso.nombre"
          :descripcion="curso.descripcion"
          :imagen="curso.imagen"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useCursoStore } from '@/stores/Curso'; 
import CardCurso from '@/components/Cursos/CardCurso.vue';

const cursoStore = useCursoStore();

const props = defineProps({
  searchQuery: String
});

const emit = defineEmits(["cursosCargados"]);

const animarEntrada = ref(false);

const cursosFiltrados = computed(() => {
  if (!props.searchQuery) return cursoStore.cursos;
  
  return cursoStore.cursos.filter(curso =>
    curso.nombre.toLowerCase().includes(props.searchQuery.toLowerCase()) ||
    (curso.descripcion && curso.descripcion.toLowerCase().includes(props.searchQuery.toLowerCase()))
  );
});

onMounted(async () => {
  try {
    await cursoStore.fetchAllCursos();
    emit("cursosCargados", cursoStore.cursos);
    
    setTimeout(() => {
      animarEntrada.value = true;
    }, 100);
  } catch (error) {
    console.error("Error al cargar cursos:", error);
  }
});
</script>

<style lang="scss" scoped>
@import "@/assets/sass/components/Cursos/ListaCursos";
</style>