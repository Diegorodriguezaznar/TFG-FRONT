<script setup lang="ts">
import { ref } from 'vue'
import type { UsuarioDTO } from '@/stores/dtos/UsuarioDTO'

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'crear', nuevoUsuario: UsuarioDTO): void
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
  idPreferencia: null,
  contraseña: '' 
})


function cerrar() {
  emit('update:modelValue', false)
}

function crear() {
  // Validación mínima
  if (!nuevoUsuario.value.nombre || !nuevoUsuario.value.gmail) {
    alert('Nombre y Gmail son obligatorios')
    return
  }

  emit('crear', { ...nuevoUsuario.value })
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
              <v-text-field v-model="nuevoUsuario.nombre" label="Nombre" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="nuevoUsuario.apellidos" label="Apellidos" />
            </v-col>
            <v-col cols="12">
              <v-text-field v-model="nuevoUsuario.gmail" label="Gmail" />
            </v-col>
            <v-col cols="12">
              <v-text-field v-model="nuevoUsuario.telefono" label="Teléfono" />
            </v-col>
            <v-col cols="12">
              <v-text-field v-model="nuevoUsuario.avatar" label="Avatar (URL)" />
            </v-col>
            <v-col cols="12">
              <v-select
                v-model="nuevoUsuario.idRol"
                label="Rol"
                :items="[1, 2, 3]"
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
