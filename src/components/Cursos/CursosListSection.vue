<template>
  <section class="cursos-list">
    <v-container class="cursos-list__container">
      <div class="cursos-list__header">
        <h2 class="cursos-list__title">Catálogo de Cursos</h2>
        <div class="cursos-list__info">
          <v-chip color="blue" variant="outlined" class="mr-3 cursos-list__chip">
            {{ cursos.length }} cursos disponibles
          </v-chip>
          <v-btn
            variant="outlined"
            color="blue"
            prepend-icon="mdi-refresh"
            @click="handleRefresh"
            :loading="loading"
            size="small"
            class="cursos-list__refresh-btn"
          >
            Actualizar
          </v-btn>
        </div>
      </div>

      <div v-if="loading" class="cursos-list__loading">
        <v-progress-circular indeterminate color="blue" size="48" class="mb-4"></v-progress-circular>
        <p class="cursos-list__loading-text">Cargando cursos...</p>
      </div>

      <div v-else-if="cursos.length === 0" class="cursos-list__empty">
        <v-icon size="64" color="grey-lighten-2" class="mb-4 cursos-list__empty-icon">mdi-book-off</v-icon>
        <h3 class="cursos-list__empty-title">{{ searchQuery ? 'No se encontraron cursos' : 'No hay cursos disponibles' }}</h3>
        <p class="cursos-list__empty-text">{{ searchQuery ? 'Intenta con otro término' : 'Vuelve pronto para nuevos cursos' }}</p>
        <v-btn 
          v-if="searchQuery"
          color="blue" 
          variant="outlined" 
          @click="handleClearSearch"
          class="cursos-list__clear-btn"
        >
          Limpiar búsqueda
        </v-btn>
      </div>

      <v-row v-else class="cursos-list__grid">
        <v-col 
          v-for="curso in cursos" 
          :key="curso.idCurso" 
          cols="12" 
          sm="6" 
          md="4" 
          lg="3"
          class="cursos-list__col"
        >
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
  </section>
</template>

<script setup lang="ts">
import CardCurso from '@/components/Cursos/CardCurso.vue';

const props = defineProps<{
  cursos: any[];
  loading: boolean;
  searchQuery: string;
}>();

const emit = defineEmits<{
  'refresh': [];
  'clear-search': [];
  'curso-guardado': [cursoId: number];
  'curso-eliminado': [cursoId: number];
}>();

const handleRefresh = () => {
  emit('refresh');
};

const handleClearSearch = () => {
  emit('clear-search');
};

const handleCursoGuardado = (cursoId: number) => {
  emit('curso-guardado', cursoId);
};

const handleCursoEliminado = (cursoId: number) => {
  emit('curso-eliminado', cursoId);
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/components/Cursos/CursosListSection";
</style>