<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import type { VideoDTO } from '@/stores/dtos/VideoDTO'

const props = defineProps<{
  mostrar: boolean
  video: VideoDTO | null
}>()

const emit = defineEmits(['update:mostrar', 'confirmar'])
</script>

<template>
  <v-dialog :model-value="props.mostrar" max-width="400px" @update:model-value="emit('update:mostrar', $event)">
    <v-card>
      <v-card-title class="text-h6">Confirmar eliminación</v-card-title>
      <v-card-text>
        ¿Estás seguro de que quieres eliminar el video
        <strong>{{ video?.titulo }}</strong>?
        Esta acción no se puede deshacer.
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="emit('update:mostrar', false)">Cancelar</v-btn>
        <v-btn color="error" @click="emit('confirmar', video?.idVideo)">Eliminar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
