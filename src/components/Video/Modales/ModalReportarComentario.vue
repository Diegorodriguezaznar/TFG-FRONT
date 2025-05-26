<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import type { ComentarioUI } from '@/stores/dtos/ComentarioDTO'

const props = defineProps<{
  mostrar: boolean
  comentario: ComentarioUI | null
  cargando?: boolean
}>()

const emit = defineEmits(['update:mostrar', 'confirmar'])
</script>

<template>
  <v-dialog 
    :model-value="mostrar" 
    max-width="500" 
    @update:model-value="emit('update:mostrar', $event)"
  >
    <v-card>
      <v-card-title class="text-h6 d-flex align-center">
        <v-icon color="warning" class="me-2">mdi-flag</v-icon>
        Reportar comentario
      </v-card-title>

      <v-card-text>
        <p class="mb-4">
          ¿Estás seguro de que deseas reportar este comentario?
        </p>
        
        <div class="bg-grey-lighten-4 pa-3 rounded">
          <p class="text-body-2 mb-2">
            <strong>Usuario:</strong> {{ comentario?.user }}
          </p>
          <p class="text-body-2 mb-0">
            <strong>Comentario:</strong> {{ comentario?.content }}
          </p>
        </div>
        
        <p class="text-caption text-warning mt-3 mb-0">
          Los reportes ayudan a mantener una comunidad segura y respetuosa.
        </p>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn @click="emit('update:mostrar', false)" :disabled="cargando">
          Cancelar
        </v-btn>
        <v-btn 
          color="warning" 
          variant="elevated"
          :loading="cargando"
          @click="emit('confirmar')"
        >
          Reportar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>