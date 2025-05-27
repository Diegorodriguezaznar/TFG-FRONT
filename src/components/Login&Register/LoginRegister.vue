<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUsuarioLogeadoStore } from "@/stores/UsuarioLogeado";

const router = useRouter();

const tab = ref('login');
const showPassword = ref(false);
const loading = ref(false);

const loginForm = ref();
const registerForm = ref();

const loginValid = ref(false);
const loginEmail = ref('');
const loginPassword = ref('');
const rememberMe = ref(false);

const registerValid = ref(false);
const registerNombre = ref('');
const registerApellido = ref('');
const registerEmail = ref('');
const registerTelefono = ref('');
const registerPassword = ref('');
const registerConfirmPassword = ref('');
const termsAccepted = ref(false);

const selectedRol = ref(1);
const roles = [
  { id: 1, nombre: 'Alumno' },
  { id: 2, nombre: 'Profesor' }
];

const alert = ref({
  show: false,
  type: 'info',
  message: ''
});

const nameRules = [
  v => !!v || 'Este campo es requerido',
  v => v.length >= 2 || 'El nombre debe tener al menos 2 caracteres'
];

const emailRules = [
  v => !!v || 'El correo electrónico es requerido',
  v => /.+@.+\..+/.test(v) || 'El correo electrónico debe ser válido'
];

const phoneRules = [
  v => !!v || 'El teléfono es requerido',
  v => /^\d{9,15}$/.test(v) || 'El teléfono debe tener entre 9 y 15 dígitos'
];

const passwordRules = [
  v => !!v || 'La contraseña es requerida',
  v => v.length >= 8 || 'La contraseña debe tener al menos 8 caracteres'
];

const passwordConfirmationRule = computed(() => 
  () => registerPassword.value === registerConfirmPassword.value || 'Las contraseñas no coinciden'
);

const showMessage = (type: string, message: string) => {
  alert.value = { show: true, type, message };
};

const handleLogin = async () => {
  if (!loginForm.value.validate()) return;
  
  loading.value = true;
  
  try {
    const response = await fetch("http://localhost:5190/api/Auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        gmail: loginEmail.value,
        contraseña: loginPassword.value
      })
    });

    if (!response.ok) {
      throw new Error("Credenciales incorrectas");
    }

    const data = await response.json();
    const usuarioLogeadoStore = useUsuarioLogeadoStore();

    const usuario = {
      idUsuario: data.idUsuario,
      nombre: data.nombre,
      gmail: loginEmail.value,
      idRol: data.idRol,
      rol: data.rol
    };

    usuarioLogeadoStore.iniciarSesion({
      usuario: usuario,
      token: data.token
    });

    showMessage('success', 'Inicio de sesión correcto');
    router.push('/cursos');
  } catch (error) {
    showMessage('error', 'Error al iniciar sesión: ' + (error.message || 'Error inesperado'));
  } finally {
    loading.value = false;
  }
};

const handleRegister = async () => {
  if (!registerForm.value.validate()) return;

  loading.value = true;

  try {
    const nuevoUsuario = {
      nombre: registerNombre.value,
      apellidos: registerApellido.value,
      gmail: registerEmail.value,
      telefono: registerTelefono.value,
      contraseña: registerPassword.value,
      idRol: selectedRol.value
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
      gmail: registerEmail.value,
      apellidos: registerApellido.value,
      telefono: registerTelefono.value,
      idRol: data.idRol,
      rol: data.rol
    };

    const usuarioLogeadoStore = useUsuarioLogeadoStore();
    usuarioLogeadoStore.iniciarSesion({
      usuario: usuario,
      token: data.token
    });

    showMessage('success', 'Registro exitoso. Sesión iniciada');
    router.push('/cursos');
  } catch (error) {
    showMessage('error', 'Error al registrarse: ' + (error.message || 'Error inesperado'));
  } finally {
    loading.value = false;
  }
};

const forgotPassword = () => {
  if (!loginEmail.value) {
    showMessage('error', 'Introduce tu correo electrónico para recuperar la contraseña');
    return;
  }
  
  showMessage('info', 'La funcionalidad de recuperación de contraseña no está implementada en el backend.');
};
</script>

<template>
  <div class="LoginRegister">
    <div class="LoginRegister__contenedor">
      <div class="LoginRegister__card">
        <v-tabs
          v-model="tab"
          color="deep-orange"
          align-tabs="center"
          grow
          class="LoginRegister__tabs"
        >
          <v-tab value="login">Iniciar Sesión</v-tab>
          <v-tab value="register">Registrarse</v-tab>
        </v-tabs>

        <div class="LoginRegister__contenido">
          <v-alert
            v-if="alert.show"
            :type="alert.type"
            :text="alert.message"
            class="LoginRegister__alerta"
            closable
            @click:close="alert.show = false"
          />
          
          <v-window v-model="tab">
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
                  class="LoginRegister__campo"
                />

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
                  class="LoginRegister__campo"
                  @click:append="showPassword = !showPassword"
                />

                <v-checkbox
                  v-model="rememberMe"
                  color="deep-orange"
                  label="Recordarme"
                  class="LoginRegister__checkbox"
                />

                <div class="LoginRegister__acciones">
                  <v-btn
                    text
                    color="deep-orange"
                    variant="text"
                    @click="forgotPassword"
                    class="LoginRegister__link"
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
                  class="LoginRegister__boton"
                >
                  Iniciar Sesión
                </v-btn>
              </v-form>
            </v-window-item>

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
                  class="LoginRegister__campo"
                />

                <v-text-field
                  v-model="registerApellido"
                  :rules="nameRules"
                  label="Apellido"
                  prepend-icon="mdi-account"
                  variant="outlined"
                  color="deep-orange"
                  required
                  class="LoginRegister__campo"
                />

                <v-text-field
                  v-model="registerEmail"
                  :rules="emailRules"
                  label="Correo electrónico"
                  prepend-icon="mdi-email"
                  variant="outlined"
                  color="deep-orange"
                  required
                  class="LoginRegister__campo"
                />

                <v-text-field
                  v-model="registerTelefono"
                  :rules="phoneRules"
                  label="Teléfono"
                  prepend-icon="mdi-phone"
                  variant="outlined"
                  color="deep-orange"
                  required
                  class="LoginRegister__campo"
                />
                
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
                  class="LoginRegister__campo"
                />

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
                  class="LoginRegister__campo"
                  @click:append="showPassword = !showPassword"
                />

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
                  class="LoginRegister__campo"
                  @click:append="showPassword = !showPassword"
                />

                <v-checkbox
                  v-model="termsAccepted"
                  :rules="[v => !!v || 'Debes aceptar los términos y condiciones']"
                  color="deep-orange"
                  label="Acepto los términos y condiciones"
                  required
                  class="LoginRegister__checkbox"
                />

                <v-btn
                  block
                  color="deep-orange"
                  size="large"
                  type="submit"
                  :loading="loading"
                  class="LoginRegister__boton"
                >
                  Registrarse
                </v-btn>
              </v-form>
            </v-window-item>
          </v-window>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/sass/layout/Login&Register";
</style>