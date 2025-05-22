<!-- src/components/Usuarios/CardUsuario.vue - Versión completa con navegación -->
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUsuarioEstadisticasStore } from '@/stores/UsuarioEstadisticas';
import type { UsuarioDTO } from '@/stores/dtos/UsuarioDTO';

// Props
const props = defineProps<{
  usuario: UsuarioDTO;
}>();

// Router y Store
const router = useRouter();
const estadisticasStore = useUsuarioEstadisticasStore();

// Variables
const loading = ref(true);

// Computed
const rolInfo = computed(() => {
  const roles = {
    1: { name: 'Administrador', color: 'red', icon: 'mdi-shield-crown' },
    2: { name: 'Profesor', color: 'blue', icon: 'mdi-school' },
    3: { name: 'Estudiante', color: 'green', icon: 'mdi-account-school' }
  };
  return roles[props.usuario.idRol] || { name: 'Usuario', color: 'grey', icon: 'mdi-account' };
});

const avatarUrl = computed(() => {
  return props.usuario.avatar || `https://picsum.photos/seed/${props.usuario.idUsuario}/150/150`;
});

const nombreCompleto = computed(() => {
  return `${props.usuario.nombre} ${props.usuario.apellidos || ''}`.trim();
});

const estadisticas = computed(() => {
  return estadisticasStore.getEstadisticasUsuario(props.usuario.idUsuario);
});

// Métodos
const cargarEstadisticas = async () => {
  loading.value = true;
  
  try {
    await estadisticasStore.fetchEstadisticasUsuario(props.usuario.idUsuario);
  } catch (error) {
    console.error('Error al cargar estadísticas:', error);
  } finally {
    loading.value = false;
  }
};

const verPerfil = () => {
  console.log(`Navegando al perfil de ${nombreCompleto.value}`);
  // Navegar al perfil del usuario específico
  router.push(`/usuario/${props.usuario.idUsuario}`);
};

const verCursos = () => {
  console.log(`Viendo cursos de ${nombreCompleto.value}`);
  // Navegar a los cursos del profesor
  router.push(`/cursos?profesor=${props.usuario.idUsuario}`);
};

// Lifecycle
onMounted(() => {
  cargarEstadisticas();
});
</script>

<template>
  <v-card 
    class="CardUsuario elevation-2"
    hover
    @click="verPerfil"
  >
    <!-- Header con avatar y rol -->
    <div class="CardUsuario__Header">
      <div class="CardUsuario__AvatarSection">
        <v-avatar size="64" class="CardUsuario__Avatar">
          <v-img :src="avatarUrl" :alt="nombreCompleto"></v-img>
        </v-avatar>
        
        <div class="CardUsuario__Chips">
          <v-chip 
            :color="rolInfo.color" 
            size="small" 
            variant="elevated"
            class="CardUsuario__RolChip"
          >
            <v-icon start :icon="rolInfo.icon" size="small"></v-icon>
            {{ rolInfo.name }}
          </v-chip>
        </div>
      </div>
    </div>
    
    <!-- Información del usuario -->
    <v-card-item class="CardUsuario__Info">
      <v-card-title class="CardUsuario__Nombre">
        {{ nombreCompleto }}
      </v-card-title>
      
      <v-card-subtitle class="CardUsuario__Email">
        <v-icon size="small" class="mr-1">mdi-email</v-icon>
        {{ usuario.gmail }}
      </v-card-subtitle>
      
      <div v-if="usuario.telefono" class="CardUsuario__Telefono mt-1">
        <v-icon size="small" class="mr-1" color="grey">mdi-phone</v-icon>
        <span class="text-caption text-grey">{{ usuario.telefono }}</span>
      </div>
    </v-card-item>
    
    <!-- Estadísticas -->
    <v-card-text class="CardUsuario__Stats">
      <div v-if="loading" class="text-center py-4">
        <v-progress-circular indeterminate color="orange" size="24"></v-progress-circular>
        <div class="text-caption text-grey mt-2">Cargando estadísticas...</div>
      </div>
      
      <div v-else-if="estadisticas" class="CardUsuario__StatsGrid">
        <!-- Cursos -->
        <div class="CardUsuario__Stat">
          <div class="CardUsuario__StatIcon">
            <v-icon color="orange" size="20">mdi-book-education</v-icon>
          </div>
          <div class="CardUsuario__StatContent">
            <div class="CardUsuario__StatNumber">{{ estadisticas.totalCursos }}</div>
            <div class="CardUsuario__StatLabel">Cursos</div>
          </div>
        </div>
        
        <!-- Videos -->
        <div class="CardUsuario__Stat">
          <div class="CardUsuario__StatIcon">
            <v-icon color="orange" size="20">mdi-play-circle</v-icon>
          </div>
          <div class="CardUsuario__StatContent">
            <div class="CardUsuario__StatNumber">{{ estadisticas.totalVideos }}</div>
            <div class="CardUsuario__StatLabel">Videos</div>
          </div>
        </div>
        
        <!-- Quizzes -->
        <div class="CardUsuario__Stat">
          <div class="CardUsuario__StatIcon">
            <v-icon color="orange" size="20">mdi-help-circle</v-icon>
          </div>
          <div class="CardUsuario__StatContent">
            <div class="CardUsuario__StatNumber">{{ estadisticas.totalQuizzes }}</div>
            <div class="CardUsuario__StatLabel">Quizzes</div>
          </div>
        </div>
      </div>
      
      <div v-else class="text-center py-4">
        <v-icon color="grey" size="24">mdi-alert-circle-outline</v-icon>
        <div class="text-caption text-grey mt-1">Error al cargar estadísticas</div>
      </div>
    </v-card-text>
    
    <!-- Acciones -->
    <v-card-actions class="CardUsuario__Actions">
      <v-btn
        color="orange"
        size="small"
        prepend-icon="mdi-account"
        @click.stop="verPerfil"
        variant="elevated"
        class="flex-grow-1 mr-1"
      >
        Ver Perfil
      </v-btn>
      
      <v-btn
        color="blue"
        size="small"
        prepend-icon="mdi-school"
        @click.stop="verCursos"
        variant="outlined"
        class="flex-grow-1 ml-1"
      >
        Cursos
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.CardUsuario {
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border: 1px solid rgba(255, 152, 0, 0.1);
  background: linear-gradient(135deg, #ffffff 0%, #fff8f5 100%);
  cursor: pointer;
}

.CardUsuario:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(255, 152, 0, 0.2) !important;
  border-color: rgba(255, 152, 0, 0.3);
}

.CardUsuario__Header {
  background: linear-gradient(135deg, #FF9800 0%, #FFB74D 100%);
  padding: 20px;
  position: relative;
}

.CardUsuario__AvatarSection {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.CardUsuario__Avatar {
  border: 3px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 12px;
  transition: transform 0.2s ease;
}

.CardUsuario:hover .CardUsuario__Avatar {
  transform: scale(1.05);
}

.CardUsuario__Chips {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.CardUsuario__RolChip {
  font-weight: 600;
  letter-spacing: 0.5px;
}

.CardUsuario__Info {
  padding: 16px 20px 8px 20px;
  text-align: center;
}

.CardUsuario__Nombre {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  line-height: 1.3;
  padding: 0;
}

.CardUsuario__Email {
  color: #666;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px 0 0 0;
}

.CardUsuario__Telefono {
  display: flex;
  align-items: center;
  justify-content: center;
}

.CardUsuario__Stats {
  padding: 12px 20px;
}

.CardUsuario__StatsGrid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.CardUsuario__Stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 8px;
  background: white;
  border-radius: 12px;
  border: 1px solid rgba(255, 152, 0, 0.1);
  transition: all 0.2s ease;
  position: relative;
}

.CardUsuario__Stat:hover {
  background: rgba(255, 152, 0, 0.05);
  transform: scale(1.02);
}

.CardUsuario__StatIcon {
  margin-bottom: 4px;
}

.CardUsuario__StatContent {
  text-align: center;
}

.CardUsuario__StatNumber {
  font-size: 1.25rem;
  font-weight: 700;
  color: #FF9800;
  line-height: 1;
}

.CardUsuario__StatLabel {
  font-size: 0.75rem;
  color: #666;
  font-weight: 500;
  margin-top: 2px;
}

.CardUsuario__Actions {
  padding: 12px 20px 20px 20px;
  gap: 8px;
}

.CardUsuario__Actions .v-btn {
  font-weight: 500;
  letter-spacing: 0.5px;
  border-radius: 8px;
  text-transform: none;
  transition: all 0.2s ease;
}

.CardUsuario__Actions .v-btn:hover {
  transform: scale(1.02);
}

/* Animaciones */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.CardUsuario {
  animation: fadeIn 0.5s ease-out;
}

/* Responsive */
@media (max-width: 600px) {
  .CardUsuario__Header {
    padding: 16px;
  }
  
  .CardUsuario__Avatar {
    width: 56px;
    height: 56px;
  }
  
  .CardUsuario__StatsGrid {
    gap: 8px;
  }
  
  .CardUsuario__Stat {
    padding: 8px 4px;
  }
  
  .CardUsuario__StatNumber {
    font-size: 1.1rem;
  }
  
  .CardUsuario__StatLabel {
    font-size: 0.7rem;
  }

  .CardUsuario__Actions {
    flex-direction: column;
  }
  
  .CardUsuario__Actions .v-btn {
    width: 100%;
    margin: 2px 0;
  }
}

/* Estados de interacción mejorados */
.CardUsuario__Actions .v-btn:active {
  transform: scale(0.98);
}

.CardUsuario:active {
  transform: translateY(-2px);
}
</style>