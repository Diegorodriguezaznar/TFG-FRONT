// FRONTEND: TFG-FRONT/src/stores/authStore.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import type { RegistroDTO, LoginDTO, AuthResponseDTO } from "./dtos/AuthDTO";

// Interfaz para el usuario actual
interface Usuario {
  id: number;
  nombre: string;
  rol: string;
}

export const useAuthStore = defineStore("auth", () => {
  // Estado
  const usuarioActual = ref<Usuario | null>(null);
  const token = ref<string | null>(null);
  const estaAutenticado = ref(false);
  const errorMessage = ref("");

  // Recuperar sesión desde localStorage
  function cargarSesion() {
    const tokenGuardado = localStorage.getItem("token");
    const usuarioGuardado = localStorage.getItem("user");
    
    if (tokenGuardado && usuarioGuardado) {
      try {
        token.value = tokenGuardado;
        usuarioActual.value = JSON.parse(usuarioGuardado);
        estaAutenticado.value = true;
        console.log("Sesión cargada desde localStorage");
      } catch (error) {
        console.error("Error al recuperar sesión:", error);
        cerrarSesion(); // Limpiar si hay error
      }
    }
  }

  // Iniciar sesión
  async function iniciarSesion(datos: LoginDTO): Promise<boolean> {
    try {
      const response = await fetch("http://localhost:5190/api/Auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
      });
      
      if (!response.ok) {
        const error = await response.text();
        errorMessage.value = error || "Credenciales inválidas";
        return false;
      }
      
      const data: AuthResponseDTO = await response.json();
      
      // Guardar datos
      token.value = data.token;
      usuarioActual.value = {
        id: data.idUsuario,
        nombre: data.nombre,
        rol: data.rol
      };
      estaAutenticado.value = true;
      errorMessage.value = "";
      
      // Guardar en localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(usuarioActual.value));
      
      return true;
    } catch (error: any) {
      errorMessage.value = error.message || "Error al iniciar sesión";
      return false;
    }
  }
  
  // Registrar usuario
  async function registrarUsuario(datos: RegistroDTO): Promise<boolean> {
    try {
      const response = await fetch("http://localhost:5190/api/Auth/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
      });
      
      if (!response.ok) {
        const error = await response.text();
        errorMessage.value = error || "Error al registrarse";
        return false;
      }
      
      const data: AuthResponseDTO = await response.json();
      
      // Guardar datos
      token.value = data.token;
      usuarioActual.value = {
        id: data.idUsuario,
        nombre: data.nombre,
        rol: data.rol
      };
      estaAutenticado.value = true;
      errorMessage.value = "";
      
      // Guardar en localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(usuarioActual.value));
      
      return true;
    } catch (error: any) {
      errorMessage.value = error.message || "Error al registrarse";
      return false;
    }
  }

  // Cerrar sesión
  function cerrarSesion() {
    usuarioActual.value = null;
    token.value = null;
    estaAutenticado.value = false;
    errorMessage.value = "";
    
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    console.log("Sesión cerrada");
  }

  return {
    usuarioActual,
    token,
    estaAutenticado,
    errorMessage,
    cargarSesion,
    iniciarSesion,
    registrarUsuario,
    cerrarSesion
  };
});