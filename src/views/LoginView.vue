<!-- FRONTEND: TFG-FRONT/src/views/LoginView.vue -->
<template>
  <div class="auth-page">
    <FormCard title="Iniciar Sesión">
      <div v-if="store.errorMessage" class="error-message">{{ store.errorMessage }}</div>
      
      <form @submit.prevent="handleSubmit">
        <FormInput 
          id="login-email"
          label="Email"
          type="email"
          v-model="formData.gmail"
          required
        />
        
        <FormInput 
          id="login-password"
          label="Contraseña"
          type="password"
          v-model="formData.contraseña"
          required
        />
        
        <div class="form-actions">
          <FormButton type="submit" primary>Iniciar Sesión</FormButton>
        </div>
      </form>
      
      <div class="form-footer">
        <p>¿No tienes cuenta? <router-link to="/registro" class="text-link">Crear Cuenta</router-link></p>
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
  name: 'LoginView',
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
        gmail: '',
        contraseña: ''
      }
    };
  },
  methods: {
    async handleSubmit() {
      const success = await this.store.iniciarSesion(this.formData);
      
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