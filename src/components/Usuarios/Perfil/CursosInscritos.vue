<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useUsuarioLogeadoStore } from '@/stores/UsuarioLogeado';
import { useUsuarioCursoStore } from '@/stores/UsuarioCurso';
import { useCursoStore } from '@/stores/Curso';
import CardCurso from '@/components/Cursos/CardCurso.vue';

// Props
const props = defineProps<{
  usuarioId: number | undefined;
}>();

// Emits
const emit = defineEmits<{
  error: [message: string];
  success: [message: string];
}>();

// --------------------------- Stores ---------------------------
const router = useRouter();
const usuarioLogeadoStore = useUsuarioLogeadoStore();
const usuarioCursoStore = useUsuarioCursoStore();
const cursoStore = useCursoStore();

// --------------------------- Variables ---------------------------
const loading = ref(true);
const misCursos = ref([]);
const mostrarTodos = ref(false);
const itemsPorDefecto = 6;

// --------------------------- Computed ---------------------------
const usuarioId = computed(() => {
  // Priorizar el prop, luego el store
  if (props.usuarioId) return props.usuarioId;
  
  const usuario = usuarioLogeadoStore.usuarioActual;
  return usuario?.id || usuario?.idUsuario || null;
});

const cursosVisibles = computed(() => {
  if (mostrarTodos.value) {
    return misCursos.value;
  }
  return misCursos.value.slice(0, itemsPorDefecto);
});

const hayMasCursos = computed(() => {
  return misCursos.value.length > itemsPorDefecto;
});

// --------------------------- Watchers ---------------------------
watch(() => props.usuarioId, (newId) => {
  if (newId) {
    console.log(' Usuario ID cambió, recargando cursos:', newId);
    cargarMisCursos();
  }
}, { immediate: false });

// --------------------------- Métodos ---------------------------
const cargarMisCursos = async () => {
  console.log(' Iniciando carga de cursos para usuario:', usuarioId.value);
  
  if (!usuarioId.value) {
    console.error(" No hay usuario logueado");
    loading.value = false;
    emit('error', 'No hay usuario logueado');
    return;
  }

  try {
    loading.value = true;
    misCursos.value = [];
    
    // 1. Obtener las inscripciones del usuario
    console.log(" Obteniendo inscripciones del usuario:", usuarioId.value);
    const inscripciones = await usuarioCursoStore.fetchInscripcionesByUsuarioId(usuarioId.value);
    console.log(" Inscripciones obtenidas:", inscripciones);
    
    // 2. Obtener todos los cursos
    console.log(" Obteniendo todos los cursos...");
    await cursoStore.fetchAllCursos();
    console.log(" Cursos del store:", cursoStore.cursos);
    
    // 3. Filtrar solo los cursos en los que está inscrito
    if (inscripciones && inscripciones.length > 0) {
      const cursosInscritos = cursoStore.cursos.filter(curso => 
        inscripciones.some(inscripcion => inscripcion.idCurso === curso.idCurso)
      );
      
      // Agregar información adicional de inscripción
      misCursos.value = cursosInscritos.map(curso => {
        const inscripcion = inscripciones.find(i => i.idCurso === curso.idCurso);
        return {
          ...curso,
          fechaInscripcion: inscripcion?.fechaCreacion || new Date().toISOString(),
          progreso: inscripcion?.progreso || Math.floor(Math.random() * 100)
        };
      });
      
      console.log(" Cursos inscritos encontrados:", misCursos.value.length);
    } else {
      misCursos.value = [];
      console.log(" No hay inscripciones para este usuario");
    }
    
  } catch (error) {
    console.error(" Error al cargar mis cursos:", error);
    misCursos.value = [];
    emit('error', 'Error al cargar los cursos inscritos');
  } finally {
    loading.value = false;
  }
};

const toggleMostrarTodos = () => {
  mostrarTodos.value = !mostrarTodos.value;
};

const handleCursoEliminado = (cursoId) => {
  console.log(` Curso eliminado de mis cursos: ${cursoId}`);
  // Remover el curso de la lista local
  misCursos.value = misCursos.value.filter(curso => curso.idCurso !== cursoId);
  emit('success', 'Te has desinscrito del curso correctamente');
};

const handleCursoGuardado = (cursoId) => {
  console.log(` Curso guardado: ${cursoId}`);
  // Recargar la lista por si acaso
  cargarMisCursos();
};

const formatearFecha = (fecha: string) => {
  try {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (err) {
    console.warn('Error al formatear fecha:', fecha);
    return 'Fecha no válida';
  }
};

const getColorProgreso = (progreso: number) => {
  if (progreso < 30) return 'error';
  if (progreso < 70) return 'warning';
  return 'success';
};

// Método para refrescar (expuesto al componente padre)
const refrescarCursos = () => {
  console.log(' Refrescando cursos manualmente');
  cargarMisCursos();
};

// Exponer métodos para uso externo
defineExpose({
  refrescarCursos
});

// --------------------------- Lifecycle Hooks ---------------------------
onMounted(() => {
  console.log(' Componente CursosInscritos montado');
  cargarMisCursos();
});
</script>

<template>
  <v-card class="CursosInscritos" elevation="2">
    <!-- Header -->
    <v-card-title class="CursosInscritos__Header">
      <div class="d-flex align-center justify-space-between w-100">
        <div class="d-flex align-center">
          <v-icon color="blue" size="large" class="mr-3">mdi-bookmark-multiple</v-icon>
          <div>
            <h2 class="text-h5 font-weight-bold">Mis Cursos</h2>
            <p class="text-subtitle-2 text-grey mb-0">
              {{ misCursos.length }} curso{{ misCursos.length !== 1 ? 's' : '' }} inscrito{{ misCursos.length !== 1 ? 's' : '' }}
            </p>
          </div>
        </div>
        
        <!-- Botón de refrescar -->
        <v-btn
          icon="mdi-refresh"
          variant="text"
          :loading="loading"
          @click="refrescarCursos"
          color="blue"
        >
        </v-btn>
      </div>
    </v-card-title>
    
    <!-- Contenido -->
    <v-card-text class="CursosInscritos__Content">
      <!-- Estado de carga -->
      <div v-if="loading" class="text-center py-8">
        <v-progress-circular indeterminate color="blue" size="64" class="mb-4"></v-progress-circular>
        <p class="text-body-2 text-grey">Cargando tus cursos...</p>
      </div>
      
      <!-- Estado vacío -->
      <div v-else-if="misCursos.length === 0" class="CursosInscritos__Empty text-center py-8">
        <div class="mb-4">
          <v-icon size="64" color="grey-lighten-2">mdi-bookmark-off</v-icon>
        </div>
        <h3 class="text-h6 text-grey-darken-1 mb-2">No estás inscrito en ningún curso</h3>
        <p class="text-body-2 text-grey mb-4">Explora nuestros cursos disponibles y comienza a aprender</p>
        <v-btn color="blue" variant="elevated" to="/cursos">
          <v-icon start>mdi-compass</v-icon>
          Explorar Cursos
        </v-btn>
      </div>
      
      <!-- Lista de cursos -->
      <div v-else>
        <!-- Información de resultados -->
        <div class="mb-4">
          <v-chip color="indigo" variant="outlined" class="mr-3">
            {{ misCursos.length }} curso{{ misCursos.length !== 1 ? 's' : '' }}
          </v-chip>
        </div>
        
        <!-- Grid de cursos usando CardCurso (mismo que MisCursosPage) -->
        <v-row align="stretch" justify="start">
          <v-col 
            v-for="(curso, index) in cursosVisibles" 
            :key="curso.idCurso" 
            cols="12" 
            sm="6" 
            md="4"
            class="d-flex CursosInscritos__CursoCol"
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
              class="w-100"
            />
          </v-col>
        </v-row>
        
        <!-- Botón para mostrar más/menos -->
        <div v-if="hayMasCursos" class="CursosInscritos__ToggleContainer mt-4 text-center">
          <v-btn 
            @click="toggleMostrarTodos"
            color="blue"
            variant="outlined"
            size="large"
          >
            <v-icon start>{{ mostrarTodos ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
            {{ mostrarTodos ? 'Mostrar menos' : `Mostrar todos (${misCursos.length})` }}
          </v-btn>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped lang="scss">
@import "@/assets/sass/components/Usuarios/Perfil/CursosInscritos.scss";
</style>
