<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import type { ComentarioUI } from '@/stores/dtos/ComentarioDTO'

const props = defineProps<{
  mostrar: boolean
  comentario: ComentarioUI | null
}>()

const emit = defineEmits(['update:mostrar', 'confirmar'])
</script>

<template>
  <v-dialog :model-value="mostrar" max-width="500" @update:model-value="emit('update:mostrar', $event)">
    <v-card>
      <v-card-title class="text-h6 d-flex align-center">
        <v-icon color="success" class="me-2">mdi-check-circle</v-icon>
        Confirmar aprobación
      </v-card-title>

      <v-card-text>
        <p class="mb-4">
          ¿Estás seguro de que deseas aprobar este comentario?
        </p>
        
        <div class="bg-grey-lighten-4 pa-3 rounded">
          <p class="text-body-2 mb-2">
            <strong>Usuario:</strong> {{ comentario?.user }}
          </p>
          <p class="text-body-2 mb-0">
            <strong>Comentario:</strong> {{ comentario?.content?.slice(0, 100) }}...
          </p>
        </div>
        
        <p class="text-caption text-success mt-3 mb-0">
          El comentario será visible para todos los usuarios.
        </p>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn @click="emit('update:mostrar', false)">
          Cancelar
        </v-btn>
        <v-btn 
          color="success" 
          variant="elevated"
          @click="emit('confirmar', comentario?.id)"
        >
          Aprobar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>