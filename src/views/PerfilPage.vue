<script setup>
// --------------------------- Imports ---------------------------
import { ref, computed, onMounted } from 'vue';
import Header from '@/components/Layout/Header.vue';
import Footer from '@/components/Layout/Footer.vue';
import Sidebar from '@/components/Layout/Sidebar.vue';
import UserTab from '@/components/Perfil/UserTab.vue';
import EditarPerfilModal from '@/components/Perfil/EditarPerfilModal.vue';
import CursosInscritos from '@/components/Perfil/CursosInscritos.vue';
import { useUsuarioLogeadoStore } from "@/stores/UsuarioLogeado";
import AvatarRiendo from '@/components/AvatarEmote.vue';

// --------------------------- Store de usuario ---------------------------
const usuarioLogeadoStore = useUsuarioLogeadoStore();

// --------------------------- Variables ---------------------------
const drawer = ref(false);
const items = ref([{ title: 'Inicio', disabled: false, href: '/' }, { title: 'Perfil', disabled: true }]);
const loading = ref(false);
const showEditModal = ref(false);
const showSnackbar = ref(false);
const snackbarText = ref('');
const snackbarColor = ref('success');

// --------------------------- Obtener el usuario actual ---------------------------
const usuarioActual = computed(() => usuarioLogeadoStore.usuarioActual);

// --------------------------- Información del usuario ---------------------------
const nombreCompleto = computed(() => {
  if (!usuarioActual.value) return 'Usuario';
  const nombre = usuarioActual.value.nombre || '';
  const apellidos = usuarioActual.value.apellidos || '';
  return `${nombre} ${apellidos}`.trim() || 'Usuario';
});

const email = computed(() => usuarioActual.value?.gmail || "usuario@ejemplo.com");

const avatarUrl = computed(() => {
  return usuarioActual.value?.avatar || `https://picsum.photos/seed/${usuarioActual.value?.idUsuario}/200/200`;
});

// --------------------------- Información del rol ---------------------------
const rolInfo = computed(() => {
  if (!usuarioActual.value) return { name: 'Usuario', color: 'grey', icon: 'mdi-account' };
  
  const roles = {
    1: { name: 'Administrador', color: 'red', icon: 'mdi-shield-crown' },
    2: { name: 'Profesor', color: 'blue', icon: 'mdi-school' },
    3: { name: 'Estudiante', color: 'green', icon: 'mdi-account-school' }
  };
  return roles[usuarioActual.value.idRol] || { name: 'Usuario', color: 'grey', icon: 'mdi-account' };
});

// --------------------------- Es estudiante para mostrar cursos inscritos ---------------------------
const esEstudiante = computed(() => usuarioActual.value?.idRol === 3);

// --------------------------- Métodos ---------------------------
const abrirModalEdicion = () => {
  showEditModal.value = true;
};

const cerrarModalEdicion = () => {
  showEditModal.value = false;
};

const manejarActualizacion = (success, message) => {
  showEditModal.value = false;
  snackbarText.value = message;
  snackbarColor.value = success ? 'success' : 'error';
  showSnackbar.value = true;
  
  if (success) {
    // Recargar datos del usuario desde localStorage
    usuarioLogeadoStore.cargarUsuarioDesdeStorage();
  }
};

// --------------------------- Verificar usuario en localStorage ---------------------------
const checkUsuarioLocal = () => {
  const usuarioGuardado = localStorage.getItem('usuario');
  if (usuarioGuardado && !usuarioActual.value) {
    try {
      usuarioLogeadoStore.usuarioActual = JSON.parse(usuarioGuardado);
      usuarioLogeadoStore.estaAutenticado = true;
    } catch (error) {
      console.error("Error al recuperar usuario del localStorage:", error);
    }
  }
};

// --------------------------- Ejecutar al montar el componente ---------------------------
onMounted(() => {
  checkUsuarioLocal();
});
</script>

<template>
  <v-app>
    <!-- --------------------------- Header --------------------------- -->
    <Header @toggle-sidebar="drawer = !drawer" />
    
    <!-- --------------------------- Breadcrumb --------------------------- -->
    <v-breadcrumbs class="PerfilPage__Breadcrumb" :items="items">
      <template v-slot:prepend>
        <v-icon icon="mdi-home" size="small"></v-icon>
      </template>
    </v-breadcrumbs>

    <!-- --------------------------- Contenedor principal --------------------------- -->
    <v-main class="PerfilPage">
      <!-- --------------------------- Sidebar --------------------------- -->
      <Sidebar v-model="drawer" />

      <v-container class="PerfilPage__Container">
        <!-- Header del perfil -->
        <v-card class="PerfilPage__Header mb-6" elevation="3">
          <div class="PerfilPage__HeaderBg">
            <div class="PerfilPage__HeaderContent">
              <!-- Avatar y información básica -->
              <div class="d-flex align-center">
                <v-avatar size="120" class="PerfilPage__Avatar">
                  <AvatarRiendo />
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
                      {{ email }}
                    </v-chip>
                  </div>
                  
                  <div v-if="usuarioActual?.telefono" class="text-white">
                    <v-icon class="mr-1">mdi-phone</v-icon>
                    {{ usuarioActual.telefono }}
                  </div>
                </div>
              </div>
              
              <!-- Botón de editar perfil -->
              <div class="PerfilPage__Actions">
                <v-btn 
                  color="white" 
                  variant="elevated" 
                  size="large"
                  prepend-icon="mdi-pencil"
                  @click="abrirModalEdicion"
                  class="PerfilPage__EditBtn"
                >
                  Cambiar Información
                </v-btn>
              </div>
            </div>
          </div>
        </v-card>
        
        <!-- Cursos inscritos (solo para estudiantes) -->
        <CursosInscritos 
          v-if="esEstudiante" 
          :usuario-id="usuarioActual?.idUsuario"
          class="mb-6"
        />
        
        <!-- Componente UserTab -->
        <v-card elevation="2" rounded="lg">
          <v-card-text class="pa-0">
            <UserTab />
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>
    
    <!-- Footer -->
    <Footer />
    
    <!-- Modal de edición -->
    <EditarPerfilModal
      :mostrar="showEditModal"
      :usuario="usuarioActual"
      @cerrar="cerrarModalEdicion"
      @actualizado="manejarActualizacion"
    />
    
    <!-- Snackbar para notificaciones -->
    <v-snackbar
      v-model="showSnackbar"
      :timeout="4000"
      :color="snackbarColor"
    >
      {{ snackbarText }}
      
      <template v-slot:actions>
        <v-btn
          variant="text"
          @click="showSnackbar = false"
        >
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<style scoped>
.PerfilPage {
  background: linear-gradient(135deg, #fff5f0 0%, #ffffff 50%, #fff8f5 100%);
  min-height: 100vh;
}

.PerfilPage__Breadcrumb {
  background-color: transparent;
  padding: 8px 16px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.PerfilPage__Container {
  max-width: 1400px;
  padding-top: 24px;
}

.PerfilPage__Header {
  border-radius: 16px;
  overflow: hidden;
  position: relative;
}

.PerfilPage__HeaderBg {
  background: linear-gradient(135deg, #FF9800 0%, #FFB74D 100%);
  position: relative;
}

.PerfilPage__HeaderBg::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" patternUnits="userSpaceOnUse" width="100" height="100"><filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23noiseFilter)" opacity="0.1"/></pattern></defs><rect width="100%" height="100%" fill="url(%23grain)"/></svg>');
  opacity: 0.3;
}

.PerfilPage__HeaderContent {
  position: relative;
  padding: 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.PerfilPage__Avatar {
  border: 4px solid white;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.PerfilPage__Actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.PerfilPage__EditBtn {
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.PerfilPage__EditBtn:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

@media (max-width: 768px) {
  .PerfilPage__HeaderContent {
    flex-direction: column;
    text-align: center;
    gap: 24px;
  }
  
  .PerfilPage__Container {
    padding: 16px;
  }
  
  .PerfilPage__Actions {
    width: 100%;
  }
  
  .PerfilPage__EditBtn {
    width: 100%;
  }
}

@media (max-width: 600px) {
  .PerfilPage__Container {
    padding: 12px;
  }
  
  .PerfilPage__Avatar {
    width: 100px;
    height: 100px;
  }
}
</style>