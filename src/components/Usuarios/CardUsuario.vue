<!-- src/components/Usuarios/CardUsuario.vue - Versión completa con navegación -->
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUsuarioEstadisticasStore } from '@/stores/UsuarioEstadisticas';
import UserAvatar from '@/components/Common/UserAvatar.vue';
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
    1: { name: 'Estudiante', color: 'green', icon: 'mdi-account-school' },
    2: { name: 'Profesor', color: 'blue', icon: 'mdi-school' },
    3: { name: 'Administrador', color: 'red', icon: 'mdi-shield-crown' }
  };
  return roles[props.usuario.idRol] || { name: 'Usuario', color: 'grey', icon: 'mdi-account' };
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
  router.push(`/usuario/${props.usuario.idUsuario}`);
};

const verCursos = () => {
  console.log(`Viendo cursos de ${nombreCompleto.value}`);
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
        <!-- Avatar personalizado por rol -->
        <UserAvatar
          :usuario="usuario"
          :size="64"
          class="CardUsuario__Avatar"
        />
        
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
    
    
  </v-card>
</template>

<style scoped lang="scss">
@import "@/assets/sass/components/Usuarios/CardUsuario.scss";
</style>