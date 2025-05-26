import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { UsuarioDTO } from "@/stores/dtos/UsuarioDTO";

export const useUsuarioLogeadoStore = defineStore("usuarioLogeado", () => {
  // --------------------------- Estado ---------------------------
  const usuarioActual = ref<UsuarioDTO | null>(null);
  const token = ref<string | null>(null);

  // --------------------------- Computed ---------------------------
  const estaAutenticado = computed(() => !!usuarioActual.value);

  const esAdmin = computed(() => {
    return usuarioActual.value?.idRol === 3; // Rol 3 = administrador real
  });

  // --------------------------- Métodos ---------------------------

  function iniciarSesion(userData: { usuario: UsuarioDTO; token: string }) {
    console.log("Iniciando sesión con:", userData);
    usuarioActual.value = userData.usuario;
    token.value = userData.token;

    // Guardar en localStorage para persistencia
    localStorage.setItem("usuario", JSON.stringify(userData.usuario));
    localStorage.setItem("token", userData.token);
  }

  function cerrarSesion() {
    usuarioActual.value = null;
    token.value = null;

    // Limpiar localStorage
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
  }

  async function cargarUsuarioDesdeStorage() {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("usuario");

    if (savedToken) {
      token.value = savedToken;
    }

    if (savedUser) {
      try {
        usuarioActual.value = JSON.parse(savedUser);
      } catch (e) {
        console.error("Error al parsear usuario guardado:", e);
        localStorage.removeItem("usuario");
      }
    }
  }

  function actualizarUsuario(userData: UsuarioDTO) {
    usuarioActual.value = userData;
    localStorage.setItem("usuario", JSON.stringify(userData));
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
