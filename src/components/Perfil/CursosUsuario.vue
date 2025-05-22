<!-- src/components/PerfilUsuario/CursosUsuario.vue -->
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
        <v-icon color="orange" size="large" class="mr-3">mdi-book-education</v-icon>
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
      <div v-else>
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
                    <v-progress-circular indeterminate color="orange"></v-progress-circular>
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
                  color="orange" 
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
            color="orange"
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

<style scoped>
.CursosUsuario {
  border-radius: 16px;
  border: 1px solid rgba(255, 152, 0, 0.2);
}

.CursosUsuario__Header {
  background: linear-gradient(135deg, rgba(255, 152, 0, 0.1) 0%, rgba(255, 183, 77, 0.05) 100%);
  border-bottom: 1px solid rgba(255, 152, 0, 0.1);
  padding: 20px;
}

.CursosUsuario__Content {
  padding: 20px;
}

.CursosUsuario__Empty {
  text-align: center;
  padding: 40px 20px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 12px;
  border: 2px dashed rgba(0, 0, 0, 0.1);
}

.CursosUsuario__CursoCol {
  animation: fadeInUp 0.5s ease-out;
}

.CursosUsuario__Curso {
  height: 100%;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  cursor: pointer;
  border: 1px solid rgba(255, 152, 0, 0.1);
}

.CursosUsuario__Curso:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(255, 152, 0, 0.2);
  border-color: rgba(255, 152, 0, 0.3);
}

.CursosUsuario__CursoImagen {
  border-radius: 12px 12px 0 0;
}

.CursosUsuario__CursoInfo {
  padding: 16px;
}

.CursosUsuario__CursoTitulo {
  font-size: 1.1rem;
  font-weight: 600;
  line-height: 1.3;
  color: #333;
  padding: 0;
}

.CursosUsuario__CursoFecha {
  color: #666;
  font-size: 0.875rem;
  padding: 4px 0 0 0;
}

.CursosUsuario__CursoDescripcion {
  color: #555;
  font-size: 0.875rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
  padding: 8px 0 0 0;
}

.CursosUsuario__CursoAcciones {
  padding: 16px;
  padding-top: 0;
}

.CursosUsuario__ToggleContainer {
  margin-top: 24px;
  text-align: center;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 600px) {
  .CursosUsuario__Header {
    padding: 16px;
  }
  
  .CursosUsuario__Content {
    padding: 16px;
  }
  
  .CursosUsuario__Empty {
    padding: 32px 16px;
  }
}
</style>