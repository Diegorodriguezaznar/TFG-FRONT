<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  nombre?: string;
  usuario?: {
    nombre: string;
    apellidos?: string;
    idRol?: number;
    idUsuario?: number;
    id?: number;
  };
  size?: number | string;
  idRol?: number; 
}

const props = withDefaults(defineProps<Props>(), {
  nombre: 'Usuario',
  size: 40,
  idRol: 1
});

// Obtener las iniciales del nombre
const iniciales = computed(() => {
  let nombreCompleto = '';

  if (props.usuario) {
    nombreCompleto = `${props.usuario.nombre} ${props.usuario.apellidos || ''}`.trim();
  } else if (props.nombre) {
    nombreCompleto = props.nombre;
  }

  if (!nombreCompleto) return 'U';

  const palabras = nombreCompleto.split(' ').filter(palabra => palabra.length > 0);

  if (palabras.length === 1) {
    return palabras[0].charAt(0).toUpperCase();
  } else {
    return palabras.slice(0, 2).map(palabra => palabra.charAt(0).toUpperCase()).join('');
  }
});

// Nombre completo para el título
const nombreCompleto = computed(() => {
  if (props.usuario) {
    return `${props.usuario.nombre} ${props.usuario.apellidos || ''}`.trim();
  }
  return props.nombre || 'Usuario';
});
</script>
<template>
  <v-avatar 
    :size="size" 
    color="orange"
    class="UserAvatar"
  >
    <span 
      class="UserAvatartext" 
      :style="{ fontSize: `${Number(size) * 0.4}px` }"
    >
      {{ iniciales }}
    </span>

    <v-tooltip 
      activator="parent" 
      location="bottom"
      :text="nombreCompleto"
    />
  </v-avatar>
</template>

<style scoped>
.UserAvatar {
  background: linear-gradient(135deg, #FF9800 0%, #F57C00 100%) !important;
  color: white;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(255, 152, 0, 0.3);
  transition: all 0.2s ease;
}

.UserAvatar:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(255, 152, 0, 0.4);
}

.UserAvatartext {
  font-weight: 700;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}
</style>