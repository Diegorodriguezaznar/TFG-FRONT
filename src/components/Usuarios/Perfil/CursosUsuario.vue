<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import type { CursoDTO } from '@/stores/dtos/CursoDTO';

// Props
const props = defineProps<{
  cursos: CursoDTO[];
  usuarioNombre: string;
}>();

// Variables
const router = useRouter();
const mostrarTodos = ref(false);
const itemsPorDefecto = 5;

// Computed
const cursosVisibles = computed(() => {
  if (mostrarTodos.value) {
    return props.cursos;
  }
  return props.cursos.slice(0, itemsPorDefecto);
});

const hayMasCursos = computed(() => {
  return props.cursos.length > itemsPorDefecto;
});

// Métodos
const toggleMostrarTodos = () => {
  mostrarTodos.value = !mostrarTodos.value;
};

const verCurso = (curso: CursoDTO) => {
  router.push(`/curso/${curso.idCurso}`);
};

const formatearFecha = (fecha: string) => {
  return new Date(fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
</script>

<template>
  <v-card class="CursosUsuario" elevation="2">
    <v-card-title class="CursosUsuario__Header">
      <div class="d-flex align-center">
        <v-icon color="blue" size="large" class="mr-3">mdi-book-education</v-icon>
        <div>
          <h2 class="text-h5 font-weight-bold">Cursos Creados</h2>
          <p class="text-subtitle-2 text-grey mb-0">
            {{ props.cursos.length }} curso{{ props.cursos.length !== 1 ? 's' : '' }} por {{ usuarioNombre }}
          </p>
        </div>
      </div>
    </v-card-title>
    
    <v-card-text class="CursosUsuario__Content">
      <!-- Sin cursos -->
      <div v-if="props.cursos.length === 0" class="CursosUsuario__Empty">
        <v-icon color="grey-lighten-2" size="64" class="mb-4">mdi-book-off</v-icon>
        <h3 class="text-h6 text-grey-darken-1 mb-2">No hay cursos creados</h3>
        <p class="text-body-2 text-grey">Este usuario aún no ha creado ningún curso</p>
      </div>
      
      <!-- Lista de cursos -->
      <div v-else class="CursosUsuario__CursosGrid">
        <v-row>
          <v-col 
            v-for="curso in cursosVisibles" 
            :key="curso.idCurso"
            cols="12" 
            sm="6" 
            md="4"
            class="CursosUsuario__CursoCol"
          >
            <v-card 
              class="CursosUsuario__Curso" 
              elevation="1" 
              @click="verCurso(curso)"
            >
              <!-- Imagen del curso -->
              <v-img 
                :src="curso.imagen || `https://picsum.photos/seed/curso${curso.idCurso}/400/200`" 
                height="160" 
                cover
                class="CursosUsuario__CursoImagen"
              >
                <template v-slot:placeholder>
                  <v-row class="fill-height ma-0" align="center" justify="center">
                    <v-progress-circular indeterminate color="blue"></v-progress-circular>
                  </v-row>
                </template>
              </v-img>
              
              <!-- Contenido del curso -->
              <v-card-item class="CursosUsuario__CursoInfo">
                <v-card-title class="CursosUsuario__CursoTitulo">
                  {{ curso.nombre }}
                </v-card-title>
                
                <v-card-subtitle class="CursosUsuario__CursoFecha">
                  Creado el {{ formatearFecha(curso.fechaCreacion) }}
                </v-card-subtitle>
                
                <v-card-text v-if="curso.descripcion" class="CursosUsuario__CursoDescripcion">
                  {{ curso.descripcion }}
                </v-card-text>
              </v-card-item>
              
              <!-- Acciones -->
              <v-card-actions class="CursosUsuario__CursoAcciones">
                <v-btn 
                  color="blue" 
                  variant="elevated" 
                  size="small"
                  @click.stop="verCurso(curso)"
                  block
                >
                  <v-icon start>mdi-play-circle</v-icon>
                  Ver Curso
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
        
        <!-- Botón para mostrar más/menos -->
        <div v-if="hayMasCursos" class="CursosUsuario__ToggleContainer">
          <v-btn 
            @click="toggleMostrarTodos"
            color="blue"
            variant="outlined"
            size="large"
            block
          >
            <v-icon start>{{ mostrarTodos ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
            {{ mostrarTodos ? 'Mostrar menos' : `Mostrar todos (${props.cursos.length})` }}
          </v-btn>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped lang="scss">
@import "@/assets/sass/components/Usuarios/Perfil/CursosUsuario.scss";
</style>
