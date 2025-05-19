<script setup lang="ts">
import { ref } from 'vue'
import type { UsuarioDTO } from '@/stores/dtos/UsuarioDTO'

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'crear', nuevoUsuario: UsuarioDTO): void
  (e: 'error', mensaje: string): void  // Nuevo evento para errores
}>()

const props = defineProps<{
  modelValue: boolean
}>()

const nuevoUsuario = ref<UsuarioDTO>({
  idUsuario: 0,
  nombre: '',
  apellidos: '',
  gmail: '',
  telefono: '',
  avatar: '',
  idRol: 2,
  contraseña: '' 
})

// Objeto para almacenar errores de validación
const errores = ref({
  nombre: '',
  gmail: '',
  contraseña: ''
})

// Función para validar email
function esEmailValido(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Función para validar campos antes de enviar
function validarFormulario(): boolean {
  // Restablecer errores
  errores.value = {
    nombre: '',
    gmail: '',
    contraseña: ''
  }
  
  let esValido = true;
  
  // Validar nombre
  if (!nuevoUsuario.value.nombre.trim()) {
    errores.value.nombre = 'El nombre es obligatorio';
    esValido = false;
  }
  
  // Validar email
  if (!nuevoUsuario.value.gmail.trim()) {
    errores.value.gmail = 'El correo electrónico es obligatorio';
    esValido = false;
  } else if (!esEmailValido(nuevoUsuario.value.gmail)) {
    errores.value.gmail = 'El formato del correo electrónico no es válido';
    esValido = false;
  }
  
  // Validar contraseña
  if (!nuevoUsuario.value.contraseña.trim()) {
    errores.value.contraseña = 'La contraseña es obligatoria';
    esValido = false;
  } else if (nuevoUsuario.value.contraseña.length < 6) {
    errores.value.contraseña = 'La contraseña debe tener al menos 6 caracteres';
    esValido = false;
  }
  
  return esValido;
}

function cerrar() {
  emit('update:modelValue', false)
}

function crear() {
  // Validar formulario antes de enviar
  if (!validarFormulario()) {
    return;
  }

  // Eliminar idUsuario para evitar problemas con el backend
  const { idUsuario, ...usuarioSinId } = nuevoUsuario.value;
  
  emit('crear', usuarioSinId as UsuarioDTO)
  
  // Limpiar formulario
  nuevoUsuario.value = {
    idUsuario: 0,
    nombre: '',
    apellidos: '',
    gmail: '',
    telefono: '',
    avatar: '',
    idRol: 2,
    contraseña: '' 
  }
  
  cerrar()
}
</script>

<template>
  <v-dialog v-model="props.modelValue" max-width="500px" persistent>
    <v-card>
      <v-card-title>Crear Usuario</v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field 
                v-model="nuevoUsuario.nombre" 
                label="Nombre" 
                :error-messages="errores.nombre"
                required
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="nuevoUsuario.apellidos" label="Apellidos" />
            </v-col>
            <v-col cols="12">
              <v-text-field 
                v-model="nuevoUsuario.gmail" 
                label="Gmail" 
                :error-messages="errores.gmail"
                required
              />
            </v-col>
            <v-col cols="12">
              <v-text-field v-model="nuevoUsuario.telefono" label="Teléfono" />
            </v-col>
            <v-col cols="12">
              <v-text-field v-model="nuevoUsuario.avatar" label="Avatar (URL)" />
            </v-col>
            <v-col cols="12">
              <v-text-field 
                v-model="nuevoUsuario.contraseña" 
                label="Contraseña" 
                type="password"
                :error-messages="errores.contraseña"
                required
              />
            </v-col>
            <v-col cols="12">
              <v-select
                v-model="nuevoUsuario.idRol"
                label="Rol"
                :items="[
                  { value: 1, title: 'Administrador' },
                  { value: 2, title: 'Usuario' },
                  { value: 3, title: 'Gestor' }
                ]"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="cerrar">Cancelar</v-btn>
        <v-btn color="primary" @click="crear">Crear</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>