import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { UsuarioDTO } from "@/stores/dtos/UsuarioDTO";

export const useUsuarioLogeadoStore = defineStore("usuarioLogeado", () => {
  // Estado
  const usuarioActual = ref<UsuarioDTO | null>(null);
  const token = ref<string | null>(null);
  
  // Computed
  const estaAutenticado = computed(() => !!usuarioActual.value);
  
  const esAdmin = computed(() => {
    if (!usuarioActual.value) return false;
    
    const idRol = usuarioActual.value.idRol;
    return idRol === 2; // Rol 2 es profesor/admin
  });
  
  // Método para iniciar sesión
  function iniciarSesion(userData: { usuario: UsuarioDTO; token: string }) {
    console.log("Iniciando sesión con:", userData);
    usuarioActual.value = userData.usuario;
    token.value = userData.token;
    
    // Guardar en localStorage para persistencia
    localStorage.setItem('usuario', JSON.stringify(userData.usuario));
    localStorage.setItem('token', userData.token);
  }
  
  // Método para cerrar sesión
  function cerrarSesion() {
    usuarioActual.value = null;
    token.value = null;
    
    // Limpiar localStorage
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
  }
  
  // Método para cargar usuario desde localStorage
  function cargarUsuarioDesdeStorage() {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('usuario');
    
    if (savedToken) {
      token.value = savedToken;
    }
    
    if (savedUser) {
      try {
        usuarioActual.value = JSON.parse(savedUser);
      } catch (e) {
        console.error('Error parsing saved user:', e);
        localStorage.removeItem('usuario');
      }
    }
  }
  
  // Método para actualizar datos del usuario
  function actualizarUsuario(userData: UsuarioDTO) {
    usuarioActual.value = userData;
    localStorage.setItem('usuario', JSON.stringify(userData));
  }
  
  return {
    usuarioActual,
    token,
    estaAutenticado,
    esAdmin,
    iniciarSesion,
    cerrarSesion,
    cargarUsuarioDesdeStorage,
    actualizarUsuario
  };
});