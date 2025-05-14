// FRONTEND: TFG-FRONT/src/views/LoginView.vue
<template>
  <div class="login-container">
    <h2>Iniciar Sesión</h2>
    
    <div v-if="error" class="error-message">{{ error }}</div>
    
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label>Email</label>
        <input 
          type="email" 
          v-model="formData.gmail" 
          required 
        />
      </div>
      
      <div class="form-group">
        <label>Contraseña</label>
        <input 
          type="password" 
          v-model="formData.contraseña" 
          required 
        />
      </div>
      
      <button type="submit" class="btn-submit">Iniciar Sesión</button>
    </form>
    
    <p>¿No tienes cuenta? <router-link to="/registro">Crear Cuenta</router-link></p>
  </div>
</template>

<script lang="ts">
import axios from 'axios';
import { defineComponent } from 'vue';
import { LoginDTO, AuthResponseDTO } from '../stores/dtos/AuthDTO';

export default defineComponent({
  name: 'LoginView',
  data() {
    return {
      formData: {
        gmail: '',
        contraseña: ''
      } as LoginDTO,
      error: ''
    };
  },
  methods: {
    async handleSubmit() {
      try {
        const response = await axios.post<AuthResponseDTO>('http://localhost:5190/api/Auth/login', this.formData);
        
        // Guardar el token en localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify({
          id: response.data.idUsuario,
          nombre: response.data.nombre,
          rol: response.data.rol
        }));
        
        // Redirigir al usuario a la página principal
        this.$router.push('/');
        
      } catch (error) {
        this.error = 'Credenciales inválidas';
        console.error(error);
      }
    }
  }
});
</script>

<style scoped>
.login-container {
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