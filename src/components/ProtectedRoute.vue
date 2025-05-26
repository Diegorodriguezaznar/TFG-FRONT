<!-- src/components/ProtectedRoute.vue -->
<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUsuarioLogeadoStore } from '@/stores/UsuarioLogeado';

const props = defineProps<{
  requiredRoles?: number[]; // Array de roles permitidos
  fallbackRoute?: string;   // Ruta a la que redirigir si no tiene permisos
}>();

const usuarioStore = useUsuarioLogeadoStore();
const router = useRouter();

const usuarioActual = computed(() => usuarioStore.usuarioActual);
const estaAutenticado = computed(() => usuarioStore.estaAutenticado);

const tienePermisos = computed(() => {
  if (!estaAutenticado.value || !usuarioActual.value) {
    return false;
  }

  // Si no se especifican roles requeridos, solo verificar autenticación
  if (!props.requiredRoles || props.requiredRoles.length === 0) {
    return true;
  }

  const rolUsuario = usuarioActual.value.idRol;
  return props.requiredRoles.includes(rolUsuario);
});

onMounted(() => {
  // Verificar permisos al montar el componente
  if (!estaAutenticado.value) {
    router.push('/login');
    return;
  }

  if (!tienePermisos.value) {
    const fallback = props.fallbackRoute || '/quizz-time!';
    router.push(fallback);
  }
});
</script>

<template>
  <div v-if="tienePermisos">
    <slot></slot>
  </div>
  
  <div v-else-if="!estaAutenticado" class="d-flex justify-center align-center" style="height: 80vh;">
    <div class="text-center">
      <v-progress-circular indeterminate color="orange" size="64" class="mb-4"></v-progress-circular>
      <p class="text-h6">Verificando autenticación...</p>
    </div>
  </div>
  
  <div v-else class="d-flex justify-center align-center" style="height: 80vh;">
    <v-card class="pa-8 text-center" max-width="400">
      <v-icon color="error" size="64" class="mb-4">mdi-lock</v-icon>
      <h3 class="text-h5 mb-4">Acceso Denegado</h3>
      <p class="text-body-1 mb-4">
        No tienes permisos para acceder a esta página.
      </p>
      <v-btn color="orange" variant="elevated" @click="router.push('/quizz-time!')">
        Volver a Quizzes
      </v-btn>
    </v-card>
  </div>
</template>