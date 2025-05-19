import { defineStore } from "pinia";
import { ref } from "vue";
import type { UsuarioDTO } from "@/stores/dtos/UsuarioDTO";
import axios from 'axios';

// Interfaz para la creación de usuario
export interface UsuarioCreateDTO {
  nombre: string;
  apellido: string;
  gmail: string;
  telefono: string;
  constraseña: string;
  idRol: number;
}

// Interfaz para las credenciales de login
export interface LoginCredentials {
  gmail: string;
  constraseña: string;
}

export const useAuthStore = defineStore("auth", () => {
  const usuarioActual = ref<UsuarioDTO | null>(null);
  const token = ref<string | null>(null);
  const errorMessage = ref<string>("");
  const isLoading = ref<boolean>(false);
  
  // Computed
  const isAuthenticated = ref<boolean>(false);
  
  // Inicializar desde localStorage
  function init() {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('usuario');
    
    if (storedToken) {
      token.value = storedToken;
      isAuthenticated.value = true;
    }
    
    if (storedUser) {
      try {
        usuarioActual.value = JSON.parse(storedUser);
      } catch (e) {
        console.error('Error parsing stored user:', e);
      }
    }
  }
  
  // Login
  async function login(credentials: LoginCredentials) {
    isLoading.value = true;
    errorMessage.value = "";
    
    try {
      // Petición de login
      console.log("Intentando login con:", credentials);
      
      // Primero intenta usar el endpoint de Auth/login si existe
      try {
        const response = await axios.post('Auth/login', credentials);
        
        if (response.data) {
          // Suponiendo que la respuesta contiene usuario y token
          const userData = {
            usuario: response.data.usuario,
            token: response.data.token
          };
          
          // Guardar en localStorage y store
          localStorage.setItem('token', userData.token);
          localStorage.setItem('usuario', JSON.stringify(userData.usuario));
          
          token.value = userData.token;
          usuarioActual.value = userData.usuario;
          isAuthenticated.value = true;
          
          return { success: true, data: userData };
        }
      } catch (authError) {
        console.error("Error en Auth/login, probando método alternativo:", authError);
        
        // Si no funciona el auth, intenta buscar el usuario por email
        const usuariosResponse = await axios.get('Usuario');
        
        if (usuariosResponse.data && Array.isArray(usuariosResponse.data)) {
          const user = usuariosResponse.data.find(u => 
            u.gmail === credentials.gmail && u.constraseña === credentials.constraseña
          );
          
          if (user) {
            // Usuario encontrado, crear token manual y sesión
            const userData = {
              usuario: user,
              token: "token-" + Date.now()
            };
            
            // Guardar en localStorage y store
            localStorage.setItem('token', userData.token);
            localStorage.setItem('usuario', JSON.stringify(userData.usuario));
            
            token.value = userData.token;
            usuarioActual.value = userData.usuario;
            isAuthenticated.value = true;
            
            return { success: true, data: userData };
          } else {
            throw new Error("Credenciales incorrectas");
          }
        } else {
          throw new Error("No se pudo obtener la lista de usuarios");
        }
      }
    } catch (error: any) {
      console.error("Error en login:", error);
      errorMessage.value = error.message || "Error al iniciar sesión";
      return { success: false, error: errorMessage.value };
    } finally {
      isLoading.value = false;
    }
  }
  
  // Registro
  async function register(userData: UsuarioCreateDTO) {
    isLoading.value = true;
    errorMessage.value = "";
    
    try {
      console.log("Intentando registro con:", userData);
      
      // Crear objeto usuario según el DTO
      const userToRegister = {
        nombre: userData.nombre,
        apellido: userData.apellido,
        gmail: userData.gmail,
        telefono: userData.telefono,
        constraseña: userData.constraseña,
        idRol: userData.idRol
      };
      
      // Petición de registro
      const response = await axios.post('Usuario', userToRegister);
      
      if (response.data) {
        return { success: true, data: response.data };
      } else {
        throw new Error("Error al registrar usuario");
      }
    } catch (error: any) {
      console.error("Error completo en registro:", error);
      console.error("Respuesta del servidor:", error.response?.data);
      
      errorMessage.value = error.response?.data?.message || error.message || "Error al registrar usuario";
      return { success: false, error: errorMessage.value };
    } finally {
      isLoading.value = false;
    }
  }
  
  // Cerrar sesión
  function logout() {
    token.value = null;
    usuarioActual.value = null;
    isAuthenticated.value = false;
    
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  }
  
  // Recuperar contraseña
  async function forgotPassword(email: string) {
    isLoading.value = true;
    errorMessage.value = "";
    
    try {
      await axios.post('Auth/forgot-password', { email });
      return { success: true };
    } catch (error: any) {
      errorMessage.value = error.message || "Error al recuperar contraseña";
      return { success: false, error: errorMessage.value };
    } finally {
      isLoading.value = false;
    }
  }
  
  return {
    usuarioActual,
    token,
    isAuthenticated,
    errorMessage,
    isLoading,
    init,
    login,
    register,
    logout,
    forgotPassword
  };
});