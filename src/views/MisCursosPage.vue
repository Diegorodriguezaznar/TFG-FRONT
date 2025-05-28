<script setup lang="ts">
// --------------------------- Imports ---------------------------
import { ref, computed, onMounted } from 'vue';
import { useUsuarioLogeadoStore } from '@/stores/UsuarioLogeado';
import { useUsuarioCursoStore } from '@/stores/UsuarioCurso';
import { useCursoStore } from '@/stores/Curso';
import Header from '@/components/Layout/Header.vue';
import Footer from '@/components/Layout/Footer.vue';
import SideBarCursos from '@/components/Layout/SideBarCursos.vue';
import CardCurso from '@/components/CardCurso.vue';

// --------------------------- Breadcrumb ---------------------------
const items = ref([
  { title: 'Inicio', href: '/cursos' },
  { title: 'Mis Cursos', disabled: true, href: '/mis-cursos' }
]);

// --------------------------- Stores ---------------------------
const usuarioLogeadoStore = useUsuarioLogeadoStore();
const usuarioCursoStore = useUsuarioCursoStore();
const cursoStore = useCursoStore();

// --------------------------- Variables ---------------------------
const drawer = ref(false);
const loading = ref(true);
const misCursos = ref([]);
const searchQuery = ref('');

// --------------------------- Computed ---------------------------
const usuarioId = computed(() => {
  const usuario = usuarioLogeadoStore.usuarioActual;
  return usuario?.id || usuario?.idUsuario || null;
});

const cursosFiltrados = computed(() => {
  if (!searchQuery.value) return misCursos.value;
  
  return misCursos.value.filter(curso =>
    curso.nombre.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    (curso.descripcion && curso.descripcion.toLowerCase().includes(searchQuery.value.toLowerCase()))
  );
});

// --------------------------- Métodos ---------------------------
const cargarMisCursos = async () => {
  if (!usuarioId.value) {
    console.error("No hay usuario logueado");
    loading.value = false;
    return;
  }

  try {
    loading.value = true;
    
    // 1. Obtener las inscripciones del usuario
    console.log("Obteniendo inscripciones del usuario:", usuarioId.value);
    const inscripciones = await usuarioCursoStore.fetchInscripcionesByUsuarioId(usuarioId.value);
    
    // 2. Obtener todos los cursos
    console.log("Obteniendo todos los cursos...");
    await cursoStore.fetchAllCursos();
    
    // 3. Filtrar solo los cursos en los que está inscrito
    if (inscripciones && inscripciones.length > 0) {
      const cursosInscritos = cursoStore.cursos.filter(curso => 
        inscripciones.some(inscripcion => inscripcion.idCurso === curso.idCurso)
      );
      
      misCursos.value = cursosInscritos;
      console.log("Cursos encontrados:", cursosInscritos.length);
    } else {
      misCursos.value = [];
      console.log("No hay inscripciones para este usuario");
    }
    
  } catch (error) {
    console.error("Error al cargar mis cursos:", error);
    misCursos.value = [];
  } finally {
    loading.value = false;
  }
};

const handleCursoEliminado = (cursoId) => {
  console.log(`Curso eliminado de mis cursos: ${cursoId}`);
  // Remover el curso de la lista local
  misCursos.value = misCursos.value.filter(curso => curso.idCurso !== cursoId);
};

const handleCursoGuardado = (cursoId) => {
  console.log(`Curso guardado: ${cursoId}`);
  // Recargar la lista por si acaso
  cargarMisCursos();
};

// --------------------------- Lifecycle Hooks ---------------------------
onMounted(() => {
  cargarMisCursos();
});
</script>

<template>
  <v-app>
    <!-- --------------------------- Header --------------------------- -->
    <Header @toggle-sidebar="drawer = !drawer" @update-search="searchQuery = $event" />
    <SideBarCursos v-model="drawer" />

    <!-- --------------------------- Contenedor principal --------------------------- -->
    <div class="MisCursosPage__Wrapper">
      <!-- --------------------------- Breadcrumb --------------------------- -->
      <v-breadcrumbs class="MisCursosPage__Breadcrumb" :items="items">
        <template v-slot:prepend>
          <v-icon icon="mdi-bookmark-multiple" size="small"></v-icon>
        </template>
      </v-breadcrumbs>

      <v-container class="MisCursosPage__Contenedor">
        <!-- --------------------------- Título de la página --------------------------- -->
        <div class="MisCursosPage__Header">
          <div class="d-flex align-center mb-4">
            <v-icon color="orange" size="x-large" class="mr-3">mdi-bookmark-multiple</v-icon>
            <div>
              <h1 class="MisCursosPage__Titulo">Mis Cursos</h1>
              <p class="MisCursosPage__Subtitulo">Cursos en los que estás inscrito</p>
            </div>
          </div>
        </div>

        <!-- --------------------------- Contenido --------------------------- -->
        <div class="MisCursosPage__Contenido">
          <!-- Estado de carga -->
          <div v-if="loading" class="text-center py-12">
            <v-progress-circular indeterminate color="orange" size="64" class="mb-4"></v-progress-circular>
            <p class="text-h6">Cargando tus cursos...</p>
          </div>
          
          <!-- Estado vacío -->
          <div v-else-if="cursosFiltrados.length === 0" class="MisCursosPage__EstadoVacio">
            <div class="text-center py-12">
              <div class="MisCursosPage__IconoVacio mb-4">
                <v-icon size="80" color="grey-lighten-2">mdi-bookmark-off</v-icon>
              </div>
              <h3 class="text-h5 text-grey-darken-1 mb-2">
                {{ searchQuery ? 'No se encontraron cursos' : 'No tienes cursos guardados' }}
              </h3>
              <p class="text-body-1 text-grey mb-4">
                {{ searchQuery 
                    ? 'Prueba con otro término de búsqueda' 
                    : 'Explora nuestros cursos y guarda los que te interesen' 
                }}
              </p>
              <div class="d-flex gap-3 justify-center">
                <v-btn 
                  color="orange" 
                  variant="elevated" 
                  prepend-icon="mdi-compass"
                  to="/cursos"
                  size="large"
                >
                  Explorar Cursos
                </v-btn>
                <v-btn 
                  v-if="searchQuery"
                  color="grey" 
                  variant="outlined" 
                  prepend-icon="mdi-refresh"
                  @click="searchQuery = ''"
                  size="large"
                >
                  Limpiar Búsqueda
                </v-btn>
              </div>
            </div>
          </div>
          
          <!-- Lista de cursos -->
          <div v-else>
            <!-- Información de resultados -->
            <div class="MisCursosPage__Info mb-4">
              <div class="d-flex align-center justify-space-between">
                <div class="d-flex align-center">
                  <v-chip color="orange" variant="outlined" class="mr-3">
                    {{ cursosFiltrados.length }} curso{{ cursosFiltrados.length !== 1 ? 's' : '' }}
                  </v-chip>
                  <span v-if="searchQuery" class="text-body-2 text-grey">
                    Filtrando por: "{{ searchQuery }}"
                  </span>
                </div>
                
                <v-btn 
                  variant="outlined" 
                  color="orange" 
                  prepend-icon="mdi-refresh"
                  @click="cargarMisCursos"
                  :loading="loading"
                  size="small"
                >
                  Actualizar
                </v-btn>
              </div>
            </div>
            
            <!-- Grid de cursos -->
            <v-container class="MisCursosPage__ContenedorCursos">
              <v-row align="stretch" justify="start">
                <v-col 
                  v-for="(curso, index) in cursosFiltrados" 
                  :key="curso.idCurso" 
                  cols="12" 
                  sm="6" 
                  md="4" 
                  lg="3"
                  class="d-flex curso-col"
                  :style="{ 'animation-delay': `${index * 0.05}s` }"
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
          </div>
        </div>
      </v-container>
    </div>
    
    <!-- --------------------------- Footer --------------------------- -->
    <Footer />
  </v-app>
</template>

<style lang="scss" scoped>
.MisCursosPage__Wrapper {
  min-height: calc(100vh - 64px - 64px); // Altura total - header - footer
  background: linear-gradient(135deg, #fff5f0 0%, #ffffff 50%, #fff8f5 100%);
  padding-bottom: 24px;
}

.MisCursosPage__Breadcrumb {
  background-color: transparent;
  padding: 16px 24px 0;
}

.MisCursosPage__Contenedor {
  max-width: 1400px;
  margin: 0 auto;
}

.MisCursosPage__Header {
  padding: 24px 0 16px;
}

.MisCursosPage__Titulo {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 4px;
  background: linear-gradient(90deg, #FF9800 0%, #FFB74D 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.MisCursosPage__Subtitulo {
  font-size: 1.25rem;
  color: #607d8b;
  margin: 0;
}

.MisCursosPage__Contenido {
  padding-top: 16px;
}

.MisCursosPage__EstadoVacio {
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.MisCursosPage__IconoVacio {
  background-color: rgba(0, 0, 0, 0.03);
  border-radius: 50%;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.MisCursosPage__Info {
  background: rgba(255, 152, 0, 0.05);
  border-radius: 12px;
  padding: 16px;
  border-left: 4px solid #FF9800;
}

.MisCursosPage__ContenedorCursos {
  width: 100%;
}

/* Animación de entrada para las cards */
.curso-col {
  opacity: 0;
  transform: translateY(20px);
  animation: slideInUp 0.5s ease forwards;
}

@keyframes slideInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Media queries para mejor responsividad */
@media (max-width: 960px) {
  .MisCursosPage__Titulo {
    font-size: 2rem;
  }
  
  .MisCursosPage__Subtitulo {
    font-size: 1.1rem;
  }
}

@media (max-width: 600px) {
  .MisCursosPage__Header {
    padding: 16px 0 12px;
  }
  
  .MisCursosPage__Titulo {
    font-size: 1.75rem;
  }
  
  .MisCursosPage__Subtitulo {
    font-size: 1rem;
  }
  
  .MisCursosPage__Info {
    padding: 12px;
  }
}
</style>