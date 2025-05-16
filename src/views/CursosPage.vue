<script setup>
// --------------------------- Imports ---------------------------
import { ref, computed, onMounted } from 'vue';
import { useUsuarioLogeadoStore } from '@/stores/UsuarioLogeado';
import Header from '@/components/Layout/Header.vue';
import Footer from '@/components/Layout/Footer.vue';
import Sidebar from '@/components/Layout/Sidebar.vue';
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

    <!-- --------------------------- Contenedor principal --------------------------- -->
    <div class="CursosPage__Wrapper">
      <!-- --------------------------- Breadcrumb --------------------------- -->
      <v-breadcrumbs class="CursosPage___Breadcrumb" :items="items">
        <template v-slot:prepend>
          <v-icon icon="mdi-book-open-variant" size="small"></v-icon>
        </template>
      </v-breadcrumbs>

      <v-container class="CursosPage__Contenedor">


        <!-- --------------------------- Título de la página --------------------------- -->
        <div class="CursosPage__Header">
          <h1 class="CursosPage__Titulo">Explora nuestros cursos</h1>
          <p class="CursosPage__Subtitulo">Encuentra los mejores cursos para impulsar tu carrera</p>
        </div>

        <!-- --------------------------- Contenido --------------------------- -->
        <div class="CursosPage___contenido">
          <v-container class="CursosPage___ContenedorCursos">
            <v-row align="stretch" justify="start">
              <!-- --------------------------- Mostrar cursos --------------------------- -->
              <v-col v-for="curso in cursosFiltrados" :key="curso.idCurso" cols="12" sm="6" md="4" lg="3" class="d-flex">
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
    </div>
    
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
.CursosPage__Wrapper {
  min-height: calc(100vh - 64px - 64px); // Altura total - header - footer
  background-color: #f5f7fa;
  padding-bottom: 24px;
}

.CursosPage___Breadcrumb {
  background-color: transparent;
  padding: 16px 24px 0;
}

.CursosPage__Contenedor {
  max-width: 1400px;
  margin: 0 auto;
}

.CursosPage__Header {
  text-align: center;
  padding: 24px 0 40px;
}

.CursosPage__Titulo {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 8px;
  background: linear-gradient(90deg, #3f51b5 0%, #2196f3 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.CursosPage__Subtitulo {
  font-size: 1.25rem;
  color: #607d8b;
  margin: 0 auto;
  max-width: 600px;
}

.CursosPage___contenido {
  padding-top: 16px;
}

.CursosPage___ContenedorCursos {
  width: 100%;
}

/* Media queries para mejor responsividad */
@media (max-width: 960px) {
  .CursosPage__Titulo {
    font-size: 2rem;
  }
  
  .CursosPage__Subtitulo {
    font-size: 1.1rem;
  }
}

@media (max-width: 600px) {
  .CursosPage__Header {
    padding: 16px 0 24px;
  }
  
  .CursosPage__Titulo {
    font-size: 1.75rem;
  }
  
  .CursosPage__Subtitulo {
    font-size: 1rem;
  }
}
</style>