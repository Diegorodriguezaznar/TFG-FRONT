<script setup>
// --------------------------- Imports ---------------------------
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import UserAvatar from '@/components/Common/UserAvatar.vue';

// --------------------------- Router ---------------------------
const router = useRouter();

// --------------------------- Props ---------------------------
const props = defineProps({
  video: {
    type: Object,
    required: true
  }
});

// --------------------------- Variables ---------------------------
const isLiked = ref(false);
const isSubscribed = ref(false);
const showFullDescription = ref(false);

// --------------------------- Computed ---------------------------
// Verificar si la descripción es lo suficientemente larga para mostrar "Leer más"
const descripcionLarga = computed(() => {
  return props.video && props.video.descripcion && props.video.descripcion.length > 150;
});

// Descripción formateada
const descripcionCorta = computed(() => {
  if (props.video && props.video.descripcion) {
    return props.video.descripcion.length > 150 
      ? props.video.descripcion.substring(0, 150) + '...' 
      : props.video.descripcion;
  }
  return 'No hay descripción disponible.';
});

// Simulación de rol del autor basado en el nombre
const autorRol = computed(() => {
  const autor = props.video?.autor?.toLowerCase() || '';
  if (autor.includes('profe') || autor.includes('profesor')) {
    return 2; // Profesor
  } else if (autor.includes('admin') || autor.includes('director')) {
    return 3; // Administrador
  }
  return 1; // Estudiante por defecto
});

// --------------------------- Métodos ---------------------------
const toggleLike = () => {
  isLiked.value = !isLiked.value;
};

const toggleSubscribe = () => {
  isSubscribed.value = !isSubscribed.value;
};

const toggleDescription = () => {
  showFullDescription.value = !showFullDescription.value;
};

// Navegación al perfil del profesor
const verPerfilProfesor = () => {
  if (props.video?.idUsuario) {
    console.log(`Navegando al perfil del profesor con ID: ${props.video.idUsuario}`);
    router.push(`/usuario/${props.video.idUsuario}`);
  } else {
    console.warn('No se encontró el ID del usuario para navegar al perfil');
  }
};

// Navegar al perfil del canal (función alternativa para el nombre del canal)
const verPerfilCanal = () => {
  if (props.video?.idUsuario) {
    router.push(`/usuario/${props.video.idUsuario}`);
  } else {
    console.warn('No se puede navegar al perfil: ID de usuario no disponible');
  }
};
</script>

<template>
  <div class="VideoInfo">
    <!-- Título del video -->
    <h1 class="VideoInfo__Title text-h5 font-weight-bold">
      {{ video.titulo || video.title || 'Sin título' }}
    </h1>
    
    <!-- Estadísticas y acciones -->
    <div class="VideoInfo__Stats d-flex align-center flex-wrap">
      <div class="VideoInfo__Views d-flex align-center">
        <span>{{ video.vistas || video.views || '0' }} visualizaciones • {{ video.fecha || video.publishedDate || 'Sin fecha' }}</span>
      </div>
      
      <v-spacer></v-spacer>
      
      <!-- Botones de acción -->
      <div class="VideoInfo__Actions d-flex align-center">
        <v-btn 
          variant="text" 
          prepend-icon="mdi-thumb-up" 
          size="small" 
          :color="isLiked ? 'primary' : ''"
          @click="toggleLike"
        >
          {{ video.likes || '0' }}
        </v-btn>
        
        <v-btn variant="text" prepend-icon="mdi-thumb-down" size="small">
          Dislike
        </v-btn>
        
        <v-btn variant="text" prepend-icon="mdi-share" size="small">
          Compartir
        </v-btn>
        
        <v-btn variant="text" prepend-icon="mdi-download" size="small">
          Descargar
        </v-btn>
      </div>
    </div>
    
    <v-divider class="my-4"></v-divider>
    
    <!-- Información del canal y descripción -->
    <div class="VideoInfo__Channel d-flex">
      <!-- Avatar personalizado del autor con navegación -->
      <div 
        class="VideoInfo__AvatarContainer"
        @click="verPerfilProfesor"
      >
        <UserAvatar
          :nombre="video.autor || video.channel || 'Profesor'"
          :id-rol="autorRol"
          :size="40"
          class="VideoInfo__Avatar"
        />
      </div>
      
      <div class="VideoInfo__ChannelInfo flex-grow-1 ml-3">
        <div class="d-flex align-center">
          <div>
            <!-- Nombre del canal también clickeable -->
            <div 
              class="VideoInfo__ChannelName font-weight-bold"
              @click="verPerfilCanal"
            >
              {{ video.autor || video.channel || 'Profesor' }}
            </div>
            <div class="text-caption text-grey">{{ video.suscriptores || video.subscribers || '0' }} suscriptores</div>
          </div>
          
          <v-spacer></v-spacer>
          
          <v-btn 
            :color="isSubscribed ? 'grey' : 'red'" 
            :variant="isSubscribed ? 'outlined' : 'flat'"
            @click="toggleSubscribe"
          >
            {{ isSubscribed ? 'Suscrito' : 'Suscribirse' }}
          </v-btn>
        </div>
        
        <!-- Descripción del video -->
        <div class="VideoInfo__Description mt-4">
          <p v-if="!showFullDescription" class="text-body-2">
            {{ descripcionCorta }}
            <v-btn 
              v-if="descripcionLarga" 
              variant="text" 
              size="small" 
              class="px-1 text-body-2" 
              @click="toggleDescription"
            >
              Mostrar más
            </v-btn>
          </p>
          <p v-else class="text-body-2">
            {{ video.descripcion || video.description || 'No hay descripción disponible.' }}
            <v-btn 
              variant="text" 
              size="small" 
              class="px-1 text-body-2" 
              @click="toggleDescription"
            >
              Mostrar menos
            </v-btn>
          </p>
        </div>
      </div>
    </div>
    
    <v-divider class="my-4"></v-divider>
  </div>
</template>

<style scoped>
.VideoInfo {
  padding: 0 16px;
}

.VideoInfo__Title {
  margin-bottom: 8px;
  line-height: 1.2;
}

.VideoInfo__Stats {
  color: #606060;
  font-size: 14px;
}

.VideoInfo__Actions {
  flex-wrap: wrap;
  gap: 8px;
}

.VideoInfo__Description {
  white-space: pre-line;
}

/* Estilos para elementos clickeables */
.VideoInfo__AvatarContainer {
  cursor: pointer;
  transition: transform 0.2s ease;
  border-radius: 50%;
  position: relative;
}

.VideoInfo__AvatarContainer:hover {
  transform: scale(1.05);
}

.VideoInfo__AvatarContainer:hover::after {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border: 2px solid rgba(255, 152, 0, 0.5);
  border-radius: 50%;
  animation: pulse 1s ease-in-out infinite;
}

.VideoInfo__Avatar {
  transition: all 0.2s ease;
}

.VideoInfo__ChannelName {
  cursor: pointer;
  transition: color 0.2s ease;
  position: relative;
}

.VideoInfo__ChannelName:hover {
  color: #FF9800;
  text-decoration: underline;
}

/* Tooltip personalizado */
.VideoInfo__AvatarContainer {
  position: relative;
}

.VideoInfo__AvatarContainer::before {
  content: 'Ver perfil del profesor';
  position: absolute;
  bottom: -35px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  pointer-events: none;
  z-index: 10;
}

.VideoInfo__AvatarContainer:hover::before {
  opacity: 1;
  visibility: visible;
}

/* Animación de pulso para el borde */
@keyframes pulse {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.05);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@media (max-width: 600px) {
  .VideoInfo__Stats {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .VideoInfo__Actions {
    margin-top: 8px;
  }
  
  .VideoInfo__AvatarContainer::before {
    display: none; /* Ocultar tooltip en móvil */
  }
}
</style>