<!-- FRONTEND: TFG-FRONT/src/views/RegistroView.vue -->
<template>
  <div class="auth-page">
    <FormCard title="Crear Cuenta">
      <div v-if="store.errorMessage" class="error-message">{{ store.errorMessage }}</div>
      
      <form @submit.prevent="handleSubmit">
        <FormInput 
          id="nombre"
          label="Nombre"
          type="text"
          v-model="formData.nombre" 
          required
        />
        
        <FormInput 
          id="apellidos"
          label="Apellidos"
          type="text"
          v-model="formData.apellidos"
        />
        
        <FormInput 
          id="gmail"
          label="Email"
          type="email"
          v-model="formData.gmail"
          required
        />
        
        <FormInput 
          id="telefono"
          label="Teléfono"
          type="tel"
          v-model="formData.telefono"
        />
        
        <FormInput 
          id="password"
          label="Contraseña"
          type="password"
          v-model="formData.contraseña"
          required
        />
        
        <FormInput 
          id="confirm-password"
          label="Confirmar Contraseña"
          type="password"
          v-model="confirmarContraseña"
          required
        />
        
        <div class="form-actions">
          <FormButton type="submit" primary>Registrarse</FormButton>
        </div>
      </form>
      
      <div class="form-footer">
        <p>¿Ya tienes cuenta? <router-link to="/login" class="text-link">Iniciar Sesión</router-link></p>
      </div>
    </FormCard>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import FormInput from '../components/FormInput.vue';
import FormButton from '../components/FormButton.vue';
import FormCard from '../components/FormCard.vue';
import { useAuthStore } from '../stores/authStore.ts';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'RegistroView',
  components: {
    FormInput,
    FormButton,
    FormCard
  },
  setup() {
    const store = useAuthStore();
    const router = useRouter();
    
    return { store, router };
  },
  data() {
    return {
      formData: {
        nombre: '',
        apellidos: '',
        gmail: '',
        telefono: '',
        contraseña: '',
        idRol: 1
      },
      confirmarContraseña: ''
    };
  },
  methods: {
    async handleSubmit() {
      // Validar contraseñas
      if (this.formData.contraseña !== this.confirmarContraseña) {
        this.store.errorMessage = 'Las contraseñas no coinciden';
        return;
      }
      
      const success = await this.store.registrarUsuario(this.formData);
      
      if (success) {
        this.router.push('/');
      }
    }
  }
});
</script>

<style scoped>
/* Tus estilos actuales... */
</style>