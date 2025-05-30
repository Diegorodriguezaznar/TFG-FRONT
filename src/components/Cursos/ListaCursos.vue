<script setup>
// --------------------------- Imports ---------------------------
import { ref, computed, onMounted } from 'vue';
import { useCursoStore } from '@/stores/Curso'; 
import CardCurso from '@/components/Cursos/CardCurso.vue';

// --------------------------- Store ---------------------------
const cursoStore = useCursoStore();

// --------------------------- Props ---------------------------
const props = defineProps({
  searchQuery: String
});

// --------------------------- Eventos ---------------------------
const emit = defineEmits(["cursosCargados"]);

// --------------------------- Variables locales ---------------------------
const animarEntrada = ref(false);

// --------------------------- Filtrar cursos ---------------------------
const cursosFiltrados = computed(() => {
  if (!props.searchQuery) return cursoStore.cursos;
  
  return cursoStore.cursos.filter(curso =>
    curso.nombre.toLowerCase().includes(props.searchQuery.toLowerCase()) ||
    (curso.descripcion && curso.descripcion.toLowerCase().includes(props.searchQuery.toLowerCase()))
  );
});

// --------------------------- Cargar cursos ---------------------------
onMounted(async () => {
  try {
    await cursoStore.fetchAllCursos();
    emit("cursosCargados", cursoStore.cursos);
    
    // Activar animación después de cargar
    setTimeout(() => {
      animarEntrada.value = true;
    }, 100);
  } catch (error) {
    console.error("Error al cargar cursos:", error);
    // El error ya se maneja en el store
  }
});
</script>

<template>
  <!-- Skeleton loaders mientras carga -->
  <v-container v-if="cursoStore.loading" class="ListaCursos__Contenedor">
    <v-row align="stretch" justify="start">
      <v-col v-for="i in 8" :key="i" cols="12" sm="6" md="4" lg="3" class="d-flex">
        <v-skeleton-loader
          type="card"
          height="350"
          class="rounded-lg"
        ></v-skeleton-loader>
      </v-col>
    </v-row>
  </v-container>
  
  <!-- Estado vacío -->
  <v-container v-else-if="cursosFiltrados.length === 0" class="ListaCursos__Contenedor ListaCursos__EstadoVacio">
    <v-row>
      <v-col cols="12" class="text-center py-8">
        <div class="ListaCursos__IconoVacio mb-4">
          <v-icon size="x-large" color="grey-lighten-2">mdi-book-off</v-icon>
        </div>
        <div class="text-h5 text-grey-darken-1 mb-2">No se encontraron cursos</div>
        <div v-if="searchQuery" class="text-body-1 text-grey mb-4">
          Prueba con otro término de búsqueda
        </div>
        <div v-else class="text-body-1 text-grey mb-4">
          Vuelve pronto para ver nuestros nuevos cursos
        </div>
        <v-btn 
          color="primary" 
          variant="outlined" 
          prepend-icon="mdi-refresh"
          @click="cursoStore.fetchAllCursos()"
        >
          Refrescar cursos
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
  
  <!-- Contenedor de cursos -->
  <v-container v-else class="ListaCursos__Contenedor">
    <v-row align="stretch" justify="start">
      <!-- Mostrar cursos -->
      <v-col 
        v-for="(curso, index) in cursosFiltrados" 
        :key="curso.idCurso" 
        cols="12" 
        sm="6" 
        md="4" 
        lg="3"
        class="d-flex curso-col"
        :class="{ 'animate-in': animarEntrada }"
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

<style scoped>
.ListaCursos__Contenedor {
  width: 100%;
  padding: 16px;
}

.ListaCursos__EstadoVacio {
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ListaCursos__IconoVacio {
  background-color: rgba(0, 0, 0, 0.03);
  border-radius: 50%;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

/* Animación de entrada para las cards */
.curso-col {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.curso-col.animate-in {
  opacity: 1;
  transform: translateY(0);
}

/* Media queries para mejor responsividad */
@media (max-width: 600px) {
  .ListaCursos__Contenedor {
    padding: 8px;
  }
}
</style>