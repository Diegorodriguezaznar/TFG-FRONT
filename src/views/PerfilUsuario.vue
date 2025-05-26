<!-- src/views/PerfilUsuario.vue -->
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useUsuarioStore } from '@/stores/Usuario';
import { useCursoStore } from '@/stores/Curso';
import { useVideoStore } from '@/stores/Video';
import { useQuizStore } from '@/stores/Quiz';
import HeaderUsuarios from '@/components/Usuarios/HeaderUsuarios.vue';
import Sidebar from '@/components/Layout/Sidebar.vue';
import CursosUsuario from '@/components/Perfil/CursosUsuario.vue';
import VideosUsuario from '@/components/Perfil/VideosUsuario.vue';
import QuizzesUsuario from '@/components/Perfil/QuizzesUsuario.vue';
import type { UsuarioDTO } from '@/stores/dtos/UsuarioDTO';

// Route y stores
const route = useRoute();
const usuarioStore = useUsuarioStore();
const cursoStore = useCursoStore();
const videoStore = useVideoStore();
const quizStore = useQuizStore();

// Variables
const drawer = ref(false);
const loading = ref(true);
const usuario = ref<UsuarioDTO | null>(null);
const cursosUsuario = ref([]);
const videosUsuario = ref([]);
const quizzesUsuario = ref([]);

// Computed
const usuarioId = computed(() => {
  return route.params.id ? Number(route.params.id) : null;
});

const rolInfo = computed(() => {
  if (!usuario.value) return { name: 'Usuario', color: 'grey', icon: 'mdi-account' };
  
  const roles = {
    1: { name: 'Administrador', color: 'red', icon: 'mdi-shield-crown' },
    2: { name: 'Profesor', color: 'blue', icon: 'mdi-school' },
    3: { name: 'Estudiante', color: 'green', icon: 'mdi-account-school' }
  };
  return roles[usuario.value.idRol] || { name: 'Usuario', color: 'grey', icon: 'mdi-account' };
});

const avatarUrl = computed(() => {
  return usuario.value?.avatar || `https://picsum.photos/seed/${usuario.value?.idUsuario}/200/200`;
});

const nombreCompleto = computed(() => {
  if (!usuario.value) return '';
  return `${usuario.value.nombre} ${usuario.value.apellidos || ''}`.trim();
});

// Métodos
const toggleSidebar = () => {
  drawer.value = !drawer.value;
};

const handleSearch = (query: string) => {
  // Implementar búsqueda si es necesario
  console.log('Buscar:', query);
};

const cargarDatosUsuario = async () => {
  if (!usuarioId.value) return;
  
  loading.value = true;
  
  try {
    // Cargar datos del usuario
    await usuarioStore.fetchUsuarioById(usuarioId.value);
    usuario.value = usuarioStore.usuario;
    
    // Cargar contenido del usuario en paralelo
    await Promise.all([
      cargarCursosUsuario(),
      cargarVideosUsuario(),
      cargarQuizzesUsuario()
    ]);
  } catch (error) {
    console.error('Error al cargar datos del usuario:', error);
  } finally {
    loading.value = false;
  }
};

const cargarCursosUsuario = async () => {
  try {
    // Intentar cargar cursos del usuario
    await cursoStore.fetchAllCursos();
    // Filtrar cursos por usuario (esto debería ser un endpoint específico)
    cursosUsuario.value = cursoStore.cursos.filter(curso => 
      curso.idUsuario === usuarioId.value
    ).sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime());
  } catch (error) {
    console.error('Error al cargar cursos del usuario:', error);
    // Datos de fallback
    cursosUsuario.value = [];
  }
};

const cargarVideosUsuario = async () => {
  try {
    await videoStore.fetchAllVideos();
    // Filtrar videos por usuario
    videosUsuario.value = videoStore.videos.filter(video => 
      video.idUsuario === usuarioId.value
    ).sort((a, b) => new Date(b.fechaSubida).getTime() - new Date(a.fechaSubida).getTime());
  } catch (error) {
    console.error('Error al cargar videos del usuario:', error);
    videosUsuario.value = [];
  }
};

const cargarQuizzesUsuario = async () => {
  try {
    await quizStore.fetchAllQuizzes();
    // Filtrar quizzes por usuario
    quizzesUsuario.value = quizStore.quizzes.filter(quiz => 
      quiz.idUsuario === usuarioId.value
    ).sort((a, b) => new Date(b.fechaCreacion || new Date()).getTime() - new Date(a.fechaCreacion || new Date()).getTime());
  } catch (error) {
    console.error('Error al cargar quizzes del usuario:', error);
    quizzesUsuario.value = [];
  }
};

// Lifecycle
onMounted(() => {
  cargarDatosUsuario();
});
</script>

<template>
  <v-app>
    <!-- Header -->
    <HeaderUsuarios 
      @toggle-sidebar="toggleSidebar"
      @search="handleSearch"
    />
    
    <!-- Contenedor principal -->
    <v-main class="PerfilUsuario">
      <!-- Sidebar -->
      <Sidebar v-model="drawer" />
      
      <!-- Contenido -->
      <v-container class="PerfilUsuario__Container">
        <!-- Estado de carga -->
        <div v-if="loading" class="d-flex justify-center my-8">
          <v-progress-circular indeterminate color="orange" size="64"></v-progress-circular>
        </div>
        
        <!-- Error si no se encuentra el usuario -->
        <div v-else-if="!usuario" class="text-center py-12">
          <v-icon color="grey-lighten-2" size="64" class="mb-4">mdi-account-alert</v-icon>
          <h3 class="text-h6 text-grey-darken-1 mb-2">Usuario no encontrado</h3>
          <p class="text-body-1 text-grey">El usuario que buscas no existe o no está disponible</p>
          <v-btn color="orange" variant="elevated" to="/usuarios" class="mt-4">
            Volver a Usuarios
          </v-btn>
        </div>
        
        <!-- Perfil del usuario -->
        <div v-else>
          <!-- Header del perfil -->
          <v-card class="PerfilUsuario__Header mb-6" elevation="3">
            <div class="PerfilUsuario__HeaderBg">
              <div class="PerfilUsuario__HeaderContent">
                <!-- Avatar y información básica -->
                <div class="d-flex align-center">
                  <v-avatar size="120" class="PerfilUsuario__Avatar">
                    <v-img :src="avatarUrl" :alt="nombreCompleto"></v-img>
                  </v-avatar>
                  
                  <div class="ml-6">
                    <h1 class="text-h4 font-weight-bold text-white mb-2">
                      {{ nombreCompleto }}
                    </h1>
                    
                    <div class="d-flex align-center mb-3">
                      <v-chip 
                        :color="rolInfo.color" 
                        variant="elevated" 
                        size="large"
                        class="mr-3"
                      >
                        <v-icon start :icon="rolInfo.icon"></v-icon>
                        {{ rolInfo.name }}
                      </v-chip>
                      
                      <v-chip 
                        color="white" 
                        variant="elevated" 
                        size="large"
                      >
                        <v-icon start>mdi-email</v-icon>
                        {{ usuario.gmail }}
                      </v-chip>
                    </div>
                    
                    <div v-if="usuario.telefono" class="text-white">
                      <v-icon class="mr-1">mdi-phone</v-icon>
                      {{ usuario.telefono }}
                    </div>
                  </div>
                </div>
                
                <!-- Estadísticas rápidas -->
                <div class="PerfilUsuario__Stats">
                  <div class="PerfilUsuario__Stat">
                    <div class="PerfilUsuario__StatNumber">{{ cursosUsuario.length }}</div>
                    <div class="PerfilUsuario__StatLabel">Cursos</div>
                  </div>
                  <div class="PerfilUsuario__Stat">
                    <div class="PerfilUsuario__StatNumber">{{ videosUsuario.length }}</div>
                    <div class="PerfilUsuario__StatLabel">Videos</div>
                  </div>
                  <div class="PerfilUsuario__Stat">
                    <div class="PerfilUsuario__StatNumber">{{ quizzesUsuario.length }}</div>
                    <div class="PerfilUsuario__StatLabel">Quizzes</div>
                  </div>
                </div>
              </div>
            </div>
          </v-card>
          
          <!-- Contenido creado por el usuario -->
          <div class="PerfilUsuario__Content">
            <!-- Cursos -->
            <CursosUsuario 
              :cursos="cursosUsuario" 
              :usuario-nombre="nombreCompleto"
              class="mb-8"
            />
            
            <!-- Videos -->
            <VideosUsuario 
              :videos="videosUsuario" 
              :usuario-nombre="nombreCompleto"
              class="mb-8"
            />
            
            <!-- Quizzes -->
            <QuizzesUsuario 
              :quizzes="quizzesUsuario" 
              :usuario-nombre="nombreCompleto"
            />
          </div>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.PerfilUsuario {
  background: linear-gradient(135deg, #fff5f0 0%, #ffffff 50%, #fff8f5 100%);
  min-height: 100vh;
}

.PerfilUsuario__Container {
  padding-top: 24px;
  max-width: 1400px;
}

.PerfilUsuario__Header {
  border-radius: 16px;
  overflow: hidden;
  position: relative;
}

.PerfilUsuario__HeaderBg {
  background: linear-gradient(135deg, #FF9800 0%, #FFB74D 100%);
  position: relative;
}

.PerfilUsuario__HeaderBg::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" patternUnits="userSpaceOnUse" width="100" height="100"><filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23noiseFilter)" opacity="0.1"/></pattern></defs><rect width="100%" height="100%" fill="url(%23grain)"/></svg>');
  opacity: 0.3;
}

.PerfilUsuario__HeaderContent {
  position: relative;
  padding: 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.PerfilUsuario__Avatar {
  border: 4px solid white;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.PerfilUsuario__Stats {
  display: flex;
  gap: 24px;
}

.PerfilUsuario__Stat {
  text-align: center;
  background: rgba(255, 255, 255, 0.15);
  padding: 16px 24px;
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.PerfilUsuario__StatNumber {
  font-size: 2rem;
  font-weight: 700;
  color: white;
  line-height: 1;
}

.PerfilUsuario__StatLabel {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  margin-top: 4px;
}

@media (max-width: 768px) {
  .PerfilUsuario__HeaderContent {
    flex-direction: column;
    text-align: center;
    gap: 24px;
  }
  
  .PerfilUsuario__Stats {
    justify-content: center;
  }
  
  .PerfilUsuario__Container {
    padding: 16px;
  }
}
</style>