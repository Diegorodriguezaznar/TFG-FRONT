<script setup lang="ts">
//imports
import { ref, computed, onMounted } from "vue";
import CardCurso from "@/components/CardCurso.vue";
import { useUsuarioLogeadoStore } from "@/stores/UsuarioLogeado";

// Stores
const usuarioLogeadoStore = useUsuarioLogeadoStore();

// Estado para cursos y carga
const cursos = ref([]);
const loading = ref(false);
const error = ref("");

// ID del usuario actual
const usuarioId = computed(() => {
  const usuario = usuarioLogeadoStore.usuarioActual;
  return usuario?.id || usuario?.idUsuario || null;
});

// Obtener las inscripciones del usuario
const obtenerCursos = async () => {
  if (!usuarioId.value) {
    error.value = "Debes iniciar sesión para ver tus cursos";
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    // Obtener las inscripciones del usuario 

    const response = await fetch(`http://localhost:5687/api/UsuarioCurso/usuario/${usuarioId.value}`);
    
    if (!response.ok) {
      throw new Error(`Error al obtener inscripciones (${response.status})`);
    }
    
    const inscripciones = await response.json();
    console.log("Inscripciones:", inscripciones);
    
    if (!inscripciones || inscripciones.length === 0) {
      cursos.value = [];
      return;
    }
    
    // Para cada inscripción, necesitamos obtener los datos del curso
    // Pero primero, veamos si estos datos están incluidos en la respuesta
    
    // Verificamos si las inscripciones ya incluyen los datos del curso
    if (inscripciones[0].curso) {
      // Si las inscripciones ya incluyen el objeto curso
      cursos.value = inscripciones.map(inscripcion => ({
        id: inscripcion.curso.idCurso,
        titulo: inscripcion.curso.nombre,
        subtitulo: "",
        descripcion: inscripcion.curso.descripcion,
        imagen: inscripcion.curso.imagen
      }));
    } else {
      // Si solo tenemos IDs, necesitamos obtener los datos de cada curso
      // Pero parece que la ruta /api/Curso/{id} no funciona
      // Intentemos obtener todos los cursos y filtrar
      
      const cursosResponse = await fetch("http://localhost:5687/api/Curso");
      
      if (!cursosResponse.ok) {
        throw new Error(`Error al obtener cursos (${cursosResponse.status})`);
      }
      
      const todosCursos = await cursosResponse.json();
      console.log("Todos los cursos:", todosCursos);
      
      // Filtrar solo los cursos en los que está inscrito
      const cursosIds = inscripciones.map(insc => insc.idCurso);
      const cursosInscritos = todosCursos.filter(curso => 
        cursosIds.includes(curso.idCurso)
      );
      
      // Transformar al formato esperado por CardCurso
      cursos.value = cursosInscritos.map(curso => ({
        id: curso.idCurso,
        titulo: curso.nombre,
        subtitulo: "",
        descripcion: curso.descripcion,
        imagen: curso.imagen
      }));
    }
  } catch (err) {
    console.error("Error:", err);
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

// Cargar datos al montar el componente
onMounted(() => {
  obtenerCursos();
});
</script>

<template>
  <v-container class="MisCursos__Contenedor">
    <!-- Estado de carga -->
    <v-card v-if="loading" class="pa-5 d-flex justify-center align-center">
      <v-progress-circular indeterminate color="orange-darken-2"></v-progress-circular>
    </v-card>
    
    <!-- Mensaje de error -->
    <v-card v-else-if="error" class="pa-5 text-center">
      <v-icon color="error" size="large">mdi-alert-circle</v-icon>
      <p class="text-h6 mt-2">{{ error }}</p>
    </v-card>
    
    <!-- Sin cursos -->
    <v-card v-else-if="cursos.length === 0" class="pa-5 text-center">
      <v-icon size="large">mdi-school</v-icon>
      <p class="text-h6 mt-2">No estás inscrito en ningún curso</p>
    </v-card>
    
    <!-- Lista de cursos -->
    <v-row v-else align="start" justify="start">
      <v-col v-for="curso in cursos" :key="curso.id" cols="12" sm="6" md="4" lg="3">
        <CardCurso
          :id="curso.id"
          :titulo="curso.titulo"
          :subtitulo="curso.subtitulo"
          :descripcion="curso.descripcion"
          :imagen="curso.imagen"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="scss" scoped>
@import "@/assets/sass/components/Mis/MisCursos.scss";
</style>