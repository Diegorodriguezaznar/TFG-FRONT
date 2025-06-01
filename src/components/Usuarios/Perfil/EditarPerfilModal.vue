<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useUsuarioStore } from '@/stores/Usuario';
import { useUsuarioLogeadoStore } from '@/stores/UsuarioLogeado';
import type { UsuarioDTO } from '@/stores/dtos/UsuarioDTO';

// Props
const props = defineProps<{
  mostrar: boolean;
  usuario: UsuarioDTO | null;
}>();

// Emits
const emit = defineEmits(['cerrar', 'actualizado']);

// Stores
const usuarioStore = useUsuarioStore();
const usuarioLogeadoStore = useUsuarioLogeadoStore();

// Form refs
const form = ref();
const valid = ref(false);

// Loading state
const loading = ref(false);

// Form data
const formData = ref<UsuarioDTO>({
  idUsuario: 0,
  nombre: '',
  apellidos: '',
  gmail: '',
  telefono: '',
  contraseña: '',
  idRol: 3
});

const confirmarContrasena = ref('');
const mostrarContrasena = ref(false);
const mostrarConfirmarContrasena = ref(false);

// Validation rules
const rules = {
  nombre: [
    (v: string) => !!v || 'El nombre es requerido',
    (v: string) => v.length >= 2 || 'El nombre debe tener al menos 2 caracteres',
    (v: string) => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(v) || 'El nombre no puede contener caracteres especiales'
  ],
  apellidos: [
    (v: string) => !v || v.length >= 2 || 'Los apellidos deben tener al menos 2 caracteres',
    (v: string) => !v || /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(v) || 'Los apellidos no pueden contener caracteres especiales'
  ],
  gmail: [
    (v: string) => !!v || 'El email es requerido',
    (v: string) => /.+@.+\..+/.test(v) || 'El email debe ser válido'
  ],
  telefono: [
    (v: string) => !v || /^[0-9+\-\s()]+$/.test(v) || 'El teléfono debe contener solo números y caracteres válidos',
    (v: string) => !v || v.length >= 9 || 'El teléfono debe tener al menos 9 dígitos'
  ],
  contrasena: [
    // Solo validar si se ha introducido algo
    (v: string) => !v || v.length >= 6 || 'La contraseña debe tener al menos 6 caracteres'
  ]
};

// Validation rule separada para confirmar contraseña que es más dinámica
const confirmarContrasenaRule = computed(() => [
  (v: string) => {
    // Si no hay contraseña nueva, no validar confirmación
    if (!formData.value.contraseña || formData.value.contraseña.trim() === '') {
      return true;
    }
    // Si hay contraseña nueva, debe coincidir
    return v === formData.value.contraseña || 'Las contraseñas no coinciden';
  }
]);

// Computed
const tituloModal = computed(() => 'Editar Información Personal');

// Methods
const inicializarFormulario = () => {
  if (props.usuario) {
    formData.value = {
      idUsuario: props.usuario.idUsuario,
      nombre: props.usuario.nombre || '',
      apellidos: props.usuario.apellidos || '',
      gmail: props.usuario.gmail || '',
      telefono: props.usuario.telefono || '',
      contraseña: '', // No mostrar contraseña actual
      idRol: props.usuario.idRol
    };
  }
  confirmarContrasena.value = '';
  mostrarContrasena.value = false;
  mostrarConfirmarContrasena.value = false;
};

const cerrarModal = () => {
  if (!loading.value) {
    resetearFormulario();
    emit('cerrar');
  }
};

const resetearFormulario = () => {
  formData.value = {
    idUsuario: 0,
    nombre: '',
    apellidos: '',
    gmail: '',
    telefono: '',
    contraseña: '',
    idRol: 3
  };
  confirmarContrasena.value = '';
  if (form.value) {
    form.value.reset();
  }
};

const validarFormulario = async () => {
  if (form.value) {
    // Validar todos los campos excepto confirmar contraseña si no hay contraseña nueva
    const { valid: isValid } = await form.value.validate();
    
    // Validación adicional manual para contraseñas
    if (formData.value.contraseña && formData.value.contraseña.trim()) {
      if (confirmarContrasena.value !== formData.value.contraseña) {
        return false;
      }
    }
    
    return isValid;
  }
  return false;
};

const guardarCambios = async () => {
  const esValido = await validarFormulario();
  
  if (!esValido) {
    return;
  }
  
  loading.value = true;
  
  try {
    // Preparar datos para enviar
    const datosActualizados: UsuarioDTO = {
      idUsuario: formData.value.idUsuario,
      nombre: formData.value.nombre.trim(),
      apellidos: formData.value.apellidos?.trim() || '',
      gmail: formData.value.gmail.trim(),
      telefono: formData.value.telefono?.trim() || '',
      idRol: formData.value.idRol,
      // SIEMPRE incluir contraseña - si no se cambió, usar la original
      contraseña: formData.value.contraseña && formData.value.contraseña.trim() 
        ? formData.value.contraseña.trim() 
        : props.usuario?.contraseña || 'sin_cambio' // Placeholder para indicar que no se cambió
    };
    
    console.log('Actualizando usuario:', {
      ...datosActualizados,
      contraseña: datosActualizados.contraseña === 'sin_cambio' ? '[SIN CAMBIOS]' : '[NUEVA CONTRASEÑA]'
    });
    
    // Llamar al store para actualizar
    const resultado = await usuarioStore.updateUsuario(datosActualizados);
    
    if (resultado) {
      // Actualizar el usuario en el store logueado
      usuarioLogeadoStore.actualizarUsuario(resultado);
      
      emit('actualizado', true, 'Información actualizada correctamente');
    } else {
      emit('actualizado', false, usuarioStore.errorMessage || 'Error al actualizar la información');
    }
    
  } catch (error: any) {
    console.error('Error al actualizar usuario:', error);
    
    // Analizar el error específico
    let mensajeError = 'Error al actualizar la información';
    if (error.message && error.message.includes('Contraseña')) {
      mensajeError = 'Error: El sistema requiere una contraseña. Intenta introducir tu contraseña actual o una nueva.';
    }
    
    emit('actualizado', false, mensajeError);
  } finally {
    loading.value = false;
  }
};

// Watchers
watch(() => props.mostrar, (nuevoValor) => {
  if (nuevoValor) {
    inicializarFormulario();
  }
});

watch(() => props.usuario, () => {
  if (props.mostrar) {
    inicializarFormulario();
  }
});
</script>

<template>
  <v-dialog 
    :model-value="mostrar" 
    @update:model-value="!$event && cerrarModal()"
    max-width="600" 
    persistent
    scrollable
  >
    <v-card class="EditarPerfil">
      <!-- Header -->
      <v-card-title class="EditarPerfil__Header">
        <div class="d-flex align-center">
          <v-avatar color="primary" class="mr-3" size="40">
            <v-icon color="white">mdi-account-edit</v-icon>
          </v-avatar>
          <div>
            <h3 class="EditarPerfil__Title">{{ tituloModal }}</h3>
            <p class="EditarPerfil__Subtitle">Actualiza tu información personal</p>
          </div>
        </div>
        <v-btn 
          icon="mdi-close" 
          variant="text" 
          @click="cerrarModal"
          :disabled="loading"
          class="ml-auto"
        ></v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <!-- Content -->
      <v-card-text class="EditarPerfil__Content">
        <v-form 
          ref="form" 
          v-model="valid" 
          @submit.prevent="guardarCambios"
          :disabled="loading"
        >
          <v-row>
            <!-- Nombre -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.nombre"
                label="Nombre *"
                variant="outlined"
                density="comfortable"
                :rules="rules.nombre"
                prepend-inner-icon="mdi-account"
                :disabled="loading"
                counter="50"
                maxlength="50"
              ></v-text-field>
            </v-col>
            
            <!-- Apellidos -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.apellidos"
                label="Apellidos"
                variant="outlined"
                density="comfortable"
                :rules="rules.apellidos"
                prepend-inner-icon="mdi-account-outline"
                :disabled="loading"
                counter="50"
                maxlength="50"
              ></v-text-field>
            </v-col>
            
            <!-- Email -->
            <v-col cols="12">
              <v-text-field
                v-model="formData.gmail"
                label="Correo Electrónico *"
                variant="outlined"
                density="comfortable"
                :rules="rules.gmail"
                prepend-inner-icon="mdi-email"
                :disabled="loading"
                type="email"
              ></v-text-field>
            </v-col>
            
            <!-- Teléfono -->
            <v-col cols="12">
              <v-text-field
                v-model="formData.telefono"
                label="Teléfono"
                variant="outlined"
                density="comfortable"
                :rules="rules.telefono"
                prepend-inner-icon="mdi-phone"
                :disabled="loading"
                placeholder="+34 123 456 789"
              ></v-text-field>
            </v-col>
            
            <!-- Sección de contraseña -->
            <v-col cols="12">
              <v-divider class="my-2"></v-divider>
              <h4 class="text-subtitle-1 mb-3">
                <v-icon class="mr-2">mdi-lock</v-icon>
                Contraseña
              </h4>
              <p class="text-caption text-grey mb-4">
                Introduce tu contraseña actual o una nueva si quieres cambiarla
              </p>
            </v-col>
            
            <!-- Nueva contraseña -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.contraseña"
                label="Contraseña (Actual o Nueva)"
                variant="outlined"
                density="comfortable"
                :rules="rules.contrasena"
                prepend-inner-icon="mdi-lock"
                :append-inner-icon="mostrarContrasena ? 'mdi-eye-off' : 'mdi-eye'"
                :type="mostrarContrasena ? 'text' : 'password'"
                @click:append-inner="mostrarContrasena = !mostrarContrasena"
                :disabled="loading"
                autocomplete="current-password"
                placeholder="Introduce tu contraseña"
              ></v-text-field>
            </v-col>
            
            <!-- Confirmar contraseña -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model="confirmarContrasena"
                label="Confirmar Contraseña"
                variant="outlined"
                density="comfortable"
                :rules="confirmarContrasenaRule"
                prepend-inner-icon="mdi-lock-check"
                :append-inner-icon="mostrarConfirmarContrasena ? 'mdi-eye-off' : 'mdi-eye'"
                :type="mostrarConfirmarContrasena ? 'text' : 'password'"
                @click:append-inner="mostrarConfirmarContrasena = !mostrarConfirmarContrasena"
                :disabled="loading || !formData.contraseña || formData.contraseña.trim() === ''"
                autocomplete="new-password"
                :placeholder="!formData.contraseña || formData.contraseña.trim() === '' ? 'Primero introduce la contraseña' : 'Confirma la contraseña'"
              ></v-text-field>
            </v-col>
          </v-row>
          
          <!-- Información adicional -->
          <v-alert 
            type="info" 
            variant="tonal" 
            class="mt-4"
            border="start"
          >
            <template v-slot:prepend>
              <v-icon>mdi-information</v-icon>
            </template>
            <strong>Importante:</strong> Los nombres no pueden contener caracteres especiales. Se requiere contraseña para guardar los cambios por seguridad.
          </v-alert>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <!-- Actions -->
      <v-card-actions class="EditarPerfil__Actions pa-4">
        <v-btn 
          variant="outlined" 
          @click="cerrarModal"
          :disabled="loading"
        >
          Cancelar
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn 
          color="primary" 
          @click="guardarCambios"
          :loading="loading"
          :disabled="!valid"
          size="large"
        >
          <v-icon left>mdi-content-save</v-icon>
          Guardar Cambios
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss">
@import "@/assets/sass/components/Usuarios/Perfil/EditarPerfilModal.scss";
</style>