<template>
  <v-container fluid class="fill-height pa-0 ma-0">
    <v-row no-gutters class="fill-height">
      <v-col cols="12" class="auth-container">
        <v-card class="auth-card mx-auto" max-width="500">
          <v-tabs
            v-model="tab"
            color="deep-orange"
            align-tabs="center"
            grow
          >
            <v-tab value="login">Iniciar Sesión</v-tab>
            <v-tab value="register">Registrarse</v-tab>
          </v-tabs>

          <v-card-text class="mt-5">
            <!-- Alerta para mostrar mensajes -->
            <v-alert
              v-if="alert.show"
              :type="alert.type"
              :text="alert.message"
              class="mb-4"
              closable
              @click:close="alert.show = false"
            ></v-alert>
            
            <v-window v-model="tab">
              <!-- Login Form -->
              <v-window-item value="login">
                <v-form ref="loginForm" v-model="loginValid" @submit.prevent="handleLogin">
                  <v-text-field
                    v-model="loginEmail"
                    :rules="emailRules"
                    label="Correo electrónico"
                    prepend-icon="mdi-email"
                    variant="outlined"
                    color="deep-orange"
                    required
                  ></v-text-field>

                  <v-text-field
                    v-model="loginPassword"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="passwordRules"
                    :type="showPassword ? 'text' : 'password'"
                    label="Contraseña"
                    prepend-icon="mdi-lock"
                    variant="outlined"
                    color="deep-orange"
                    required
                    @click:append="showPassword = !showPassword"
                  ></v-text-field>

                  <v-checkbox
                    v-model="rememberMe"
                    color="deep-orange"
                    label="Recordarme"
                  ></v-checkbox>

                  <div class="d-flex justify-space-between align-center mb-4">
                    <v-btn
                      text
                      color="deep-orange"
                      variant="text"
                      @click="forgotPassword"
                    >
                      ¿Olvidaste tu contraseña?
                    </v-btn>
                  </div>

                  <v-btn
                    block
                    color="deep-orange"
                    size="large"
                    type="submit"
                    :loading="loading"
                    class="white--text"
                  >
                    Iniciar Sesión
                  </v-btn>
                </v-form>
              </v-window-item>

              <!-- Register Form -->
              <v-window-item value="register">
                <v-form ref="registerForm" v-model="registerValid" @submit.prevent="handleRegister">
                  <v-text-field
                    v-model="registerNombre"
                    :rules="nameRules"
                    label="Nombre"
                    prepend-icon="mdi-account"
                    variant="outlined"
                    color="deep-orange"
                    required
                  ></v-text-field>

                  <v-text-field
                    v-model="registerApellido"
                    :rules="nameRules"
                    label="Apellido"
                    prepend-icon="mdi-account"
                    variant="outlined"
                    color="deep-orange"
                    required
                  ></v-text-field>

                  <v-text-field
                    v-model="registerEmail"
                    :rules="emailRules"
                    label="Correo electrónico"
                    prepend-icon="mdi-email"
                    variant="outlined"
                    color="deep-orange"
                    required
                  ></v-text-field>

                  <v-text-field
                    v-model="registerTelefono"
                    :rules="phoneRules"
                    label="Teléfono"
                    prepend-icon="mdi-phone"
                    variant="outlined"
                    color="deep-orange"
                    required
                  ></v-text-field>
                  
                  <!-- Selector de rol -->
                  <v-select
                    v-model="selectedRol"
                    :items="roles"
                    item-title="nombre"
                    item-value="id"
                    label="Tipo de usuario"
                    prepend-icon="mdi-account-cog"
                    variant="outlined"
                    color="deep-orange"
                    required
                  ></v-select>

                  <v-text-field
                    v-model="registerPassword"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="passwordRules"
                    :type="showPassword ? 'text' : 'password'"
                    label="Contraseña"
                    prepend-icon="mdi-lock"
                    variant="outlined"
                    color="deep-orange"
                    required
                    @click:append="showPassword = !showPassword"
                  ></v-text-field>

                  <v-text-field
                    v-model="registerConfirmPassword"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="[...passwordRules, passwordConfirmationRule]"
                    :type="showPassword ? 'text' : 'password'"
                    label="Confirmar Contraseña"
                    prepend-icon="mdi-lock-check"
                    variant="outlined"
                    color="deep-orange"
                    required
                    @click:append="showPassword = !showPassword"
                  ></v-text-field>

                  <v-checkbox
                    v-model="termsAccepted"
                    :rules="[v => !!v || 'Debes aceptar los términos y condiciones']"
                    color="deep-orange"
                    label="Acepto los términos y condiciones"
                    required
                  ></v-checkbox>

                  <v-btn
                    block
                    color="deep-orange"
                    size="large"
                    type="submit"
                    :loading="loading"
                    class="white--text"
                  >
                    Registrarse
                  </v-btn>
                </v-form>
              </v-window-item>
            </v-window>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
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
      selectedRol: 1, // Por defecto, rol de alumno (1)
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
        v => v.length >= 2 || 'El nombre debe tener al menos 2 caracteres'
      ],
      emailRules: [
        v => !!v || 'El correo electrónico es requerido',
        v => /.+@.+\..+/.test(v) || 'El correo electrónico debe ser válido'
      ],
      phoneRules: [
        v => !!v || 'El teléfono es requerido',
        v => /^\d{9,15}$/.test(v) || 'El teléfono debe tener entre 9 y 15 dígitos'
      ],
      passwordRules: [
        v => !!v || 'La contraseña es requerida',
        v => v.length >= 8 || 'La contraseña debe tener al menos 8 caracteres'
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

        // ✅ SOLUCIÓN: Usar directamente data.idRol del backend
        const usuario = {
          idUsuario: data.idUsuario,
          nombre: data.nombre,
          gmail: this.loginEmail, 
          idRol: data.idRol, 
          rol: data.rol
        };

        console.log("🔍 Usuario que se guardará:", usuario);
        console.log("🔍 idRol específico:", usuario.idRol);

        usuarioLogeadoStore.iniciarSesion({
          usuario: usuario,
          token: data.token
        });

        this.showMessage('success', 'Inicio de sesión correcto');
        this.$router.push('/cursos');
      } catch (error) {
        console.error('Error al iniciar sesión:', error);
        this.showMessage('error', 'Error al iniciar sesión: ' + (error.message || 'Error inesperado'));
      } finally {
        this.loading = false;
      }
    },
        
    async handleRegister() {
      if (!this.$refs.registerForm.validate()) return;

      this.loading = true;

      try {
        const nuevoUsuario = {
          nombre: this.registerNombre,
          apellidos: this.registerApellido,
          gmail: this.registerEmail,
          telefono: this.registerTelefono,
          contraseña: this.registerPassword,
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
        console.log("🔍 Respuesta completa del registro:", data);

        // ✅ SOLUCIÓN: Usar directamente data.idRol del backend
        const usuario = {
          idUsuario: data.idUsuario,
          nombre: data.nombre,
          gmail: this.registerEmail, // Del formulario
          apellidos: this.registerApellido, // Del formulario
          telefono: this.registerTelefono, // Del formulario
          idRol: data.idRol, // ✅ Usar directamente el idRol del backend
          rol: data.rol
        };

        console.log("🔍 Usuario registrado que se guardará:", usuario);
        console.log("🔍 idRol específico:", usuario.idRol);

        const usuarioLogeadoStore = useUsuarioLogeadoStore();
        usuarioLogeadoStore.iniciarSesion({
          usuario: usuario,
          token: data.token
        });

        this.showMessage('success', 'Registro exitoso. Sesión iniciada');
        this.$router.push('/cursos');
      } catch (error) {
        console.error('Error al registrarse:', error);
        this.showMessage('error', 'Error al registrarse: ' + (error.message || 'Error inesperado'));
      } finally {
        this.loading = false;
      }
    },

    resetRegisterForm() {
      this.registerNombre = '';
      this.registerApellido = '';
      this.registerEmail = '';
      this.registerTelefono = '';
      this.registerPassword = '';
      this.registerConfirmPassword = '';
      this.selectedRol = 1;
      this.termsAccepted = false;
    },
    
    async forgotPassword() {
      if (!this.loginEmail) {
        this.showMessage('error', 'Introduce tu correo electrónico para recuperar la contraseña');
        return;
      }
      
      this.loading = true;
      
      try {
        // No hay funcionalidad real para recuperar contraseña, mostrar mensaje informativo
        this.showMessage('info', 'La funcionalidad de recuperación de contraseña no está implementada en el backend.');
      } catch (error) {
        console.error('Error al recuperar contraseña:', error);
        this.showMessage('error', 'Error al recuperar contraseña: ' + error.message);
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>

<style scoped>
.auth-container {
  background: linear-gradient(to bottom right, white, #FFA500);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.auth-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="none"/><g fill="%23ffffff" fill-opacity="0.1"><circle cx="10" cy="10" r="1" /><circle cx="30" cy="10" r="1" /><circle cx="50" cy="10" r="1" /><circle cx="70" cy="10" r="1" /><circle cx="90" cy="10" r="1" /><circle cx="10" cy="30" r="1" /><circle cx="30" cy="30" r="1" /><circle cx="50" cy="30" r="1" /><circle cx="70" cy="30" r="1" /><circle cx="90" cy="30" r="1" /><circle cx="10" cy="50" r="1" /><circle cx="30" cy="50" r="1" /><circle cx="50" cy="50" r="1" /><circle cx="70" cy="50" r="1" /><circle cx="90" cy="50" r="1" /><circle cx="10" cy="70" r="1" /><circle cx="30" cy="70" r="1" /><circle cx="50" cy="70" r="1" /><circle cx="70" cy="70" r="1" /><circle cx="90" cy="70" r="1" /><circle cx="10" cy="90" r="1" /><circle cx="30" cy="90" r="1" /><circle cx="50" cy="90" r="1" /><circle cx="70" cy="90" r="1" /><circle cx="90" cy="90" r="1" /></g></svg>');
  opacity: 0.5;
}

.auth-card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 20px;
  z-index: 1;
}
</style>