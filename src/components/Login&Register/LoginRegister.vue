<template>
  <div class="LoginRegister">
    <div class="LoginRegister__BackgroundAnimation">
      <div class="LoginRegister__FloatingShape LoginRegister__FloatingShape--1"></div>
      <div class="LoginRegister__FloatingShape LoginRegister__FloatingShape--2"></div>
      <div class="LoginRegister__FloatingShape LoginRegister__FloatingShape--3"></div>
      <div class="LoginRegister__FloatingShape LoginRegister__FloatingShape--4"></div>
      <div class="LoginRegister__FloatingShape LoginRegister__FloatingShape--5"></div>
    </div>

    <v-container fluid class="LoginRegister__Container">
      <v-row no-gutters class="fill-height align-center justify-center">
        <v-col cols="12" sm="10" md="8" lg="5" xl="4">
          <div class="text-center mb-4">
            <div class="LoginRegister__LogoContainer">
              <v-avatar size="60" class="LoginRegister__LogoAvatar">
                <v-icon size="35" color="white">mdi-school</v-icon>
              </v-avatar>
            </div>
            <h1 class="LoginRegister__LogoText">AcademIQ</h1>
            <p class="LoginRegister__LogoSubtitle">Tu plataforma de aprendizaje</p>
          </div>

          <v-card class="LoginRegister__Card" elevation="16">
            <div class="LoginRegister__TabsContainer">
              <div class="LoginRegister__TabsWrapper">
                <button 
                  :class="['LoginRegister__TabButton', { 'LoginRegister__TabButton--active': tab === 'login' }]"
                  @click="tab = 'login'"
                >
                  <v-icon class="LoginRegister__TabIcon">mdi-login</v-icon>
                  Iniciar Sesión
                </button>
                <button 
                  :class="['LoginRegister__TabButton', { 'LoginRegister__TabButton--active': tab === 'register' }]"
                  @click="tab = 'register'"
                >
                  <v-icon class="LoginRegister__TabIcon">mdi-account-plus</v-icon>
                  Registrarse
                </button>
              </div>
              <div :class="['LoginRegister__TabIndicator', { 'LoginRegister__TabIndicator--right': tab === 'register' }]"></div>
            </div>

            <v-card-text class="LoginRegister__Content">
              <v-alert
                v-if="alert.show"
                :type="alert.type"
                variant="tonal"
                class="LoginRegister__Alert mb-3"
                border="start"
                closable
                @click:close="alert.show = false"
                density="compact"
              >
                <template v-slot:prepend>
                  <v-icon size="small">{{ getAlertIcon(alert.type) }}</v-icon>
                </template>
                {{ alert.message }}
              </v-alert>

              <div class="LoginRegister__TabContent">
                <div v-if="tab === 'login'" class="LoginRegister__FormContainer">
                  <h2 class="LoginRegister__FormTitle">¡Bienvenido!</h2>
                  <p class="LoginRegister__FormSubtitle">Ingresa tus credenciales</p>

                  <v-form ref="loginForm" v-model="loginValid" @submit.prevent="handleLogin" class="mt-4">
                    <div class="LoginRegister__InputGroup">
                      <v-text-field
                        v-model="loginEmail"
                        :rules="emailRules"
                        label="Correo electrónico"
                        type="email"
                        variant="outlined"
                        color="primary"
                        class="LoginRegister__Input"
                        prepend-inner-icon="mdi-email-outline"
                        :disabled="loading"
                        autocomplete="email"
                        density="compact"
                      ></v-text-field>
                    </div>

                    <div class="LoginRegister__InputGroup">
                      <v-text-field
                        v-model="loginPassword"
                        :rules="passwordRules"
                        :type="showPassword ? 'text' : 'password'"
                        label="Contraseña"
                        variant="outlined"
                        color="primary"
                        class="LoginRegister__Input"
                        prepend-inner-icon="mdi-lock-outline"
                        :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                        @click:append-inner="showPassword = !showPassword"
                        :disabled="loading"
                        autocomplete="current-password"
                        density="compact"
                      ></v-text-field>
                    </div>

                    <v-btn
                      type="submit"
                      color="primary"
                      size="large"
                      block
                      :loading="loading"
                      class="LoginRegister__SubmitBtn mt-4"
                      variant="elevated"
                    >
                      <v-icon start>mdi-login</v-icon>
                      Iniciar Sesión
                    </v-btn>
                  </v-form>
                </div>

                <div v-else class="LoginRegister__FormContainer">
                  <h2 class="LoginRegister__FormTitle">¡Únete a nosotros!</h2>
                  <p class="LoginRegister__FormSubtitle">Crea tu cuenta de estudiante</p>

                  <v-form ref="registerForm" v-model="registerValid" @submit.prevent="handleRegister" class="mt-4">
                    <v-row dense>
                      <v-col cols="12" sm="6">
                        <div class="LoginRegister__InputGroup">
                          <v-text-field
                            v-model="registerNombre"
                            :rules="nameRules"
                            label="Nombre *"
                            variant="outlined"
                            color="primary"
                            class="LoginRegister__Input"
                            prepend-inner-icon="mdi-account-outline"
                            :disabled="loading"
                            autocomplete="given-name"
                            required
                            density="compact"
                          ></v-text-field>
                        </div>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <div class="LoginRegister__InputGroup">
                          <v-text-field
                            v-model="registerApellido"
                            :rules="nameRules"
                            label="Apellido *"
                            variant="outlined"
                            color="primary"
                            class="LoginRegister__Input"
                            prepend-inner-icon="mdi-account-outline"
                            :disabled="loading"
                            autocomplete="family-name"
                            required
                            density="compact"
                          ></v-text-field>
                        </div>
                      </v-col>
                    </v-row>

                    <div class="LoginRegister__InputGroup">
                      <v-text-field
                        v-model="registerEmail"
                        :rules="emailRules"
                        label="Correo electrónico *"
                        type="email"
                        variant="outlined"
                        color="primary"
                        class="LoginRegister__Input"
                        prepend-inner-icon="mdi-email-outline"
                        :disabled="loading"
                        autocomplete="email"
                        required
                        density="compact"
                      ></v-text-field>
                    </div>

                    <div class="LoginRegister__InputGroup">
                      <v-text-field
                        v-model="registerTelefono"
                        :rules="phoneRules"
                        label="Teléfono *"
                        type="tel"
                        variant="outlined"
                        color="primary"
                        class="LoginRegister__Input"
                        prepend-inner-icon="mdi-phone-outline"
                        :disabled="loading"
                        autocomplete="tel"
                        required
                        placeholder="+34 123 456 789"
                        density="compact"
                      ></v-text-field>
                    </div>

                    <v-row dense>
                      <v-col cols="12" sm="6">
                        <div class="LoginRegister__InputGroup">
                          <v-text-field
                            v-model="registerPassword"
                            :rules="passwordRules"
                            :type="showPassword ? 'text' : 'password'"
                            label="Contraseña *"
                            variant="outlined"
                            color="primary"
                            class="LoginRegister__Input"
                            prepend-inner-icon="mdi-lock-outline"
                            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                            @click:append-inner="showPassword = !showPassword"
                            :disabled="loading"
                            autocomplete="new-password"
                            required
                            density="compact"
                          ></v-text-field>
                        </div>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <div class="LoginRegister__InputGroup">
                          <v-text-field
                            v-model="registerConfirmPassword"
                            :rules="[...passwordRules, passwordConfirmationRule]"
                            :type="showPassword ? 'text' : 'password'"
                            label="Confirmar Contraseña *"
                            variant="outlined"
                            color="primary"
                            class="LoginRegister__Input"
                            prepend-inner-icon="mdi-lock-check-outline"
                            :disabled="loading"
                            autocomplete="new-password"
                            required
                            density="compact"
                          ></v-text-field>
                        </div>
                      </v-col>
                    </v-row>

                    <div class="LoginRegister__TermsContainer">
                      <v-checkbox
                        v-model="termsAccepted"
                        :rules="[v => !!v || 'Debes aceptar los términos y condiciones']"
                        color="primary"
                        density="compact"
                        :disabled="loading"
                        hide-details="auto"
                      >
                        <template v-slot:label>
                          <span class="LoginRegister__TermsLabel">
                            Acepto los 
                            <a href="#" class="LoginRegister__TermsLink" @click.prevent>términos y condiciones</a>
                          </span>
                        </template>
                      </v-checkbox>
                    </div>

                    <v-alert
                      type="info"
                      variant="tonal"
                      class="mb-3"
                      border="start"
                      density="compact"
                    >
                      <template v-slot:prepend>
                        <v-icon size="small">mdi-information</v-icon>
                      </template>
                      <small><strong>Cuenta de Estudiante:</strong> Te registrarás como estudiante.</small>
                    </v-alert>

                    <v-btn
                      type="submit"
                      color="primary"
                      size="large"
                      block
                      :loading="loading"
                      class="LoginRegister__SubmitBtn mt-3"
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

          <div class="LoginRegister__Footer">
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
      
      loginValid: false,
      loginEmail: '',
      loginPassword: '',
      rememberMe: false,
      
      registerValid: false,
      registerNombre: '',
      registerApellido: '',
      registerEmail: '',
      registerTelefono: '',
      registerPassword: '',
      registerConfirmPassword: '',
      termsAccepted: false,
      
      alert: {
        show: false,
        type: 'info',
        message: ''
      },
      
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
          this.$router.push('/home');
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

      if (!this.registerNombre.trim() || !this.registerApellido.trim() || 
          !this.registerEmail.trim() || !this.registerTelefono.trim() || 
          !this.registerPassword.trim() || !this.termsAccepted) {
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
          idRol: 1
        };

        console.log("📝 Registrando usuario como estudiante:", {
          ...nuevoUsuario,
          contraseña: "[OCULTA]"
        });

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
          idRol: 1,
          rol: { id: 1, nombre: 'Estudiante' }
        };

        const usuarioLogeadoStore = useUsuarioLogeadoStore();
        usuarioLogeadoStore.iniciarSesion({
          usuario: usuario,
          token: data.token
        });

        this.showMessage('success', '¡Cuenta creada exitosamente! Bienvenido a AcademIQ');
        
        setTimeout(() => {
          this.$router.push('/home');
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

<style scoped lang="scss">
@import "@/assets/sass/pages/LoginRegister";
</style>