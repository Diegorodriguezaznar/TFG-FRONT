import { defineStore } from "pinia";
import { ref } from "vue";
import type { Usuario } from "@/types/usuario";

export const useUsuarioLogeadoStore = defineStore("usuarioLogeado", () => {
  // Estado del usuario actual
  const usuarioActual = ref<Usuario | null>(null);
  const estaAutenticado = ref(false);
  const errorMessage = ref("");

  // Recuperar usuario desde localStorage al iniciar
  function cargarUsuarioDesdeStorage() {
    const usuarioGuardado = localStorage.getItem("usuario");
    if (usuarioGuardado) {
      try {
        usuarioActual.value = JSON.parse(usuarioGuardado);
        estaAutenticado.value = true;
        console.log("Usuario cargado desde localStorage:", usuarioActual.value);
      } catch (error) {
        console.error("Error al recuperar usuario:", error);
        localStorage.removeItem("usuario"); // Limpiar si hay error
      }
    }
  }

  // Guardar usuario en localStorage al iniciar sesión
  async function login(email: string, password: string): Promise<boolean> {
    try {
      const response = await fetch("http://localhost:5190/api/Usuario/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        errorMessage.value = "Credenciales inválidas";
        return false;
      }

      const usuario = await response.json();
      usuarioActual.value = usuario;
      estaAutenticado.value = true;
      errorMessage.value = "";

      // Guardar en localStorage
      localStorage.setItem("usuario", JSON.stringify(usuario));
      console.log("Usuario guardado en localStorage:", usuario);

      return true;
    } catch (error: any) {
      errorMessage.value = error.message || "Error al iniciar sesión";
      return false;
    }
  }

  // Limpiar usuario y cerrar sesión
  function logout() {
    usuarioActual.value = null;
    estaAutenticado.value = false;
    errorMessage.value = "";
    localStorage.removeItem("usuario");
    console.log("Usuario eliminado de localStorage");
  }

  return {
    usuarioActual,
    estaAutenticado,
    errorMessage,
    login,
    logout,
    cargarUsuarioDesdeStorage, // Agregamos la función para restaurar sesión
  };
});
