<script setup lang="ts">
import CardCurso from '@/components/CardCurso.vue';

// Props
const props = defineProps<{
  cursos: any[];
  loading: boolean;
  searchQuery: string;
}>();

// Emits
const emit = defineEmits<{
  'refresh': [];
  'clear-search': [];
  'curso-guardado': [cursoId: number];
  'curso-eliminado': [cursoId: number];
}>();

// Métodos
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

<template>
  <section class="CursosList">
    <v-container class="CursosList__Container">
      <!-- Header -->
      <div class="CursosList__Header">
        <h2>Catálogo de Cursos</h2>
        <div class="CursosList__Info">
          <v-chip color="blue" variant="outlined" class="mr-3">
            {{ cursos.length }} cursos disponibles
          </v-chip>
          <v-btn
            variant="outlined"
            color="blue"
            prepend-icon="mdi-refresh"
            @click="handleRefresh"
            :loading="loading"
            size="small"
          >
            Actualizar
          </v-btn>
        </div>
      </div>

      <!-- Estado de carga -->
      <div v-if="loading" class="CursosList__Loading">
        <v-progress-circular indeterminate color="blue" size="48" class="mb-4"></v-progress-circular>
        <p>Cargando cursos...</p>
      </div>

      <!-- Sin cursos -->
      <div v-else-if="cursos.length === 0" class="CursosList__Empty">
        <v-icon size="64" color="grey-lighten-2" class="mb-4">mdi-book-off</v-icon>
        <h3>{{ searchQuery ? 'No se encontraron cursos' : 'No hay cursos disponibles' }}</h3>
        <p class="text-grey">{{ searchQuery ? 'Intenta con otro término' : 'Vuelve pronto para nuevos cursos' }}</p>
        <v-btn 
          v-if="searchQuery"
          color="blue" 
          variant="outlined" 
          @click="handleClearSearch"
        >
          Limpiar búsqueda
        </v-btn>
      </div>

      <!-- Grid de cursos -->
      <v-row v-else>
        <v-col 
          v-for="curso in cursos" 
          :key="curso.idCurso" 
          cols="12" 
          sm="6" 
          md="4" 
          lg="3"
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

<style scoped>
.CursosList {
  background: white;
}

.CursosList__Container {
  padding: 60px 16px;
  max-width: 1400px;
}

/* Header */
.CursosList__Header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 40px;
  flex-wrap: wrap;
  gap: 1rem;
}

.CursosList__Header h2 {
  font-size: 2rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.CursosList__Info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* Estados */
.CursosList__Loading,
.CursosList__Empty {
  text-align: center;
  padding: 60px 20px;
}

.CursosList__Loading p,
.CursosList__Empty h3 {
  color: #333;
  margin-bottom: 1rem;
}

.CursosList__Empty p {
  margin-bottom: 2rem;
}

/* Responsive */
@media (max-width: 768px) {
  .CursosList__Header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .CursosList__Info {
    width: 100%;
    justify-content: space-between;
  }
}

@media (max-width: 600px) {
  .CursosList__Container {
    padding: 40px 16px;
  }
}
</style>