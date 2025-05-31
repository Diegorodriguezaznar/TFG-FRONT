<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useUsuarioStore } from '@/stores/Usuario';
import { useCursoStore } from '@/stores/Curso';
import { useVideoStore } from '@/stores/Video';
import { useQuizStore } from '@/stores/Quiz';
import HeaderUsuarios from '@/components/Layout/HeaderUsuarios.vue';
import Sidebar from '@/components/Layout/Sidebar.vue';
import CursosUsuario from '@/components/Usuarios/Perfil/CursosUsuario.vue';
import VideosUsuario from '@/components/Usuarios/Perfil/VideosUsuario.vue';
import QuizzesUsuario from '@/components/Usuarios/Perfil/QuizzesUsuario.vue';
import UserAvatar from '@/components/Common/UserAvatar.vue';
import type { UsuarioDTO } from '@/stores/dtos/UsuarioDTO';

const route = useRoute();
const usuarioStore = useUsuarioStore();
const cursoStore = useCursoStore();
const videoStore = useVideoStore();
const quizStore = useQuizStore();

const drawer = ref(false);
const loading = ref(true);
const usuario = ref<UsuarioDTO | null>(null);
const cursosUsuario = ref([]);
const videosUsuario = ref([]);
const quizzesUsuario = ref([]);

const usuarioId = computed(() => {
  return route.params.id ? Number(route.params.id) : null;
});

const rolInfo = computed(() => {
  if (!usuario.value) return { name: 'Usuario', color: 'grey', icon: 'mdi-account' };
  
  const roles = {
    3: { name: 'Administrador', color: 'red', icon: 'mdi-shield-crown' },
    2: { name: 'Profesor', color: 'blue', icon: 'mdi-school' },
    1: { name: 'Estudiante', color: 'green', icon: 'mdi-account-school' }
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

const toggleSidebar = () => {
  drawer.value = !drawer.value;
};

const handleSearch = (query: string) => {
  // Búsqueda implementada en componente padre
};

const cargarDatosUsuario = async () => {
  if (!usuarioId.value) return;
  
  loading.value = true;
  
  try {
    await usuarioStore.fetchUsuarioById(usuarioId.value);
    usuario.value = usuarioStore.usuario;
    
    await Promise.all([
      cargarCursosUsuario(),
      cargarVideosUsuario(),
      cargarQuizzesUsuario()
    ]);
  } catch (error) {
    console.error('Error cargando datos del usuario:', error);
  } finally {
    loading.value = false;
  }
};

const cargarCursosUsuario = async () => {
  try {
    await cursoStore.fetchAllCursos();
    cursosUsuario.value = cursoStore.cursos.filter(curso => 
      curso.idUsuario === usuarioId.value
    ).sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime());
  } catch (error) {
    console.error('Error cargando cursos del usuario:', error);
    cursosUsuario.value = [];
  }
};

const cargarVideosUsuario = async () => {
  try {
    await videoStore.fetchAllVideos();
    videosUsuario.value = videoStore.videos.filter(video => 
      video.idUsuario === usuarioId.value
    ).sort((a, b) => new Date(b.fechaSubida).getTime() - new Date(a.fechaSubida).getTime());
  } catch (error) {
    console.error('Error cargando videos del usuario:', error);
    videosUsuario.value = [];
  }
};

const cargarQuizzesUsuario = async () => {
  if (!usuarioId.value) return;
  
  try {
    // Usar el método específico para obtener quizzes por usuario
    const quizzes = await quizStore.fetchQuizzesByUsuario(usuarioId.value);
    quizzesUsuario.value = quizzes.sort((a, b) => {
      const fechaA = new Date(a.fechaCreacion || new Date()).getTime();
      const fechaB = new Date(b.fechaCreacion || new Date()).getTime();
      return fechaB - fechaA;
    });
    
    console.log(`Quizzes cargados para usuario ${usuarioId.value}:`, quizzesUsuario.value);
  } catch (error) {
    console.error('Error cargando quizzes del usuario:', error);
    quizzesUsuario.value = [];
  }
};

onMounted(() => {
  cargarDatosUsuario();
});
</script>

<template>
  <v-app>
    <HeaderUsuarios 
      @toggle-sidebar="toggleSidebar"
      @search="handleSearch"
    />
    
    <v-main class="PerfilUsuario">
      <Sidebar v-model="drawer" />
      
      <v-container class="PerfilUsuario__Container">
        <div v-if="loading" class="PerfilUsuario__Loading">
          <v-progress-circular indeterminate color="orange" size="64"></v-progress-circular>
        </div>
        
        <div v-else-if="!usuario" class="PerfilUsuario__NotFound">
          <v-icon color="grey-lighten-2" size="64" class="PerfilUsuario__NotFoundIcon">mdi-account-alert</v-icon>
          <h3 class="PerfilUsuario__NotFoundTitle">Usuario no encontrado</h3>
          <p class="PerfilUsuario__NotFoundText">El usuario que buscas no existe o no está disponible</p>
          <v-btn color="orange" variant="elevated" to="/usuarios" class="PerfilUsuario__NotFoundButton">
            Volver a Usuarios
          </v-btn>
        </div>
        
        <div v-else>
          <v-card class="PerfilUsuario__Header" elevation="3">
            <div class="PerfilUsuario__HeaderBg">
              <div class="PerfilUsuario__HeaderContent">
                <!-- Avatar y información básica -->
                <div class="d-flex align-center">
                  <UserAvatar
                    :nombre="nombreCompleto"
                    :id-rol="usuario.idRol"
                    :size="120"
                    class="PerfilUsuario__Avatar"
                  />
                  
                  <div class="PerfilUsuario__UserDetails">
                    <h1 class="PerfilUsuario__UserName">
                      {{ nombreCompleto }}
                    </h1>
                    
                    <div class="PerfilUsuario__UserBadges">
                      <v-chip 
                        :color="rolInfo.color" 
                        variant="elevated" 
                        size="large"
                        class="PerfilUsuario__RoleBadge"
                      >
                        <v-icon start :icon="rolInfo.icon"></v-icon>
                        {{ rolInfo.name }}
                      </v-chip>
                      
                      <v-chip 
                        color="white" 
                        variant="elevated" 
                        size="large"
                        class="PerfilUsuario__EmailBadge"
                      >
                        <v-icon start>mdi-email</v-icon>
                        {{ usuario.gmail }}
                      </v-chip>
                    </div>
                    
                    <div v-if="usuario.telefono" class="PerfilUsuario__Phone">
                      <v-icon class="PerfilUsuario__PhoneIcon">mdi-phone</v-icon>
                      {{ usuario.telefono }}
                    </div>
                  </div>
                </div>
                
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
          
          <div class="PerfilUsuario__Content">
            <CursosUsuario 
              :cursos="cursosUsuario" 
              :usuario-nombre="nombreCompleto"
              class="PerfilUsuario__CursosSection"
            />
            
            <VideosUsuario 
              :videos="videosUsuario" 
              :usuario-nombre="nombreCompleto"
              class="PerfilUsuario__VideosSection"
            />
            
            <QuizzesUsuario 
              :quizzes="quizzesUsuario" 
              :usuario-nombre="nombreCompleto"
              class="PerfilUsuario__QuizzesSection"
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

.PerfilUsuario__Loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
}

.PerfilUsuario__NotFound {
  text-align: center;
  padding: 60px 20px;
}

.PerfilUsuario__NotFoundIcon {
  margin-bottom: 16px;
}

.PerfilUsuario__NotFoundTitle {
  font-size: 1.5rem;
  font-weight: 600;
  color: #666;
  margin-bottom: 8px;
}

.PerfilUsuario__NotFoundText {
  color: #999;
  margin-bottom: 24px;
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
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" patternUnits="userSpaceOnUse" width="100" height="100"><filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23noiseFilter)" opacity="0.1"/></pattern></defs><rect width="100%" height="100%" fill="url(%23grain)"/></rect></svg>');
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
  margin-right: 24px;
}

.PerfilUsuario__UserDetails {
  flex: 1;
}

.PerfilUsuario__UserName {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 16px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.PerfilUsuario__UserBadges {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.PerfilUsuario__Phone {
  display: flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
}

.PerfilUsuario__PhoneIcon {
  margin-right: 8px;
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

.PerfilUsuario__Content {
  margin-top: 20px;
}

.PerfilUsuario__CursosSection {
  margin-bottom: 15px;
}

.PerfilUsuario__VideosSection {
  margin-bottom: 15px;
}

.PerfilUsuario__QuizzesSection {
  margin-bottom: 15px;
}

@media (max-width: 768px) {
  .PerfilUsuario__HeaderContent {
    flex-direction: column;
    text-align: center;
    gap: 24px;
  }
  
  .PerfilUsuario__Avatar {
    margin-right: 0;
    margin-bottom: 16px;
  }
  
  .PerfilUsuario__UserName {
    font-size: 2rem;
  }
  
  .PerfilUsuario__Stats {
    justify-content: center;
  }
  
  .PerfilUsuario__Container {
    padding: 16px;
  }
  
  .PerfilUsuario__UserBadges {
    justify-content: center;
  }
}
</style>