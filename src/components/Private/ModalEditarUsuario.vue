<script setup lang="ts">
import { ref, watch } from 'vue'
import type { UsuarioDTO } from '@/stores/dtos/UsuarioDTO'

const props = defineProps<{
  modelValue: boolean
  usuario: UsuarioDTO | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'guardar', usuarioActualizado: UsuarioDTO): void
}>()

const usuarioLocal = ref<UsuarioDTO | null>(null)

watch(
  () => props.usuario,
  (nuevo) => {
    usuarioLocal.value = nuevo ? { ...nuevo } : null
  },
  { immediate: true }
)

function cerrar() {
  emit('update:modelValue', false)
}

function guardar() {
  if (usuarioLocal.value) {
    emit('guardar', usuarioLocal.value)
    cerrar()
  }
}
</script>

<template>
  <v-dialog v-model="props.modelValue" max-width="500px" persistent>
    <v-card v-if="usuarioLocal">
      <v-card-title>Editar Usuario</v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field v-model="usuarioLocal.nombre" label="Nombre" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="usuarioLocal.apellidos" label="Apellidos" />
            </v-col>
            <v-col cols="12">
              <v-text-field v-model="usuarioLocal.gmail" label="Gmail" />
            </v-col>
            <v-col cols="12">
              <v-text-field v-model="usuarioLocal.telefono" label="Teléfono" />
            </v-col>
            <v-col cols="12">
              <v-text-field v-model="usuarioLocal.avatar" label="Avatar (URL)" />
            </v-col>
            <v-col cols="12">
              <v-select
                v-model="usuarioLocal.idRol"
                label="Rol"
                :items="[1, 2, 3]"
                item-title="Rol"
                item-value="Rol"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="cerrar">Cancelar</v-btn>
        <v-btn color="primary" @click="guardar">Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
