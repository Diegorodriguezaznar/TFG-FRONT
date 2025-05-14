// FRONTEND: TFG-FRONT/src/views/RegistroView.vue
<template>
  <div class="registro-container">
    <h2>Crear Cuenta</h2>
    
    <div v-if="error" class="error-message">{{ error }}</div>
    
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label>Nombre</label>
        <input 
          type="text" 
          v-model="formData.nombre" 
          required 
        />
      </div>
      
      <div class="form-group">
        <label>Apellidos</label>
        <input 
          type="text" 
          v-model="formData.apellidos" 
        />
      </div>
      
      <div class="form-group">
        <label>Email</label>
        <input 
          type="email" 
          v-model="formData.gmail" 
          required 
        />
      </div>
      
      <div class="form-group">
        <label>Teléfono</label>
        <input 
          type="tel" 
          v-model="formData.telefono" 
        />
      </div>
      
      <div class="form-group">
        <label>Contraseña</label>
        <input 
          type="password" 
          v-model="formData.contraseña" 
          required 
          minlength="6"
        />
      </div>
      
      <div class="form-group">
        <label>Confirmar Contraseña</label>
        <input 
          type="password" 
          v-model="confirmarContraseña" 
          required 
          minlength="6"
        />
      </div>
      
      <button type="submit" class="btn-submit">Registrarse</button>
    </form>
    
    <p>¿Ya tienes cuenta? <router-link to="/login">Iniciar Sesión</router-link></p>
  </div>
</template>

<script lang="ts">
import axios from 'axios';
import { defineComponent } from 'vue';
import { RegistroDTO, AuthResponseDTO } from '../stores/dtos/AuthDTO';

export default defineComponent({
  name: 'RegistroView',
  data() {
    return {
      formData: {
        nombre: '',
        apellidos: '',
        gmail: '',
        telefono: '',
        contraseña: '',
        idRol: 1
      } as RegistroDTO,
      confirmarContraseña: '',
      error: ''
    };
  },
  methods: {
    async handleSubmit() {
      // Validar contraseñas
      if (this.formData.contraseña !== this.confirmarContraseña) {
        this.error = 'Las contraseñas no coinciden';
        return;
      }
      
      try {
        const response = await axios.post<AuthResponseDTO>('http://localhost:5190/api/Auth/registro', this.formData);
        
        // Guardar el token en localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify({
          id: response.data.idUsuario,
          nombre: response.data.nombre,
          rol: response.data.rol
        }));
        
        // Redirigir al usuario a la página principal
        this.$router.push('/');
        
      } catch (error: any) {
        this.error = error.response?.data || 'Error al registrarse';
        console.error(error);
      }
    }
  }
});
</script>

<style scoped>
.registro-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.btn-submit {
  width: 100%;
  padding: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-submit:hover {
  background-color: #45a049;
}

.error-message {
  color: red;
  margin-bottom: 15px;
}
</style>