<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import type { ComentarioUI } from '@/stores/dtos/ComentarioDTO'

const props = defineProps<{
  mostrar: boolean
  comentario: ComentarioUI | null
}>()

const emit = defineEmits(['update:mostrar', 'aprobar', 'eliminar'])

function formatearFecha(fecha: string): string {
  return new Date(fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<template>
  <v-dialog :model-value="mostrar" max-width="700px" @update:model-value="emit('update:mostrar', $event)">
    <v-card v-if="comentario">
      <v-card-title class="text-h5 pa-4">
        Comentario de {{ comentario.user }}
      </v-card-title>

      <v-card-text>
        <div class="d-flex align-center mb-2 flex-wrap">
          <v-chip color="error" class="me-2" :text="`${comentario.numeroReportes} reportes`" />
        </div>

        <p class="text-subtitle-2 mb-4">Fecha: {{ formatearFecha(comentario.fechaCreacion) }}</p>

        <p class="text-body-1 mb-4">{{ comentario.content }}</p>

        <v-divider class="mb-4" />
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn color="success" @click="emit('aprobar', comentario.id)">
          <v-icon class="me-2">mdi-check</v-icon>
          Aprobar Comentario
        </v-btn>
        <v-btn color="error" @click="emit('eliminar', comentario)">
          <v-icon class="me-2">mdi-delete</v-icon>
          Eliminar Comentario
        </v-btn>
        <v-btn text @click="emit('update:mostrar', false)">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

