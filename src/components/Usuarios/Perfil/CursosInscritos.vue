<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUsuarioCursoStore } from '@/stores/UsuarioCurso';
import { useCursoStore } from '@/stores/Curso';

// Props
const props = defineProps<{
  usuarioId: number | undefined;
}>();

// Variables
const router = useRouter();
const usuarioCursoStore = useUsuarioCursoStore();
const cursoStore = useCursoStore();

const loading = ref(true);
const error = ref('');
const cursosInscritos = ref([]);
const mostrarTodos = ref(false);
const itemsPorDefecto = 6;

// Computed
const cursosVisibles = computed(() => {
  if (mostrarTodos.value) {
    return cursosInscritos.value;
  }
  return cursosInscritos.value.slice(0, itemsPorDefecto);
});

const hayMasCursos = computed(() => {
  return cursosInscritos.value.length > itemsPorDefecto;
});

// Métodos
const cargarCursosInscritos = async () => {
  if (!props.usuarioId) {
    error.value = 'ID de usuario no válido';
    loading.value = false;
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    // Obtener las inscripciones del usuario
    const inscripciones = await usuarioCursoStore.fetchInscripcionesByUsuarioId(props.usuarioId);
    
    if (!inscripciones || inscripciones.length === 0) {
      cursosInscritos.value = [];
      loading.value = false;
      return;
    }

    // Obtener todos los cursos
    await cursoStore.fetchAllCursos();
    const todosCursos = cursoStore.cursos;

    // Filtrar solo los cursos en los que está inscrito
    const cursosConDetalles = inscripciones
      .map(inscripcion => {
        const curso = todosCursos.find(c => c.idCurso === inscripcion.idCurso);
        if (curso) {
          return {
            ...curso,
            fechaInscripcion: inscripcion.fechaCreacion || new Date().toISOString(),
            progreso: Math.floor(Math.random() * 100) // Progreso simulado
          };
        }
        return null;
      })
      .filter(curso => curso !== null)
      .sort((a, b) => new Date(b.fechaInscripcion).getTime() - new Date(a.fechaInscripcion).getTime());

    cursosInscritos.value = cursosConDetalles;

  } catch (err: any) {
    console.error('Error al cargar cursos inscritos:', err);
    error.value = 'Error al cargar los cursos inscritos';
  } finally {
    loading.value = false;
  }
};

const toggleMostrarTodos = () => {
  mostrarTodos.value = !mostrarTodos.value;
};

const verCurso = (curso) => {
  router.push(`/curso/${curso.idCurso}`);
};

const desinscribirse = async (curso, event) => {
  event.stopPropagation();
  
  if (!confirm(`¿Estás seguro de que quieres desinscribirte del curso "${curso.nombre}"?`)) {
    return;
  }

  try {
    const exito = await usuarioCursoStore.deleteInscripcion(props.usuarioId, curso.idCurso);
    
    if (exito) {
      // Eliminar el curso de la lista local
      cursosInscritos.value = cursosInscritos.value.filter(c => c.idCurso !== curso.idCurso);
    } else {
      alert('Error al desinscribirse del curso');
    }
  } catch (error) {
    console.error('Error al desinscribirse:', error);
    alert('Error al desinscribirse del curso');
  }
};

const formatearFecha = (fecha: string) => {
  return new Date(fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const getColorProgreso = (progreso: number) => {
  if (progreso < 30) return 'error';
  if (progreso < 70) return 'warning';
  return 'success';
};

</script>

<template>
  <v-card class="CursosInscritos" elevation="2">
    <v-card-title class="CursosInscritos__Header">
      <div class="d-flex align-center">
        <v-icon color="blue" size="large" class="mr-3">mdi-bookmark-multiple</v-icon>
        <div>
          <h2 class="text-h5 font-weight-bold">Mis Cursos</h2>
          <p class="text-subtitle-2 text-grey mb-0">
            {{ cursosInscritos.length }} curso{{ cursosInscritos.length !== 1 ? 's' : '' }} inscrito{{ cursosInscritos.length !== 1 ? 's' : '' }}
          </p>
        </div>
      </div>
    </v-card-title>
    
    <v-card-text class="CursosInscritos__Content">
      <!-- Estado de carga -->
      <div v-if="loading" class="d-flex justify-center my-8">
        <v-progress-circular indeterminate color="blue" size="64"></v-progress-circular>
      </div>
      
      <!-- Error -->
      <v-alert
        v-else-if="error"
        type="error"
        variant="tonal"
        class="mb-4"
      >
        {{ error }}
      </v-alert>
      
      <!-- Sin cursos -->
      <div v-else-if="cursosInscritos.length === 0" class="CursosInscritos__Empty">
        <v-icon color="grey-lighten-2" size="64" class="mb-4">mdi-bookmark-off</v-icon>
        <h3 class="text-h6 text-grey-darken-1 mb-2">No estás inscrito en ningún curso</h3>
        <p class="text-body-2 text-grey mb-4">Explora nuestros cursos disponibles y comienza a aprender</p>
        <v-btn color="blue" variant="elevated" to="/cursos">
          Explorar Cursos
        </v-btn>
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
            class="CursosInscritos__CursoCol"
          >
            <v-card 
              class="CursosInscritos__Curso" 
              elevation="1" 
              @click="verCurso(curso)"
            >
              <!-- Imagen del curso -->
              <div class="CursosInscritos__CursoImagen">
                <v-img 
                  :src="curso.imagen || `https://picsum.photos/seed/curso${curso.idCurso}/400/200`" 
                  height="160" 
                  cover
                >
                  <template v-slot:placeholder>
                    <v-row class="fill-height ma-0" align="center" justify="center">
                      <v-progress-circular indeterminate color="blue"></v-progress-circular>
                    </v-row>
                  </template>
                </v-img>
                
                <!-- Botón de desinscribirse -->
                <v-btn
                  icon="mdi-bookmark-remove"
                  variant="elevated"
                  color="error"
                  size="small"
                  class="CursosInscritos__DesinscribirBtn"
                  @click.stop="desinscribirse(curso, $event)"
                >
                </v-btn>
              </div>
              
              <!-- Contenido del curso -->
              <v-card-item class="CursosInscritos__CursoInfo">
                <v-card-title class="CursosInscritos__CursoTitulo">
                  {{ curso.nombre }}
                </v-card-title>
                
                <v-card-subtitle class="CursosInscritos__CursoFecha">
                  Inscrito el {{ formatearFecha(curso.fechaInscripcion) }}
                </v-card-subtitle>
                
                <v-card-text v-if="curso.descripcion" class="CursosInscritos__CursoDescripcion">
                  {{ curso.descripcion }}
                </v-card-text>
                
                <!-- Barra de progreso -->
                <div class="CursosInscritos__Progreso mt-3">
                  <div class="d-flex justify-space-between align-center mb-1">
                    <span class="text-caption text-grey">Progreso</span>
                    <span class="text-caption font-weight-medium">{{ curso.progreso }}%</span>
                  </div>
                  <v-progress-linear
                    :model-value="curso.progreso"
                    :color="getColorProgreso(curso.progreso)"
                    height="6"
                    rounded
                  ></v-progress-linear>
                </div>
              </v-card-item>
              
              <!-- Acciones -->
              <v-card-actions class="CursosInscritos__CursoAcciones">
                <v-btn 
                  color="blue" 
                  variant="elevated" 
                  size="small"
                  @click.stop="verCurso(curso)"
                  block
                >
                  <v-icon start>mdi-play-circle</v-icon>
                  Continuar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
        
        <!-- Botón para mostrar más/menos -->
        <div v-if="hayMasCursos" class="CursosInscritos__ToggleContainer">
          <v-btn 
            @click="toggleMostrarTodos"
            color="blue"
            variant="outlined"
            size="large"
            block
          >
            <v-icon start>{{ mostrarTodos ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
            {{ mostrarTodos ? 'Mostrar menos' : `Mostrar todos (${cursosInscritos.length})` }}
          </v-btn>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.CursosInscritos {
  border-radius: 16px;
  border: 1px solid rgba(33, 150, 243, 0.2);
}

.CursosInscritos__Header {
  background: linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(100, 181, 246, 0.05) 100%);
  border-bottom: 1px solid rgba(33, 150, 243, 0.1);
  padding: 20px;
}

.CursosInscritos__Content {
  padding: 20px;
}

.CursosInscritos__Empty {
  text-align: center;
  padding: 40px 20px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 12px;
  border: 2px dashed rgba(0, 0, 0, 0.1);
}

.CursosInscritos__CursoCol {
  animation: fadeInUp 0.5s ease-out;
}

.CursosInscritos__Curso {
  height: 100%;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  cursor: pointer;
  border: 1px solid rgba(33, 150, 243, 0.1);
  position: relative;
}

.CursosInscritos__Curso:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(33, 150, 243, 0.2);
  border-color: rgba(33, 150, 243, 0.3);
}

.CursosInscritos__CursoImagen {
  position: relative;
  border-radius: 12px 12px 0 0;
  overflow: hidden;
}

.CursosInscritos__DesinscribirBtn {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 2;
}

.CursosInscritos__CursoInfo {
  padding: 16px;
}

.CursosInscritos__CursoTitulo {
  font-size: 1.1rem;
  font-weight: 600;
  line-height: 1.3;
  color: #333;
  padding: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.CursosInscritos__CursoFecha {
  color: #666;
  font-size: 0.875rem;
  padding: 4px 0 0 0;
}

.CursosInscritos__CursoDescripcion {
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

.CursosInscritos__Progreso {
  margin-top: 12px;
}

.CursosInscritos__CursoAcciones {
  padding: 16px;
  padding-top: 0;
}

.CursosInscritos__ToggleContainer {
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
  .CursosInscritos__Header {
    padding: 16px;
  }
  
  .CursosInscritos__Content {
    padding: 16px;
  }
  
  .CursosInscritos__Empty {
    padding: 32px 16px;
  }
}
</style>