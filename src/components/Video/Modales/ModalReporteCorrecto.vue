<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const props = defineProps<{
  mostrar: boolean
  tipo: 'success' | 'error' | 'warning' | 'info'
  titulo: string
  mensaje: string
  textoBoton?: string
}>()

const emit = defineEmits(['update:mostrar'])

const configuraciones = {
  success: {
    icono: 'mdi-check-circle',
    color: 'success'
  },
  error: {
    icono: 'mdi-alert-circle',
    color: 'error'
  },
  warning: {
    icono: 'mdi-alert',
    color: 'warning'
  },
  info: {
    icono: 'mdi-information',
    color: 'info'
  }
}
</script>

<template>
  <v-dialog 
    :model-value="mostrar" 
    max-width="400" 
    @update:model-value="emit('update:mostrar', $event)"
  >
    <v-card>
      <v-card-title class="text-h6 d-flex align-center justify-center">
        <v-icon 
          :color="configuraciones[tipo].color" 
          class="me-2" 
          size="large"
        >
          {{ configuraciones[tipo].icono }}
        </v-icon>
        {{ titulo }}
      </v-card-title>

      <v-card-text class="text-center">
        <p class="mb-0">{{ mensaje }}</p>
      </v-card-text>

      <v-card-actions class="justify-center">
        <v-btn 
          :color="configuraciones[tipo].color" 
          variant="elevated"
          @click="emit('update:mostrar', false)"
        >
          {{ textoBoton || 'Entendido' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>