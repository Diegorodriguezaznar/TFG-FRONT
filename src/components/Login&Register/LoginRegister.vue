<template>
  <div class="auth-wrapper">
    <!-- Fondo animado -->
    <div class="background-animation">
      <div class="floating-shape shape-1"></div>
      <div class="floating-shape shape-2"></div>
      <div class="floating-shape shape-3"></div>
      <div class="floating-shape shape-4"></div>
      <div class="floating-shape shape-5"></div>
    </div>

    <!-- Contenedor principal -->
    <v-container fluid class="auth-container">
      <v-row no-gutters class="fill-height align-center justify-center">
        <v-col cols="12" sm="10" md="8" lg="6" xl="4">
          <!-- Logo y branding -->
          <div class="text-center mb-8">
            <div class="logo-container">
              <v-avatar size="80" class="logo-avatar">
                <v-icon size="50" color="white">mdi-school</v-icon>
              </v-avatar>
            </div>
            <h1 class="logo-text">AcademIQ</h1>
            <p class="logo-subtitle">Tu plataforma de aprendizaje</p>
          </div>

          <!-- Card principal -->
          <v-card class="auth-card" elevation="24">
            <!-- Pestañas mejoradas -->
            <div class="tabs-container">
              <div class="tabs-wrapper">
                <button 
                  :class="['tab-button', { active: tab === 'login' }]"
                  @click="tab = 'login'"
                >
                  <v-icon class="tab-icon">mdi-login</v-icon>
                  Iniciar Sesión
                </button>
                <button 
                  :class="['tab-button', { active: tab === 'register' }]"
                  @click="tab = 'register'"
                >
                  <v-icon class="tab-icon">mdi-account-plus</v-icon>
                  Registrarse
                </button>
              </div>
              <div class="tab-indicator" :class="{ 'indicator-right': tab === 'register' }"></div>
            </div>

            <v-card-text class="auth-content">
              <!-- Alertas mejoradas -->
              <v-alert
                v-if="alert.show"
                :type="alert.type"
                variant="tonal"
                class="custom-alert mb-6"
                border="start"
                closable
                @click:close="alert.show = false"
              >
                <template v-slot:prepend>
                  <v-icon>{{ getAlertIcon(alert.type) }}</v-icon>
                </template>
                {{ alert.message }}
              </v-alert>

              <!-- Contenido de las pestañas -->
              <div class="tab-content">
                <!-- Login Form -->
                <div v-if="tab === 'login'" class="form-container">
                  <h2 class="form-title">¡Bienvenido de vuelta!</h2>
                  <p class="form-subtitle">Ingresa tus credenciales para continuar</p>

                  <v-form ref="loginForm" v-model="loginValid" @submit.prevent="handleLogin" class="mt-6">
                    <div class="input-group">
                      <v-text-field
                        v-model="loginEmail"
                        :rules="emailRules"
                        label="Correo electrónico"
                        type="email"
                        variant="outlined"
                        color="primary"
                        class="custom-input"
                        prepend-inner-icon="mdi-email-outline"
                        :disabled="loading"
                        autocomplete="email"
                      ></v-text-field>
                    </div>

                    <div class="input-group">
                      <v-text-field
                        v-model="loginPassword"
                        :rules="passwordRules"
                        :type="showPassword ? 'text' : 'password'"
                        label="Contraseña"
                        variant="outlined"
                        color="primary"
                        class="custom-input"
                        prepend-inner-icon="mdi-lock-outline"
                        :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                        @click:append-inner="showPassword = !showPassword"
                        :disabled="loading"
                        autocomplete="current-password"
                      ></v-text-field>
                    </div>

                    <div class="form-options">
                      <v-checkbox
                        v-model="rememberMe"
                        color="primary"
                        density="compact"
                        hide-details
                        :disabled="loading"
                      >
                        <template v-slot:label>
                          <span class="checkbox-label">Recordarme</span>
                        </template>
                      </v-checkbox>

                      <v-btn
                        variant="text"
                        color="primary"
                        size="small"
                        @click="forgotPassword"
                        :disabled="loading"
                        class="forgot-password-btn"
                      >
                        ¿Olvidaste tu contraseña?
                      </v-btn>
                    </div>

                    <v-btn
                      type="submit"
                      color="primary"
                      size="x-large"
                      block
                      :loading="loading"
                      class="submit-btn mt-6"
                      variant="elevated"
                    >
                      <v-icon start>mdi-login</v-icon>
                      Iniciar Sesión
                    </v-btn>
                  </v-form>
                </div>

                <!-- Register Form -->
                <div v-else class="form-container">
                  <h2 class="form-title">¡Únete a nosotros!</h2>
                  <p class="form-subtitle">Crea tu cuenta y comienza a aprender</p>

                  <v-form ref="registerForm" v-model="registerValid" @submit.prevent="handleRegister" class="mt-6">
                    <v-row>
                      <v-col cols="12" sm="6">
                        <div class="input-group">
                          <v-text-field
                            v-model="registerNombre"
                            :rules="nameRules"
                            label="Nombre *"
                            variant="outlined"
                            color="primary"
                            class="custom-input"
                            prepend-inner-icon="mdi-account-outline"
                            :disabled="loading"
                            autocomplete="given-name"
                            required
                          ></v-text-field>
                        </div>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <div class="input-group">
                          <v-text-field
                            v-model="registerApellido"
                            :rules="nameRules"
                            label="Apellido *"
                            variant="outlined"
                            color="primary"
                            class="custom-input"
                            prepend-inner-icon="mdi-account-outline"
                            :disabled="loading"
                            autocomplete="family-name"
                            required
                          ></v-text-field>
                        </div>
                      </v-col>
                    </v-row>

                    <div class="input-group">
                      <v-text-field
                        v-model="registerEmail"
                        :rules="emailRules"
                        label="Correo electrónico *"
                        type="email"
                        variant="outlined"
                        color="primary"
                        class="custom-input"
                        prepend-inner-icon="mdi-email-outline"
                        :disabled="loading"
                        autocomplete="email"
                        required
                      ></v-text-field>
                    </div>

                    <div class="input-group">
                      <v-text-field
                        v-model="registerTelefono"
                        :rules="phoneRules"
                        label="Teléfono *"
                        type="tel"
                        variant="outlined"
                        color="primary"
                        class="custom-input"
                        prepend-inner-icon="mdi-phone-outline"
                        :disabled="loading"
                        autocomplete="tel"
                        required
                        placeholder="+34 123 456 789"
                      ></v-text-field>
                    </div>

                    <div class="input-group">
                      <v-select
                        v-model="selectedRol"
                        :items="roles"
                        item-title="nombre"
                        item-value="id"
                        label="Tipo de usuario *"
                        variant="outlined"
                        color="primary"
                        class="custom-input"
                        prepend-inner-icon="mdi-account-cog-outline"
                        :disabled="loading"
                        :rules="rolRules"
                        required
                      ></v-select>
                    </div>

                    <v-row>
                      <v-col cols="12" sm="6">
                        <div class="input-group">
                          <v-text-field
                            v-model="registerPassword"
                            :rules="passwordRules"
                            :type="showPassword ? 'text' : 'password'"
                            label="Contraseña *"
                            variant="outlined"
                            color="primary"
                            class="custom-input"
                            prepend-inner-icon="mdi-lock-outline"
                            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                            @click:append-inner="showPassword = !showPassword"
                            :disabled="loading"
                            autocomplete="new-password"
                            required
                          ></v-text-field>
                        </div>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <div class="input-group">
                          <v-text-field
                            v-model="registerConfirmPassword"
                            :rules="[...passwordRules, passwordConfirmationRule]"
                            :type="showPassword ? 'text' : 'password'"
                            label="Confirmar Contraseña *"
                            variant="outlined"
                            color="primary"
                            class="custom-input"
                            prepend-inner-icon="mdi-lock-check-outline"
                            :disabled="loading"
                            autocomplete="new-password"
                            required
                          ></v-text-field>
                        </div>
                      </v-col>
                    </v-row>

                    <div class="terms-container">
                      <v-checkbox
                        v-model="termsAccepted"
                        :rules="[v => !!v || 'Debes aceptar los términos y condiciones']"
                        color="primary"
                        density="compact"
                        :disabled="loading"
                      >
                        <template v-slot:label>
                          <span class="terms-label">
                            Acepto los 
                            <a href="#" class="terms-link" @click.prevent>términos y condiciones</a>
                          </span>
                        </template>
                      </v-checkbox>
                    </div>

                    <v-btn
                      type="submit"
                      color="primary"
                      size="x-large"
                      block
                      :loading="loading"
                      class="submit-btn mt-4"
                      variant="elevated"
                    >
                      <v-icon start>mdi-account-plus</v-icon>
                      Crear Cuenta
                    </v-btn>
                  </v-form>
                </div>
              </div>
            </v-card-text>
          </v-card>

          <!-- Footer -->
          <div class="auth-footer">
            <p>&copy; 2025 AcademIQ. Todos los derechos reservados.</p>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { useUsuarioLogeadoStore } from "@/stores/UsuarioLogeado";
import { useUsuarioStore } from "@/stores/Usuario";

export default {
  name: 'LoginRegister',
  data() {
    return {
      tab: 'login',
      showPassword: false,
      loading: false,
      
      // Login form
      loginValid: false,
      loginEmail: '',
      loginPassword: '',
      rememberMe: false,
      
      // Register form
      registerValid: false,
      registerNombre: '',
      registerApellido: '',
      registerEmail: '',
      registerTelefono: '',
      registerPassword: '',
      registerConfirmPassword: '',
      termsAccepted: false,
      
      // Rol selector
      selectedRol: 1,
      roles: [
        { id: 1, nombre: 'Alumno' },
        { id: 2, nombre: 'Profesor' }
      ],
      
      // Alerta
      alert: {
        show: false,
        type: 'info',
        message: ''
      },
      
      // Validation rules
      nameRules: [
        v => !!v || 'Este campo es requerido',
        v => (v && v.trim().length >= 2) || 'Debe tener al menos 2 caracteres',
        v => (v && v.trim().length <= 50) || 'Máximo 50 caracteres'
      ],
      emailRules: [
        v => !!v || 'El correo electrónico es requerido',
        v => /.+@.+\..+/.test(v) || 'El correo electrónico debe ser válido'
      ],
      phoneRules: [
        v => !!v || 'El teléfono es requerido',
        v => v.trim() !== '' || 'El teléfono no puede estar vacío',
        v => /^[+]?[\d\s\-()]{9,15}$/.test(v) || 'El teléfono debe tener entre 9 y 15 dígitos'
      ],
      passwordRules: [
        v => !!v || 'La contraseña es requerida',
        v => v.length >= 6 || 'La contraseña debe tener al menos 6 caracteres'
      ],
      rolRules: [
        v => !!v || 'Debes seleccionar un tipo de usuario'
      ]
    }
  },
  computed: {
    passwordConfirmationRule() {
      return () => 
        this.registerPassword === this.registerConfirmPassword || 
        'Las contraseñas no coinciden'
    }
  },
  methods: {
    getAlertIcon(type) {
      const icons = {
        success: 'mdi-check-circle',
        error: 'mdi-alert-circle',
        warning: 'mdi-alert',
        info: 'mdi-information'
      };
      return icons[type] || 'mdi-information';
    },
    
    showMessage(type, message) {
      this.alert = {
        show: true,
        type,
        message
      };
    },
    
    async handleLogin() {
      if (!this.$refs.loginForm.validate()) return;
            
      this.loading = true;
            
      try {
        const response = await fetch("http://localhost:5190/api/Auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            gmail: this.loginEmail,
            contraseña: this.loginPassword
          })
        });

        if (!response.ok) {
          throw new Error("Credenciales incorrectas");
        }

        const data = await response.json();
        console.log("🔍 Respuesta completa del login:", data);

        const usuarioLogeadoStore = useUsuarioLogeadoStore();

        const usuario = {
          idUsuario: data.idUsuario,
          nombre: data.nombre,
          gmail: this.loginEmail, 
          idRol: data.idRol, 
          rol: data.rol
        };

        usuarioLogeadoStore.iniciarSesion({
          usuario: usuario,
          token: data.token
        });

        this.showMessage('success', '¡Bienvenido de vuelta!');
        
        setTimeout(() => {
          this.$router.push('/cursos');
        }, 1200);
      } catch (error) {
        console.error('Error al iniciar sesión:', error);
        this.showMessage('error', 'Credenciales incorrectas. Por favor, verifica tus datos.');
      } finally {
        this.loading = false;
      }
    },
        
    async handleRegister() {
      if (!this.$refs.registerForm.validate()) return;

      // Validación adicional para asegurar que todos los campos están completos
      if (!this.registerNombre.trim() || !this.registerApellido.trim() || 
          !this.registerEmail.trim() || !this.registerTelefono.trim() || 
          !this.registerPassword.trim() || !this.selectedRol || !this.termsAccepted) {
        this.showMessage('warning', 'Por favor, completa todos los campos obligatorios.');
        return;
      }

      this.loading = true;

      try {
        const nuevoUsuario = {
          nombre: this.registerNombre.trim(),
          apellidos: this.registerApellido.trim(),
          gmail: this.registerEmail.trim(),
          telefono: this.registerTelefono.trim(),
          contraseña: this.registerPassword.trim(),
          idRol: this.selectedRol
        };

        const response = await fetch("http://localhost:5190/api/Auth/registro", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(nuevoUsuario)
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error al registrar: ${response.status} ${errorText}`);
        }

        const data = await response.json();

        const usuario = {
          idUsuario: data.idUsuario,
          nombre: data.nombre,
          gmail: this.registerEmail.trim(),
          apellidos: this.registerApellido.trim(),
          telefono: this.registerTelefono.trim(),
          idRol: data.idRol,
          rol: data.rol
        };

        const usuarioLogeadoStore = useUsuarioLogeadoStore();
        usuarioLogeadoStore.iniciarSesion({
          usuario: usuario,
          token: data.token
        });

        this.showMessage('success', '¡Cuenta creada exitosamente! Bienvenido a AcademIQ');
        
        setTimeout(() => {
          this.$router.push('/cursos');
        }, 1500);
      } catch (error) {
        console.error('Error al registrarse:', error);
        this.showMessage('error', 'No se pudo crear la cuenta. Por favor, intenta de nuevo.');
      } finally {
        this.loading = false;
      }
    },

    async forgotPassword() {
      if (!this.loginEmail) {
        this.showMessage('warning', 'Introduce tu correo electrónico para recuperar la contraseña');
        return;
      }
      
      this.showMessage('info', 'La funcionalidad de recuperación de contraseña estará disponible próximamente.');
    }
  }
}
</script>

<style scoped>
/* Variables CSS */
:root {
  --primary-color: #FF9800;
  --primary-dark: #F57700;
  --primary-light: #FFB74D;
  --secondary-color: #2196F3;
  --text-primary: #212121;
  --text-secondary: #757575;
  --background-light: #FAFAFA;
  --shadow-main: 0 8px 32px rgba(0, 0, 0, 0.1);
  --shadow-hover: 0 12px 40px rgba(0, 0, 0, 0.15);
  --border-radius: 16px;
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Wrapper principal */
.auth-wrapper {
  min-height: 100vh;
  position: relative;
  background: linear-gradient(135deg, #FF6B35 0%, #F7931E 25%, #FFB74D 50%, #FF8A65 75%, #FF7043 100%);
  overflow: hidden;
}

/* Animación de fondo */
.background-animation {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
}

.floating-shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  animation: float 4s ease-in-out infinite;
  backdrop-filter: blur(2px);
}

.shape-1 {
  width: 80px;
  height: 80px;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
  background: rgba(255, 152, 0, 0.2);
}

.shape-2 {
  width: 120px;
  height: 120px;
  top: 70%;
  left: 80%;
  animation-delay: 0.8s;
  background: rgba(255, 193, 7, 0.25);
}

.shape-3 {
  width: 60px;
  height: 60px;
  top: 20%;
  right: 10%;
  animation-delay: 1.6s;
  background: rgba(255, 183, 77, 0.3);
}

.shape-4 {
  width: 100px;
  height: 100px;
  bottom: 20%;
  left: 20%;
  animation-delay: 2.4s;
  background: rgba(255, 112, 67, 0.2);
}

.shape-5 {
  width: 40px;
  height: 40px;
  top: 50%;
  left: 50%;
  animation-delay: 3.2s;
  background: rgba(255, 138, 101, 0.25);
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg) scale(1);
  }
  33% {
    transform: translateY(-25px) rotate(120deg) scale(1.1);
  }
  66% {
    transform: translateY(15px) rotate(240deg) scale(0.9);
  }
}

/* Contenedor principal */
.auth-container {
  position: relative;
  z-index: 1;
  padding: 2rem;
}

/* Logo y branding */
.logo-container {
  margin-bottom: 1.5rem;
}

.logo-avatar {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
  box-shadow: var(--shadow-main);
  margin: 0 auto;
}

.logo-text {
  font-size: 3rem;
  font-weight: 700;
  color: white;
  margin: 1rem 0 0.5rem;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  letter-spacing: -1px;
}

.logo-subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  margin: 0;
  font-weight: 300;
}

/* Card principal */
.auth-card {
  border-radius: 24px;
  backdrop-filter: blur(20px);
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
  transition: var(--transition);
}

.auth-card:hover {
  box-shadow: var(--shadow-hover);
  transform: translateY(-2px);
}

/* Pestañas mejoradas */
.tabs-container {
  position: relative;
  background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
  padding: 0;
}

.tabs-wrapper {
  display: flex;
  position: relative;
}

.tab-button {
  flex: 1;
  padding: 1.5rem 2rem;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  position: relative;
  z-index: 2;
}

.tab-button.active {
  color: var(--primary-color);
}

.tab-icon {
  font-size: 1.2rem;
}

.tab-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50%;
  height: 4px;
  background: linear-gradient(90deg, var(--primary-color), var(--primary-light));
  transition: var(--transition);
  border-radius: 2px 2px 0 0;
}

.tab-indicator.indicator-right {
  left: 50%;
}

/* Contenido */
.auth-content {
  padding: 3rem;
}

.tab-content {
  min-height: 500px;
}

.form-container {
  max-width: 100%;
}

.form-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  text-align: center;
}

.form-subtitle {
  color: var(--text-secondary);
  text-align: center;
  margin-bottom: 0;
  font-size: 1rem;
}

/* Grupos de inputs */
.input-group {
  margin-bottom: 1.5rem;
}

/* Inputs personalizados */
:deep(.custom-input .v-field) {
  border-radius: 12px;
  background: rgba(248, 250, 252, 0.8);
  backdrop-filter: blur(10px);
}

:deep(.custom-input .v-field--focused) {
  box-shadow: 0 0 0 2px rgba(255, 152, 0, 0.2);
}

:deep(.custom-input .v-field__input) {
  padding: 1rem 1rem 1rem 3rem;
  font-size: 1rem;
}

:deep(.custom-input .v-field__prepend-inner) {
  padding-left: 1rem;
}

/* Opciones del formulario */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1.5rem 0;
  flex-wrap: wrap;
  gap: 1rem;
}

.checkbox-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.forgot-password-btn {
  font-size: 0.9rem;
  text-decoration: none;
}

.forgot-password-btn:hover {
  text-decoration: underline;
}

/* Términos */
.terms-container {
  margin: 1.5rem 0;
}

.terms-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.terms-link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
}

.terms-link:hover {
  text-decoration: underline;
}

/* Botón de envío */
.submit-btn {
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: none;
  box-shadow: var(--shadow-main);
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
}

.submit-btn:hover {
  box-shadow: var(--shadow-hover);
  transform: translateY(-2px);
}

/* Alertas personalizadas */
.custom-alert {
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border-left-width: 4px;
}

/* Footer */
.auth-footer {
  text-align: center;
  margin-top: 2rem;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
}

/* Responsive */
@media (max-width: 768px) {
  .auth-content {
    padding: 2rem 1.5rem;
  }
  
  .logo-text {
    font-size: 2.5rem;
  }
  
  .form-title {
    font-size: 1.75rem;
  }
  
  .tab-button {
    padding: 1.25rem 1rem;
    font-size: 0.9rem;
  }
  
  .form-options {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 480px) {
  .auth-container {
    padding: 1rem;
  }
  
  .auth-content {
    padding: 1.5rem 1rem;
  }
  
  .logo-text {
    font-size: 2rem;
  }
  
  .tab-content {
    min-height: auto;
  }
}

/* Animaciones */
.form-container {
  animation: fadeInUp 0.4s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Estados de carga */
.submit-btn:disabled {
  opacity: 0.7;
}

/* Mejoras de accesibilidad */
.tab-button:focus {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

:deep(.v-field--focused .v-field__outline) {
  border-color: var(--primary-color);
  border-width: 2px;
}
</style>