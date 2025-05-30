<script setup lang="ts">
import { defineProps, computed } from 'vue';
import { useRouter } from 'vue-router';
import type { VideoDTO } from '@/stores/dtos/VideoDTO';
import UserAvatar from '@/components/Common/UserAvatar.vue';

const props = defineProps<{
  video: VideoDTO
}>();

// Router
const router = useRouter();

// Función para obtener rol basado en el nombre del autor
const obtenerRolAutor = computed(() => {
  const autor = props.video?.autor?.toLowerCase() || '';
  if (autor.includes('profe') || autor.includes('profesor')) {
    return 2; // Profesor
  } else if (autor.includes('admin') || autor.includes('director')) {
    return 3; // Administrador
  }
  return 1; // Estudiante por defecto
});

// Función para obtener color según asignatura
const getColorForAsignatura = (asignatura: string): string => {
  const colores: Record<string, string> = {
    'Mates': 'blue',
    'Lengua': 'deep-purple',
    'Historia': 'brown',
    'Física': 'indigo',
    'Química': 'green',
    'Biología': 'teal',
    'Inglés': 'red',
    'Arte': 'pink',
    'Informática': 'orange',
    'Música': 'cyan'
  };
  
  return colores[asignatura] || 'grey';
};

// Método para navegar al perfil del profesor
const verPerfilProfesor = () => {
  if (props.video?.idUsuario) {
    console.log(`Navegando al perfil del profesor con ID: ${props.video.idUsuario}`);
    router.push(`/usuario/${props.video.idUsuario}`);
  } else {
    console.warn('No se encontró el ID del usuario para navegar al perfil');
  }
};

// Método para navegar desde el nombre del canal
const verPerfilCanal = () => {
  if (props.video?.idUsuario) {
    router.push(`/usuario/${props.video.idUsuario}`);
  } else {
    console.warn('No se puede navegar al perfil: ID de usuario no disponible');
  }
};
</script>

<template>
  <div class="tarjeta-canal">
    <div class="d-flex align-center mb-3">
      <!-- Avatar personalizado del autor con navegación -->
      <div 
        class="InfoCanal__AvatarContainer"
        @click="verPerfilProfesor"
      >
        <UserAvatar
          :nombre="video.autor || 'Usuario'"
          :id-rol="obtenerRolAutor"
          :size="50"
          class="InfoCanal__Avatar"
        />
      </div>
      
      <div class="ml-3">
        <!-- Nombre del canal también clickeable -->
        <h3 
          class="text-h6 mb-0 InfoCanal__NombreCanal"
          @click="verPerfilCanal"
        >
          {{ video.autor }}
        </h3>
        <div class="text-subtitle-2 text-grey">{{ video.asignatura }}</div>
      </div>
    </div>
    
    <h3 class="text-h6 font-weight-bold mt-4">{{ video.titulo }}</h3>
    <p class="text-body-2">
      {{ video.descripcion && video.descripcion.length > 100 
        ? video.descripcion.substring(0, 100) + '...' 
        : video.descripcion }}
    </p>
  </div>
</template>

<style scoped>
.tarjeta-canal {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
}

/* Estilos para elementos clickeables */
.InfoCanal__AvatarContainer {
  cursor: pointer;
  transition: transform 0.2s ease;
  border-radius: 50%;
  position: relative;
}

.InfoCanal__AvatarContainer:hover {
  transform: scale(1.05);
}

.InfoCanal__AvatarContainer:hover::after {
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

.InfoCanal__Avatar {
  transition: all 0.2s ease;
}

.InfoCanal__NombreCanal {
  cursor: pointer;
  transition: color 0.2s ease;
}

.InfoCanal__NombreCanal:hover {
  color: #FF9800;
  text-decoration: underline;
}

/* Tooltip personalizado */
.InfoCanal__AvatarContainer {
  position: relative;
}

.InfoCanal__AvatarContainer::before {
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

.InfoCanal__AvatarContainer:hover::before {
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

/* Responsive */
@media (max-width: 600px) {
  .InfoCanal__AvatarContainer::before {
    display: none; /* Ocultar tooltip en móvil */
  }
}
</style>  