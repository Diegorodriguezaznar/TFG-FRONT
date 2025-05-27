<!-- src/components/UserAvatar.vue -->
<template>
  <v-avatar 
    :size="size" 
    :class="[avatarClasses, { 'light-bg': lightBackground }]"
    class="UserAvatar"
  >
    <span class="UserAvatar__Letter">{{ primeraLetra }}</span>
  </v-avatar>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  usuario?: {
    nombre?: string;
    idRol?: number;
  } | null;
  size?: string | number;
  nombre?: string;
  idRol?: number;
  lightBackground?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  size: 40,
  nombre: '',
  idRol: 1,
  lightBackground: false
});

// Computed para obtener los datos del usuario
const datosUsuario = computed(() => {
  if (props.usuario) {
    return {
      nombre: props.usuario.nombre || 'U',
      idRol: props.usuario.idRol || 1
    };
  }
  return {
    nombre: props.nombre || 'U',
    idRol: props.idRol || 1
  };
});

// Primera letra del nombre
const primeraLetra = computed(() => {
  const nombre = datosUsuario.value.nombre;
  return nombre ? nombre.charAt(0).toUpperCase() : 'U';
});

// Clases CSS según el rol
const avatarClasses = computed(() => {
  const idRol = datosUsuario.value.idRol;
  
  switch (idRol) {
    case 1: // Estudiante
      return 'UserAvatar--estudiante';
    case 2: // Profesor
      return 'UserAvatar--profesor';
    case 3: // Administrador
      return 'UserAvatar--admin';
    default:
      return 'UserAvatar--estudiante';
  }
});
</script>

<style scoped>
.UserAvatar {
  font-weight: 700;
  transition: all 0.3s ease;
  border: 2px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.UserAvatar:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.UserAvatar__Letter {
  font-size: inherit;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

/* Estilos por rol */
.UserAvatar--estudiante {
  background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%);
}

.UserAvatar--profesor {
  background: linear-gradient(135deg, #2196F3 0%, #42A5F5 100%);
}

.UserAvatar--admin {
  background: linear-gradient(135deg, #F44336 0%, #EF5350 100%);
}

/* Variantes con fondo claro para contextos específicos */
.UserAvatar--estudiante.light-bg {
  background: linear-gradient(135deg, #C8E6C9 0%, #A5D6A7 100%);
  color: #2E7D32;
  border-color: #4CAF50;
}

.UserAvatar--profesor.light-bg {
  background: linear-gradient(135deg, #BBDEFB 0%, #90CAF9 100%);
  color: #1565C0;
  border-color: #2196F3;
}

.UserAvatar--admin.light-bg {
  background: linear-gradient(135deg, #FFCDD2 0%, #EF9A9A 100%);
  color: #C62828;
  border-color: #F44336;
}

.UserAvatar--estudiante.light-bg .UserAvatar__Letter,
.UserAvatar--profesor.light-bg .UserAvatar__Letter,
.UserAvatar--admin.light-bg .UserAvatar__Letter {
  text-shadow: none;
}
</style>